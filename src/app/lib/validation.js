import crypto from "crypto";

export const OTP_LENGTH = 6;
export const SELL_RESERVE_ON_APPROVAL_MARKER = "[reserve=on-approval]";

const MONEY_REGEX = /^\d+(\.\d{1,2})?$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const ACCOUNT_REGEX = /^\d{8,20}$/;

export function parsePositiveInt(value) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function parsePositiveAmount(value, options = {}) {
  const { min = 0.01, max = 10000000 } = options;
  const raw = String(value ?? "").trim();

  if (!MONEY_REGEX.test(raw)) {
    return null;
  }

  const amount = Number.parseFloat(raw);
  if (!Number.isFinite(amount) || amount < min || amount > max) {
    return null;
  }

  return Number(amount.toFixed(2));
}

export function normalizePhone(value) {
  const digits = String(value ?? "").replace(/\D/g, "");
  return PHONE_REGEX.test(digits) ? digits : null;
}

export function sanitizeText(value, options = {}) {
  const { maxLength = 255, allowEmpty = true } = options;
  const text = String(value ?? "").trim().replace(/\s+/g, " ");

  if (!text && !allowEmpty) {
    return null;
  }

  return text.slice(0, maxLength);
}

export function normalizeBankCardInput(input) {
  const accountNo = String(input?.accountNo ?? "").trim();
  const ifsc = String(input?.ifsc ?? "").trim().toUpperCase();
  const payeeName = sanitizeText(input?.payeeName, { maxLength: 120, allowEmpty: false });
  const bankName = sanitizeText(input?.bankName, { maxLength: 120 });

  if (!ACCOUNT_REGEX.test(accountNo)) {
    return { error: "Enter a valid bank account number" };
  }

  if (!IFSC_REGEX.test(ifsc)) {
    return { error: "Enter a valid IFSC code" };
  }

  if (!payeeName) {
    return { error: "Payee name is required" };
  }

  return {
    value: {
      accountNo,
      ifsc,
      payeeName,
      bankName: bankName || null,
    },
  };
}

export function generateReference(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function appendReason(description, reason) {
  const trimmedReason = sanitizeText(reason, { maxLength: 500 });
  if (!trimmedReason) {
    return description || null;
  }

  return description
    ? `${description}\nReason: ${trimmedReason}`
    : `Reason: ${trimmedReason}`;
}

export function withSellReserveOnApproval(description) {
  const cleanDescription = sanitizeText(description, { maxLength: 500, allowEmpty: false }) || "Sell request";
  return `${SELL_RESERVE_ON_APPROVAL_MARKER} ${cleanDescription}`;
}

export function isSellReserveOnApproval(description) {
  return typeof description === "string" && description.includes(SELL_RESERVE_ON_APPROVAL_MARKER);
}

export function timingSafeEqualStrings(left, right) {
  const leftBuffer = Buffer.from(String(left ?? ""));
  const rightBuffer = Buffer.from(String(right ?? ""));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}