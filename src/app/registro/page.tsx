"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { api } from "@/lib/api";
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

export default function RegistroPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      await api("/api/auth/registro", {
        method: "POST",
        body: JSON.stringify({
          rut: form.get("rut"),
          nombre: form.get("nombre"),
          apellido: form.get("apellido"),
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-primary/20 via-background to-background px-4 py-12">
      <Card className="w-full max-w-md shadow-brand">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl text-shadow-brand">
            Crear cuenta
          </CardTitle>
          <CardDescription>
            Registro de trabajadores de VentasFix. El email debe ser
            @ventasfix.cl.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="rut">RUT</Label>
                <Input id="rut" name="rut" required placeholder="12.345.678-9" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" name="nombre" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="apellido">Apellido</Label>
                <Input id="apellido" name="apellido" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="nombre@ventasfix.cl" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" name="password" type="password" required autoComplete="new-password" />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              <UserPlus />
              {loading ? "Registrando…" : "Registrarse"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
