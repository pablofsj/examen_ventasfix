import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, hashPassword } from "@/lib/auth";
import { parseUsuarioInput } from "@/lib/validacion";

type Ctx = { params: Promise<{ id: string }> };

const selectPublico = {
  id: true,
  rut: true,
  nombre: true,
  apellido: true,
  email: true,
} as const;

export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const usuario = await prisma.usuario.findUnique({
    where: { id: Number(id) },
    select: selectPublico,
  });
  if (!usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
  return NextResponse.json(usuario);
}

export async function PUT(request: Request, { params }: Ctx) {
  const userId = await getSessionUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const existente = await prisma.usuario.findUnique({
    where: { id: Number(id) },
  });
  if (!existente) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const { data, error } = parseUsuarioInput(body);
  if (error || !data) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const duplicado = await prisma.usuario.findFirst({
    where: {
      OR: [{ email: data.email }, { rut: data.rut }],
      NOT: { id: existente.id },
    },
  });
  if (duplicado) {
    return NextResponse.json(
      { error: "El email o RUT ya está registrado" },
      { status: 409 }
    );
  }

  const { password, ...resto } = data;
  const actualizado = await prisma.usuario.update({
    where: { id: existente.id },
    data: { ...resto, password: await hashPassword(password) },
    select: selectPublico,
  });
  return NextResponse.json(actualizado);
}

export async function DELETE(request: Request, { params }: Ctx) {
  const userId = await getSessionUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const existente = await prisma.usuario.findUnique({
    where: { id: Number(id) },
  });
  if (!existente) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  await prisma.usuario.delete({ where: { id: existente.id } });
  return new NextResponse(null, { status: 204 });
}
