import { Logo } from "@/components/logo";
import {
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/brand-icons";

const socials = [
  { name: "LinkedIn", href: "https://www.linkedin.com/ventasfix", Icon: LinkedinIcon },
  { name: "Instagram", href: "https://www.instagram.com/ventasfix", Icon: InstagramIcon },
  { name: "X", href: "https://x.com/ventasfix", Icon: XIcon },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 shadow-[0_-1px_2px_rgb(0_0_0/0.4)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-8 sm:flex-row sm:justify-between">
        <Logo compact />

        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} VentasFix. Todos los derechos reservados.
        </p>

        <div className="flex gap-2">
          {socials.map(({ name, href, Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={name}
              title={name}
              className="grid size-9 place-items-center rounded-full border bg-background text-muted-foreground shadow-[0_2px_8px_rgb(0_0_0/0.4)] transition-colors hover:bg-primary hover:text-primary-foreground hover:shadow-brand"
            >
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
