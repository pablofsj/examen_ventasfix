type Cuerpo = Record<string, unknown>;

function texto(b: Cuerpo, clave: string): string {
  return typeof b[clave] === "string" ? b[clave].trim() : "";
}

function entero(b: Cuerpo, clave: string): number | null {
  const v = b[clave];
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export interface UsuarioInput {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

export interface ProductoInput {
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

export interface ClienteInput {
  rutEmpresa: string;
  rubro: string;
  razonSocial: string;
  telefono: string;
  direccion: string;
  nombreContacto: string;
  emailContacto: string;
}

export function parseUsuarioInput(
  body: unknown
): { data?: UsuarioInput; error?: string } {
  const b = (body ?? {}) as Cuerpo;
  const rut = texto(b, "rut");
  const nombre = texto(b, "nombre");
  const apellido = texto(b, "apellido");
  const email = texto(b, "email").toLowerCase();
  const password = typeof b.password === "string" ? b.password : "";

  if (!rut || !nombre || !apellido || !email || !password) {
    return { error: "Todos los campos son obligatorios" };
  }
  if (!email.endsWith("@ventasfix.cl")) {
    return { error: "El email debe terminar en @ventasfix.cl" };
  }
  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres" };
  }

  return { data: { rut, nombre, apellido, email, password } };
}

export function parseProductoInput(
  body: unknown
): { data?: ProductoInput; error?: string } {
  const b = (body ?? {}) as Cuerpo;
  const sku = texto(b, "sku");
  const nombre = texto(b, "nombre");
  const descripcionCorta = texto(b, "descripcionCorta");
  const descripcionLarga = texto(b, "descripcionLarga");
  const imagen = texto(b, "imagen");
  const precioNeto = entero(b, "precioNeto");
  const precioVenta = entero(b, "precioVenta");
  const stockActual = entero(b, "stockActual");
  const stockMinimo = entero(b, "stockMinimo");
  const stockBajo = entero(b, "stockBajo");
  const stockAlto = entero(b, "stockAlto");

  if (
    !sku ||
    !nombre ||
    !descripcionCorta ||
    !descripcionLarga ||
    !imagen
  ) {
    return { error: "Todos los campos son obligatorios" };
  }
  const numeros = [precioNeto, precioVenta, stockActual, stockMinimo, stockBajo, stockAlto];
  if (numeros.some((n) => n === null || n < 0)) {
    return { error: "Precios y stock deben ser números enteros no negativos" };
  }

  return {
    data: {
      sku,
      nombre,
      descripcionCorta,
      descripcionLarga,
      imagen,
      precioNeto: precioNeto!,
      precioVenta: precioVenta!,
      stockActual: stockActual!,
      stockMinimo: stockMinimo!,
      stockBajo: stockBajo!,
      stockAlto: stockAlto!,
    },
  };
}

export function parseClienteInput(
  body: unknown
): { data?: ClienteInput; error?: string } {
  const b = (body ?? {}) as Cuerpo;
  const rutEmpresa = texto(b, "rutEmpresa");
  const rubro = texto(b, "rubro");
  const razonSocial = texto(b, "razonSocial");
  const telefono = texto(b, "telefono");
  const direccion = texto(b, "direccion");
  const nombreContacto = texto(b, "nombreContacto");
  const emailContacto = texto(b, "emailContacto").toLowerCase();

  if (
    !rutEmpresa ||
    !rubro ||
    !razonSocial ||
    !telefono ||
    !direccion ||
    !nombreContacto ||
    !emailContacto
  ) {
    return { error: "Todos los campos son obligatorios" };
  }

  return {
    data: {
      rutEmpresa,
      rubro,
      razonSocial,
      telefono,
      direccion,
      nombreContacto,
      emailContacto,
    },
  };
}
