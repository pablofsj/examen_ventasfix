"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { api, type Usuario } from "@/lib/api";
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

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(() => {
    api<Usuario[]>("/api/usuarios")
      .then(setUsuarios)
      .catch(() => setUsuarios([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(cargar, [cargar]);

  async function eliminar(id: number) {
    if (!confirm("¿Eliminar este usuario?")) return;
    await api(`/api/usuarios/${id}`, { method: "DELETE" });
    cargar();
  }

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users className="size-6 text-primary" />
            <div>
              <CardTitle>Usuarios</CardTitle>
              <CardDescription>
                Trabajadores que administran la plataforma
              </CardDescription>
            </div>
          </div>
          <Button asChild>
            <Link href="/usuarios/nuevo">
              <Plus />
              Nuevo usuario
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Cargando…
            </p>
          ) : usuarios.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay usuarios registrados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RUT</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Apellido</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono text-xs">{u.rut}</TableCell>
                    <TableCell>{u.nombre}</TableCell>
                    <TableCell>{u.apellido}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-1">
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link href={`/usuarios/${u.id}`} aria-label="Editar">
                            <Pencil />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive"
                          onClick={() => eliminar(u.id)}
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
