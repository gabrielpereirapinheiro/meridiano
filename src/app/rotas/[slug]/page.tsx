import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { routeOrder, routes, type RouteId } from "@/data/catalog";
import { guides } from "@/data/guides";
import { ClimateBoard } from "@/components/climate-board";
import { Footer, Header } from "@/components/header";
import { bestForRoute, defaultPrefs, nightsFor } from "@/lib/engine";
import { money, rangeLabel } from "@/lib/format";

const highlight: Record<RouteId, number[]> = {
  cabo: [5, 8, 9, 10],
  "cabo-atenas": [5, 6, 9, 10],
  "atenas-oslo": [5, 6, 7, 8],
};

export function generateStaticParams() {
  return routeOrder.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = routes[slug as RouteId];
  if (!route) return { title: "Rota" };
  return {
    title: `${route.name} — Meridiano`,
    description: route.summary,
  };
}

export default async function RoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!routeOrder.includes(slug as RouteId)) notFound();
  const id = slug as RouteId;
  const route = routes[id];
  const best = bestForRoute(id, {
    ...defaultPrefs,
    safari: id === "cabo",
    nights: nightsFor(id, id === "cabo"),
  });
  const guide = guides[id];

  return (
    <>
      <Header />
      <main>
        <section className="relative min-h-[420px]">
          <Image src={route.photo} alt={route.photoAlt} fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/35 to-night/10" />
          <div className="relative mx-auto flex min-h-[420px] max-w-6xl flex-col justify-end px-4 py-10 text-paper">
            <p className="text-xs uppercase tracking-[0.18em] text-paper/75">{route.kicker}</p>
            <h1 className="serif mt-2 text-5xl tracking-tight sm:text-7xl">{route.name}</h1>
            <p className="mt-4 max-w-xl text-lg text-paper/85">{route.summary}</p>
          </div>
        </section>
        <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="sheet h-fit p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Melhor janela, critérios padrão</p>
            <p className="serif mt-2 text-3xl">{best.quote.holiday.name}</p>
            <p className="mt-1 text-sm text-muted">{rangeLabel(best.quote.depart, best.quote.ret)}</p>
            <p className="num mt-4 text-4xl">{money(best.quote.cashTotal)}</p>
            <p className="mt-1 text-sm text-muted">Uma pessoa, hotel em local bom, comida de restaurante, em dinheiro.</p>
            <p className="mt-4 text-sm">
              Nota da mesa {best.score.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </p>
            <Link
              href={`/?rota=${id}#planejar`}
              className="mt-5 inline-flex rounded-full bg-ink px-4 py-2 text-sm text-paper"
            >
              Calcular do meu jeito
            </Link>
          </aside>
          <div className="space-y-8">
            {guide.sections.map((section) => (
              <article key={section.title}>
                <h2 className="serif text-3xl tracking-tight">{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="mt-3 leading-7 text-ink/90">
                    {paragraph}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </section>
        <ClimateBoard highlight={highlight[id]} />
      </main>
      <Footer />
    </>
  );
}

