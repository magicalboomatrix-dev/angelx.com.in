import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// Retry config
const SMS_MAX_RETRIES   = 2;
const SMS_RETRY_DELAY_MS = 1200;

// Indian mobile: starts 6-9, exactly 10 digits
const INDIAN_10_DIGIT = /^[6-9]\d{9}$/;

const createSmsError = (message, code, status, cause) => {
  const error = new Error(message);
  error.code   = code;
  error.status = status;
  if (cause !== undefined) error.cause = cause;
  return error;
};

/**
 * Normalise any Indian phone representation to a bare 10-digit string.
 * Accepts: "9876543210", "+919876543210", "919876543210", "09876543210"
 */
const normalizeMobileNumber = (value) => {
  let digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0'))  digits = digits.slice(1);
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  return digits;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Send an OTP via Twilio SMS (never voice).
 *
 * @param {string} to  - Indian phone number in any common format.
 * @param {string} otp - The OTP digits to deliver.
 */
export const sendSms = async (to, otp) => {
  if (!accountSid || !authToken || !fromNumber) {
    throw createSmsError('SMS service is not configured', 'SMS_NOT_CONFIGURED', 503);
  }

  const phone = normalizeMobileNumber(to);
  if (!INDIAN_10_DIGIT.test(phone)) {
    throw createSmsError(
      `Invalid Indian mobile number: "${to}"`,
      'SMS_INVALID_PHONE',
      400
    );
  }

  const toE164  = `+91${phone}`;
  const client  = twilio(accountSid, authToken);
  const body    = `${otp} is your AngelX OTP. Valid for 5 minutes. Do not share with anyone.`;

  let lastError = null;

  for (let attempt = 1; attempt <= 1 + SMS_MAX_RETRIES; attempt++) {
    try {
      const message = await client.messages.create({
        body,
        from: fromNumber,
        to:   toE164,
      });

      console.info(
        `[SMS] ✓ Delivered | phone=${toE164} sid=${message.sid} ` +
        `status=${message.status} attempt=${attempt}`
      );
      return message;

    } catch (err) {
      lastError = err;

      // Twilio auth errors (code 20003) and invalid-number errors (21211) — no retry
      if (err.code === 20003 || err.code === 21211 || err.code === 21614) {
        const mapped = err.code === 20003 ? 'SMS_AUTH_FAILED' : 'SMS_INVALID_PHONE';
        console.error(`[SMS] ✗ Fatal | phone=${toE164} twilioCode=${err.code} detail=${err.message}`);
        throw createSmsError(err.message, mapped, 503, err);
      }

      if (attempt <= SMS_MAX_RETRIES) {
        const delay = SMS_RETRY_DELAY_MS * attempt;
        console.warn(
          `[SMS] ⚠ Attempt ${attempt} failed for ${toE164} — retrying in ${delay}ms. ` +
          `twilioCode=${err.code ?? 'n/a'} detail=${err.message}`
        );
        await sleep(delay);
      } else {
        console.error(
          `[SMS] ✗ All ${1 + SMS_MAX_RETRIES} attempts failed | phone=${toE164} ` +
          `twilioCode=${err.code ?? 'n/a'} detail=${err.message}`
        );
      }
    }
  }

  throw createSmsError('Failed to send OTP', 'SMS_SEND_FAILED', 502, lastError);
};
