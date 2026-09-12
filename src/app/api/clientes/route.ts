import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { parseClienteInput } from "@/lib/validacion";

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

export async function GET() {
  const clientes = await prisma.cliente.findMany({
    orderBy: { id: "desc" },
    select: selectPublico,
  });
  return NextResponse.json(clientes);
}

export async function POST(request: Request) {
  const userId = await getSessionUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const { data, error } = parseClienteInput(body);
  if (error || !data) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const existente = await prisma.cliente.findUnique({
    where: { rutEmpresa: data.rutEmpresa },
  });
  if (existente) {
    return NextResponse.json(
      { error: "El RUT de empresa ya está registrado" },
      { status: 409 }
    );
  }

  const cliente = await prisma.cliente.create({
    data,
    select: selectPublico,
  });
  return NextResponse.json(cliente, { status: 201 });
}
