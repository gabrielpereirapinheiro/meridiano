import { holidays, type FoodTier, type HotelTier, type RouteId } from "@/data/catalog";
import { defaultPrefs, nightsFor, resolveQuote, type Prefs } from "@/lib/engine";
import { googleFlights, kayak, skyscanner } from "@/lib/links";
import { NextResponse } from "next/server";

const routes = new Set<RouteId>(["cabo", "cabo-atenas", "atenas-oslo"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rota = url.searchParams.get("rota") ?? "cabo";
  if (!routes.has(rota as RouteId)) {
    return NextResponse.json({ erro: "Rota desconhecida." }, { status: 400 });
  }
  const route = rota as RouteId;
  const feriado = url.searchParams.get("feriado");
  const holiday = holidays.find((item) => item.id === feriado) ?? null;
  const qual = url.searchParams.get("qual") === "1" ? 1 : 0;
  const prefs = prefsFrom(url);
  const scored = resolveQuote(route, prefs, holiday ? { holidayId: holiday.id, which: qual } : null);
  const quote = scored.quote;
  const buscas = quote.legs.map((leg) => ({
    label: leg.label,
    estimativa: leg.estimateBrl,
    milhas: leg.milesEach,
    google: googleFlights(leg, prefs.people),
    skyscanner: skyscanner(leg, prefs.people),
    kayak: kayak(leg, prefs.people),
  }));

  const aoVivo = await amadeusFirst(quote.legs[0], prefs.people);

  return NextResponse.json({
    pesquisadoEm: "2026-10-23",
    rota: route,
    feriado: quote.holiday.name,
    saida: quote.depart,
    volta: quote.ret,
    dinheiro: quote.cashTotal,
    milhas: quote.milesUsed,
    desembolsoComMilhas: quote.milesCashTotal,
    nota: scored.score,
    aviso:
      "Estimativa de planejamento com base em médias de outubro de 2026. Os links abrem a busca ao vivo. Sem chave Amadeus, esta API não devolve tarifa de companhia.",
    buscas,
    aoVivo,
  });
}

function prefsFrom(url: URL): Prefs {
  const people = url.searchParams.get("pessoas") === "2" ? 2 : 1;
  const hotel = (url.searchParams.get("hotel") ?? "bom") as HotelTier;
  const food = (url.searchParams.get("comida") ?? "medio") as FoodTier;
  const route = (url.searchParams.get("rota") ?? "cabo") as RouteId;
  const safari = url.searchParams.get("safari") !== "0" && route === "cabo";
  const baseNights = nightsFor(route, safari);
  const num = (key: string, fallback: number) => {
    const raw = url.searchParams.get(key);
    if (raw === null || raw === "") return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  };
  return {
    ...defaultPrefs,
    people,
    hotel: hotel === "medio" || hotel === "folgado" ? hotel : "bom",
    food: food === "simples" || food === "confortavel" ? food : "medio",
    safari,
    lodge: url.searchParams.get("lodge") === "1",
    insurance: url.searchParams.get("seguro") !== "0",
    milesAfrica: num("milhasAfrica", defaultPrefs.milesAfrica),
    milesEurope: num("milhasEuropa", defaultPrefs.milesEurope),
    milheiro: num("milheiro", defaultPrefs.milheiro),
    taxPerLeg: num("taxas", defaultPrefs.taxPerLeg),
    bridgeBrl: num("ponte", defaultPrefs.bridgeBrl),
    nights: {
      cape: num("cape", baseNights.cape),
      kruger: num("kruger", baseNights.kruger),
      athens: num("athens", baseNights.athens),
      oslo: num("oslo", baseNights.oslo),
    },
  };
}

async function amadeusFirst(
  leg: { from: string; to: string; depart: string; ret?: string } | undefined,
  people: number,
) {
  const id = process.env.AMADEUS_CLIENT_ID;
  const secret = process.env.AMADEUS_CLIENT_SECRET;
  if (!id || !secret || !leg) return null;
  const host = process.env.AMADEUS_HOST ?? "https://test.api.amadeus.com";
  try {
    const tokenResponse = await fetch(`${host}/v1/security/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: id,
        client_secret: secret,
      }),
    });
    if (!tokenResponse.ok) return { erro: "Amadeus recusou a autenticação." };
    const token = (await tokenResponse.json()) as { access_token?: string };
    if (!token.access_token) return { erro: "Amadeus não devolveu token." };
    const params = new URLSearchParams({
      originLocationCode: leg.from,
      destinationLocationCode: leg.to,
      departureDate: leg.depart,
      adults: String(people),
      currencyCode: "BRL",
      max: "5",
    });
    if (leg.ret) params.set("returnDate", leg.ret);
    const offers = await fetch(`${host}/v2/shopping/flight-offers?${params}`, {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!offers.ok) return { erro: "Amadeus não devolveu ofertas para este trecho." };
    const body = (await offers.json()) as {
      data?: { price?: { grandTotal?: string; currency?: string }; itineraries?: { duration?: string }[] }[];
    };
    return (body.data ?? []).slice(0, 5).map((offer) => ({
      total: offer.price?.grandTotal,
      moeda: offer.price?.currency,
      duracao: offer.itineraries?.[0]?.duration,
    }));
  } catch {
    return { erro: "Falha ao consultar o Amadeus." };
  }
}
