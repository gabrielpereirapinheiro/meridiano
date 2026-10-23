import type { RouteId } from "@/data/catalog";

export const guides: Record<RouteId, { sections: { title: string; body: string[] }[] }> = {
  cabo: {
    sections: [
      {
        title: "Como sair de Brasília",
        body: [
          "Não há voo direto. O relógio realista é 18 a 26 horas porta a porta, com uma ou duas escalas. O Trabber usa 16h35 como duração de referência do trecho voado, e isso não inclui o tempo morto de conexão nem o fuso (Cidade do Cabo fica cinco horas à frente de Brasília no inverno de lá, quatro no verão).",
          "A malha que mais aparece: Brasília–Guarulhos, e de lá Qatar até Doha e a África do Sul; Ethiopian até Adis Abeba; Turkish até Istambul; ou LATAM até Joanesburgo com Airlink ou South African até o Cabo. Emirates via Dubai costuma ser o produto mais confortável e, nas pesquisas do Trabber, raramente o mais barato.",
          "No Trabber, a Qatar entrou em 82% das buscas Brasília–Cidade do Cabo e foi a mais barata em 97,7% desses casos. A média de R$ 6.591 que o site publica veio de uma amostra mínima: serve de pista, não de orçamento. O piso que o Google Flights mostrou foi R$ 4.884, ida e volta, 9 a 15 de agosto, duas escalas, LATAM com Airlink. A curva desta mesa fica acima desse piso de propósito. Agosto barato não é dezembro.",
        ],
      },
      {
        title: "Dinheiro e milhas",
        body: [
          "Em dinheiro, a curva de planejamento da ida e volta sai de cerca de R$ 7.000 no inverno sul-africano e passa de R$ 12.000 em janeiro, com dezembro em R$ 14.000. Setembro, a janela boa de clima, fica em R$ 8.200 na curva. São números para decidir a época, não para pagar. O botão de busca abre Google Flights, Skyscanner e Kayak na data exata.",
          "Na Smiles, o AwardTool viu GRU–CPT em econômica a partir de 70.300 milhas entre 16 de setembro e 16 de outubro de 2026. No banco da Milhas na Mão, até 18 de outubro de 2026, o piso do ano foi 61.900. Joanesburgo apareceu a 68.000 e, na janela recente, a 82.300. Executiva GRU–CPT surgiu a 171.600, em nove datas só. A Smiles não tem tabela. O campo do plano é editável.",
          "A LATAM Pass precifica na hora. Vale a pena quando o voo é dela até Guarulhos e o prêmio aparece abaixo da Smiles. Não transfira milha de um programa para o outro antes de ver o assento. A ponte Brasília–Guarulhos, quando o prêmio não sai de BSB, está numa linha separada: cerca de R$ 480 ida e volta, ou 5.000 milhas Smiles o trecho doméstico que já foi visto.",
        ],
      },
      {
        title: "Onde ficar e quanto comer",
        body: [
          "Hotel médio em lugar bom, no Cabo, quer dizer Waterfront, De Waterkant, Gardens ou Sea Point. A mediana da cidade para um quarto de duas pessoas, no painel da TravelDeals de 20 de outubro de 2026, foi US$ 244 em setembro de 2027, US$ 212 em agosto e US$ 195 em outubro de 2026 (o outubro mais barato da série). O plano soma 15% em cima disso quando o botão está em “local bom”. Um 4 estrelas de orla pode sair dessa faixa; um quarto genérico de cidade sai abaixo. A mediana é do quarto, então quem viaja só paga quase o mesmo pela cama.",
          "No Kruger, o “médio” desta mesa é chalé de rest camp da SANParks, na casa de ZAR 3.200 a noite pelo quarto, em Skukuza, Satara ou Lower Sabie. Lodge privado é outro esporte: a chave “lodge” usa US$ 380 por pessoa por noite, com suplemento se você for só. Não misture as duas coisas na cabeça.",
          "Comida média no Cabo, por pessoa e por dia: café, almoço de bairro e um jantar com um prato de verdade, sem menu de degustação. A conta da mesa é ZAR 590, cerca de R$ 180 no câmbio de 23 de outubro de 2026. O TravelPriceWatch, no mesmo mês, via almoço de menu perto de ZAR 180 e prato de jantar entre ZAR 190 e 365. The Test Kitchen, a ZAR 2.250 o menu, não entra nessa média. No parque, o dia fica um pouco mais baixo se você comprar no mercado do camp.",
        ],
      },
      {
        title: "Clima e a melhor quinzena",
        body: [
          "Cidade do Cabo é mediterrânea. Dezembro a fevereiro é verão, seco, ventoso e caro. A chuva chega de maio a agosto. Setembro e outubro são primavera: flor, luz boa, máxima perto de 19–21°C. Março a maio é o outro ombro, com o mar ainda decente e a cidade esvaziando.",
          "Kruger é o contrário. O jogo se vê na seca, de maio a setembro, quando o mato baixa e o bicho vai à água. A máxima em agosto anda na casa dos 28°C e a noite cai para 8°C. A partir de outubro a chuva volta e o avistamento piora. Por isso a quinzena que segura os dois é o fim de agosto e o começo de setembro.",
          "No calendário de 2027, o Dia do Trabalho cai numa segunda, 6 de setembro. A mesa marca a semana de 4 a 18 de setembro: o feriado entra no começo e as noites de hotel ficam em setembro, com o Kruger ainda na seca. A de 28 de agosto a 11 de setembro também serve e costuma sair um pouco mais barata. Columbus Day, 11 de outubro, é a alternativa se o safari sair da lista. Memorial Day, 31 de maio, abre a seca no Kruger e é outono bonito no Cabo. Natal e Ano-Novo são alta, calor e preço.",
        ],
      },
      {
        title: "Papelada",
        body: [
          "Brasileiro não tira visto para turismo de até 90 dias. O passaporte precisa valer 30 dias além da saída e ter duas páginas em branco. O certificado internacional de febre amarela é exigido de quem embarca no Brasil: a vacina tem de estar tomada pelo menos dez dias antes. Confira a regra vigente perto da data, porque imigração muda o texto sem avisar o roteiro.",
          "Cidade do Cabo não pede profilaxia de malária. O Kruger pede conversa com médico. Uber funciona na cidade. No parque, reserve o traslado ou dirija de dia; não improvise a estrada à noite.",
        ],
      },
    ],
  },
  "cabo-atenas": {
    sections: [
      {
        title: "O que esta rota é, e o que ela não é",
        body: [
          "É um longo curso até o Cabo, alguns dias de cidade e costa, um voo longo até Atenas e uma semana grega com um dia de barco. Não é safari mais ilha. Quem enfia Kruger no meio perde a Acrópole ou perde o parque, e em geral perde os dois.",
          "Conte três dias mortos: a chegada na África, o salto Cabo–Atenas (onze a dezesseis horas com a escala em Doha, Adis ou Istambul) e a volta Atenas–Brasília. Sobram cerca de onze noites de verdade. A divisão que a mesa usa é seis no Cabo e cinco em Atenas.",
        ],
      },
      {
        title: "Como fechar os voos",
        body: [
          "Não existe um “voo Brasília–Cabo–Atenas” óbvio. Dá para comprar três trechos ou pedir um multi-cidade nos dois longos e pagar o miolo à parte. A mesa soma as pernas: só ida de Brasília ao Cabo (62% da ida e volta daquele mês, porque avulso custa mais que a metade), Cabo–Atenas em torno de US$ 620 no ombro, e a volta Atenas–Brasília no mesmo critério. Setembro fica mais caro que um único ida e volta para um destino só. É o preço de ver os dois.",
          "Para Atenas, saindo de Brasília, o Kayak media R$ 6.422 a ida e volta nos doze meses anteriores a esta pesquisa, com faixa típica de R$ 5.603 a R$ 7.459. O Momondo tinha um piso recente de R$ 5.799 na Air France e R$ 5.815 na TAP. Isso é ombro e baixa. Julho e agosto sobem, e a curva do plano leva isso em conta. TAP via Lisboa e Air France via Paris são as cias que mais entregam horário decente. Turkish via Istambul serve quando o preço ou a milha aparece.",
          "Milhas: use no Brasília–Cabo e no Atenas–Brasília. O miolo Cabo–Atenas quase sempre sai melhor em dinheiro. O número de partida para a Europa é 100.000 Smiles o trecho, no meio do que se viu entre 77.700 (Paris, saindo de Fortaleza) e 106.100 (Amsterdã, saindo de Guarulhos). Mude o campo quando você olhar o calendário de verdade.",
        ],
      },
      {
        title: "Hotel, comida, ritmo",
        body: [
          "No Cabo, a mesma regra da rota solo: Waterfront, Gardens ou Sea Point, mediana do mês mais 15%. Em Atenas, durma em Plaka, Koukaki ou Monastiraki, a pé da ruína e do jantar. A mediana da TravelDeals para setembro de 2027 é US$ 253 o quarto; outubro de 2026, US$ 220; junho de 2027, US$ 255. O Booking citava US$ 206 como média de 4 estrelas sem dizer o mês. A mesa usa o mês, não essa média solta.",
          "Comida em Atenas, no nível médio: cerca de € 58 por pessoa por dia, café, almoço e um jantar de taverna. Dá algo perto de R$ 330 no câmbio de outubro de 2026. A Grécia fica mais barata que a Noruega e mais cara que o Cabo. O dia essencial inclui Acrópole, museu e a balsa de Hidra, perto de € 110 por pessoa no pacote de passeios.",
          "Hidra cabe. Santorini não. A balsa de manhã e a volta no fim da tarde devolvem você para a cama em Atenas. Mykonos é fila e diária, e come o pouco tempo que esta rota tem.",
        ],
      },
      {
        title: "Quando os dois climas concordam",
        body: [
          "O Cabo quer primavera ou outono. Atenas quer maio, junho, setembro ou outubro. Julho e agosto em Atenas passam de 33°C e a cidade esvazia de quem pode. O cruzamento bom é setembro, e o segundo é outubro.",
          "Dia do Trabalho, 6 de setembro de 2027: o mar na Ática ainda anda perto de 25°C, o Cabo está em flor, e o vento do verão sul-africano ainda não virou o sudeste de dezembro. Columbus Day, 11 de outubro, barateia os dois hotéis. O mar grego cai para perto de 22°C: ótimo para caminhar e comer, morno para quem quer praia o dia inteiro.",
          "Junho junta calor no Cabo (é inverno, chuvoso, máxima de 18°C, o que até é agradável) com a Grécia no ponto. Funciona, e não é a razão de cruzar dois continentes: você estaria pagando o salto intercontinental para ver o Cabo na estação menos festiva. A mesa mostra a nota. Ela não esconde a opção.",
        ],
      },
      {
        title: "Papelada dos dois lados",
        body: [
          "África do Sul: sem visto até 90 dias, febre amarela, passaporte com 30 dias além da saída. Schengen, na Grécia: sem visto até 90 dias dentro de 180, passaporte com três meses além da saída do espaço. Vale o critério mais rígido, que é o europeu.",
          "O EES, o registro biométrico na fronteira Schengen, estava em implantação até abril de 2026. Em 2027 ele já é rotina: foto e digital, e fila. O ETIAS, a autorização eletrônica, estava previsto para o último trimestre de 2026. Para uma viagem em 2027, reserve um tempo antes do embarque e uma taxa na casa dos € 20, e confirme a data oficial quando ela existir. Não é visto. Também não é nada.",
        ],
      },
    ],
  },
  "atenas-oslo": {
    sections: [
      {
        title: "A rota que a mapa aceita",
        body: [
          "Atenas e Oslo cabem em quatorze noites porque o segundo avião tem quatro horas, não dezesseis. A mesa põe seis noites na Grécia e cinco na Noruega: duas em Oslo, duas no fiorde (Bergen ou Flåm) e a última de volta em Oslo, perto do voo longo.",
          "A ordem é Grécia primeiro. Você queima o fuso numa cidade quente, de rua, e só depois encara o norte. A volta longa sai de Oslo. Nas pesquisas recentes, a TAP via Lisboa foi o caminho mais barato de Brasília para Oslo, e Lisboa também serve para Atenas. Dá para desenhar BSB–LIS–ATH na ida e OSL–LIS–BSB na volta.",
        ],
      },
      {
        title: "Passagem, cias e milhas",
        body: [
          "Kayak, Brasília–Oslo: faixa típica R$ 5.232 a R$ 6.613, piso recente de ida e volta R$ 4.616 na TAP, 6 a 10 de novembro, viagem curta. Momondo: típico R$ 4.023 a R$ 6.679 e um piso de ida e volta a R$ 6.116. Junho e julho não estão nesse piso. A curva do plano sobe para cerca de R$ 9.000 a R$ 9.800 a ida e volta no auge.",
          "Atenas, mesma lógica: média Kayak R$ 6.422, e o verão acima disso. O trecho Atenas–Oslo fica na casa dos € 110 no ombro e sobe no feriado de julho. SAS e Norwegian resolvem. Não gaste milha num voo de manhã.",
          "Os dois longos, sim, são candidato a milha. Europa em econômica, na Smiles, oscilou de menos de 80 mil saindo do Nordeste a mais de 100 mil saindo de Guarulhos. O padrão editável é 100.000 por trecho, mais a ponte Brasília–São Paulo se o prêmio não nascer em BSB. LATAM, Flying Blue e Miles&Smiles entram na comparação do dia. Programa de milha dinâmica não se resume num cartaz.",
        ],
      },
      {
        title: "O chão é que dói na Noruega",
        body: [
          "Hotel em Oslo, mediana TravelDeals do quarto duplo: US$ 236 em junho de 2027, US$ 200 em julho, US$ 250 em setembro. Kayak via 4 estrelas em torno de US$ 212 numa média sem mês. Fique em Sentrum ou Aker Brygge. Clarion e Scandic entregam o “médio em lugar bom”. O Grand Hotel é outro orçamento.",
          "Comida em Oslo é o item que descola esta rota da Grécia. Um dia médio, almoço e jantar fora, fica em NOK 720 por pessoa, perto de R$ 390. O prato típico visto em outubro de 2026 custava NOK 220 a 380. Cerveja passa de NOK 100. O nível “simples” do plano assume um mercado ou padaria no lugar de uma das refeições. Em Atenas o mesmo espírito custa cerca de € 58.",
          "Passeio norueguês que vale a pena nesta quinzena: a linha até Flåm ou o trem para Bergen, na casa de NOK 2.600 por pessoa já com folga para museu. Não compre o Norway in a Nutshell inteiro no escuro; às vezes o trem e uma balsa avulsa saem menores. Conferir na Vy e na Visit Flåm quando a data existir de verdade.",
        ],
      },
      {
        title: "A época em que os dois estão acordados",
        body: [
          "Atenas em junho: máxima perto de 30°C, mar em torno de 23°C, cidade cheia mas ainda não no forno de agosto. Oslo em junho: máxima perto de 20°C, quase 19 horas de luz, fiorde aberto, Bergen molhada. É o encontro.",
          "O feriado que cai dentro disso é a sexta 18 de junho de 2027, folga de Juneteenth. A janela de sábado 12 a sábado 26 de junho inclui o dia e ainda fica antes do pico de julho. A semana da Independência, 5 de julho, é o cartão-postal e a diária alta: Atenas a 33°C, Noruega no auge, tudo mais caro.",
          "Memorial Day, 31 de maio, deixa a Grécia pronta e a Noruega ainda fria, máxima na casa dos 16°C no começo do mês. Dia do Trabalho, 6 de setembro, inverte: Atenas excelente, Oslo já em outono, uns 16°C e dia encurtando. Dá para ir. Não é a viagem que justifica juntar os dois. De novembro a março, Oslo é outra viagem, de cidade e, mais ao norte, de aurora. Não combina com praia grega no mesmo bilhete.",
        ],
      },
      {
        title: "Schengen, uma vez só",
        body: [
          "Grécia e Noruega contam os dias juntas. Quatorze noites não ameaçam o limite de 90 em 180. O passaporte precisa ter três meses além da saída. Seguro com cobertura de € 30 mil pode ser pedido. O plano já reserva uma linha para isso.",
          "Em 2027, embarque com o EES na conta: a primeira entrada no espaço registra biometria e a fila do verão em Atenas ou Oslo não é lenda. ETIAS, se estiver valendo como o Itamaraty projetava para o fim de 2026, se resolve online antes. Confirme perto da compra. Leve capa de chuva para Bergen mesmo em junho. O fiorde não marca reunião com o sol.",
        ],
      },
    ],
  },
};
