import currencyToNumber from "./currencyToNumber.js";
import stringToDate from "./stringToDate.js";

declare global {
    interface Transaction {
        id: number;
        date: Date;
        name: string;
        email: string;
        status: string;
        money: string;
        value: number | null;
        newCustomer: boolean;
        paymentMethod: string;
    }
    
    interface TransactionAPI {
        ID: number;
        Data: string;
        Nome: string;
        Email: string;
        Status: string;
        ['Valor (R$)']: string;
        ['Cliente Novo']: number;
        ['Forma de Pagamento']: string;
    }
}

export function fromEntity(transaction: TransactionAPI): Transaction {
    return {
        id: transaction.ID,
        date: stringToDate(transaction.Data),
        name: transaction.Nome,
        email: transaction.Email,
        status: transaction.Status,
        money:  transaction["Valor (R$)"],
        value: currencyToNumber(transaction["Valor (R$)"]),
        newCustomer: Boolean(transaction["Cliente Novo"]),
        paymentMethod: transaction["Forma de Pagamento"],
    }
}