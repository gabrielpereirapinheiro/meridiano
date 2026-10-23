import {
  athensOsloBaseEur,
  athensOsloFactor,
  capeAthensBaseUsd,
  capeAthensFactor,
  cityMeta,
  climate,
  climateScore,
  defaultMiles,
  flightRtBrl,
  foodMidLocal,
  foodTierFactor,
  fx,
  holidays,
  hotelMedianUsd,
  hotelTierFactor,
  internalKrugerBrl,
  krugerChaletZar,
  krugerLodgeUsd,
  months,
  routeOrder,
  routes,
  type CityId,
  type FoodTier,
  type Holiday,
  type HotelTier,
  type RouteId,
} from "@/data/catalog";
import { addDays, daysBetween, dow, monthIndex, rangeLabel, shortDate } from "@/lib/format";
import { type SearchLeg } from "@/lib/links";

export type Nights = Record<CityId, number>;

export type Prefs = {
  people: 1 | 2;
  hotel: HotelTier;
  food: FoodTier;
  safari: boolean;
  lodge: boolean;
  insurance: boolean;
  ritmo: "essencial" | "devagar";
  milesAfrica: number;
  milesEurope: number;
  taxPerLeg: number;
  milheiro: number;
  bridgeBrl: number;
  nights: Nights;
};

export type Pick = { holidayId: string; which: 0 | 1 } | null;

export const defaultNights: Nights = { cape: 8, kruger: 4, athens: 6, oslo: 5 };

export const defaultPrefs: Prefs = {
  people: 1,
  hotel: "bom",
  food: "medio",
  safari: true,
  lodge: false,
  insurance: true,
  ritmo: "essencial",
  milesAfrica: defaultMiles.africaOneWay,
  milesEurope: defaultMiles.europeOneWay,
  taxPerLeg: defaultMiles.taxPerLeg,
  milheiro: defaultMiles.milheiro,
  bridgeBrl: defaultMiles.bridgeBrl,
  nights: defaultNights,
};

export function nightsFor(route: RouteId, safari: boolean): Nights {
  if (route === "cabo") {
    return safari
      ? { cape: 8, kruger: 4, athens: 0, oslo: 0 }
      : { cape: 12, kruger: 0, athens: 0, oslo: 0 };
  }
  if (route === "cabo-atenas") {
    return { cape: 6, kruger: 0, athens: 5, oslo: 0 };
  }
  return { cape: 0, kruger: 0, athens: 6, oslo: 5 };
}

export type TripWindow = { depart: string; ret: string };

export function saturdayWindows(holiday: string): [TripWindow, TripWindow] {
  let saturday = holiday;
  while (dow(saturday) !== 6) saturday = addDays(saturday, -1);
  const late = { depart: saturday, ret: addDays(saturday, 14) };
  const earlyDepart = addDays(saturday, -7);
  return [{ depart: earlyDepart, ret: addDays(earlyDepart, 14) }, late];
}

type Stay = { city: CityId; nights: number; start: string };

export type Line = { id: string; label: string; brl: number; hint: string };

export type Quote = {
  route: RouteId;
  holiday: Holiday;
  which: 0 | 1;
  depart: string;
  ret: string;
  stays: Stay[];
  lines: Line[];
  cashTotal: number;
  milesLines: Line[];
  milesCashTotal: number;
  milesUsed: number;
  milesPriced: number;
  legs: SearchLeg[];
  climate: number;
  weakest: number;
  krugerBlock: number;
  krugerNights: number;
  harsh: boolean;
  logistics: number;
  warnings: { level: "ok" | "atencao" | "evite"; text: string }[];
};

function round(value: number) {
  return Math.round(value);
}

function staysOf(route: RouteId, nights: Nights, depart: string): Stay[] {
  const order: CityId[] =
    route === "cabo"
      ? ["cape", "kruger"]
      : route === "cabo-atenas"
        ? ["cape", "athens"]
        : ["athens", "oslo"];
  let cursor = addDays(depart, 1);
  const stays: Stay[] = [];
  for (const city of order) {
    const count = Math.max(0, nights[city] || 0);
    if (!count) continue;
    stays.push({ city, nights: count, start: cursor });
    cursor = addDays(cursor, count);
  }
  return stays;
}

function hotelNight(city: CityId, month: number, prefs: Prefs) {
  const factor = hotelTierFactor[prefs.hotel];
  if (city === "kruger") {
    if (prefs.lodge) {
      const solo = prefs.people === 1 ? 1.5 : 1;
      return krugerLodgeUsd * fx.usdBrl * solo * prefs.people;
    }
    return krugerChaletZar * fx.zarBrl * factor;
  }
  return hotelMedianUsd[city][month - 1] * fx.usdBrl * factor;
}

function foodDay(city: CityId, prefs: Prefs) {
  const local =
    city === "cape" || city === "kruger"
      ? foodMidLocal[city] * fx.zarBrl
      : city === "athens"
        ? foodMidLocal.athens * fx.eurBrl
        : foodMidLocal.oslo * fx.nokBrl;
  const lodgeDiscount = city === "kruger" && prefs.lodge ? 0.35 : 1;
  return local * foodTierFactor[prefs.food] * lodgeDiscount * prefs.people;
}

function monthClimate(city: CityId, month: number) {
  return climateScore[city][month - 1];
}

function applicableNights(route: RouteId, prefs: Prefs): Nights {
  const nights = { ...prefs.nights };
  if (route !== "cabo" || !prefs.safari) nights.kruger = 0;
  if (route === "cabo") {
    nights.athens = 0;
    nights.oslo = 0;
  }
  if (route === "cabo-atenas") nights.oslo = 0;
  if (route === "atenas-oslo") nights.cape = 0;
  return nights;
}

function buildQuote(
  route: RouteId,
  holiday: Holiday,
  which: 0 | 1,
  prefs: Prefs,
): Quote {
  const window = saturdayWindows(holiday.date)[which];
  const stays = staysOf(route, applicableNights(route, prefs), window.depart);
  const lines: Line[] = [];
  const people = prefs.people;

  const departMonth = monthIndex(window.depart);
  const returnMonth = monthIndex(window.ret);
  const ow = 0.62;

  const legs: SearchLeg[] = [];

  if (route === "cabo") {
    const rt = flightRtBrl.cpt[departMonth - 1] * people;
    lines.push({
      id: "voo",
      label: "Voos Brasília ↔ Cidade do Cabo",
      brl: round(rt),
      hint: `Curva de ${months[departMonth - 1]}. Piso visto: R$ 4.884 numa semana de agosto, 2 escalas. Ida e volta de planejamento não usa o piso.`,
    });
    legs.push({
      from: "BSB",
      to: "CPT",
      depart: window.depart,
      ret: window.ret,
      label: "Brasília ↔ Cidade do Cabo",
      estimateBrl: round(rt),
      milesEach: prefs.milesAfrica * 2,
    });
    const kruger = stays.find((stay) => stay.city === "kruger");
    if (kruger) {
      const internal = internalKrugerBrl * people;
      lines.push({
        id: "interno",
        label: "Voo interno Cabo → Kruger / Joanesburgo",
        brl: internal,
        hint: "Estimativa Airlink, Safair ou LATAM via Joanesburgo. A volta internacional pode sair de JNB.",
      });
      legs.push({
        from: "CPT",
        to: "JNB",
        depart: kruger.start,
        label: "Cidade do Cabo → Joanesburgo",
        estimateBrl: internal,
        milesEach: 0,
      });
    }
  } else if (route === "cabo-atenas") {
    const out = flightRtBrl.cpt[departMonth - 1] * ow * people;
    const connector =
      capeAthensBaseUsd * capeAthensFactor[monthIndex(stays.find((s) => s.city === "athens")?.start ?? window.ret) - 1] *
      fx.usdBrl *
      people;
    const back = flightRtBrl.ath[returnMonth - 1] * ow * people;
    const athensStart = stays.find((stay) => stay.city === "athens")?.start ?? addDays(window.depart, 7);
    lines.push({
      id: "voo-1",
      label: "Brasília → Cidade do Cabo",
      brl: round(out),
      hint: "Só ida estimada em 62% da ida e volta do mês da saída. Ida avulsa costuma passar da metade.",
    });
    lines.push({
      id: "voo-2",
      label: "Cidade do Cabo → Atenas",
      brl: round(connector),
      hint: "Uma escala típica em Doha, Adis Abeba ou Istambul. Base de US$ 620 no ombro, ajustada ao mês.",
    });
    lines.push({
      id: "voo-3",
      label: "Atenas → Brasília",
      brl: round(back),
      hint: "Só ida estimada em 62% da ida e volta Brasília–Atenas no mês da volta.",
    });
    legs.push(
      {
        from: "BSB",
        to: "CPT",
        depart: window.depart,
        label: "Brasília → Cidade do Cabo",
        estimateBrl: round(out),
        milesEach: prefs.milesAfrica,
      },
      {
        from: "CPT",
        to: "ATH",
        depart: athensStart,
        label: "Cidade do Cabo → Atenas",
        estimateBrl: round(connector),
        milesEach: 0,
      },
      {
        from: "ATH",
        to: "BSB",
        depart: window.ret,
        label: "Atenas → Brasília",
        estimateBrl: round(back),
        milesEach: prefs.milesEurope,
      },
    );
  } else {
    const out = flightRtBrl.ath[departMonth - 1] * ow * people;
    const osloStart = stays.find((stay) => stay.city === "oslo")?.start ?? addDays(window.depart, 7);
    const hop =
      athensOsloBaseEur *
      athensOsloFactor[monthIndex(osloStart) - 1] *
      fx.eurBrl *
      people;
    const back = flightRtBrl.osl[returnMonth - 1] * ow * people;
    lines.push({
      id: "voo-1",
      label: "Brasília → Atenas",
      brl: round(out),
      hint: "Curva ancorada na média Kayak de R$ 6.422 a ida e volta, com alta no verão europeu.",
    });
    lines.push({
      id: "voo-2",
      label: "Atenas → Oslo",
      brl: round(hop),
      hint: "SAS, Norwegian ou Aegean. Perto de quatro horas. Milhas aqui quase nunca compensam.",
    });
    lines.push({
      id: "voo-3",
      label: "Oslo → Brasília",
      brl: round(back),
      hint: "A TAP via Lisboa foi o padrão mais barato visto no Kayak a partir de Brasília.",
    });
    legs.push(
      {
        from: "BSB",
        to: "ATH",
        depart: window.depart,
        label: "Brasília → Atenas",
        estimateBrl: round(out),
        milesEach: prefs.milesEurope,
      },
      {
        from: "ATH",
        to: "OSL",
        depart: osloStart,
        label: "Atenas → Oslo",
        estimateBrl: round(hop),
        milesEach: 0,
      },
      {
        from: "OSL",
        to: "BSB",
        depart: window.ret,
        label: "Oslo → Brasília",
        estimateBrl: round(back),
        milesEach: prefs.milesEurope,
      },
    );
  }

  let climateSum = 0;
  let climateNights = 0;
  let weakest = 10;
  let krugerBlock = 10;
  let harsh = false;
  for (const stay of stays) {
    let hotel = 0;
    let food = 0;
    let stayClimate = 0;
    let cursor = stay.start;
    for (let i = 0; i < stay.nights; i += 1) {
      const month = monthIndex(cursor);
      hotel += hotelNight(stay.city, month, prefs);
      food += foodDay(stay.city, prefs);
      const score = monthClimate(stay.city, month);
      climateSum += score;
      stayClimate += score;
      climateNights += 1;
      if (score < 4.5) harsh = true;
      cursor = addDays(cursor, 1);
    }
    const stayAverage = stay.nights ? stayClimate / stay.nights : 10;
    weakest = Math.min(weakest, stayAverage);
    if (stay.city === "kruger") krugerBlock = stayAverage;
    const roomNote =
      stay.city === "kruger"
        ? prefs.lodge
          ? "Lodge privado médio, por pessoa, com suplemento de solteiro se viajar só."
          : "Chalé de parque para o quarto, não por pessoa. ZAR 3.200 é faixa de rest camp, não tarifa de lodge."
        : `Mediana mensal do quarto duplo, com ${prefs.hotel === "medio" ? "o valor cru da cidade" : prefs.hotel === "bom" ? "+15% de endereço bom" : "+45% de hotel mais folgado"}.`;
    lines.push({
      id: `hotel-${stay.city}`,
      label: `Hotel · ${cityMeta[stay.city].name}`,
      brl: round(hotel),
      hint: `${stay.nights} noites em ${cityMeta[stay.city].stay}. ${roomNote}`,
    });
    lines.push({
      id: `food-${stay.city}`,
      label: `Comida · ${cityMeta[stay.city].name}`,
      brl: round(food),
      hint:
        stay.city === "oslo"
          ? "Prato de restaurante em Oslo fica entre NOK 220 e 380. A bebida, à parte, pesa."
          : "Café, almoço e um jantar, sem menu de degustação.",
    });
  }

  const activity = activityCost(stays, people);
  if (activity.brl > 0) lines.push(activity.line);

  const transport = transportCost(stays, people);
  if (transport > 0) {
    lines.push({
      id: "transporte",
      label: "Transporte local",
      brl: round(transport),
      hint: "Uber do grupo no Cabo. Metrô por pessoa em Atenas. Passe por pessoa em Oslo. O Kruger inclui um traslado simples.",
    });
  }

  if (prefs.insurance) {
    const schengen = stays.some((stay) => stay.city === "athens" || stay.city === "oslo");
    const each = schengen ? 190 : 140;
    lines.push({
      id: "seguro",
      label: "Seguro-viagem",
      brl: each * people,
      hint: schengen
        ? "Estimativa para 14 dias com cobertura de € 30 mil, o piso que o Schengen pode pedir."
        : "Estimativa para 14 dias. A África do Sul não exige, e ainda assim vale ter.",
    });
  }

  lines.push({
    id: "chip",
    label: "Chip e miúdos",
    brl: 80 * people,
    hint: "eSIM de duas semanas e uma margem curta para água, lavanderia e gorjeta de passeio.",
  });

  const cashTotal = lines.reduce((sum, line) => sum + line.brl, 0);
  const flightCash = lines
    .filter((line) => line.id.startsWith("voo") || line.id === "interno")
    .reduce((sum, line) => sum + line.brl, 0);
  const ground = cashTotal - flightCash;
  const awardLegs = legs.filter((leg) => leg.milesEach > 0);
  const shortHopCash = legs
    .filter((leg) => leg.milesEach === 0)
    .reduce((sum, leg) => sum + leg.estimateBrl, 0);
  const milesTotal = awardLegs.reduce((sum, leg) => sum + leg.milesEach * people, 0);
  const segments = awardLegs.reduce((sum, leg) => sum + (leg.ret ? 2 : 1), 0) * people;
  const taxes = segments * prefs.taxPerLeg;
  const bridge = awardLegs.length ? prefs.bridgeBrl * people : 0;
  const milesCashTotal = round(ground + shortHopCash + taxes + bridge);
  const milesPriced = round(milesCashTotal + (milesTotal / 1000) * prefs.milheiro);

  const hotelNights = stays.reduce((sum, stay) => sum + stay.nights, 0);
  const roomNights = daysBetween(addDays(window.depart, 1), window.ret);
  const warnings = warningsFor(route, stays, harsh, hotelNights, roomNights, prefs, holiday);

  const logistics =
    route === "cabo" ? (stays.some((stay) => stay.city === "kruger") ? 6.6 : 8) : routes[route].logistics;

  return {
    route,
    holiday,
    which,
    depart: window.depart,
    ret: window.ret,
    stays,
    lines,
    cashTotal,
    milesLines: [
      {
        id: "taxas",
        label: "Taxas das milhas e trechos pagos",
        brl: round(taxes + shortHopCash),
        hint: "Taxas por trecho longo, mais o voo curto que continua em dinheiro.",
      },
      {
        id: "ponte",
        label: "Ponte Brasília–São Paulo, se a emissão for de GRU",
        brl: round(bridge),
        hint: "Zere este campo se achar prêmio saindo de Brasília.",
      },
      ...lines.filter((line) => !line.id.startsWith("voo") && line.id !== "interno"),
    ],
    milesCashTotal,
    milesUsed: milesTotal,
    milesPriced,
    legs,
    climate: climateNights ? climateSum / climateNights : 0,
    weakest: climateNights ? weakest : 0,
    krugerBlock,
    krugerNights: stays.find((stay) => stay.city === "kruger")?.nights ?? 0,
    harsh,
    logistics,
    warnings,
  };
}

function activityCost(stays: Stay[], people: number): { brl: number; line: Line } {
  let brl = 0;
  const bits: string[] = [];
  if (stays.some((stay) => stay.city === "cape")) {
    const value = round(2800 * fx.zarBrl * people);
    brl += value;
    bits.push("Cabo: teleférico, Cape Point, vinícola");
  }
  const kruger = stays.find((stay) => stay.city === "kruger");
  if (kruger) {
    const value = round((500 * kruger.nights + 900) * fx.zarBrl * people);
    brl += value;
    bits.push("Kruger: taxa de conservação e um game drive");
  }
  if (stays.some((stay) => stay.city === "athens")) {
    brl += round(110 * fx.eurBrl * people);
    bits.push("Atenas: Acrópole, museu e balsa de Hidra");
  }
  if (stays.some((stay) => stay.city === "oslo")) {
    brl += round(2600 * fx.nokBrl * people);
    bits.push("Noruega: trem do fiorde e museus");
  }
  return {
    brl,
    line: {
      id: "passeios",
      label: "Passeios essenciais",
      brl,
      hint: bits.join(" · "),
    },
  };
}

function transportCost(stays: Stay[], people: number) {
  let total = 0;
  for (const stay of stays) {
    if (stay.city === "cape") total += 95 * stay.nights;
    if (stay.city === "kruger") total += 150 * stay.nights;
    if (stay.city === "athens") total += 45 * stay.nights * people;
    if (stay.city === "oslo") total += 75 * stay.nights * people;
  }
  return total;
}

function warningsFor(
  route: RouteId,
  stays: Stay[],
  harsh: boolean,
  hotelNights: number,
  roomNights: number,
  prefs: Prefs,
  holiday: Holiday,
): Quote["warnings"] {
  const notes: Quote["warnings"] = [];
  if (harsh) {
    notes.push({
      level: "evite",
      text: "Algum pedaço desta janela fica abaixo de 4,5 no clima. Dá para ir, e a viagem muda de natureza: frio, chuva ou dia curto.",
    });
  }
  if (hotelNights > roomNights) {
    notes.push({
      level: "atencao",
      text: `São ${hotelNights} noites de hotel numa janela que comporta cerca de ${roomNights} fora do avião de ida. Reduza as noites ou aceite voltar depois.`,
    });
  }
  if (hotelNights < 9) {
    notes.push({
      level: "atencao",
      text: "Menos de nove noites de hotel em duas semanas significa que o avião está comendo a viagem.",
    });
  }
  const kruger = stays.find((stay) => stay.city === "kruger");
  if (route === "cabo" && kruger && kruger.nights < 3) {
    notes.push({
      level: "atencao",
      text: "Menos de três noites no Kruger vira traslado com animal no meio. Ou fique quatro, ou deixe o safari para outra viagem.",
    });
  }
  if (route === "cabo" && !kruger) {
    notes.push({
      level: "ok",
      text: "Sem Kruger sobra tempo para Hermanus, a rota do vinho e um dia inteiro parado. Em setembro ainda há chance de baleia.",
    });
  }
  if (route === "cabo-atenas") {
    notes.push({
      level: "atencao",
      text: "Três voos longos em quatorze noites. O dia do Cabo para Atenas e o dia da volta não rendem passeio. Santorini não cabe; Hidra, de barco, cabe.",
    });
  }
  const oslo = stays.find((stay) => stay.city === "oslo");
  if (oslo && oslo.nights < 4) {
    notes.push({
      level: "atencao",
      text: "Com menos de quatro noites na Noruega, o fiorde vira um dia corrido e Bergen fica de fora.",
    });
  }
  if (prefs.ritmo === "devagar" && route !== "cabo") {
    notes.push({
      level: "atencao",
      text: "No ritmo devagar, duas cidades em duas semanas aperta. A rota de um país só é a que sobra espaço para repetir um café.",
    });
  }
  if (holiday.id === "natal" || holiday.id === "reveillon" || holiday.id === "ano-novo") {
    notes.push({
      level: "atencao",
      text: "Fim de ano é alta na Cidade do Cabo, baixa luz em Oslo e cidade fria em Atenas. Só vale se a data for inegociável.",
    });
  }
  if (stays.some((stay) => stay.city === "cape" || stay.city === "kruger")) {
    notes.push({
      level: "ok",
      text: "Leve o certificado de febre amarela. Sem visto para turismo até 90 dias. Passaporte com 30 dias além da saída e duas páginas livres.",
    });
  }
  if (stays.some((stay) => stay.city === "athens" || stay.city === "oslo")) {
    notes.push({
      level: "ok",
      text: "Grécia e Noruega dividem o mesmo relógio Schengen: 90 dias a cada 180. Em 2027, conte com EES na fronteira e, muito provavelmente, ETIAS antes de embarcar.",
    });
  }
  if (kruger) {
    notes.push({
      level: "atencao",
      text: "Kruger é área de malária. Cidade do Cabo não é. A decisão da profilaxia é com um médico, antes da passagem.",
    });
  }
  return notes;
}

export type Scored = {
  quote: Quote;
  score: number;
  costScore: number;
};

function priceScore(total: number, cheapest: number) {
  if (total <= 0) return 0;
  return (cheapest / total) * 10;
}

function scoreWindow(quote: Quote, costScore: number) {
  const blend = quote.climate * 0.62 + quote.weakest * 0.38;
  const edge = quote.holiday.date === quote.depart || quote.holiday.date === quote.ret ? 0 : 0.15;
  let raw = blend * 0.5 + costScore * 0.27 + quote.logistics * 0.23 + edge;
  if (quote.krugerNights >= 3 && quote.krugerBlock < 7.5) raw -= 0.6;
  if (quote.krugerNights >= 3 && quote.krugerBlock >= 8.5) raw += 0.25;
  return quote.harsh ? raw * 0.72 : raw;
}

export function optionsForRoute(route: RouteId, prefs: Prefs): Scored[] {
  const quotes = holidays.flatMap((holiday) =>
    ([0, 1] as const).map((which) => buildQuote(route, holiday, which, prefs)),
  );
  const cheapest = Math.min(...quotes.map((quote) => quote.cashTotal));
  return quotes
    .map((quote) => {
      const costScore = priceScore(quote.cashTotal, cheapest);
      return { quote, costScore, score: scoreWindow(quote, costScore) };
    })
    .sort((a, b) => b.score - a.score);
}

export function bestForRoute(route: RouteId, prefs: Prefs) {
  return optionsForRoute(route, prefs)[0];
}

export function resolveQuote(route: RouteId, prefs: Prefs, pick: Pick) {
  if (!pick) return bestForRoute(route, prefs);
  const holiday = holidays.find((item) => item.id === pick.holidayId) ?? holidays[0];
  const quotes = ([0, 1] as const).map((which) => buildQuote(route, holiday, which, prefs));
  const all = optionsForRoute(route, prefs);
  const cheapest = Math.min(...all.map((item) => item.quote.cashTotal));
  const quote = quotes[pick.which];
  const costScore = priceScore(quote.cashTotal, cheapest);
  return { quote, costScore, score: scoreWindow(quote, costScore) };
}

export function rankRoutes(prefs: Prefs) {
  const bests = routeOrder.map((route) => {
    const local: Prefs = {
      ...prefs,
      nights: nightsFor(route, prefs.safari),
      lodge: route === "cabo" && prefs.safari ? prefs.lodge : false,
    };
    return { route, ...bestForRoute(route, local) };
  });
  const cheapest = Math.min(...bests.map((item) => item.quote.cashTotal));
  return bests
    .map((item) => {
      const costScore = priceScore(item.quote.cashTotal, cheapest);
      const score = scoreWindow(item.quote, costScore);
      return { ...item, score, costScore };
    })
    .sort((a, b) => b.score - a.score);
}

export type Block = { place: string; when: string; points: string[] };

export function blocksFor(quote: Quote, ritmo: Prefs["ritmo"]): Block[] {
  return quote.stays.map((stay) => {
    const end = addDays(stay.start, stay.nights);
    const when = `${shortDate(stay.start)} – ${shortDate(end)}`;
    return { place: cityMeta[stay.city].name, when, points: pointsFor(stay.city, stay.nights, ritmo) };
  });
}

function pointsFor(city: CityId, nights: number, ritmo: Prefs["ritmo"]): string[] {
  if (city === "cape") {
    const base = [
      "Primeiro dia só para chegar: Waterfront, um mercado e cama cedo. O fuso come a ambição.",
      "Table Mountain cedo, antes do vento sueste fechar o teleférico, e Bo-Kaap à tarde.",
      "Cape Point e os pinguins de Boulders no mesmo dia, de carro ou tour.",
      "Um dia inteiro em Stellenbosch ou Franschhoek. Escolha duas vinícolas, não cinco.",
    ];
    if (nights >= 6) {
      base.push(
        ritmo === "devagar"
          ? "No ritmo devagar, pule a segunda vinícola e deixe uma tarde em Sea Point sem horário."
          : "Sea Point ou Kalk Bay sem programa. Robben Island só se o horário encaixar de manhã.",
      );
    }
    if (nights >= 10) {
      base.push("Com a segunda semana livre, desça para Hermanus. No começo de setembro a baleia ainda aparece.");
    }
    if (nights <= 5) base.push("Com tão poucas noites, pule a ilha e a segunda região de vinho.");
    return base;
  }
  if (city === "kruger") {
    return [
      "Entre à tarde e não conte esse dia como safari.",
      "Dois jogos de manhã e um de fim de tarde. No meio do dia o bicho some e o calor, no verão, castiga.",
      nights >= 4
        ? "Quatro noites dão três manhãs úteis. É o mínimo que parece viagem, não escala."
        : "Abaixo de três noites, o parque vira corredor.",
      "Saia para Joanesburgo no dia anterior ao voo internacional. Não conecte game drive com embarque.",
    ];
  }
  if (city === "athens") {
    const base = [
      "Acrópole na abertura e o museu na parte quente do dia.",
      "Plaka e Monastiraki a pé. O pôr do sol no Areópago ou em Lykavittos.",
      nights >= 4
        ? "Hidra de barco, ida cedo e volta no fim da tarde. Santorini consome dois dias e não entra neste recorte."
        : "Sem um dia folgado, fique em Atenas e deixe a ilha.",
    ];
    if (nights >= 5) base.push("Um dia sem ruína: Koukaki, uma taverna com reserva, e o cabo Sounion se ainda houver perna.");
    return base;
  }
  const base = [
    "Oslo em dois dias: Ópera, Aker Brygge, o parque Vigeland e um museu, não três.",
    nights >= 4
      ? "Durma em Bergen ou faça a linha Flåm. O fiorde é o motivo da Noruega estar nesta rota."
      : "Sem quarta noite, o fiorde só cabe como bate-volta cansativo.",
    "Bergen molha em junho. Capa de chuva, sapato fechado, e um museu de reserva.",
  ];
  if (nights >= 5) base.push("A quinta noite volta para Oslo, perto do aeroporto, sem programação.");
  return base;
}

export type Brief = { id: string; kicker: string; title: string; paragraphs: string[] };

export function briefs(route: RouteId, prefs: Prefs, pick: Pick): Brief[] {
  const active = resolveQuote(route, prefs, pick);
  const ranking = rankRoutes(prefs);
  const quote = active.quote;
  const climateLine = quote.stays
    .map((stay) => {
      const month = monthIndex(addDays(stay.start, Math.floor((stay.nights - 1) / 2)));
      const pack = climate[stay.city];
      const high = pack.high[month - 1];
      const low = pack.low[month - 1];
      return `${cityMeta[stay.city].name} em ${months[month - 1]} fica em torno de ${low}–${high}°C`;
    })
    .join("; ");

  const winner = ranking[0];
  const runner = ranking[1];
  const others = ranking.filter((item) => item.route !== route);
  const close = runner && winner.score - runner.score < 0.25;

  return [
    {
      id: "clima",
      kicker: "01",
      title: "Clima",
      paragraphs: [
        `${climateLine}. A nota de clima desta janela é ${quote.climate.toFixed(1)} de 10.`,
        quote.harsh
          ? "Abaixo de 4,5 a mesa trata a data como outra viagem: cidade no inverno, parque na chuva, ou fiorde no escuro."
          : "Esta janela passa no clima que você descreveu: caminhar, comer fora e ver paisagem sem transformar a mala num equipamento de expedição.",
        osloLight(quote),
      ].filter(Boolean) as string[],
    },
    {
      id: "rota",
      kicker: "02",
      title: "Rota",
      paragraphs: routeCopy(quote, prefs.ritmo),
    },
    {
      id: "caixa",
      kicker: "03",
      title: "Caixa",
      paragraphs: [
        `Em dinheiro, esta janela fecha em ${brl(quote.cashTotal)} para ${prefs.people === 1 ? "uma pessoa, pagando o quarto inteiro" : "duas pessoas no mesmo quarto"}.`,
        `Nas milhas, os trechos longos usam ${quote.milesUsed.toLocaleString("pt-BR")} milhas e ainda pedem ${brl(quote.milesCashTotal)} de taxas, ponte, voo curto, hotel e comida. Se o milheiro valer R$ ${prefs.milheiro}, o pacote equivalente sai ${brl(quote.milesPriced)}.`,
        quote.milesPriced + 400 < quote.cashTotal
          ? "Pelo milheiro que está na mesa, emitir o longo curso em milhas fica mais barato do que pagar a passagem."
          : "Pelo milheiro que está na mesa, comprar a passagem em dinheiro fica mais racional do que queimar milha. Ajuste o milheiro se as suas já estão na conta e o custo de oportunidade for outro.",
      ],
    },
    {
      id: "malha",
      kicker: "04",
      title: "Malha",
      paragraphs: malhaCopy(quote),
    },
    {
      id: "mesa",
      kicker: "05",
      title: "Mesa",
      paragraphs: [
        close && (winner.route === route || runner.route === route)
          ? `Empate técnico entre ${routes[winner.route].name} (${winner.score.toFixed(1)}) e ${routes[runner.route].name} (${runner.score.toFixed(1)}). A casa decimal não decide: uma é mais barata, a outra cansa menos. Esta aqui é ${routes[route].name}, ${rangeLabel(quote.depart, quote.ret)}, em torno de ${quote.holiday.name}.`
          : winner.route === route
            ? `Entre as três rotas, na melhor janela de cada uma e com estes critérios, a mesa fica com ${routes[route].name}: ${rangeLabel(quote.depart, quote.ret)}, em torno de ${quote.holiday.name}. Nota ${active.score.toFixed(1)}.`
            : `Esta rota está boa de estudar, e a melhor nota geral, com os mesmos critérios, ainda é ${routes[winner.route].name} em ${rangeLabel(winner.quote.depart, winner.quote.ret)} (${winner.quote.holiday.name}, ${winner.score.toFixed(1)}).`,
        ...others.map(
          (item) =>
            `${routes[item.route].name} na janela dela (${item.quote.holiday.name}, ${rangeLabel(item.quote.depart, item.quote.ret)}) fica em ${brl(item.quote.cashTotal)} na divisão recomendada de noites, nota ${item.score.toFixed(1)}.`,
        ),
        "A nota mistura o clima (50%, puxado para baixo pelo trecho mais fraco), o preço contra a opção mais barata do grupo (27%) e o desgaste dos voos (23%). Safari fora da seca perde ponto. Frio demais também. Não é um ranking de beleza.",
      ],
    },
  ];
}

function osloLight(quote: Quote) {
  const oslo = quote.stays.find((stay) => stay.city === "oslo");
  if (!oslo) return "";
  const month = monthIndex(addDays(oslo.start, Math.floor((oslo.nights - 1) / 2)));
  const light = climate.oslo.light[month - 1];
  const athens = quote.stays.find((stay) => stay.city === "athens");
  const sea = athens
    ? ` O mar em Atenas anda perto de ${climate.athens.sea[monthIndex(addDays(athens.start, Math.floor((athens.nights - 1) / 2))) - 1]}°C.`
    : "";
  return `Em Oslo, a luz do dia nesse mês fica em torno de ${light} horas.${sea}`;
}

function routeCopy(quote: Quote, ritmo: Prefs["ritmo"]) {
  if (quote.route === "cabo") {
    return [
      "Chega pelo Cabo, não por Joanesburgo, se o safari for no fim. A cidade merece os primeiros dias, com o corpo ainda cruzando fuso.",
      quote.stays.some((stay) => stay.city === "kruger")
        ? "O Kruger entra no meio para o fim: quatro noites, voo interno, e uma noite de folga em Joanesburgo antes do internacional se o horário apertar."
        : "Sem o parque, a segunda semana pode descer para Hermanus e a costa, ou simplesmente repetir a cidade com menos pressa.",
      ritmo === "devagar"
        ? "Devagar, no Cabo, é a escolha certa: um bairro por dia e uma vinícola só."
        : "No ritmo essencial ainda cabe montanha, ponta do cabo, vinho e, com o safari ligado, o parque.",
    ];
  }
  if (quote.route === "cabo-atenas") {
    return [
      "A ordem é Cabo primeiro e Atenas depois. Você chega no hemisfério sul ainda no clima de primavera ou outono e termina no Mediterrâneo, de onde a volta para Brasília tem mais voo.",
      "Corte o Kruger desta versão. Quem tenta parque, cidade e Acrópole em quatorze noites passa a viagem em aeroporto.",
      "Hidra é a ilha que cabe: um dia, sem pernoitar. Mykonos e Santorini pedem outra semana.",
    ];
  }
  return [
    "Atenas primeiro, Oslo depois. O voo de quatro horas é de manhã, e a volta longa sai de Oslo via Lisboa com mais facilidade do que o caminho inverso.",
    quote.stays.find((stay) => stay.city === "oslo" && stay.nights >= 4)
      ? "Duas noites em Oslo, duas em Bergen ou Flåm, e a última de novo em Oslo. É o recorte que mostra cidade e fiorde sem um terceiro destino."
      : "A Noruega está curta demais para o fiorde. Devolva uma noite de Atenas para Oslo.",
    "Não suba até as Lofoten nesta quinzena. Tromsø e aurora são outra viagem, no inverno, e não combinam com a Grécia no mesmo bilhete.",
  ];
}

function malhaCopy(quote: Quote) {
  if (quote.route === "cabo") {
    return [
      "Não existe voo direto de Brasília. O caminho curto costuma ser Brasília–Guarulhos e depois Joanesburgo ou Cidade do Cabo, com LATAM até o Brasil e Airlink ou South African no trecho africano.",
      "Em dinheiro, a Qatar via Doha apareceu com muita frequência como a tarifa mais baixa no Trabber. Ethiopian via Adis Abeba e Turkish via Istambul são as outras malhas que valem abrir. Emirates costuma ir bem no assento e mal no preço.",
      "Em milhas, o número de planejamento é 70.300 Smiles a ida, GRU–CPT, visto entre setembro e outubro de 2026. No ano móvel até 18 out 2026 também apareceu 61.900. A executiva surgiu a 171.600, em poucas datas. A LATAM é dinâmica: compare no dia, não transfira antes.",
    ];
  }
  if (quote.route === "cabo-atenas") {
    return [
      "São três bilhetes mentais: Brasília–Cabo, Cabo–Atenas, Atenas–Brasília. Um multi-cidade único às vezes une os dois longos e deixa o miolo de fora. Por isso a mesa soma as pernas e manda você conferir os dois jeitos.",
      "Cabo–Atenas costuma ter uma escala no Golfo ou na Etiópia. É um dia perdido, não um connection de duas horas.",
      "Milhas compensam nos dois longos e quase nunca no miolo. Se a Smiles só tiver Europa a 110 mil ou mais, pague Atenas em dinheiro e use milha só na perna africana, que é a mais cara em cash no fim do ano.",
    ];
  }
  return [
    "De Brasília, TAP via Lisboa foi a escala mais barata para Oslo no recorte recente do Kayak, e também aparece bem para Atenas. Air France via Paris e a malha Lufthansa/KLM são o plano B quando a TAP sobe.",
    "Atenas–Oslo é voo de manhã na SAS ou na Norwegian. Não gaste milha nele.",
    "Para a Europa, a Smiles já mostrou Paris a 77.700 saindo de Fortaleza e Amsterdã a 106.100 saindo de Guarulhos. O campo do plano nasce em 100.000 por trecho porque Brasília quase nunca é o aeroporto mais barato do prêmio. A ponte BSB–GRU está separada, para você zerar se achar assento direto.",
  ];
}

function brl(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function perPerson(total: number, people: number) {
  return total / people;
}
