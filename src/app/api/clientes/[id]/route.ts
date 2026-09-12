import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { parseClienteInput } from "@/lib/validacion";

type Ctx = { params: Promise<{ id: string }> };

const selectPublico = {
  id: true,
  rutEmpresa: true,
  rubro: true,
  razonSocial: true,
  telefono: true,
  direccion: true,
  nombreContacto: true,
  emailContacto: true,
} as const;

export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const cliente = await prisma.cliente.findUnique({
    where: { id: Number(id) },
    select: selectPublico,
  });
  if (!cliente) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  }
  return NextResponse.json(cliente);
}

export async function PUT(request: Request, { params }: Ctx) {
  const userId = await getSessionUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const existente = await prisma.cliente.findUnique({
    where: { id: Number(id) },
  });
  if (!existente) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const { data, error } = parseClienteInput(body);
  if (error || !data) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const duplicado = await prisma.cliente.findFirst({
    where: { rutEmpresa: data.rutEmpresa, NOT: { id: existente.id } },
  });
  if (duplicado) {
    return NextResponse.json(
      { error: "El RUT de empresa ya está registrado" },
      { status: 409 }
    );
  }

  const actualizado = await prisma.cliente.update({
    where: { id: existente.id },
    data,
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
  const existente = await prisma.cliente.findUnique({
    where: { id: Number(id) },
  });
  if (!existente) {
    return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
  }

  await prisma.cliente.delete({ where: { id: existente.id } });
  return new NextResponse(null, { status: 204 });
}
