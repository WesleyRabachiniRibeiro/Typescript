/**
 * Receive String '1.000,00' return Number 1000.00;
 */
export default function currencyToNumber(currency: string): number | null {
    const number = Number(currency.replaceAll(".", "").replace(",", "."));
    return isNaN(number) ? null : number;
}