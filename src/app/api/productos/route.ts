import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { parseProductoInput } from "@/lib/validacion";

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

export async function GET() {
  const productos = await prisma.producto.findMany({
    orderBy: { id: "desc" },
    select: selectPublico,
  });
  return NextResponse.json(productos);
}

export async function POST(request: Request) {
  const userId = await getSessionUserId(request);
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const { data, error } = parseProductoInput(body);
  if (error || !data) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const existente = await prisma.producto.findUnique({
    where: { sku: data.sku },
  });
  if (existente) {
    return NextResponse.json({ error: "El SKU ya está registrado" }, { status: 409 });
  }

  const producto = await prisma.producto.create({
    data,
    select: selectPublico,
  });
  return NextResponse.json(producto, { status: 201 });
}
