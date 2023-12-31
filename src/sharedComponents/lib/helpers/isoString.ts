export const isoString = (date: Date = new Date()): string => {
    const tzo = date.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';
    const pad = function (num: number) {
        return (num < 10 ? '0' : '') + num;
    };

    return date.getFullYear() +
        '-' + date.getMonth() + 1 +
        '-' + date.getDate()
    // +
    // 'T' + pad(date.getHours()) +
    // ':' + pad(date.getMinutes()) +
    // ':' + pad(date.getSeconds()) 
    // +
    // dif + pad(Math.floor(Math.abs(tzo) / 60)) +
    // ':' + pad(Math.abs(tzo) % 60);
}