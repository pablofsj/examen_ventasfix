<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Contexto del proyecto

Backoffice **VentasFix** con patrón **cliente-servidor (MVC monolito)**: gestión de usuarios, productos y clientes con autenticación JWT y API consumible por terceros (Softland). Examen final — Desarrollo de Software Web I.

## Stack

- Next.js 16 (App Router) + TypeScript
- Prisma 7 + PostgreSQL (driver adapter `@prisma/adapter-pg`)
- Argon2 (`argon2id`) para el hash de contraseñas
- `jose` para firmar/verificar JWT (Edge/Node)
- shadcn/ui (componentes) + Tailwind CSS v4 + `lucide-react` (iconos)
- Cookie `httpOnly` + `Secure` + `SameSite` para el JWT (navegador) y `Authorization: Bearer` (terceros)

## Arquitectura (mapeo MVC)

| Capa | Ubicación |
|---|---|
| Modelo | `prisma/schema.prisma` (`Usuario`, `Producto`, `Cliente`) |
| Controlador | `src/app/api/**/route.ts` |
| Vista | `src/app/**/page.tsx` |
| Componentes UI | `src/components/ui/` (shadcn), `src/components/` (navbar, footer, logo, brand-icons) y `src/components/forms/` (formularios por entidad) |
| Middleware JWT | `src/proxy.ts` |
| Prisma client | `src/lib/prisma.ts` (singleton + adapter) |
| Auth helpers | `src/lib/auth.ts` |
| Validación entrada | `src/lib/validacion.ts` |
| Tipos/API helper | `src/lib/api.ts` |

## Convenciones de Next.js 16 / Prisma 7 (¡rompen con versiones anteriores!)

- `params` de un route handler es una **Promise**: `const { id } = await params`.
- `cookies()` de `next/headers` es **async**: `(await cookies()).get("token")`.
- `middleware.ts` está **deprecado** → se usa `src/proxy.ts` (export `proxy` + `config.matcher`).
- Prisma 7 usa el generator `prisma-client` (salida en `generated/prisma/`) y **requiere driver adapter**: `new PrismaClient({ adapter: new PrismaPg({ connectionString }) })`.
- El cliente generado se importa desde `../../generated/prisma/client`, **no** desde `@prisma/client`. Regenerar con `npx prisma generate` (corre en `postinstall`).

## Base de datos

- PostgreSQL **embebido** (`embedded-postgres`, `scripts/db.mjs`): sin Docker ni instalación local. Corre en el puerto `5433`.
- `.env` se crea **automáticamente** en `postinstall`/`dev`/`build` vía `scripts/setup-env.js` (con `JWT_SECRET` aleatorio de 32 bytes).
- `npm run db:start` lo levanta en `localhost:5433` (db `ventasfix`, user `root`, pass `ventasfix`).
- Migraciones: `npm run db:migrate -- --name <nombre>`.
- Seed: `npm run db:seed` crea el usuario admin (`admin@ventasfix.cl`).

## Comandos

```bash
npm install
npm run db:start        # levanta PostgreSQL embebido
npm run db:migrate -- --name init
npm run db:seed         # usuario admin inicial
npm run dev             # http://localhost:3000
npm run build
npm run start
```

## Seguridad / autenticación

- `src/lib/validacion.ts` centraliza la validación de entrada (todos los campos obligatorios; email `@ventasfix.cl`; numéricos no negativos).
- `getSessionUserId(request?)` (`src/lib/auth.ts`) acepta cookie **o** header `Authorization: Bearer`; los controladores de escritura la usan para responder 401.
- El proxy protege `/dashboard`, `/usuarios`, `/productos`, `/clientes` y toda la API (salvo `/api/auth/login` y `/api/auth/registro`): redirige a `/login` o responde 401. El JWT se firma con `JWT_SECRET` (HS256, `jose`).
- La contraseña nunca se devuelve en las respuestas de la API (los `select` excluyen `password`).
