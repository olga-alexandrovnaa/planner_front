
export const getWeekStart = (w: number, y = new Date().getFullYear()) => {
    const d = new Date(y, 0, 4);
    d.setDate(d.getDate() - (d.getDay() || 7) + 1 + 7*(w - 1));
    return d;
}


