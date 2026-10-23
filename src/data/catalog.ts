export const researchedOn = "23 de outubro de 2026";

export const fx = {
  asOf: "2026-10-23",
  usdBrl: 5.042763 / 1,
  eurBrl: 5.042763 / 0.891529,
  zarBrl: 5.042763 / 16.495348,
  nokBrl: 5.042763 / 9.343987,
  source: "https://open.er-api.com/v6/latest/USD",
};

export type CityId = "cape" | "kruger" | "athens" | "oslo";
export type RouteId = "cabo" | "cabo-atenas" | "atenas-oslo";
export type HotelTier = "medio" | "bom" | "folgado";
export type FoodTier = "simples" | "medio" | "confortavel";

export const hotelTierFactor: Record<HotelTier, number> = {
  medio: 1,
  bom: 1.15,
  folgado: 1.45,
};

export const foodTierFactor: Record<FoodTier, number> = {
  simples: 0.72,
  medio: 1,
  confortavel: 1.4,
};

/** Mediana de quarto duplo em USD, por mês. TravelDeals, painel de 20 out 2026 (out/2026–set/2027). */
export const hotelMedianUsd: Record<Exclude<CityId, "kruger">, number[]> = {
  cape: [256, 291, 262, 248, 219, 204, 208, 212, 244, 195, 246, 233],
  athens: [148, 149, 170, 204, 254, 255, 238, 227, 253, 220, 153, 147],
  oslo: [175, 173, 190, 186, 220, 236, 200, 236, 250, 238, 194, 180],
};

/** Chalé de rest camp no Kruger, quarto para duas pessoas, ZAR por noite. Faixa usual de parque, não cotação. */
export const krugerChaletZar = 3200;
/** Lodge privado médio, USD por pessoa por noite, dividindo quarto. Estimativa de planejamento. */
export const krugerLodgeUsd = 380;

/** Ida e volta em dinheiro, econômica, BSB → destino, curva de planejamento em R$. */
export const flightRtBrl = {
  cpt: [12000, 10500, 9000, 7800, 7400, 7000, 7000, 7200, 8200, 8000, 9000, 14000],
  ath: [6400, 6200, 6600, 7200, 8200, 9600, 10500, 10000, 8600, 7200, 6400, 7800],
  osl: [6000, 5800, 6000, 6600, 7600, 9000, 9800, 9400, 8200, 6800, 5800, 8200],
};

/** Multiplicador sobre US$ 620 para CPT → ATH, só ida. */
export const capeAthensFactor = [0.85, 0.85, 0.9, 0.95, 1.05, 1.25, 1.35, 1.3, 1.1, 1, 0.9, 1.15];
export const capeAthensBaseUsd = 620;

/** Multiplicador sobre € 110 para ATH → OSL, só ida. */
export const athensOsloFactor = [0.7, 0.7, 0.75, 0.85, 1, 1.25, 1.45, 1.4, 1.1, 0.9, 0.75, 0.9];
export const athensOsloBaseEur = 110;

export const internalKrugerBrl = 1150;

/** Comida média por pessoa por dia, na moeda local, antes do câmbio. */
export const foodMidLocal = {
  cape: 590,
  kruger: 480,
  athens: 58,
  oslo: 720,
};

export const climateScore: Record<CityId, number[]> = {
  cape: [6, 6, 8, 9, 8, 7, 6.5, 7, 9, 9, 8, 6],
  kruger: [3, 3, 4, 6, 8, 9, 9.5, 10, 8.5, 6.5, 5, 4],
  athens: [3, 4, 5, 7.5, 9, 9, 6.5, 6, 9.2, 8.2, 5, 3.5],
  oslo: [2, 2.5, 3.5, 5, 6.5, 9, 9.2, 8.5, 6.5, 4, 2.5, 2],
};

export const climate = {
  cape: {
    high: [26, 27, 25, 23, 20, 18, 18, 18, 19, 21, 24, 25],
    low: [16, 16, 14, 12, 9, 8, 7, 8, 9, 11, 13, 15],
    rain: [15, 17, 20, 41, 69, 93, 82, 77, 40, 30, 14, 17],
  },
  kruger: {
    high: [33, 32, 32, 30, 28, 26, 26, 28, 31, 32, 32, 33],
    low: [21, 20, 19, 15, 10, 6, 6, 8, 12, 16, 18, 20],
    rain: [94, 96, 66, 38, 14, 9, 8, 8, 22, 40, 63, 92],
  },
  athens: {
    high: [13, 14, 16, 20, 25, 30, 33, 33, 29, 23, 18, 14],
    low: [7, 7, 8, 11, 16, 20, 23, 23, 19, 15, 12, 8],
    rain: [57, 47, 41, 31, 23, 11, 6, 6, 14, 53, 58, 69],
    sea: [15, 15, 15, 16, 20, 23, 25, 26, 25, 22, 19, 17],
  },
  oslo: {
    high: [0, 1, 5, 10, 16, 20, 22, 20, 16, 10, 4, 1],
    low: [-5, -5, -2, 2, 7, 11, 13, 12, 8, 4, 0, -4],
    rain: [49, 36, 47, 41, 53, 65, 81, 89, 90, 84, 73, 55],
    light: [7, 9, 12, 15, 18, 19, 18, 16, 13, 10, 8, 6],
  },
};

export const months = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export const holidays = [
  { id: "ano-novo", name: "Ano-Novo", us: "New Year's Day", date: "2027-01-01", dow: "sexta" },
  { id: "mlk", name: "Martin Luther King Jr.", us: "MLK Day", date: "2027-01-18", dow: "segunda" },
  { id: "presidentes", name: "Presidents' Day", us: "Presidents' Day", date: "2027-02-15", dow: "segunda" },
  { id: "memorial", name: "Memorial Day", us: "Memorial Day", date: "2027-05-31", dow: "segunda" },
  { id: "juneteenth", name: "Juneteenth", us: "folga de Juneteenth", date: "2027-06-18", dow: "sexta" },
  { id: "independencia", name: "Independência", us: "Independence Day", date: "2027-07-05", dow: "segunda" },
  { id: "trabalho", name: "Dia do Trabalho", us: "Labor Day", date: "2027-09-06", dow: "segunda" },
  { id: "colombo", name: "Columbus Day", us: "Columbus Day", date: "2027-10-11", dow: "segunda" },
  { id: "veteranos", name: "Veterans Day", us: "Veterans Day", date: "2027-11-11", dow: "quinta" },
  { id: "acao-de-gracas", name: "Ação de Graças", us: "Thanksgiving", date: "2027-11-25", dow: "quinta" },
  { id: "natal", name: "Natal", us: "Christmas", date: "2027-12-25", dow: "sábado" },
  { id: "reveillon", name: "Réveillon", us: "New Year's Eve", date: "2027-12-31", dow: "sexta" },
] as const;

export type Holiday = (typeof holidays)[number];

export const cityMeta: Record<
  CityId,
  { name: string; nightsLabel: string; stay: string }
> = {
  cape: {
    name: "Cidade do Cabo",
    nightsLabel: "Noites no Cabo",
    stay: "Waterfront, De Waterkant, Gardens ou Sea Point",
  },
  kruger: {
    name: "Kruger",
    nightsLabel: "Noites no Kruger",
    stay: "Chalé de rest camp (Skukuza, Satara ou Lower Sabie)",
  },
  athens: {
    name: "Atenas",
    nightsLabel: "Noites em Atenas",
    stay: "Plaka, Koukaki ou Monastiraki",
  },
  oslo: {
    name: "Oslo e fiorde",
    nightsLabel: "Noites na Noruega",
    stay: "Sentrum ou Aker Brygge; 2 noites em Bergen se o bloco tiver 5+",
  },
};

export const routes: Record<
  RouteId,
  {
    id: RouteId;
    index: string;
    name: string;
    kicker: string;
    summary: string;
    cities: CityId[];
    photo: string;
    photoAlt: string;
    accent: string;
    logistics: number;
  }
> = {
  cabo: {
    id: "cabo",
    index: "01",
    name: "África do Sul",
    kicker: "Um país, de verdade",
    summary:
      "Cidade do Cabo e, se couber, quatro noites de safari no Kruger. Um único longo curso saindo de Brasília.",
    cities: ["cape", "kruger"],
    photo:
      "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1600&q=75",
    photoAlt: "Costa e montanha na Cidade do Cabo, com o oceano ao fundo",
    accent: "#9a4630",
    logistics: 7.4,
  },
  "cabo-atenas": {
    id: "cabo-atenas",
    index: "02",
    name: "Cabo e Atenas",
    kicker: "Dois continentes",
    summary:
      "Uma semana no Cabo e outra em Atenas, com um dia de barco até Hidra. Sem Kruger: o calendário não aguenta os dois.",
    cities: ["cape", "athens"],
    photo:
      "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=1600&q=75",
    photoAlt: "Acrópole de Atenas acima dos telhados da cidade",
    accent: "#1d4e66",
    logistics: 4.3,
  },
  "atenas-oslo": {
    id: "atenas-oslo",
    index: "03",
    name: "Atenas e Oslo",
    kicker: "O verão que cabe",
    summary:
      "Atenas e um dia em Hidra, depois Oslo e um fiorde. Um longo curso e um voo de quatro horas. É a rota que a geografia aceita.",
    cities: ["athens", "oslo"],
    photo:
      "https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1600&q=75",
    photoAlt: "Fiorde norueguês com montanhas e água parada",
    accent: "#23423b",
    logistics: 8.2,
  },
};

export const routeOrder: RouteId[] = ["cabo", "cabo-atenas", "atenas-oslo"];

export const defaultMiles = {
  africaOneWay: 70300,
  europeOneWay: 100000,
  taxPerLeg: 350,
  milheiro: 25,
  bridgeBrl: 480,
};

export const sources: { title: string; url: string; used: string }[] = [
  {
    title: "Câmbio USD, EUR, ZAR e NOK",
    url: "https://open.er-api.com/v6/latest/USD",
    used: "Cotações de 23 out 2026, 00:02 UTC. USD 5,04 · EUR 5,66 · ZAR 0,31 · NOK 0,54.",
  },
  {
    title: "Google Flights — Brasil para Cidade do Cabo",
    url: "https://www.google.com/travel/flights/flights-to-cape-town.html?gl=BR",
    used: "Piso visto de R$ 4.884, BSB–CPT, 9–15 de agosto, 2 escalas, LATAM/Airlink.",
  },
  {
    title: "Trabber — Brasília–Cidade do Cabo",
    url: "https://www.trabber.com.br/passagem-brasilia-cidade-do-cabo-bsb-cpt/",
    used: "Qatar em 82% das pesquisas e mais barata em 97,7% desses casos. Duração de referência 16h35. A média de R$ 6.591 veio de amostra mínima: entra como pista.",
  },
  {
    title: "Kayak — Brasília–Atenas",
    url: "https://www.kayak.com.br/voos/Brasilia-BSB/Atenas-Eleftherios-V--ATH",
    used: "Ida e volta típica R$ 5.603–7.459, média R$ 6.422 nos 12 meses anteriores à consulta. Piso recente R$ 5.329.",
  },
  {
    title: "Kayak — Brasília–Oslo",
    url: "https://www.kayak.com.br/voos/Brasilia-BSB/Oslo-e-outros-aeroportos-OSL",
    used: "Faixa típica R$ 5.232–6.613. Piso recente R$ 4.616 na TAP via Lisboa. Lisboa foi a escala mais barata no trimestre, média R$ 5.332.",
  },
  {
    title: "Momondo — Brasília–Oslo e Brasília–Atenas",
    url: "https://www.momondo.com.br/passagem/brasilia-distrito-federal/atenas",
    used: "Oslo: típico R$ 4.023–6.679, piso recente de ida e volta R$ 6.116. Atenas: piso de 72 horas R$ 5.799 (Air France) e R$ 5.815 (TAP).",
  },
  {
    title: "AwardTool — Smiles para a África do Sul",
    url: "https://www.awardtool.com/programs/gol-smiles/to-south-africa",
    used: "Janela 16 set–16 out 2026: GRU–CPT econômica a partir de 70.300 milhas; executiva 171.600 em poucas datas. GRU–JNB econômica 82.300.",
  },
  {
    title: "Milhas na Mão — destinos Smiles",
    url: "https://www.milhasbot.com.br/destinos-com-milhas-smiles/",
    used: "12 meses até 18 out 2026: CPT desde 61.900 (GRU), JNB desde 68.000, Paris 77.700 (Fortaleza), Madri 78.300 (Salvador), Amsterdã 106.100 (GRU). A Smiles não publica tabela fixa.",
  },
  {
    title: "TravelDeals — mediana de hotel",
    url: "https://traveldeals.com/prices",
    used: "Mediana em USD do quarto para 2 adultos, painel de 20 out 2026, meses de out/2026 a set/2027. É a base mensal de Cidade do Cabo, Atenas e Oslo.",
  },
  {
    title: "Booking — hotéis 4 estrelas em Atenas",
    url: "https://www.booking.com/fourstars/city/gr/athens.html",
    used: "Média declarada de US$ 206 a noite para 4 estrelas, sem mês fixo. Cruzamento, não a curva usada no cálculo.",
  },
  {
    title: "Kayak — hotéis em Oslo",
    url: "https://www.kayak.com/Oslo-Hotels.29309.hotel.ksp",
    used: "Quarto duplo médio US$ 212; 4 estrelas em torno de US$ 212. Cruzamento da mediana de junho (US$ 236).",
  },
  {
    title: "HotelsCombined — 4 estrelas na Cidade do Cabo",
    url: "https://www.hotelscombined.ie/Place/Cape-Town-4-Star-Hotels.4sr.26827.ksp",
    used: "Média citada de cerca de € 111 a noite (consulta de agosto de 2026). A curva mensal do plano usa a mediana TravelDeals, em geral mais alta.",
  },
  {
    title: "TravelPriceWatch — refeições na Cidade do Cabo",
    url: "https://www.travelpricewatch.com/cape-town-south-africa/",
    used: "Outubro de 2026: almoço de menu em torno de ZAR 180, prato de jantar ZAR 190–365. O dia médio do plano soma ZAR 590 por pessoa.",
  },
  {
    title: "TravelPriceWatch — refeições em Oslo",
    url: "https://www.travelpricewatch.com/oslo-norway/",
    used: "Outubro de 2026: prato típico NOK 220–380, almoço de buffet NOK 210. O dia médio do plano soma NOK 720 por pessoa.",
  },
  {
    title: "Raven Guides — custo diário na Grécia e na Noruega",
    url: "https://www.ravenguides.com/blog/how-much-does-it-cost-to-visit-europe",
    used: "Refeição simples na Grécia em torno de € 15; quarto de 3 estrelas típico € 112. Noruega: quarto típico 1.450 NOK, refeição 220 NOK. A base de comida em Atenas é € 58/dia.",
  },
  {
    title: "África do Sul — visto para brasileiros",
    url: "https://www.southafrica.net/br/pt/travel/category/o-que-voc%C3%AA-precisa-saber/requerimento-de-visto",
    used: "Turismo até 90 dias sem visto. Passaporte com 30 dias além da saída e duas páginas em branco. CIV de febre amarela obrigatório para quem sai do Brasil.",
  },
  {
    title: "Itamaraty — Schengen, EES e ETIAS",
    url: "https://www.gov.br/mre/pt-br/consulado-amsterda/vistos/vistos-para-brasileiros",
    used: "Brasileiro entra sem visto por até 90 dias a cada 180. EES em implantação até abril de 2026. ETIAS previsto para o último trimestre de 2026 — em 2027, trate como provável.",
  },
];
