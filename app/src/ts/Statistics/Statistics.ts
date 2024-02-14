import countBy, { CountList } from "./countBy.js";

type TransactionFilterValue = Transaction & { value: number }

function filterValue(transaction: Transaction): transaction is TransactionFilterValue {
    return transaction.value != null;
}

export default class Statistics {

    private total: Number;
    private paymentMethods: CountList;
    private status: CountList;
    private week;
    private bestDay;

    constructor(transactions: Transaction[]) {
        this.total = this.setTotal(transactions);
        this.paymentMethods = this.setPaymentMethods(transactions);
        this.status = this.setStatus(transactions);
        this.week = this.setWeek(transactions);
        this.bestDay = this.setBestDay();
    }

    private setTotal(transactions: Transaction[]) {
        return transactions.filter(filterValue).reduce((acc, item) => {
                return acc + item.value;
        }, 0);
    }

    public getTotal() {
        return this.total;
    }

    private setStatus(transactions: Transaction[]) {
        const status = transactions.map(({status}) => status);
        return countBy(status);
    }

    public getStatus() {
        return this.status;
    }

    private setPaymentMethods(transactions: Transaction[]) {
        const paymentMethods = transactions.map(({paymentMethod}) => paymentMethod);
        return countBy(paymentMethods);
    }

    public getPaymentMethods() {
        return this.paymentMethods;
    }

    private setWeek(transactions: Transaction[]) {
        const week = {
            sunday: 0,
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            saturday: 0
        };
        for(let i = 0; i < transactions.length; i++) {
            const day = transactions[i].date.getDay();
            if (day === 0) week.sunday += 1;
            if (day === 1) week.monday += 1;
            if (day === 2) week.tuesday += 1;
            if (day === 3) week.wednesday += 1;
            if (day === 4) week.thursday += 1;
            if (day === 5) week.friday += 1;
            if (day === 6) week.saturday += 1;
        }
        return week;
    }

    public getWeek() {
        return this.week;
    }

    private setBestDay() {
        return Object.entries(this.week).sort((a, b) => {
            return b[1] - a[1];
        })[0]
        
    }

    public getBestDay() {
        return this.bestDay;
    }
}