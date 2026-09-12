import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductoForm } from "@/components/forms/producto-form";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const producto = await prisma.producto.findUnique({
    where: { id: Number(id) },
    select: {
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
    },
  });
  if (!producto) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <ProductoForm producto={producto} />
    </div>
  );
}
