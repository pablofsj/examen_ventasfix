"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { api, type Cliente } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(() => {
    api<Cliente[]>("/api/clientes")
      .then(setClientes)
      .catch(() => setClientes([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(cargar, [cargar]);

  async function eliminar(id: number) {
    if (!confirm("¿Eliminar este cliente?")) return;
    await api(`/api/clientes/${id}`, { method: "DELETE" });
    cargar();
  }

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="size-6 text-primary" />
            <div>
              <CardTitle>Clientes</CardTitle>
              <CardDescription>Clientes empresa de VentasFix</CardDescription>
            </div>
          </div>
          <Button asChild>
            <Link href="/clientes/nuevo">
              <Plus />
              Nuevo cliente
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Cargando…</p>
          ) : clientes.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay clientes registrados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RUT empresa</TableHead>
                  <TableHead>Razón social</TableHead>
                  <TableHead>Rubro</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.rutEmpresa}</TableCell>
                    <TableCell>{c.razonSocial}</TableCell>
                    <TableCell>{c.rubro}</TableCell>
                    <TableCell>
                      <div>{c.nombreContacto}</div>
                      <div className="text-xs text-muted-foreground">{c.emailContacto}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-1">
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link href={`/clientes/${c.id}`} aria-label="Editar">
                            <Pencil />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive"
                          onClick={() => eliminar(c.id)}
                          aria-label="Eliminar"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
