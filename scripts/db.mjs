import EmbeddedPostgres from "embedded-postgres";

// Script de desarrollo: levanta un PostgreSQL local embebido para correr la
// app sin instalar PostgreSQL. Credenciales según INIT.md.
// El proceso se mantiene vivo: al terminarlo (Ctrl+C), PostgreSQL se detiene.
const pg = new EmbeddedPostgres({
  databaseDir: "./data/db",
  user: "root",
  password: "ventasfix",
  port: 5433,
  authMethod: "scram-sha-256",
  persistent: true,
  onLog: () => {},
});

await pg.initialise().catch(() => {});
await pg.start();
await pg.createDatabase("ventasfix").catch(() => {});
console.log("PostgreSQL listo en localhost:5433 (root / ventasfix)");

// Mantener el proceso vivo; async-exit-hook detiene PostgreSQL al salir.
await new Promise(() => {});
