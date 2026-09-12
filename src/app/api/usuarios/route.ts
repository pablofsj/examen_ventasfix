import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, hashPassword } from "@/lib/auth";
import { parseUsuarioInput } from "@/lib/validacion";

const selectPublico = {
  id: true,
  rut: true,
  nombre: true,
  apellido: true,
  email: true,
} as const;

export async function GET() {
  const usuarios = await prisma.usuario.findMany({
    orderBy: { id: "desc" },
    select: selectPublico,
  });
  return NextResponse.json(usuarios);
}

export async function POST(request: Request) {
  const userId = await getSessionUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

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
    select: selectPublico,
  });
  return NextResponse.json(usuario, { status: 201 });
}
