const twoFactorApiKey = process.env.TWOFACTOR_API_KEY;
const twoFactorTemplateName = process.env.TWOFACTOR_TEMPLATE_NAME || 'AUTOGEN';

const createSmsError = (message, code, status, cause) => {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  error.cause = cause;
  return error;
};

const normalizeMobileNumber = (value) => {
  const digits = value?.toString().replace(/\D/g, '') || '';

  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }

  return digits;
};

/**
 * Send an OTP SMS using 2Factor.in
 * @param {string} to - Phone number (10-digit Indian number without country code)
 * @param {string} otp - The OTP code to send
 */
export const sendSms = async (to, otp) => {
  if (!twoFactorApiKey) {
    throw createSmsError('SMS service is not configured', 'SMS_NOT_CONFIGURED', 503);
  }

  const normalizedNumber = normalizeMobileNumber(to);
  if (!/^\d{10}$/.test(normalizedNumber)) {
    throw createSmsError('SMS service received an invalid phone number', 'SMS_SEND_FAILED', 400);
  }

  const url = `https://2factor.in/API/V1/${twoFactorApiKey}/SMS/${normalizedNumber}/${encodeURIComponent(otp)}/${encodeURIComponent(twoFactorTemplateName)}`;

  try {
    const response = await fetch(url, { method: 'GET' });

    const rawBody = await response.text();
    let result = null;

    try {
      result = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      result = { Details: rawBody };
    }

    const isAuthFailure =
      response.status === 401 ||
      response.status === 403 ||
      /auth|api key|invalid key|unauthorized/i.test(result?.Details || '');

    if (isAuthFailure) {
      throw createSmsError(
        '2Factor authentication failed. Check TWOFACTOR_API_KEY.',
        'SMS_AUTH_FAILED',
        503,
        result
      );
    }

    if (!response.ok || result?.Status !== 'Success') {
      const detail = result?.Details || 'Failed to send OTP';
      throw createSmsError(detail, 'SMS_SEND_FAILED', response.status || 502, result);
    }

    console.log(`OTP sent via 2Factor to ${normalizedNumber}. Session ID: ${result?.Details || 'n/a'}`);
    return result;
  } catch (error) {
    console.error('Error sending OTP:', error);

    if (error?.code === 'SMS_AUTH_FAILED' || error?.code === 'SMS_SEND_FAILED') {
      throw error;
    }

    throw createSmsError('Failed to send OTP', 'SMS_SEND_FAILED', 502, error);
  }
};
