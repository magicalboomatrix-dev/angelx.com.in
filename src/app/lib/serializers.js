import { Prisma } from '@prisma/client';

export function toDecimal(value) {
  if (value instanceof Prisma.Decimal) {
    return value;
  }

  if (value === null || value === undefined) {
    return new Prisma.Decimal(0);
  }

  return new Prisma.Decimal(value);
}

export function decimalToNumber(value, scale = 6) {
  return Number(toDecimal(value).toFixed(scale));
}

export function serializeWallet(wallet) {
  if (!wallet) {
    return null;
  }

  return {
    ...wallet,
    usdtAvailable: decimalToNumber(wallet.usdtAvailable),
    usdtLocked: decimalToNumber(wallet.usdtLocked),
    usdtDeposited: decimalToNumber(wallet.usdtDeposited),
    usdtWithdrawn: decimalToNumber(wallet.usdtWithdrawn),
  };
}

export function serializeTransaction(transaction) {
  if (!transaction) {
    return null;
  }

  return {
    ...transaction,
    amount: decimalToNumber(transaction.amount),
  };
}

export function serializeTransactions(transactions) {
  return transactions.map(serializeTransaction);
}