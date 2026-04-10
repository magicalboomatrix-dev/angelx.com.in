import { Prisma } from '@prisma/client';

import prisma from '@/lib/prisma';
import { generateReference, sanitizeText } from '@/lib/validation';
import { decimalToNumber, toDecimal } from '@/lib/serializers';
import { getOrCreateSettings } from '@/lib/settings';

const MAX_PENDING_SELL_REQUESTS = 3;

function money(value) {
  return toDecimal(value).toDecimalPlaces(6, Prisma.Decimal.ROUND_HALF_UP);
}

async function ensureWallet(tx, userId) {
  const existing = await tx.wallet.findUnique({ where: { userId } });
  if (existing) {
    return existing;
  }

  return tx.wallet.create({
    data: {
      userId,
      usdtAvailable: money(0),
      usdtLocked: money(0),
      usdtDeposited: money(0),
      usdtWithdrawn: money(0),
    },
  });
}

export async function addWalletLedgerEntry(tx, input) {
  const amount = money(input.amount);
  const balanceAfter = money(input.balanceAfter);
  return tx.walletLedger.create({
    data: {
      userId: input.userId,
      type: input.type,
      amount,
      balanceAfter,
      referenceId: input.referenceId || null,
    },
  });
}

export async function addAdminActionLog(tx, input) {
  return tx.adminActionLog.create({
    data: {
      adminId: input.adminId,
      action: input.action,
      targetId: input.targetId || null,
      metadata: input.metadata || Prisma.JsonNull,
    },
  });
}

async function settleReferralReward(tx, transaction, adminId) {
  if (!transaction || !['DEPOSIT', 'SELL'].includes(transaction.type)) {
    return null;
  }

  const user = await tx.user.findUnique({
    where: { id: transaction.userId },
    select: { id: true, referredById: true },
  });

  if (!user?.referredById) {
    return null;
  }

  const settings = await getOrCreateSettings(tx);
  const rewardAmount = money(settings.inviteReward || 0);

  if (rewardAmount.lte(0)) {
    return null;
  }

  const existingReward = await tx.referralReward.findUnique({
    where: {
      referrerId_transactionId: {
        referrerId: user.referredById,
        transactionId: transaction.id,
      },
    },
  });

  if (existingReward) {
    return existingReward;
  }

  const referrerWallet = await ensureWallet(tx, user.referredById);
  const updatedReferrerWallet = await tx.wallet.update({
    where: { userId: user.referredById },
    data: {
      usdtAvailable: { increment: rewardAmount },
    },
  });

  const reward = await tx.referralReward.create({
    data: {
      referrerId: user.referredById,
      referredUserId: user.id,
      transactionId: transaction.id,
      amount: rewardAmount,
    },
  });

  await addWalletLedgerEntry(tx, {
    userId: user.referredById,
    type: 'REFERRAL_REWARD',
    amount: rewardAmount,
    balanceAfter: updatedReferrerWallet.usdtAvailable,
    referenceId: transaction.referenceId,
  });

  await addAdminActionLog(tx, {
    adminId,
    action: 'award_referral_reward',
    targetId: String(reward.id),
    metadata: {
      referrerId: user.referredById,
      referredUserId: user.id,
      transactionId: transaction.id,
      referenceId: transaction.referenceId,
      amount: decimalToNumber(rewardAmount),
    },
  });

  return { reward, wallet: updatedReferrerWallet, previousWallet: referrerWallet };
}

export async function createPendingSellRequest(input) {
  const amount = money(input.amount);

  return prisma.$transaction(async (tx) => {
    const pendingCount = await tx.transaction.count({
      where: {
        userId: input.userId,
        type: 'SELL',
        status: 'PENDING',
      },
    });

    if (pendingCount >= MAX_PENDING_SELL_REQUESTS) {
      throw new Error('You already have the maximum number of pending sell requests');
    }

    const wallet = await ensureWallet(tx, input.userId);
    const moveFunds = await tx.wallet.updateMany({
      where: {
        userId: input.userId,
        usdtAvailable: { gte: amount },
      },
      data: {
        usdtAvailable: { decrement: amount },
        usdtLocked: { increment: amount },
      },
    });

    if (moveFunds.count !== 1) {
      throw new Error('Insufficient balance');
    }

    const updatedWallet = await tx.wallet.findUnique({ where: { userId: input.userId } });
    const referenceId = generateReference('SELL');
    const transaction = await tx.transaction.create({
      data: {
        userId: input.userId,
        referenceId,
        type: 'SELL',
        amount,
        currency: input.currency || 'USDT',
        network: input.network || null,
        address: input.address || null,
        status: 'PENDING',
        description: sanitizeText(input.description, { maxLength: 500 }) || null,
      },
    });

    await addWalletLedgerEntry(tx, {
      userId: input.userId,
      type: 'SELL_LOCK',
      amount: amount.negated(),
      balanceAfter: updatedWallet.usdtAvailable,
      referenceId,
    });

    return { transaction, wallet: updatedWallet, previousWallet: wallet };
  });
}

export async function createPendingDeposit(input) {
  const amount = money(input.amount);
  return prisma.transaction.create({
    data: {
      userId: input.userId,
      referenceId: input.referenceId || generateReference('DEP'),
      txnId: input.txnId || null,
      type: 'DEPOSIT',
      amount,
      currency: input.currency || 'USDT',
      network: input.network || null,
      address: input.address || null,
      status: 'PENDING',
      description: sanitizeText(input.description, { maxLength: 500 }) || null,
    },
  });
}

export async function confirmDeposit(input) {
  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findUnique({ where: { id: input.transactionId } });
    if (!transaction || transaction.type !== 'DEPOSIT' || transaction.status !== 'PENDING') {
      throw new Error('Transaction not found or already processed');
    }

    const wallet = await ensureWallet(tx, transaction.userId);
    const updatedWallet = await tx.wallet.update({
      where: { userId: transaction.userId },
      data: {
        usdtAvailable: { increment: transaction.amount },
        usdtDeposited: { increment: transaction.amount },
      },
    });

    const updatedTransaction = await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'SUCCESS',
        adminId: input.adminId,
        reviewNote: sanitizeText(input.reviewNote, { maxLength: 500 }) || null,
        reviewedAt: new Date(),
      },
    });

    await addWalletLedgerEntry(tx, {
      userId: transaction.userId,
      type: 'DEPOSIT_CREDIT',
      amount: transaction.amount,
      balanceAfter: updatedWallet.usdtAvailable,
      referenceId: transaction.referenceId,
    });

    await addAdminActionLog(tx, {
      adminId: input.adminId,
      action: 'confirm_deposit',
      targetId: String(transaction.id),
      metadata: {
        referenceId: transaction.referenceId,
        amount: decimalToNumber(transaction.amount),
      },
    });

    await settleReferralReward(tx, updatedTransaction, input.adminId);

    return { transaction: updatedTransaction, wallet: updatedWallet, previousWallet: wallet };
  });
}

export async function rejectDeposit(input) {
  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findUnique({ where: { id: input.transactionId } });
    if (!transaction || transaction.type !== 'DEPOSIT' || transaction.status !== 'PENDING') {
      throw new Error('Transaction not found or already processed');
    }

    const updatedTransaction = await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'REJECTED',
        adminId: input.adminId,
        reviewNote: sanitizeText(input.reviewNote, { maxLength: 500 }) || null,
        reviewedAt: new Date(),
      },
    });

    await addAdminActionLog(tx, {
      adminId: input.adminId,
      action: 'reject_deposit',
      targetId: String(transaction.id),
      metadata: {
        referenceId: transaction.referenceId,
        amount: decimalToNumber(transaction.amount),
        reviewNote: sanitizeText(input.reviewNote, { maxLength: 500 }) || null,
      },
    });

    return { transaction: updatedTransaction };
  });
}

export async function confirmSell(input) {
  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findUnique({ where: { id: input.transactionId } });
    if (!transaction || transaction.type !== 'SELL' || transaction.status !== 'PENDING') {
      throw new Error('Transaction not found or already processed');
    }

    const wallet = await ensureWallet(tx, transaction.userId);
    const hasLockedFunds = wallet.usdtLocked.greaterThanOrEqualTo(transaction.amount);

    let updateResult;
    let settlementMode = 'locked';

    if (hasLockedFunds) {
      updateResult = await tx.wallet.updateMany({
        where: {
          userId: transaction.userId,
          usdtLocked: { gte: transaction.amount },
        },
        data: {
          usdtLocked: { decrement: transaction.amount },
          usdtWithdrawn: { increment: transaction.amount },
        },
      });
    } else {
      settlementMode = 'legacy-available';
      updateResult = await tx.wallet.updateMany({
        where: {
          userId: transaction.userId,
          usdtAvailable: { gte: transaction.amount },
        },
        data: {
          usdtAvailable: { decrement: transaction.amount },
          usdtWithdrawn: { increment: transaction.amount },
        },
      });
    }

    if (updateResult.count !== 1) {
      throw new Error(
        hasLockedFunds
          ? 'Locked balance is insufficient'
          : 'Available balance is insufficient for this legacy pending sell'
      );
    }

    const updatedWallet = await tx.wallet.findUnique({ where: { userId: transaction.userId } });
    const updatedTransaction = await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'SUCCESS',
        adminId: input.adminId,
        reviewNote: sanitizeText(input.reviewNote, { maxLength: 500 }) || null,
        reviewedAt: new Date(),
      },
    });

    await addWalletLedgerEntry(tx, {
      userId: transaction.userId,
      type: 'SELL_SETTLE',
      amount: transaction.amount.negated(),
      balanceAfter: updatedWallet.usdtAvailable,
      referenceId: transaction.referenceId,
    });

    await addAdminActionLog(tx, {
      adminId: input.adminId,
      action: 'confirm_sell',
      targetId: String(transaction.id),
      metadata: {
        referenceId: transaction.referenceId,
        amount: decimalToNumber(transaction.amount),
        settlementMode,
      },
    });

    await settleReferralReward(tx, updatedTransaction, input.adminId);

    return { transaction: updatedTransaction, wallet: updatedWallet, previousWallet: wallet };
  });
}

export async function rejectSell(input) {
  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findUnique({ where: { id: input.transactionId } });
    if (!transaction || transaction.type !== 'SELL' || transaction.status !== 'PENDING') {
      throw new Error('Transaction not found or already processed');
    }

    const wallet = await ensureWallet(tx, transaction.userId);
    const hasLockedFunds = wallet.usdtLocked.greaterThanOrEqualTo(transaction.amount);

    let updatedWallet = wallet;
    let settlementMode = 'legacy-no-wallet-change';

    if (hasLockedFunds) {
      const updateResult = await tx.wallet.updateMany({
        where: {
          userId: transaction.userId,
          usdtLocked: { gte: transaction.amount },
        },
        data: {
          usdtLocked: { decrement: transaction.amount },
          usdtAvailable: { increment: transaction.amount },
        },
      });

      if (updateResult.count !== 1) {
        throw new Error('Locked balance is insufficient');
      }

      updatedWallet = await tx.wallet.findUnique({ where: { userId: transaction.userId } });
      settlementMode = 'locked-release';
    }

    const reviewNote = sanitizeText(input.reviewNote, { maxLength: 500 }) || null;
    const updatedTransaction = await tx.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'REJECTED',
        adminId: input.adminId,
        reviewNote,
        reviewedAt: new Date(),
      },
    });

    if (hasLockedFunds) {
      await addWalletLedgerEntry(tx, {
        userId: transaction.userId,
        type: 'SELL_RELEASE',
        amount: transaction.amount,
        balanceAfter: updatedWallet.usdtAvailable,
        referenceId: transaction.referenceId,
      });
    }

    await addAdminActionLog(tx, {
      adminId: input.adminId,
      action: 'reject_sell',
      targetId: String(transaction.id),
      metadata: {
        referenceId: transaction.referenceId,
        amount: decimalToNumber(transaction.amount),
        reviewNote,
        settlementMode,
      },
    });

    return { transaction: updatedTransaction, wallet: updatedWallet, previousWallet: wallet };
  });
}

export async function adjustWalletBalance(input) {
  const amount = money(input.amount);
  const normalizedType = input.type === 'DEBIT' ? 'DEBIT' : 'CREDIT';

  return prisma.$transaction(async (tx) => {
    const wallet = await ensureWallet(tx, input.userId);
    let updatedWallet;

    if (normalizedType === 'CREDIT') {
      updatedWallet = await tx.wallet.update({
        where: { userId: input.userId },
        data: {
          usdtAvailable: { increment: amount },
        },
      });
    } else {
      const updateResult = await tx.wallet.updateMany({
        where: {
          userId: input.userId,
          usdtAvailable: { gte: amount },
        },
        data: {
          usdtAvailable: { decrement: amount },
        },
      });

      if (updateResult.count !== 1) {
        throw new Error('Insufficient wallet balance');
      }

      updatedWallet = await tx.wallet.findUnique({ where: { userId: input.userId } });
    }

    await addWalletLedgerEntry(tx, {
      userId: input.userId,
      type: normalizedType === 'CREDIT' ? 'ADMIN_CREDIT' : 'ADMIN_DEBIT',
      amount: normalizedType === 'CREDIT' ? amount : amount.negated(),
      balanceAfter: updatedWallet.usdtAvailable,
      referenceId: input.referenceId || generateReference('ADJ'),
    });

    await addAdminActionLog(tx, {
      adminId: input.adminId,
      action: 'adjust_wallet',
      targetId: String(input.userId),
      metadata: {
        amount: decimalToNumber(amount),
        type: normalizedType,
        reason: sanitizeText(input.reason, { maxLength: 300 }) || null,
      },
    });

    return { wallet: updatedWallet, previousWallet: wallet };
  });
}