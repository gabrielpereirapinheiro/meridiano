"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/#planejar", label: "Mesa" },
  { href: "/rotas/cabo", label: "Cabo" },
  { href: "/rotas/cabo-atenas", label: "Cabo e Atenas" },
  { href: "/rotas/atenas-oslo", label: "Atenas e Oslo" },
  { href: "/fontes", label: "Fontes" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="group flex items-baseline gap-3">
          <span className="serif text-xl tracking-tight">Meridiano</span>
          <span className="hidden text-[11px] uppercase tracking-[0.18em] text-muted sm:inline">
            Brasília · 2027
          </span>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto text-sm">
          {links.map((link) => {
            const active = link.href.startsWith("/rotas")
              ? pathname === link.href
              : link.href === "/fontes"
                ? pathname === "/fontes"
                : false;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 rounded-full px-3 py-1.5 ${active ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 text-sm text-muted sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="serif text-2xl text-ink">Meridiano</p>
          <p className="mt-2 max-w-md">
            Referência de mercado pesquisada em 23 de outubro de 2026. Não é cotação, não é agência
            e não segura tarifa.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/fontes" className="underline decoration-line underline-offset-4">
            De onde vêm os números
          </Link>
          <a href="/api/voos?rota=cabo&feriado=trabalho&qual=0" className="underline decoration-line underline-offset-4">
            API de buscas
          </a>
        </div>
      </div>
    </footer>
  );
}
