import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClienteForm } from "@/components/forms/cliente-form";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cliente = await prisma.cliente.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      rutEmpresa: true,
      rubro: true,
      razonSocial: true,
      telefono: true,
      direccion: true,
      nombreContacto: true,
      emailContacto: true,
    },
  });
  if (!cliente) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <ClienteForm cliente={cliente} />
    </div>
  );
}
