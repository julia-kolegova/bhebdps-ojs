async function getCurrencyData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        date: "2019-02-18 14:30:56",
        response: {
          Date: "2019-02-19T11:30:00+03:00",
          PreviousDate: "2019-02-16T11:30:00+03:00",
          PreviousURL:
            "//www.cbr-xml-daily.ru/archive/2019/02/16/daily_json.js",
          Timestamp: "2019-02-18T17:00:00+03:00",
          Valute: {
            AUD: {
              ID: "R01010",
              NumCode: "036",
              CharCode: "AUD",
              Nominal: 1,
              Name: "Австралийский доллар",
              Value: 47.3467,
              Previous: 47.2801,
            },
            AZN: {
              ID: "R01020A",
              NumCode: "944",
              CharCode: "AZN",
              Nominal: 1,
              Name: "Азербайджанский манат",
              Value: 39.0492,
              Previous: 39.3188,
            },
          },
        },
      });
    }, 5000);
  });
}

function getCurrencyList(data) {
  return data.map((item) => {
    const container = document.createElement("div");
    container.classList.add("item");
    container.innerHTML = `
            <div class="item__code">${item.CharCode}</div>
            <div class="item__value">${item.Value}</div>
            <div class="item__currency">руб.</div>
        `;

    return container;
  });
}

(async function () {
  const data = await getCurrencyData();
  const currencylist = getCurrencyList(Object.values(data.response.Valute));

  document.querySelector("#loader").classList.remove("loader_active");
  document.querySelector("#items").append(...currencylist);
})();
