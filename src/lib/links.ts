import { yymmdd } from "./format";

export type SearchLeg = {
  from: string;
  to: string;
  depart: string;
  ret?: string;
  label: string;
  estimateBrl: number;
  milesEach: number;
};

export function googleFlights(leg: SearchLeg, people: number) {
  const query = leg.ret
    ? `Voos de ${leg.from} para ${leg.to} em ${leg.depart} volta ${leg.ret} ${people} ${people > 1 ? "adultos" : "adulto"}`
    : `Voo de ${leg.from} para ${leg.to} em ${leg.depart} somente ida ${people} ${people > 1 ? "adultos" : "adulto"}`;
  return `https://www.google.com/travel/flights?hl=pt-BR&curr=BRL&q=${encodeURIComponent(query)}`;
}

export function skyscanner(leg: SearchLeg, people: number) {
  const path = leg.ret
    ? `${leg.from.toLowerCase()}/${leg.to.toLowerCase()}/${yymmdd(leg.depart)}/${yymmdd(leg.ret)}`
    : `${leg.from.toLowerCase()}/${leg.to.toLowerCase()}/${yymmdd(leg.depart)}`;
  const params = new URLSearchParams({
    adultsv2: String(people),
    cabinclass: "economy",
    currency: "BRL",
    locale: "pt-BR",
  });
  return `https://www.skyscanner.com.br/transporte/passagens-aereas/${path}/?${params}`;
}

export function kayak(leg: SearchLeg, people: number) {
  const dates = leg.ret ? `${leg.depart}/${leg.ret}` : leg.depart;
  return `https://www.kayak.com.br/flights/${leg.from}-${leg.to}/${dates}/${people}adults?sort=bestflight_a`;
}
