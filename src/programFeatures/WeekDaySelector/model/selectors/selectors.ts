/* eslint-disable max-len */

import { StateSchema } from "@/app/providers/StoreProvider";
import { getMonthYearString } from "@/sharedComponents/lib/helpers/getMonthYearString";
import { getYYYY_MM_DD } from "@/sharedComponents/lib/helpers/getYYYY_MM_DD";
import { addDays, getDay, getMonth, parse } from "date-fns";

export const getSelectedDay = (state: StateSchema) => state.weekForm?.selectedDay;
export const getShowedWeekNumber = (state: StateSchema) => state.weekForm?.showedWeekNumber;
export const getShowedYear = (state: StateSchema) => state.weekForm?.showedYear;
export const getShowedMonthYearString = (state: StateSchema) => 
getMonthYearString(
    new Date(state.weekForm?.showedYear, 
    getMonth(parse(String(state.weekForm?.showedWeekNumber),'I', new Date(state.weekForm?.showedYear, 1, 1))),
    1)
);

export const getWeekDates = (state: StateSchema) => {
    const result: {day: number, date: Date, shortName: string, isSelected: boolean}[] = [];
    let date = parse(String(state.weekForm?.showedWeekNumber), 'I', new Date(state.weekForm?.showedYear, 1, 1));
    const weekDayNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
    for (let index = 0; index < 7; index++) {
        result.push({
            day: getDay(date),
            date: {...date},
            shortName: weekDayNames[index],
            isSelected: getYYYY_MM_DD(date) === getYYYY_MM_DD(state.weekForm.selectedDay)
        });
        date = addDays(date, 1)
    }
    return result;
}