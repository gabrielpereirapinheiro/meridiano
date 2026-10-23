# Meridiano

Comparador de duas semanas em 2027, saindo de Brasília: África do Sul, Cabo com Atenas, ou Atenas com Oslo. A conta usa médias de mercado pesquisadas em 23 de outubro de 2026 e encaixa a viagem num feriado federal dos Estados Unidos.

Os números são referência para decidir a época. A tarifa do dia abre no Google Flights, no Skyscanner e no Kayak.

```bash
npm install
npm run dev
```

`GET /api/voos?rota=cabo&feriado=trabalho&qual=0` devolve o orçamento e os links. Com `AMADEUS_CLIENT_ID` e `AMADEUS_CLIENT_SECRET`, o mesmo endpoint também consulta ofertas do primeiro trecho.
