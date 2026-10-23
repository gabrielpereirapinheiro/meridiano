import { fx, researchedOn, sources } from "@/data/catalog";
import { Footer, Header } from "@/components/header";

export const metadata = {
  title: "Fontes — Meridiano",
  description: "De onde vêm os preços, as milhas, os hotéis e o clima usados na mesa.",
};

export default function FontesPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-14">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Método</p>
        <h1 className="serif mt-2 text-5xl tracking-tight">O que é número e o que é curva.</h1>
        <div className="mt-6 space-y-4 leading-7">
          <p>
            Tudo foi fechado em {researchedOn}. O câmbio daquele dia, no open.er-api, foi de R${" "}
            {fx.usdBrl.toFixed(2)} por dólar, R$ {fx.eurBrl.toFixed(2)} por euro, R$ {fx.zarBrl.toFixed(2)} por
            rand e R$ {fx.nokBrl.toFixed(2)} por coroa.
          </p>
          <p>
            Passagem em dinheiro tem dois andares. O piso é uma tarifa que alguém viu (Google Flights,
            Kayak, Momondo). A curva mensal é o número que entra na conta: ela parte dessas médias e sobe
            no verão europeu e no verão sul-africano, porque as médias publicadas estavam cheias de
            novembro e agosto promocional. Ida avulsa em rota aberta entra como 62% da ida e volta do mês.
            Atenas–Cabo parte de US$ 620. Atenas–Oslo parte de € 110. Os dois são estimativa de
            planejamento, ditas como tal na linha do orçamento.
          </p>
          <p>
            Hotel é a mediana mensal da TravelDeals para um quarto de duas pessoas, de outubro de 2026 a
            setembro de 2027. “Local bom” soma 15%. “Mais folgado”, 45%. Quem viaja só paga o quarto
            inteiro. O chalé do Kruger parte do piso publicado de Skukuza, R 2.220 o quarto na vigência
            2026/27, e recebe o mesmo acréscimo de categoria. O lodge, US$ 380 por pessoa, fica entre esse
            bangalô e o all-inclusive de US$ 600 a US$ 1.000. A taxa internacional do parque, R 692 por
            adulto por dia, entra na linha de passeios, com dois game drives.
          </p>
          <p>
            Comida é um dia médio montado em cima de cardápios publicados em outubro de 2026, não o índice
            de um aplicativo. Passeio essencial é um pacote curto: montanha, ponta do cabo, vinícola,
            taxa do Kruger, Acrópole, Hidra, trem do fiorde. Dá para gastar o dobro. Dá para gastar a
            metade.
          </p>
          <p>
            Milhas Smiles citadas são emissões vistas, não tabela. O padrão de 70.300 para a Cidade do
            Cabo e de 100.000 para a Europa está editável na mesa. O piso de 30.000 do Flying Blue para
            Atenas e Oslo, visto no outono de 2026, é saver: entra na página de fontes e não no campo
            inicial, porque junho de 2027 pode não ter esse lugar. A nota da rota mistura clima (50%,
            puxado para baixo pelo trecho mais fraco), preço da janela contra a opção mais barata (27%) e
            o desgaste dos voos (23%). Se algum destino fica abaixo de 4,5 no clima, a nota leva um
            desconto. Temperatura é normal climatológica arredondada, não previsão de 2027.
          </p>
          <p>
            A API <code>/api/voos</code> devolve a mesma conta e os links de Google Flights, Skyscanner e
            Kayak. Se existirem <code>AMADEUS_CLIENT_ID</code> e <code>AMADEUS_CLIENT_SECRET</code> no
            ambiente, ela também pergunta ofertas ao Amadeus para o primeiro trecho. Sem chave, não
            inventa tarifa ao vivo.
          </p>
        </div>
        <ol className="mt-10 space-y-5">
          {sources.map((source, index) => (
            <li key={source.url} className="border-t border-line pt-4">
              <a href={source.url} className="font-medium underline decoration-line underline-offset-4" target="_blank" rel="noreferrer">
                {String(index + 1).padStart(2, "0")} · {source.title}
              </a>
              <p className="mt-2 text-sm leading-6 text-muted">{source.used}</p>
            </li>
          ))}
        </ol>
      </main>
      <Footer />
    </>
  );
}
