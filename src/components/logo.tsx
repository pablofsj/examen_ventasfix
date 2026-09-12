import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2", className)}
      aria-label="VentasFix"
    >
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-brand">
        <ShoppingCart className="size-5" />
      </span>
      {!compact && (
        <span className="font-display text-xl font-bold tracking-tight text-foreground text-shadow-brand">
          Ventas<span className="text-primary">Fix</span>
        </span>
      )}
    </Link>
  );
}
