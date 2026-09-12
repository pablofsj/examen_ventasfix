export interface Usuario {
  id: number;
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
}

export interface Producto {
  id: number;
  sku: string;
  nombre: string;
  descripcionCorta: string;
  descripcionLarga: string;
  imagen: string;
  precioNeto: number;
  precioVenta: number;
  stockActual: number;
  stockMinimo: number;
  stockBajo: number;
  stockAlto: number;
}

export interface Cliente {
  id: number;
  rutEmpresa: string;
  rubro: string;
  razonSocial: string;
  telefono: string;
  direccion: string;
  nombreContacto: string;
  emailContacto: string;
}

export interface DashboardStats {
  usuarios: number;
  productos: number;
  clientes: number;
}

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      (data as { error?: string } | null)?.error ?? "Error del servidor"
    );
  }
  return data as T;
}

export function formatCLP(valor: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(valor);
}
