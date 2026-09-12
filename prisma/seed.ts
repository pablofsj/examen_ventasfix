import "dotenv/config";
import argon2 from "argon2";
import { prisma } from "../src/lib/prisma";

// Usuario administrador inicial: el backoffice requiere login y los usuarios
// se administran desde la propia aplicación, por lo que se siembra una cuenta
// admin para el primer acceso. Credenciales de desarrollo documentadas en el
// README (cámbialas en producción).
const ADMIN = {
  rut: "11.111.111-1",
  nombre: "Admin",
  apellido: "VentasFix",
  email: "admin@ventasfix.cl",
  password: "admin123",
};

async function main() {
  const existente = await prisma.usuario.findUnique({
    where: { email: ADMIN.email },
  });
  if (existente) {
    console.log(`Usuario ${ADMIN.email} ya existe; no se hizo nada.`);
    return;
  }

  await prisma.usuario.create({
    data: {
      rut: ADMIN.rut,
      nombre: ADMIN.nombre,
      apellido: ADMIN.apellido,
      email: ADMIN.email,
      password: await argon2.hash(ADMIN.password, { type: argon2.argon2id }),
    },
  });
  console.log(`Usuario admin creado: ${ADMIN.email} / ${ADMIN.password}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
