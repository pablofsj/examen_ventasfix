"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

const links = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/usuarios", label: "Usuarios", Icon: Users },
  { href: "/productos", label: "Productos", Icon: Package },
  { href: "/clientes", label: "Clientes", Icon: Building2 },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/login" || pathname === "/registro";

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 shadow-[0_2px_12px_rgb(0_0_0/0.35)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />

        {isAuthPage ? (
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="lg">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/registro">Registrarse</Link>
            </Button>
          </nav>
        ) : (
          <nav className="flex items-center gap-1">
            {links.map(({ href, label, Icon }) => {
              const activo = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Button
                  key={href}
                  asChild
                  variant={activo ? "secondary" : "ghost"}
                  size="lg"
                >
                  <Link href={href}>
                    <Icon />
                    {label}
                  </Link>
                </Button>
              );
            })}
            <Button variant="outline" size="lg" onClick={logout}>
              <LogOut />
              Salir
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
