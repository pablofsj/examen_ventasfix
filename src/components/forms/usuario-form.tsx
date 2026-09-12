"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, type Usuario } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function UsuarioForm({ usuario }: { usuario?: Usuario }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const editando = Boolean(usuario);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const body = JSON.stringify({
      rut: form.get("rut"),
      nombre: form.get("nombre"),
      apellido: form.get("apellido"),
      email: form.get("email"),
      password: form.get("password"),
    });
    try {
      await api(usuario ? `/api/usuarios/${usuario.id}` : "/api/usuarios", {
        method: usuario ? "PUT" : "POST",
        body,
      });
      router.push("/usuarios");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-2xl shadow-card">
      <CardHeader>
        <CardTitle>{editando ? "Editar usuario" : "Nuevo usuario"}</CardTitle>
        <CardDescription>
          Todos los campos son obligatorios. El email debe ser @ventasfix.cl.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="rut">RUT</Label>
              <Input id="rut" name="rut" required defaultValue={usuario?.rut} placeholder="12.345.678-9" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" required defaultValue={usuario?.nombre} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" name="apellido" required defaultValue={usuario?.apellido} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required defaultValue={usuario?.email} placeholder="nombre@ventasfix.cl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">
                {editando ? "Nueva contraseña" : "Contraseña"}
              </Label>
              <Input id="password" name="password" type="password" required autoComplete="new-password" />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando…" : "Guardar"}
            </Button>
            <Button asChild variant="outline">
              <Link href="/usuarios">Cancelar</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
