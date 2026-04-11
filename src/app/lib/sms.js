const fast2SmsAuthorizationKey =
  process.env.FAST2SMS_AUTHORIZATION_KEY || process.env.FAST2SMS_API_KEY;
const fast2SmsRoute = process.env.FAST2SMS_ROUTE || 'q';
const fast2SmsLanguage = process.env.FAST2SMS_LANGUAGE || 'english';
const fast2SmsFlash = process.env.FAST2SMS_FLASH === '1' ? 1 : 0;
const fast2SmsEndpoint = 'https://www.fast2sms.com/dev/bulkV2';

const createSmsError = (message, code, status, cause) => {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  error.cause = cause;
  return error;
};

const normalizeFast2SmsNumber = (value) => {
  const digits = value?.toString().replace(/\D/g, '') || '';

  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }

  return digits;
};

const getProviderMessage = (payload, fallback) => {
  if (Array.isArray(payload?.message)) {
    return payload.message.join(', ');
  }

  if (typeof payload?.message === 'string' && payload.message.trim()) {
    return payload.message;
  }

  return fallback;
};

const isFast2SmsSuccess = (payload) => {
  if (payload?.return === true) {
    return true;
  }

  const providerMessage = getProviderMessage(payload, '');
  return /success/i.test(providerMessage);
};

/**
 * Send an SMS message using Fast2SMS
 * @param {string} to - Phone number to send SMS to (10-digit Indian number without country code)
 * @param {string} message - Message content
 */
export const sendSms = async (to, message) => {
  if (!fast2SmsAuthorizationKey) {
    throw createSmsError('SMS service is not configured', 'SMS_NOT_CONFIGURED', 503);
  }

  const normalizedNumber = normalizeFast2SmsNumber(to);
  if (!/^\d{10}$/.test(normalizedNumber)) {
    throw createSmsError('SMS service received an invalid phone number', 'SMS_SEND_FAILED', 400);
  }

  try {
    const response = await fetch(fast2SmsEndpoint, {
      method: 'POST',
      headers: {
        authorization: fast2SmsAuthorizationKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        route: fast2SmsRoute,
        language: fast2SmsLanguage,
        flash: fast2SmsFlash,
        numbers: normalizedNumber,
        message,
      }),
    });

    const rawBody = await response.text();
    let result = null;

    try {
      result = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      result = { message: rawBody };
    }

    const providerMessage = getProviderMessage(result, 'Failed to send SMS');
    const isAuthFailure =
      response.status === 401 ||
      response.status === 403 ||
      /auth|authorization|api key|invalid key|unauthorized/i.test(providerMessage);

    if (isAuthFailure) {
      throw createSmsError(
        'Fast2SMS authentication failed. Check SMS credentials.',
        'SMS_AUTH_FAILED',
        503,
        result
      );
    }

    if (!response.ok || !isFast2SmsSuccess(result)) {
      throw createSmsError(providerMessage, 'SMS_SEND_FAILED', response.status || 502, result);
    }

    console.log(`SMS sent successfully to ${normalizedNumber}. Request ID: ${result?.request_id || 'n/a'}`);
    return result;
  } catch (error) {
    console.error('Error sending SMS:', error);

    if (error?.code === 'SMS_AUTH_FAILED' || error?.code === 'SMS_SEND_FAILED') {
      throw error;
    }

    throw createSmsError('Failed to send SMS', 'SMS_SEND_FAILED', 502, error);
  }
};
