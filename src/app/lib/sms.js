import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

const createSmsError = (message, code, status, cause) => {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  error.cause = cause;
  return error;
};

/**
 * Send an SMS message using Twilio
 * @param {string} to - Phone number to send SMS to (10-digit Indian number without country code)
 * @param {string} message - Message content
 */
export const sendSms = async (to, message) => {
  if (!client || !twilioPhoneNumber) {
    throw createSmsError('SMS service is not configured', 'SMS_NOT_CONFIGURED', 503);
  }

  // Format phone number for India (+91)
  const formattedNumber = to.startsWith('+') ? to : `+91${to}`;
  
  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: formattedNumber,
    });
    
    console.log(`✅ SMS sent successfully to ${formattedNumber}. SID: ${result.sid}`);
    return result;
  } catch (error) {
    console.error('❌ Error sending SMS:', error);

    if (error?.code === 20003 || error?.status === 401) {
      throw createSmsError(
        'Twilio authentication failed. Check SMS credentials.',
        'SMS_AUTH_FAILED',
        503,
        error
      );
    }

    throw createSmsError('Failed to send SMS', 'SMS_SEND_FAILED', 502, error);
  }
};
