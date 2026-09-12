"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, type Producto } from "@/lib/api";
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

export function ProductoForm({ producto }: { producto?: Producto }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const editando = Boolean(producto);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const body = JSON.stringify({
      sku: form.get("sku"),
      nombre: form.get("nombre"),
      descripcionCorta: form.get("descripcionCorta"),
      descripcionLarga: form.get("descripcionLarga"),
      imagen: form.get("imagen"),
      precioNeto: form.get("precioNeto"),
      precioVenta: form.get("precioVenta"),
      stockActual: form.get("stockActual"),
      stockMinimo: form.get("stockMinimo"),
      stockBajo: form.get("stockBajo"),
      stockAlto: form.get("stockAlto"),
    });
    try {
      await api(producto ? `/api/productos/${producto.id}` : "/api/productos", {
        method: producto ? "PUT" : "POST",
        body,
      });
      router.push("/productos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-2xl shadow-card">
      <CardHeader>
        <CardTitle>{editando ? "Editar producto" : "Nuevo producto"}</CardTitle>
        <CardDescription>
          Todos los campos son obligatorios. Precios en pesos chilenos (CLP).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" name="sku" required defaultValue={producto?.sku} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" required defaultValue={producto?.nombre} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="imagen">Imagen (URL)</Label>
              <Input id="imagen" name="imagen" required defaultValue={producto?.imagen} placeholder="https://…" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="descripcionCorta">Descripción corta</Label>
              <Input id="descripcionCorta" name="descripcionCorta" required defaultValue={producto?.descripcionCorta} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="descripcionLarga">Descripción larga</Label>
              <textarea
                id="descripcionLarga"
                name="descripcionLarga"
                required
                defaultValue={producto?.descripcionLarga}
                className="flex min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="precioNeto">Precio neto</Label>
              <Input id="precioNeto" name="precioNeto" type="number" min="0" required defaultValue={producto?.precioNeto} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="precioVenta">Precio de venta (IVA 19 %)</Label>
              <Input id="precioVenta" name="precioVenta" type="number" min="0" required defaultValue={producto?.precioVenta} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stockActual">Stock actual</Label>
              <Input id="stockActual" name="stockActual" type="number" min="0" required defaultValue={producto?.stockActual} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stockMinimo">Stock mínimo</Label>
              <Input id="stockMinimo" name="stockMinimo" type="number" min="0" required defaultValue={producto?.stockMinimo} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stockBajo">Stock bajo</Label>
              <Input id="stockBajo" name="stockBajo" type="number" min="0" required defaultValue={producto?.stockBajo} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stockAlto">Stock alto</Label>
              <Input id="stockAlto" name="stockAlto" type="number" min="0" required defaultValue={producto?.stockAlto} />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando…" : "Guardar"}
            </Button>
            <Button asChild variant="outline">
              <Link href="/productos">Cancelar</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
