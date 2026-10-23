import Image from "next/image";
import { routeOrder, routes } from "@/data/catalog";
import { ClimateBoard } from "@/components/climate-board";
import { Footer, Header } from "@/components/header";
import { Planner } from "@/components/planner";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto grid max-w-6xl items-end gap-10 px-4 pb-4 pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:pt-16">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Duas semanas · um feriado · três rotas</p>
            <h1 className="serif mt-4 text-5xl leading-[0.95] tracking-tight sm:text-7xl">
              Sair de Brasília em 2027 sem escolher no escuro.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              África do Sul sozinha, Cabo com Atenas, ou Atenas com Oslo. A mesa compara dinheiro e
              milhas, hotel em lugar bom, comida, clima e o feriado americano que cabe em quatorze noites.
            </p>
            <a href="#planejar" className="mt-8 inline-flex rounded-full bg-ink px-5 py-3 text-sm text-paper">
              Abrir a mesa
            </a>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {routeOrder.map((id) => (
              <a key={id} href={`/rotas/${id}`} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl">
                <Image
                  src={routes[id].photo}
                  alt={routes[id].photoAlt}
                  fill
                  priority={id === "cabo"}
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="200px"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/80 to-transparent p-3 text-sm text-paper">
                  {routes[id].name}
                </span>
              </a>
            ))}
          </div>
        </section>
        <Planner />
        <ClimateBoard />
      </main>
      <Footer />
    </>
  );
}
