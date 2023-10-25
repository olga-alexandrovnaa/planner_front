import { getDay, getISOWeeksInYear, getWeek } from "date-fns";

export const getYearWeekNumber = (date = new Date()) => {
    const n = getDay(date) === 0 ? getWeek(date) - 1 : getWeek(date)
    if(n === 0){
        const lastYearWeeksCount = getISOWeeksInYear(new Date(date.getFullYear(), 0, 1));
        return lastYearWeeksCount;
    }
    return n;
}


