import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UsuarioForm } from "@/components/forms/usuario-form";

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const usuario = await prisma.usuario.findUnique({
    where: { id: Number(id) },
    select: { id: true, rut: true, nombre: true, apellido: true, email: true },
  });
  if (!usuario) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <UsuarioForm usuario={usuario} />
    </div>
  );
}
