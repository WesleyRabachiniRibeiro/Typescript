import Statistics from "./Statistics.js";
import { CountList } from "./countBy.js";
import fetchData from "./fetchData.js";
import { fromEntity } from "./normalizeTransaction.js";

async function handleData() {
    const data = await fetchData<TransactionAPI[]>("https://api.origamid.dev/json/transacoes.json");
    if (!data) return;
    const transactions = data.map(fromEntity);
    fillTable(transactions);
    fillStatistics(transactions);
}

function fillTable(transactions : Transaction[]): void {
    const table = document.querySelector("#transactions tbody");
    if(!table) return;
    transactions.forEach((transaction) => {
        table.innerHTML += `
            <tr>
                <td>${transaction.name}</td>
                <td>${transaction.email}</td>
                <td>R$ ${transaction.money}</td>
                <td>${transaction.paymentMethod}</td>
                <td>${transaction.status}</td>
            </tr>
        `
    });
}

function fillList(list: CountList, containerId: string) {
    const element = document.querySelector<HTMLElement>(containerId);
    if(element) {
        Object.keys(list).forEach(key => {
            element.innerHTML += `<p>${key}: ${list[key]}</p>`
        })
    }
}

function fillStatistics(transactions: Transaction[]): void {
    const statistics = new Statistics(transactions);
    const totalElement = document.querySelector<HTMLElement>("#total span");
    const dayElement = document.querySelector<HTMLElement>("#day span");

    fillList(statistics.getPaymentMethods(), "#payment")
    fillList(statistics.getStatus(), "#status")

    if(totalElement) {
        totalElement.innerText = statistics.getTotal().toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    if(dayElement) {
        dayElement.innerText = statistics.getBestDay()[0];
    };
}

handleData()