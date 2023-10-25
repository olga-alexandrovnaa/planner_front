import { getDay } from "date-fns";

export const getWeekDayNumber = (date = new Date()) => {
    const weekDay = getDay(date);
    const weekDayWithMondayStart = weekDay === 0 ? 6 : weekDay - 1;
    return weekDayWithMondayStart;
}


