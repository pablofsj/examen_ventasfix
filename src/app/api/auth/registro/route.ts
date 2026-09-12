import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { parseUsuarioInput } from "@/lib/validacion";

// Registro de usuario: crea una cuenta con la contraseña cifrada (Argon2id).
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { data, error } = parseUsuarioInput(body);
  if (error || !data) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const existente = await prisma.usuario.findFirst({
    where: { OR: [{ email: data.email }, { rut: data.rut }] },
  });
  if (existente) {
    return NextResponse.json(
      { error: "El email o RUT ya está registrado" },
      { status: 409 }
    );
  }

  const { password, ...resto } = data;
  const usuario = await prisma.usuario.create({
    data: { ...resto, password: await hashPassword(password) },
    select: { id: true, rut: true, nombre: true, apellido: true, email: true },
  });
  return NextResponse.json(usuario, { status: 201 });
}
