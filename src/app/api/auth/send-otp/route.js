// import prisma from '@/lib/prisma';
// import { sendEmail } from '@/lib/mailer';
// import crypto from 'crypto';

// const generateOtp = () => crypto.randomInt(1000, 9999).toString();

// export async function POST(req) {
//   try {
//     const { email } = await req.json();
//     if (!email) {
//       return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
//     }

//     const otp = generateOtp();
//     const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

//     await prisma.user.upsert({
//       where: { email },
//       update: { otp, otpExpiry },
//       create: { email, otp, otpExpiry },
//     });

//     try {
//       await sendEmail(email, otp);
//     } catch (emailError) {
//       console.error('Email sending failed:', emailError);
//       return new Response(JSON.stringify({ error: 'Failed to send OTP email' }), { status: 500 });
//     }

//     return new Response(JSON.stringify({ message: 'OTP sent to your email' }), { status: 200 });
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//     return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
//   }
// }

// export async function GET() {
//   return new Response(JSON.stringify({ message: "Use POST to send OTP" }), { status: 200 });
// }

import prisma from '@/lib/prisma';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendSms } from '@/lib/sms';
import { checkRateLimit, createRateLimitResponse, getClientIdentifier } from '@/lib/rateLimit';
import { normalizePhone, OTP_LENGTH } from '@/lib/validation';

const generateOtp = () => crypto.randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH).toString();
const isDevOtpBypassEnabled =
  process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEV_OTP_BYPASS === 'true';

export async function POST(req) {
  try {
    const { phone } = await req.json();
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { status: 400 }
      );
    }

    const ipKey = `otp-send:${getClientIdentifier(req)}:${normalizedPhone}`;
    const rateLimit = checkRateLimit(ipKey, { windowMs: 5 * 60 * 1000, max: 5 });
    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit, 'Too many OTP requests. Please try again later.');
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.upsert({
      where: { mobile: normalizedPhone },
      update: { otp: otpHash, otpExpiry },
      create: {
        mobile: normalizedPhone,
        otp: otpHash,
        otpExpiry,
      },
    });

    if (isDevOtpBypassEnabled) {
      console.log(`[DEV OTP] ${normalizedPhone}: ${otp}`);

      return new Response(
        JSON.stringify({
          message: 'OTP generated in development mode',
          devOtp: otp,
        }),
        { status: 200 }
      );
    }

    await sendSms(normalizedPhone, `Your AngelX OTP is ${otp}`);

    return new Response(
      JSON.stringify({ message: 'OTP sent to your phone' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Send OTP error:', error);

    if (error?.code === 'SMS_NOT_CONFIGURED' || error?.code === 'SMS_AUTH_FAILED' || error?.code === 'SMS_SEND_FAILED') {
      return new Response(
        JSON.stringify({
          error: 'OTP service is temporarily unavailable',
          ...(process.env.NODE_ENV !== 'production' && error?.message
            ? { details: error.message }
            : {}),
        }),
        { status: error.status || 503 }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500 }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ message: 'Use POST to send OTP' }),
    { status: 200 }
  );
}