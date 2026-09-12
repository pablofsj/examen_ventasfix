import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { parseProductoInput } from "@/lib/validacion";

type Ctx = { params: Promise<{ id: string }> };

const selectPublico = {
  id: true,
  sku: true,
  nombre: true,
  descripcionCorta: true,
  descripcionLarga: true,
  imagen: true,
  precioNeto: true,
  precioVenta: true,
  stockActual: true,
  stockMinimo: true,
  stockBajo: true,
  stockAlto: true,
} as const;

export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const producto = await prisma.producto.findUnique({
    where: { id: Number(id) },
    select: selectPublico,
  });
  if (!producto) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
  return NextResponse.json(producto);
}

export async function PUT(request: Request, { params }: Ctx) {
  const userId = await getSessionUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const existente = await prisma.producto.findUnique({
    where: { id: Number(id) },
  });
  if (!existente) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const { data, error } = parseProductoInput(body);
  if (error || !data) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const duplicado = await prisma.producto.findFirst({
    where: { sku: data.sku, NOT: { id: existente.id } },
  });
  if (duplicado) {
    return NextResponse.json({ error: "El SKU ya está registrado" }, { status: 409 });
  }

  const actualizado = await prisma.producto.update({
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
  const existente = await prisma.producto.findUnique({
    where: { id: Number(id) },
  });
  if (!existente) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  await prisma.producto.delete({ where: { id: existente.id } });
  return new NextResponse(null, { status: 204 });
}
