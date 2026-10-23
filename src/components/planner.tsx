"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import {
  cityMeta,
  holidays,
  months,
  routeOrder,
  routes,
  type CityId,
  type FoodTier,
  type HotelTier,
  type RouteId,
} from "@/data/catalog";
import {
  blocksFor,
  briefs,
  defaultPrefs,
  nightsFor,
  optionsForRoute,
  rankRoutes,
  resolveQuote,
  type Pick,
  type Prefs,
} from "@/lib/engine";
import { googleFlights, kayak, skyscanner, type SearchLeg } from "@/lib/links";
import { money, miles, rangeLabel } from "@/lib/format";

const hotelLabels: Record<HotelTier, string> = {
  medio: "Mediana",
  bom: "Local bom",
  folgado: "Mais folgado",
};

const foodLabels: Record<FoodTier, string> = {
  simples: "Simples",
  medio: "Restaurante",
  confortavel: "Sem contar",
};

type LiveSearch = {
  label: string;
  estimativa: number;
  google: string;
  skyscanner: string;
  kayak: string;
};

export function Planner() {
  const reduce = useReducedMotion();
  const [route, setRoute] = useState<RouteId>("cabo");
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs);
  const [pick, setPick] = useState<Pick>(null);
  const [live, setLive] = useState<LiveSearch[] | null>(null);
  const [liveNote, setLiveNote] = useState("");
  const [liveState, setLiveState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("rota");
    if (id === "cabo" || id === "cabo-atenas" || id === "atenas-oslo") {
      setRoute(id);
      setPrefs((current) => ({
        ...current,
        safari: id === "cabo",
        nights: nightsFor(id, id === "cabo"),
      }));
      setPick(null);
    }
  }, []);

  const rankedWindows = useMemo(() => optionsForRoute(route, prefs), [route, prefs]);
  const active = useMemo(() => resolveQuote(route, prefs, pick), [route, prefs, pick]);
  const ranking = useMemo(() => rankRoutes(prefs), [prefs]);
  const notes = useMemo(() => briefs(route, prefs, pick), [route, prefs, pick]);
  const blocks = blocksFor(active.quote, prefs.ritmo);
  const quote = active.quote;
  const maxLine = Math.max(...quote.lines.map((line) => line.brl), 1);

  function chooseRoute(id: RouteId) {
    setRoute(id);
    setPick(null);
    setLive(null);
    setLiveState("idle");
    setPrefs((current) => ({
      ...current,
      nights: nightsFor(id, current.safari),
    }));
  }

  function chooseHoliday(id: string) {
    const best = rankedWindows.find((item) => item.quote.holiday.id === id);
    if (!best) return;
    setPick({ holidayId: id, which: best.quote.which });
    setLive(null);
    setLiveState("idle");
  }

  async function fetchLive() {
    setLiveState("loading");
    const params = new URLSearchParams({
      rota: route,
      feriado: quote.holiday.id,
      qual: String(quote.which),
      pessoas: String(prefs.people),
      hotel: prefs.hotel,
      comida: prefs.food,
      safari: prefs.safari ? "1" : "0",
      lodge: prefs.lodge ? "1" : "0",
      seguro: prefs.insurance ? "1" : "0",
      cape: String(prefs.nights.cape),
      kruger: String(prefs.nights.kruger),
      athens: String(prefs.nights.athens),
      oslo: String(prefs.nights.oslo),
      milhasAfrica: String(prefs.milesAfrica),
      milhasEuropa: String(prefs.milesEurope),
      milheiro: String(prefs.milheiro),
      taxas: String(prefs.taxPerLeg),
      ponte: String(prefs.bridgeBrl),
    });
    try {
      const response = await fetch(`/api/voos?${params.toString()}`);
      if (!response.ok) throw new Error("falha");
      const data = (await response.json()) as { aviso: string; buscas: LiveSearch[] };
      setLive(data.buscas);
      setLiveNote(data.aviso);
      setLiveState("ready");
    } catch {
      setLive(quote.legs.map((leg) => toSearch(leg, prefs.people)));
      setLiveNote("A API não respondeu. Os links abaixo foram montados neste navegador, com a mesma estimativa.");
      setLiveState("error");
    }
  }

  const nightCities: CityId[] =
    route === "cabo"
      ? prefs.safari
        ? ["cape", "kruger"]
        : ["cape"]
      : route === "cabo-atenas"
        ? ["athens", "cape"]
        : ["athens", "oslo"];

  return (
    <section id="planejar" className="mx-auto max-w-6xl px-4 py-8 sm:py-14">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">A mesa</p>
        <h2 className="serif mt-2 text-4xl tracking-tight sm:text-5xl">Cinco agentes, uma conta.</h2>
        <p className="mt-3 text-lg text-muted">
          Clima, rota, caixa e malha leem os mesmos números. Nada aqui é tarifa presa. É a conta
          para escolher a quinzena antes de abrir o site da cia.
        </p>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-3">
        {routeOrder.map((id) => {
          const item = routes[id];
          const selected = id === route;
          return (
            <button
              key={id}
              type="button"
              onClick={() => chooseRoute(id)}
              aria-pressed={selected}
              className={`sheet overflow-hidden text-left transition ${selected ? "ring-2 ring-ink" : "hover:-translate-y-0.5"}`}
            >
              <div className="relative h-36">
                <Image src={item.photo} alt="" fill className="object-cover" sizes="400px" />
                <span className="absolute left-3 top-3 rounded-full bg-night/80 px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-paper">
                  {item.index}
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.16em]" style={{ color: item.accent }}>
                  {item.kicker}
                </p>
                <h3 className="serif mt-1 text-2xl">{item.name}</h3>
                <p className="mt-2 text-sm text-muted">{item.summary}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="sheet mt-6 p-4 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Feriado dentro das 14 noites</p>
            <p className="mt-1 text-sm text-muted">
              Dois sábados possíveis por data. A mesa marca o que encaixa melhor nesta rota.
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 text-sm underline decoration-line underline-offset-4"
            onClick={() => {
              setPick(null);
              setPrefs((current) => ({ ...current, nights: nightsFor(route, current.safari) }));
            }}
          >
            Voltar ao recomendado
          </button>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {holidays.map((holiday) => {
            const best = rankedWindows.find((item) => item.quote.holiday.id === holiday.id);
            const selected = quote.holiday.id === holiday.id;
            return (
              <button
                key={holiday.id}
                type="button"
                onClick={() => chooseHoliday(holiday.id)}
                aria-pressed={selected}
                className={`min-w-36 shrink-0 rounded-2xl border px-3 py-2 text-left ${selected ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink/40"}`}
              >
                <span className="block text-sm font-medium">{holiday.name}</span>
                <span className={`mt-1 block text-xs ${selected ? "text-paper/70" : "text-muted"}`}>
                  {holiday.dow} · {holiday.date.slice(8)} {months[Number(holiday.date.slice(5, 7)) - 1].slice(0, 3)}
                </span>
                <span className={`num mt-2 block text-lg ${selected ? "text-paper" : ""}`}>
                  {best ? best.score.toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 }) : "–"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Janela</span>
          <strong>{rangeLabel(quote.depart, quote.ret)}</strong>
          <button
            type="button"
            className="rounded-full border border-line px-3 py-1 hover:border-ink"
            onClick={() =>
              setPick({
                holidayId: quote.holiday.id,
                which: quote.which === 0 ? 1 : 0,
              })
            }
          >
            Trocar para a outra semana
          </button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="sr-only">Preferências da viagem</legend>
            <Choice
              label="Pessoas"
              value={String(prefs.people)}
              options={[
                ["1", "Só"],
                ["2", "Casal"],
              ]}
              onChange={(value) => setPrefs((current) => ({ ...current, people: value === "2" ? 2 : 1 }))}
            />
            <Choice
              label="Hotel"
              value={prefs.hotel}
              options={(Object.keys(hotelLabels) as HotelTier[]).map((key) => [key, hotelLabels[key]])}
              onChange={(value) => setPrefs((current) => ({ ...current, hotel: value as HotelTier }))}
            />
            <Choice
              label="Comida"
              value={prefs.food}
              options={(Object.keys(foodLabels) as FoodTier[]).map((key) => [key, foodLabels[key]])}
              onChange={(value) => setPrefs((current) => ({ ...current, food: value as FoodTier }))}
            />
            <Choice
              label="Ritmo"
              value={prefs.ritmo}
              options={[
                ["essencial", "Essencial"],
                ["devagar", "Devagar"],
              ]}
              onChange={(value) =>
                setPrefs((current) => ({ ...current, ritmo: value === "devagar" ? "devagar" : "essencial" }))
              }
            />
          </fieldset>
          <div className="space-y-3">
            {nightCities.map((city) => (
              <Stepper
                key={city}
                label={cityMeta[city].nightsLabel}
                value={prefs.nights[city]}
                min={city === "cape" || city === "athens" ? 3 : 0}
                max={10}
                onChange={(value) =>
                  setPrefs((current) => ({
                    ...current,
                    nights: { ...current.nights, [city]: value },
                  }))
                }
              />
            ))}
            {route === "cabo" ? (
              <div className="flex flex-wrap gap-2">
                <Toggle
                  pressed={prefs.safari}
                  onClick={() =>
                    setPrefs((current) => {
                      const safari = !current.safari;
                      return { ...current, safari, lodge: safari ? current.lodge : false, nights: nightsFor("cabo", safari) };
                    })
                  }
                  label="Incluir Kruger"
                />
                {prefs.safari ? (
                  <Toggle
                    pressed={prefs.lodge}
                    onClick={() => setPrefs((current) => ({ ...current, lodge: !current.lodge }))}
                    label={prefs.lodge ? "Lodge privado" : "Chalé de parque"}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <details className="mt-5 border-t border-line pt-4">
          <summary className="cursor-pointer text-sm font-medium">Ajustar milhas, taxas e seguro</summary>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <NumberField
              label="Milhas África, por trecho"
              value={prefs.milesAfrica}
              step={1000}
              onChange={(milesAfrica) => setPrefs((current) => ({ ...current, milesAfrica }))}
            />
            <NumberField
              label="Milhas Europa, por trecho"
              value={prefs.milesEurope}
              step={1000}
              onChange={(milesEurope) => setPrefs((current) => ({ ...current, milesEurope }))}
            />
            <NumberField
              label="Taxas por trecho longo (R$)"
              value={prefs.taxPerLeg}
              step={50}
              onChange={(taxPerLeg) => setPrefs((current) => ({ ...current, taxPerLeg }))}
            />
            <NumberField
              label="Milheiro (R$)"
              value={prefs.milheiro}
              step={1}
              onChange={(milheiro) => setPrefs((current) => ({ ...current, milheiro }))}
            />
            <NumberField
              label="Ponte BSB–GRU (R$)"
              value={prefs.bridgeBrl}
              step={20}
              onChange={(bridgeBrl) => setPrefs((current) => ({ ...current, bridgeBrl }))}
            />
            <label className="flex items-end gap-2 pb-2 text-sm">
              <input
                type="checkbox"
                checked={prefs.insurance}
                onChange={(event) => setPrefs((current) => ({ ...current, insurance: event.target.checked }))}
              />
              Incluir seguro-viagem
            </label>
          </div>
        </details>
      </div>

      <motion.div
        key={`${route}-${quote.depart}-${prefs.people}-${prefs.hotel}-${prefs.food}-${prefs.safari}-${prefs.lodge}`}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.35 }}
        className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]"
      >
        <div className="sheet p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted">
            {routes[route].name} · {quote.holiday.name}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted">Em dinheiro</p>
              <p className="num text-5xl">{money(quote.cashTotal)}</p>
              <p className="mt-1 text-sm text-muted">
                {prefs.people > 1 ? `${money(quote.cashTotal / 2)} por pessoa, quarto dividido` : "Uma pessoa, quarto inteiro"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted">Em milhas, o que ainda sai do banco</p>
              <p className="num text-5xl">{money(quote.milesCashTotal)}</p>
              <p className="mt-1 text-sm text-muted">
                mais {miles(quote.milesUsed)}. Comprando o milheiro a R$ {prefs.milheiro}: {money(quote.milesPriced)}.
              </p>
            </div>
          </div>
          <ol className="mt-6 space-y-3">
            {quote.lines.map((line) => (
              <li key={line.id}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span>{line.label}</span>
                  <span className="num text-lg">{money(line.brl)}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full bg-paper-2">
                  <div
                    className="h-1.5 rounded-full bg-cape"
                    style={{ width: `${Math.max(4, (line.brl / maxLine) * 100)}%`, background: routes[route].accent }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted">{line.hint}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchLive}
              className="rounded-full bg-ink px-4 py-2 text-sm text-paper"
            >
              {liveState === "loading" ? "Montando as buscas…" : "Buscar estes voos agora"}
            </button>
            <Link href={`/rotas/${route}`} className="rounded-full border border-line px-4 py-2 text-sm">
              Ler a rota
            </Link>
          </div>
          {live ? (
            <div className="mt-5 space-y-3 border-t border-line pt-4" aria-live="polite">
              <p className="text-sm text-muted">{liveNote}</p>
              {live.map((item) => (
                <div key={item.label} className="rounded-2xl border border-line p-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-medium">{item.label}</p>
                    <p className="num text-lg">{money(item.estimativa)}</p>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm">
                    <a className="underline underline-offset-4" href={item.google} target="_blank" rel="noreferrer">
                      Google Flights
                    </a>
                    <a className="underline underline-offset-4" href={item.skyscanner} target="_blank" rel="noreferrer">
                      Skyscanner
                    </a>
                    <a className="underline underline-offset-4" href={item.kayak} target="_blank" rel="noreferrer">
                      Kayak
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="desk rounded-3xl p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-[#d9c7ae]">
            Nota da mesa {active.score.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </p>
          <div className="mt-4 space-y-5">
            {notes.map((note) => (
              <article key={note.id}>
                <h3 className="serif text-2xl">
                  <span className="mr-2 text-sm text-[#d9c7ae]">{note.kicker}</span>
                  {note.title}
                </h3>
                {note.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mt-2 text-sm leading-6 text-[#f6f0e6]/90">
                    {paragraph}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </motion.div>

      <p className="mt-8 text-sm text-muted">
        As três rotas na divisão recomendada de noites, com o mesmo hotel e a mesma comida. O total de cima segue os controles.
      </p>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {ranking.map((item, index) => (
          <button
            key={item.route}
            type="button"
            onClick={() => chooseRoute(item.route)}
            className={`sheet p-4 text-left ${item.route === route ? "ring-2 ring-ink" : ""}`}
          >
            <p className="text-xs uppercase tracking-[0.16em] text-muted">
              {index === 0 ? "Melhor nota agora" : `Nota ${item.score.toLocaleString("pt-BR", { maximumFractionDigits: 1, minimumFractionDigits: 1 })}`}
            </p>
            <h3 className="serif mt-1 text-2xl">{routes[item.route].name}</h3>
            <p className="mt-1 text-sm text-muted">
              {item.quote.holiday.name} · {rangeLabel(item.quote.depart, item.quote.ret)} · divisão recomendada
            </p>
            <p className="num mt-3 text-3xl">{money(item.quote.cashTotal)}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="sheet p-5">
          <h3 className="serif text-3xl">Como os dias se dividem</h3>
          <p className="mt-2 text-sm text-muted">
            Saída {rangeLabel(quote.depart, quote.ret)}. A primeira noite de hotel conta no dia seguinte
            ao embarque. O que sobra no fim é o voo de volta.
          </p>
          <ol className="mt-5 space-y-5">
            {blocks.map((block) => (
              <li key={block.place}>
                <p className="text-xs uppercase tracking-[0.16em] text-muted">{block.when}</p>
                <h4 className="serif text-2xl">{block.place}</h4>
                <ul className="mt-2 space-y-1 text-sm leading-6">
                  {block.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
        <div className="sheet p-5">
          <h3 className="serif text-3xl">Antes de comprar</h3>
          <ul className="mt-4 space-y-3">
            {quote.warnings.map((warning) => (
              <li key={warning.text} className="border-t border-line pt-3 text-sm leading-6">
                <span
                  className={`mr-2 inline-block rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.14em] ${warning.level === "evite" ? "bg-cape text-white" : warning.level === "atencao" ? "bg-[#e4c56a]" : "bg-[#d7e4d4]"}`}
                >
                  {warning.level === "atencao" ? "atenção" : warning.level}
                </span>
                {warning.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function toSearch(leg: SearchLeg, people: number): LiveSearch {
  return {
    label: leg.label,
    estimativa: leg.estimateBrl,
    google: googleFlights(leg, people),
    skyscanner: skyscanner(leg, people),
    kayak: kayak(leg, people),
  };
}

function Choice({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-muted">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {options.map(([id, text]) => (
          <button
            key={id}
            type="button"
            aria-pressed={value === id}
            onClick={() => onChange(id)}
            className={`rounded-full px-3 py-1.5 text-sm ${value === id ? "bg-ink text-paper" : "bg-paper-2 text-ink"}`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-paper-2 px-3 py-2">
      <span className="text-sm">{label}</span>
      <span className="flex items-center gap-2">
        <button type="button" className="h-8 w-8 rounded-full bg-sheet" onClick={() => onChange(Math.max(min, value - 1))} aria-label={`Menos ${label}`}>
          –
        </button>
        <span className="num w-6 text-center text-xl">{value}</span>
        <button type="button" className="h-8 w-8 rounded-full bg-sheet" onClick={() => onChange(Math.min(max, value + 1))} aria-label={`Mais ${label}`}>
          +
        </button>
      </span>
    </div>
  );
}

function Toggle({ pressed, onClick, label }: { pressed: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm ${pressed ? "bg-ink text-paper" : "bg-paper-2"}`}
    >
      {label}
    </button>
  );
}

function NumberField({
  label,
  value,
  step,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm">
      <span className="text-muted">{label}</span>
      <input
        className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2"
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
      />
    </label>
  );
}
