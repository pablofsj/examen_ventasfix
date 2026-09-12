# VentasFix — Backoffice

Backoffice de **VentasFix**, una empresa que moderniza su sistema de venta en línea. La plataforma permite administrar **usuarios**, **productos** y **clientes**, con un **dashboard** de resumen y una **API REST autenticada** para la integración con aplicaciones de terceros (p. ej. el sistema de gestión **Softland**).

Examen final de la asignatura *Desarrollo de Software Web I*, IPSS.

---

## Stack técnico

| Tecnología | Rol |
|---|---|
| **Next.js 16** (App Router) + TypeScript | Framework full-stack, patrón cliente-servidor |
| **Prisma 7** + PostgreSQL | ORM y base de datos (driver adapter `@prisma/adapter-pg`) |
| **Argon2** (`argon2id`) | Hash de contraseñas |
| **jose** | Firma/verificación de JWT (compatible con Edge Runtime) |
| **Tailwind CSS v4** + shadcn/ui | Estilos y componentes (tema oscuro empresarial) |
| **lucide-react** | Iconografía |

### Justificación breve

- **Next.js App Router** unifica la vista (server/client components) y los controladores (route handlers) en un solo proyecto, lo que simplifica un backoffice MVC monolito.
- **Prisma** aporta un schema tipado que elimina la duplicación entre modelo y tipos, con validación en tiempo de compilación.
- **Argon2id** es el algoritmo recomendado por OWASP para el almacenamiento seguro de contraseñas.
- **jose** permite verificar JWT tanto en Node como en Edge, necesario para el middleware (`proxy.ts`) y para que terceros consuman la API con `Authorization: Bearer`.
- **PostgreSQL embebido** permite ejecutar el proyecto sin Docker ni instalación local.

---

## Requisitos

- Node.js 20 o superior (probado con Node 20+).
- No se requiere PostgreSQL ni Docker: la base de datos es **embebida** y se descarga automáticamente.

## Pasos de ejecución

```bash
# 1. Instalar dependencias (genera automáticamente el cliente Prisma y el .env)
npm install

# 2. Levantar PostgreSQL embebido (puerto 5433)
npm run db:start

# 3. Crear las tablas (en otra terminal)
npm run db:migrate -- --name init

# 4. Sembrar el usuario administrador inicial
npm run db:seed

# 5. Ejecutar la aplicación
npm run dev
```

Abre `http://localhost:3000`. Accede con el usuario administrador:

- **Email:** `admin@ventasfix.cl`
- **Contraseña:** `admin123`

> Cambia estas credenciales desde el propio backoffice (sección **Usuarios**) o crea nuevas cuentas.

### Variables de entorno

El proyecto **no versiona credenciales**. El archivo `.env` se genera automáticamente al ejecutar `npm install` (vía `scripts/setup-env.js`) con:

- `DATABASE_URL`: cadena de conexión al PostgreSQL embebido.
- `JWT_SECRET`: secreto aleatorio de 32 bytes para firmar los JWT.

Para generar las tuyas propias, basta con borrar `.env` y volver a ejecutar `npm install`, o crearlo manualmente siguiendo `.env.example`:

```bash
DATABASE_URL="postgresql://root:ventasfix@localhost:5433/ventasfix"
JWT_SECRET="<secreto-aleatorio-de-32-bytes>"
```

Puedes generar un secreto con:

```bash
openssl rand -hex 32
```

---

## Arquitectura

La aplicación sigue el patrón **cliente-servidor**: el navegador (cliente) consume la API y las vistas del servidor Next.js. Internamente, el backend se organiza siguiendo **MVC**.

| Capa | Ubicación |
|---|---|
| Modelo | `prisma/schema.prisma` (`Usuario`, `Producto`, `Cliente`) |
| Controlador | `src/app/api/**/route.ts` |
| Vista | `src/app/**/page.tsx` |
| Middleware JWT | `src/proxy.ts` |
| Validación | `src/lib/validacion.ts` |
| Auth | `src/lib/auth.ts` |

### Estructura del proyecto

```
examen_ventasfix/
├── prisma/
│   ├── schema.prisma          # Modelo de datos (Prisma)
│   ├── seed.ts                # Usuario admin inicial
│   └── migrations/            # Migraciones SQL
├── scripts/
│   ├── db.mjs                 # PostgreSQL embebido (puerto 5433)
│   └── setup-env.js           # Genera .env (DATABASE_URL + JWT_SECRET)
├── src/
│   ├── proxy.ts               # Middleware de autenticación JWT
│   ├── app/
│   │   ├── layout.tsx         # Layout raíz (navbar + footer)
│   │   ├── globals.css        # Tema oscuro + estilos base
│   │   ├── page.tsx           # Redirige a /dashboard
│   │   ├── login/             # Vista de inicio de sesión
│   │   ├── dashboard/         # Resumen de conteos
│   │   ├── usuarios/          # CRUD de usuarios (listado + nuevo + [id])
│   │   ├── productos/         # CRUD de productos
│   │   ├── clientes/          # CRUD de clientes
│   │   └── api/               # Controladores (route handlers)
│   │       ├── auth/          # login / logout
│   │       ├── usuarios/      # GET/POST + [id]
│   │       ├── productos/     # GET/POST + [id]
│   │       └── clientes/      # GET/POST + [id]
│   ├── components/
│   │   ├── ui/                # Componentes shadcn (Button, Card, Table, …)
│   │   ├── forms/             # Formularios por entidad
│   │   ├── navbar.tsx         # Navegación del backoffice
│   │   ├── footer.tsx         # Pie con redes sociales
│   │   ├── logo.tsx           # Logo VentasFix
│   │   └── brand-icons.tsx    # Iconos de LinkedIn, Instagram y X
│   └── lib/
│       ├── prisma.ts          # Cliente Prisma (singleton + adapter)
│       ├── auth.ts            # Hash de contraseñas + JWT
│       ├── validacion.ts      # Validación de entrada (por entidad)
│       ├── api.ts             # Tipos y helper de consumo de la API
│       └── utils.ts           # Utilidades (cn)
├── public/                    # Recursos estáticos
├── docs/screenshots/          # Capturas de pantalla
├── .env.example               # Variables de entorno de referencia
└── package.json               # Scripts y dependencias
```

### Modelo de datos

#### `Usuario`

| Campo | Tipo | Restricciones |
|---|---|---|
| `id` | Int | PK, autoincrement |
| `rut` | String | Único |
| `nombre` | String | Obligatorio |
| `apellido` | String | Obligatorio |
| `email` | String | Único, `@ventasfix.cl` |
| `password` | String | Hash Argon2id |

#### `Producto`

| Campo | Tipo | Restricciones |
|---|---|---|
| `id` | Int | PK, autoincrement |
| `sku` | String | Único |
| `nombre` | String | Obligatorio |
| `descripcionCorta` | String | Obligatorio |
| `descripcionLarga` | String | Obligatorio |
| `imagen` | String | URL de la imagen |
| `precioNeto` | Int | ≥ 0 |
| `precioVenta` | Int | ≥ 0 (IVA 19 %) |
| `stockActual` | Int | ≥ 0 |
| `stockMinimo` | Int | ≥ 0 |
| `stockBajo` | Int | ≥ 0 |
| `stockAlto` | Int | ≥ 0 |

#### `Cliente`

| Campo | Tipo | Restricciones |
|---|---|---|
| `id` | Int | PK, autoincrement |
| `rutEmpresa` | String | Único |
| `rubro` | String | Obligatorio |
| `razonSocial` | String | Obligatorio |
| `telefono` | String | Obligatorio |
| `direccion` | String | Obligatorio |
| `nombreContacto` | String | Obligatorio |
| `emailContacto` | String | Obligatorio |

---

## Funcionalidades

### Autenticación

- **Login** con email (`@ventasfix.cl`) y contraseña.
- Sesión mediante cookie `httpOnly` + `Secure` + `SameSite`.
- Contraseñas cifradas con **Argon2id** (nunca se devuelven en la API).
- La API admite autenticación por **Bearer token** para terceros (el login devuelve el JWT en el cuerpo de la respuesta).

### Dashboard

Resumen con el total de **usuarios**, **productos** y **clientes** registrados.

### Usuarios

Trabajadores que administran el sistema: `id`, `rut`, `nombre`, `apellido`, `email`, `password` (cifrada).

### Productos

Catálogo con impuestos incluidos: `id`, `sku`, `nombre`, descripción corta y larga, `imagen`, `precioNeto`, `precioVenta` (IVA 19 %), `stockActual`, `stockMinimo`, `stockBajo`, `stockAlto`.

### Clientes

Clientes empresa: `id`, `rutEmpresa`, `rubro`, `razonSocial`, `telefono`, `direccion`, `nombreContacto`, `emailContacto`.

---

## API REST

Base URL: `http://localhost:3000`. Todos los endpoints (salvo el login) requieren autenticación: cookie de sesión o header `Authorization: Bearer <token>`.

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Inicia sesión y devuelve el JWT | — |
| `POST` | `/api/auth/logout` | Cierra sesión | Sí |
| `GET` | `/api/usuarios` | Lista usuarios | Sí |
| `POST` | `/api/usuarios` | Crea usuario | Sí |
| `GET` | `/api/usuarios/:id` | Obtiene usuario | Sí |
| `PUT` | `/api/usuarios/:id` | Actualiza usuario | Sí |
| `DELETE` | `/api/usuarios/:id` | Elimina usuario | Sí |
| `GET` | `/api/productos` | Lista productos | Sí |
| `POST` | `/api/productos` | Crea producto | Sí |
| `GET` | `/api/productos/:id` | Obtiene producto | Sí |
| `PUT` | `/api/productos/:id` | Actualiza producto | Sí |
| `DELETE` | `/api/productos/:id` | Elimina producto | Sí |
| `GET` | `/api/clientes` | Lista clientes | Sí |
| `POST` | `/api/clientes` | Crea cliente | Sí |
| `GET` | `/api/clientes/:id` | Obtiene cliente | Sí |
| `PUT` | `/api/clientes/:id` | Actualiza cliente | Sí |
| `DELETE` | `/api/clientes/:id` | Elimina cliente | Sí |

### Ejemplo de consumo con token (terceros)

```bash
# 1. Obtener token
curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ventasfix.cl","password":"admin123"}' | jq -r .token

# 2. Listar productos con el token
curl -s http://localhost:3000/api/productos \
  -H "Authorization: Bearer <TOKEN>"
```

Los métodos de escritura validan que **todos los campos sean obligatorios** (no se almacenan datos vacíos) y responden `400` si falta alguno, `401` sin autenticación y `409` si se duplica un campo único.

---

## Capturas de pantalla

### Login

![Login](docs/screenshots/01-login.png)

### Dashboard

![Dashboard](docs/screenshots/02-dashboard.png)

### Productos

![Listado de productos](docs/screenshots/03-productos.png)

![Formulario de producto](docs/screenshots/04-producto-form.png)

### Usuarios

![Listado de usuarios](docs/screenshots/05-usuarios.png)

### Clientes

![Listado de clientes](docs/screenshots/06-clientes.png)

### API (JSON)

![Respuesta JSON de la API](docs/screenshots/07-api.png)

---

## Licencia

Proyecto académico.
