"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const dropList = document.querySelectorAll("#dropList select");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const iconReverse = document.getElementById("iconReverse");
const exchangeRate = document.getElementById("exchangeRate");
const exchangeButton = document.getElementById("exchangeButton");
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
        loadFlag(e.target);
    });
}
function loadFlag(element) {
    var _a;
    for (let code in country_list) {
        if (code == element.value) {
            let imgTag = (_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector("img");
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
function getExchangeValue() {
    return __awaiter(this, void 0, void 0, function* () {
        const amountInput = document.querySelector("#form input");
        let amountVal = amountInput.value;
        if (amountVal == "" || amountVal == "0") {
            amountVal = "1";
            amountInput.value = "1";
        }
        exchangeRate.innerText = "Getting exchange rate ...";
        const apiKey = "0398e785df0a8b5b1323da77";
        const useCurrApi = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurr.value}`;
        try {
            const response = yield fetch(useCurrApi);
            const result = yield response.json();
            let exchRate = result.conversion_rates[toCurr.value];
            let total = (parseFloat(amountVal) * exchRate).toFixed(2);
            exchangeRate.innerText = `${amountVal} ${fromCurr.value} = ${total} ${toCurr.value}`;
        }
        catch (error) {
            exchangeRate.innerText = "Something went wrong ... ";
            console.error("Exchange rate fetch failed:", error);
        }
    });
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
