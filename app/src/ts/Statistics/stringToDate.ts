export default function stringToDate(value: string) : Date {
    const [date, time] = value.split(" ");
    const [day, month, year] = date.split("/").map(Number);
    const [hour, minutes] = time.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minutes);
}