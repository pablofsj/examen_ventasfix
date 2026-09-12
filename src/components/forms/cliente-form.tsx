"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, type Cliente } from "@/lib/api";
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

export function ClienteForm({ cliente }: { cliente?: Cliente }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const editando = Boolean(cliente);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const body = JSON.stringify({
      rutEmpresa: form.get("rutEmpresa"),
      rubro: form.get("rubro"),
      razonSocial: form.get("razonSocial"),
      telefono: form.get("telefono"),
      direccion: form.get("direccion"),
      nombreContacto: form.get("nombreContacto"),
      emailContacto: form.get("emailContacto"),
    });
    try {
      await api(cliente ? `/api/clientes/${cliente.id}` : "/api/clientes", {
        method: cliente ? "PUT" : "POST",
        body,
      });
      router.push("/clientes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-2xl shadow-card">
      <CardHeader>
        <CardTitle>{editando ? "Editar cliente" : "Nuevo cliente"}</CardTitle>
        <CardDescription>
          Todos los campos son obligatorios. Los clientes son empresas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="rutEmpresa">RUT empresa</Label>
              <Input id="rutEmpresa" name="rutEmpresa" required defaultValue={cliente?.rutEmpresa} placeholder="76.123.456-K" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="razonSocial">Razón social</Label>
              <Input id="razonSocial" name="razonSocial" required defaultValue={cliente?.razonSocial} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="rubro">Rubro</Label>
              <Input id="rubro" name="rubro" required defaultValue={cliente?.rubro} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" required defaultValue={cliente?.telefono} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" name="direccion" required defaultValue={cliente?.direccion} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nombreContacto">Persona de contacto</Label>
              <Input id="nombreContacto" name="nombreContacto" required defaultValue={cliente?.nombreContacto} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emailContacto">Email de contacto</Label>
              <Input id="emailContacto" name="emailContacto" type="email" required defaultValue={cliente?.emailContacto} />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando…" : "Guardar"}
            </Button>
            <Button asChild variant="outline">
              <Link href="/clientes">Cancelar</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
