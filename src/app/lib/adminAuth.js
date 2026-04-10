import jwt from "jsonwebtoken";

export const ADMIN_COOKIE_NAME = "adminToken";
export const ADMIN_TOKEN_MAX_AGE_SECONDS = 24 * 60 * 60;

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return process.env.JWT_SECRET;
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

function verifyAdminTokenValue(token) {
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    return null;
  }
}

export function verifyAdminToken(req) {
  const authHeader = req.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return null;

  return verifyAdminTokenValue(authHeader.slice(7).trim());
}

export function verifyAdminCookie(req) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    return verifyAdminTokenValue(token);
  } catch (err) {
    console.error("Admin cookie verification failed:", err);
    return null;
  }
}

export function setAdminAuthCookie(response, token) {
  response.cookies.set(ADMIN_COOKIE_NAME, token, buildCookieOptions(ADMIN_TOKEN_MAX_AGE_SECONDS));
  return response;
}

export function clearAdminAuthCookie(response) {
  response.cookies.set(ADMIN_COOKIE_NAME, "", buildCookieOptions(0));
  return response;
}

