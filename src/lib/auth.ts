import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserRole } from "@/models/User";

const JWT_SECRET =
  process.env.JWT_SECRET || "blooming_oasis_secure_jwt_dev_key_8492049182390";
const COOKIE_NAME = "blooming_auth_token";

export interface TokenPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(res: NextResponse, token: string): void {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function getUserFromRequest(req: NextRequest): TokenPayload | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function hasAdminAccess(role?: UserRole): boolean {
  if (!role) return false;
  return ["superadmin", "admin", "order_manager", "product_manager"].includes(
    role
  );
}

export function canManageProducts(role?: UserRole): boolean {
  if (!role) return false;
  return ["superadmin", "admin", "product_manager"].includes(role);
}

export function canManageOrders(role?: UserRole): boolean {
  if (!role) return false;
  return ["superadmin", "admin", "order_manager"].includes(role);
}

