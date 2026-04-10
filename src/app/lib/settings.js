import prisma from "@/lib/prisma";

export const DEFAULT_SETTINGS = Object.freeze({
  rate: 102,
  withdrawMin: 50,
  depositMin: 100,
  inviteReward: 1,
  trc20Address: "TU7f7jwJr56owuutyzbJEwVqF3ii4KCiPV",
  erc20Address: "0x78845f99b319b48393fbcde7d32fcb7ccd6661bf",
  trc20QrUrl: "images/trc20.png",
  erc20QrUrl: "images/bep20.jpg",
});

export async function getSettings(prismaClient = prisma) {
  return prismaClient.settings.findFirst({
    orderBy: { id: "asc" },
  });
}

export async function getOrCreateSettings(prismaClient = prisma) {
  const existing = await getSettings(prismaClient);
  if (existing) {
    return existing;
  }

  return prismaClient.settings.create({
    data: DEFAULT_SETTINGS,
  });
}

export function serializePublicSettings(settings) {
  return {
    rate: settings.rate,
    inviteReward: settings.inviteReward,
    limits: {
      depositMin: settings.depositMin,
      withdrawMin: settings.withdrawMin,
    },
    crypto: {
      TRC20: {
        address: settings.trc20Address,
        qrUrl: settings.trc20QrUrl,
      },
      BEP20: {
        address: settings.erc20Address,
        qrUrl: settings.erc20QrUrl,
      },
      ERC20: {
        address: settings.erc20Address,
        qrUrl: settings.erc20QrUrl,
      },
    },
  };
}

export function serializeDepositInfo(settings) {
  return serializePublicSettings(settings).crypto;
}