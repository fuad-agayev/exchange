const dropList = document.querySelectorAll<HTMLSelectElement>("#dropList select");
const fromCurr = document.querySelector<HTMLSelectElement>(".from select")!;
const toCurr = document.querySelector<HTMLSelectElement>(".to select")!;
const iconReverse = document.getElementById("iconReverse") as HTMLDivElement;
const exchangeRate = document.getElementById("exchangeRate") as HTMLDivElement;
const exchangeButton = document.getElementById("exchangeButton") as HTMLButtonElement;





// Populate select elements with options
for (let i = 0; i < dropList.length; i++) {
  for (let currencyCode in country_list) {
    let selected = i == 0 
        ? (currencyCode == "USD" ? "selected" : "") 
        : (currencyCode == "TRY" ? "selected" : "");

    let optionTag = `<option value="${currencyCode}" ${selected}>${currencyCode}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }

  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target as HTMLSelectElement);
  });
}

function loadFlag(element: HTMLSelectElement): void {
  for (let code in country_list) {
    if (code == element.value) {
      let imgTag = element.parentElement?.querySelector("img") as HTMLImageElement;
      if (imgTag) {
        imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
      }
    }
  }
}

exchangeButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeValue();
});

async function getExchangeValue(): Promise<void> {
  const amountInput = document.querySelector<HTMLInputElement>("#form input")!;
  let amountVal = amountInput.value;
  if (amountVal == "" || amountVal == "0") {
    amountVal = "1";
    amountInput.value = "1";
  }

  exchangeRate.innerText = "Getting exchange rate ...";
  const apiKey = "0398e785df0a8b5b1323da77";
  const useCurrApi = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurr.value}`;
  
  try {
    const response = await fetch(useCurrApi);
    const result = await response.json();
    
    let exchRate = result.conversion_rates[toCurr.value];
    let total = (parseFloat(amountVal) * exchRate).toFixed(2);
    
    exchangeRate.innerText = `${amountVal} ${fromCurr.value} = ${total} ${toCurr.value}`;
  } catch (error) {
    exchangeRate.innerText = "Something went wrong ... ";
    console.error("Exchange rate fetch failed:", error);
  }
}

window.addEventListener("load", () => {
  getExchangeValue();
});

iconReverse.addEventListener("click", () => {
  let tempCode = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = tempCode;
  loadFlag(fromCurr);
  loadFlag(toCurr);
  getExchangeValue();
});


