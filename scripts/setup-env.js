// Crea automáticamente el archivo .env si no existe, para que el proyecto
// funcione sin configuración manual (DATABASE_URL + JWT_SECRET aleatorio).
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const envPath = path.join(__dirname, "..", ".env");

if (fs.existsSync(envPath)) {
  console.log("[setup-env] .env ya existe; no se modificó.");
  process.exit(0);
}

const jwtSecret = crypto.randomBytes(32).toString("hex");
const content = [
  'DATABASE_URL="postgresql://root:ventasfix@localhost:5433/ventasfix"',
  `JWT_SECRET="${jwtSecret}"`,
  "",
].join("\n");

fs.writeFileSync(envPath, content, "utf8");
console.log("[setup-env] .env creado (DATABASE_URL :5433 + JWT_SECRET aleatorio).");
