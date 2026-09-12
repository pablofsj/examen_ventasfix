import { Building2, Package, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const dynamic = "force-dynamic";

async function getStats() {
  const [usuarios, productos, clientes] = await Promise.all([
    prisma.usuario.count(),
    prisma.producto.count(),
    prisma.cliente.count(),
  ]);
  return { usuarios, productos, clientes };
}

export default async function DashboardPage() {
  const { usuarios, productos, clientes } = await getStats();

  const stats = [
    { label: "Usuarios", value: usuarios, Icon: Users },
    { label: "Productos", value: productos, Icon: Package },
    { label: "Clientes", value: clientes, Icon: Building2 },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-shadow-brand">
        Dashboard
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Resumen general del sistema VentasFix.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, Icon }) => (
          <Card key={label} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{label}</CardTitle>
              <span className="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
                <Icon className="size-5" />
              </span>
            </CardHeader>
            <CardContent>
              <p className="font-display text-4xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground">
                {value === 1 ? "registro" : "registros"} en el sistema
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
