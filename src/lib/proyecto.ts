export interface ProyectoInput {
  nombre: string;
  fechaInicio: Date;
  estado: string;
  responsable: string;
  monto: number;
}

export function parseProyectoInput(
  body: unknown
): { data?: ProyectoInput; error?: string } {
  const b = (body ?? {}) as Record<string, unknown>;
  const nombre = typeof b.nombre === "string" ? b.nombre.trim() : "";
  const estado = typeof b.estado === "string" ? b.estado.trim() : "";
  const responsable =
    typeof b.responsable === "string" ? b.responsable.trim() : "";
  const fechaInicio =
    typeof b.fechaInicio === "string" ? new Date(b.fechaInicio) : new Date(NaN);
  const monto = b.monto === null || b.monto === "" ? NaN : Number(b.monto);

  if (!nombre || !estado || !responsable) {
    return { error: "Nombre, estado y responsable son obligatorios" };
  }
  if (isNaN(fechaInicio.getTime())) {
    return { error: "fechaInicio inválida (use formato YYYY-MM-DD)" };
  }
  if (isNaN(monto)) {
    return { error: "monto inválido" };
  }

  return { data: { nombre, estado, responsable, fechaInicio, monto } };
}
