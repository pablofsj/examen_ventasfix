import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// En Next.js 16 `middleware.ts` fue renombrado a `proxy.ts`. Cumple la función
// de middleware: valida el JWT (cookie `token` o header `Authorization: Bearer`)
// y protege el backoffice y la API.
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function getUserId(request: NextRequest): Promise<number | null> {
  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ")
    ? auth.slice(7)
    : request.cookies.get("token")?.value;

  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const sub = Number(payload.sub);
    return Number.isInteger(sub) ? sub : null;
  } catch {
    return null;
  }
}

const RUTAS_PROTEGIDAS = [
  "/dashboard",
  "/usuarios",
  "/productos",
  "/clientes",
];

// La API está protegida salvo el login (que emite el token) y el registro.
const API_PUBLICA = ["/api/auth/login", "/api/auth/registro"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userId = await getUserId(request);

  const esApi = pathname.startsWith("/api");
  const esAuth = pathname.startsWith("/login") || pathname.startsWith("/registro");
  const esPublica = API_PUBLICA.some((r) => pathname === r);
  const esProtegida =
    RUTAS_PROTEGIDAS.some((r) => pathname === r || pathname.startsWith(`${r}/`)) ||
    (esApi && !esPublica);

  if (!userId && esProtegida) {
    if (esApi) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (userId && esAuth) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
