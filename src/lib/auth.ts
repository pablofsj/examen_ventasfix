import { SignJWT, jwtVerify } from "jose";
import argon2 from "argon2";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, { type: argon2.argon2id });
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  return argon2.verify(hash, plain);
}

export async function signToken(userId: number): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<number | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    const sub = Number(payload.sub);
    return Number.isInteger(sub) ? sub : null;
  } catch {
    return null;
  }
}

// id del usuario autenticado, o null si no hay sesión válida.
// Soporta dos fuentes: cookie httpOnly (navegador) y `Authorization: Bearer`
// (aplicaciones de terceros, p. ej. el sistema de gestión Softland).
export async function getSessionUserId(request?: Request): Promise<number | null> {
  if (request) {
    const auth = request.headers.get("authorization");
    if (auth?.startsWith("Bearer ")) {
      return verifyToken(auth.slice(7));
    }
  }
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export const TOKEN_COOKIE = "token";
