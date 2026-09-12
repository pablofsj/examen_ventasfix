"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Package, Pencil, Plus, Trash2 } from "lucide-react";
import { api, formatCLP, type Producto } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

function stockEstado(p: Producto) {
  if (p.stockActual <= p.stockMinimo) return { label: "Bajo", variant: "destructive" as const };
  if (p.stockActual < p.stockBajo) return { label: "Medio", variant: "secondary" as const };
  return { label: "Ok", variant: "default" as const };
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(() => {
    api<Producto[]>("/api/productos")
      .then(setProductos)
      .catch(() => setProductos([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(cargar, [cargar]);

  async function eliminar(id: number) {
    if (!confirm("¿Eliminar este producto?")) return;
    await api(`/api/productos/${id}`, { method: "DELETE" });
    cargar();
  }

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Package className="size-6 text-primary" />
            <div>
              <CardTitle>Productos</CardTitle>
              <CardDescription>Catálogo con precios e impuestos incluidos</CardDescription>
            </div>
          </div>
          <Button asChild>
            <Link href="/productos/nuevo">
              <Plus />
              Nuevo producto
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Cargando…</p>
          ) : productos.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No hay productos registrados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio venta</TableHead>
                  <TableHead>Stock actual</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.map((p) => {
                  const estado = stockEstado(p);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                      <TableCell>{p.nombre}</TableCell>
                      <TableCell>{formatCLP(p.precioVenta)}</TableCell>
                      <TableCell>{p.stockActual}</TableCell>
                      <TableCell>
                        <Badge variant={estado.variant}>{estado.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-1">
                          <Button asChild variant="ghost" size="icon-sm">
                            <Link href={`/productos/${p.id}`} aria-label="Editar">
                              <Pencil />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive"
                            onClick={() => eliminar(p.id)}
                            aria-label="Eliminar"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
