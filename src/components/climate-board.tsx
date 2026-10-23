import { climate, climateScore, months, type CityId } from "@/data/catalog";

const rows: { id: CityId; label: string }[] = [
  { id: "cape", label: "Cidade do Cabo" },
  { id: "kruger", label: "Kruger" },
  { id: "athens", label: "Atenas" },
  { id: "oslo", label: "Oslo" },
];

function tone(score: number) {
  if (score >= 8.5) return "bg-[#2f6b4f] text-white";
  if (score >= 7) return "bg-[#7ea47a] text-ink";
  if (score >= 5) return "bg-[#e4c56a] text-ink";
  if (score >= 3.5) return "bg-[#e0a15a] text-ink";
  return "bg-[#9a4630] text-white";
}

export function ClimateBoard({ highlight = [] }: { highlight?: number[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Normais de clima</p>
        <h2 className="serif mt-2 text-4xl tracking-tight">O ano, visto do chão</h2>
        <p className="mt-3 text-muted">
          Máxima e mínima em °C, médias históricas arredondadas. A cor é a nota da mesa para
          caminhar e ver paisagem, não um índice oficial. Verde aguenta a viagem que está
          desenhada aqui. Terracota pede outra estação.
        </p>
      </div>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[760px] border-separate border-spacing-1 text-left text-xs">
          <thead>
            <tr className="text-muted">
              <th className="px-2 py-2 font-medium">Lugar</th>
              {months.map((month, index) => (
                <th
                  key={month}
                  className={`px-1 py-2 text-center font-medium capitalize ${highlight.includes(index + 1) ? "text-ink" : ""}`}
                >
                  {month.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th className="whitespace-nowrap px-2 py-2 text-sm font-medium">{row.label}</th>
                {months.map((month, index) => {
                  const pack = climate[row.id];
                  const score = climateScore[row.id][index];
                  return (
                    <td key={month} className="p-0">
                      <div
                        className={`rounded-md px-1 py-2 text-center leading-tight ${tone(score)} ${highlight.includes(index + 1) ? "ring-2 ring-ink ring-offset-1 ring-offset-paper" : ""}`}
                        title={`${row.label} em ${month}: nota ${score}`}
                      >
                        <span className="block font-semibold">
                          {pack.high[index]}°
                        </span>
                        <span className="block opacity-80">{pack.low[index]}°</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-3">
        <li>Chuva no Cabo concentra de maio a agosto. O verão de lá é seco e ventoso.</li>
        <li>Kruger se vê na seca, maio a setembro. O verão é verde, quente e fechado.</li>
        <li>Oslo em junho passa de 18 horas de luz. Em dezembro, fica perto de 6.</li>
      </ul>
    </section>
  );
}
