import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signToken, verifyPassword, TOKEN_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email y contraseña son obligatorios" },
      { status: 400 }
    );
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario || !(await verifyPassword(usuario.password, password))) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  const token = await signToken(usuario.id);
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  // El token también se devuelve en el cuerpo para que aplicaciones de
  // terceros (p. ej. Softland) consuman la API con `Authorization: Bearer`.
  return NextResponse.json({
    token,
    id: usuario.id,
    rut: usuario.rut,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
  });
}
