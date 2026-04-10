import crypto from 'crypto';

import prisma from '@/lib/prisma';

import { decimalToNumber } from '@/lib/serializers';
import { getOrCreateSettings } from '@/lib/settings';

const INVITE_CODE_LENGTH = 12;

export function generateInviteCode() {
  return crypto
    .randomBytes(9)
    .toString('base64url')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, INVITE_CODE_LENGTH);
}

export async function ensureUserInviteCode(prismaClient, userId) {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: { id: true, inviteCode: true },
  });

  if (!user) {
    return null;
  }

  if (user.inviteCode) {
    return user.inviteCode;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const inviteCode = generateInviteCode();

    try {
      const updated = await prismaClient.user.update({
        where: { id: userId },
        data: { inviteCode },
        select: { inviteCode: true },
      });

      return updated.inviteCode;
    } catch (error) {
      if (error?.code !== 'P2002') {
        throw error;
      }
    }
  }

  throw new Error('Unable to generate a unique invite code');
}

function maskMobile(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length < 7) {
    return value || 'Unknown';
  }

  return `+91 ${digits.slice(0, 3)}***${digits.slice(-4)}`;
}

export async function getReferralDashboardData(userId, origin, prismaClient = prisma) {
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      inviteCode: true,
      referrals: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          mobile: true,
          email: true,
          createdAt: true,
          referredAt: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const inviteCode = user.inviteCode || await ensureUserInviteCode(prismaClient, userId);
  const settings = await getOrCreateSettings(prismaClient);
  const referralUserIds = user.referrals.map((entry) => entry.id);

  let rewardsByUser = new Map();
  let successfulOrdersByUser = new Map();
  let totalRewards = 0;

  if (referralUserIds.length > 0) {
    const rewards = await prismaClient.referralReward.groupBy({
      by: ['referredUserId'],
      where: {
        referrerId: userId,
        referredUserId: { in: referralUserIds },
      },
      _sum: { amount: true },
      _count: { id: true },
      _max: { createdAt: true },
    });

    rewardsByUser = new Map(
      rewards.map((entry) => {
        const rewardAmount = decimalToNumber(entry._sum.amount || 0);
        totalRewards += rewardAmount;
        return [entry.referredUserId, {
          rewardAmount,
          rewardCount: entry._count.id,
          lastRewardAt: entry._max.createdAt || null,
        }];
      })
    );

    const successfulOrders = await prismaClient.transaction.groupBy({
      by: ['userId'],
      where: {
        userId: { in: referralUserIds },
        status: 'SUCCESS',
        type: { in: ['DEPOSIT', 'SELL'] },
      },
      _count: { id: true },
      _max: { reviewedAt: true },
    });

    successfulOrdersByUser = new Map(
      successfulOrders.map((entry) => [entry.userId, {
        successfulOrders: entry._count.id,
        lastApprovedAt: entry._max.reviewedAt || null,
      }])
    );
  }

  const referrals = user.referrals.map((entry) => {
    const reward = rewardsByUser.get(entry.id);
    const orders = successfulOrdersByUser.get(entry.id);
    const successfulOrders = orders?.successfulOrders || 0;
    const rewardAmount = reward?.rewardAmount || 0;

    return {
      id: entry.id,
      name: entry.fullName || entry.email || maskMobile(entry.mobile),
      mobile: maskMobile(entry.mobile),
      email: entry.email || null,
      joinedAt: entry.createdAt,
      referredAt: entry.referredAt,
      successfulOrders,
      rewardAmount,
      rewardCount: reward?.rewardCount || 0,
      lastApprovedAt: orders?.lastApprovedAt || null,
      lastRewardAt: reward?.lastRewardAt || null,
      status: rewardAmount > 0 ? 'Rewarded' : successfulOrders > 0 ? 'Approved' : 'Pending',
    };
  });

  return {
    inviteCode,
    inviteLink: `${origin}/login-account?ref=${encodeURIComponent(inviteCode)}`,
    inviteReward: Number(settings.inviteReward || 0),
    totalReferrals: referrals.length,
    totalRewards,
    rewardedReferrals: referrals.filter((entry) => entry.rewardAmount > 0).length,
    referrals,
  };
}