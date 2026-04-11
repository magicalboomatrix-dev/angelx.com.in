// lib/auth.js
import prisma from "./prisma";
import jwt from "jsonwebtoken";

export const USER_COOKIE_NAME = "userToken";
export const USER_TOKEN_MAX_AGE_SECONDS = 24 * 60 * 60;

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return process.env.JWT_SECRET;
}

function getTokenFromRequest(req) {
  const authHeader = req.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return req.cookies?.get(USER_COOKIE_NAME)?.value || null;
}

function buildCookieOptions(maxAge) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };
}

/**
 * Generate JWT for a user
 * @param {Object} user - User object
 * @returns {string} token
 */
export function generateToken(user) {
  const payload = { id: user.id };
  return jwt.sign(payload, getJwtSecret(), { expiresIn: USER_TOKEN_MAX_AGE_SECONDS });
}

/**
 * Verify JWT token and return payload
 * @param {string} token
 * @returns {Object|null} payload
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (err) {
    return null;
  }
}

/**
 * Get current logged-in user from the request
 * @param {Request} req - Next.js App Router request
 * @returns {Promise<Object|null>} User
 */
export async function getCurrentUser(req) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        wallet: true,
      },
    });

    return user || null;
  } catch (err) {
    console.error("getCurrentUser error:", err);
    return null;
  }
}

export function setUserAuthCookie(response, token) {
  response.cookies.set(USER_COOKIE_NAME, token, buildCookieOptions(USER_TOKEN_MAX_AGE_SECONDS));
  return response;
}

export function clearUserAuthCookie(response) {
  response.cookies.set(USER_COOKIE_NAME, "", buildCookieOptions(0));
  return response;
}
