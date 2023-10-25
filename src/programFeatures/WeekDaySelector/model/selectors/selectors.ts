/* eslint-disable max-len */

import { StateSchema } from "@/app/providers/StoreProvider";
import { getMonthYearString } from "@/sharedComponents/lib/helpers/getMonthYearString";
import { addDays, getMonth, parse } from "date-fns";
import { WeekDay } from "../types/weekSchema";
import { getDD_MM_YYYY } from "@/sharedComponents/lib/helpers/getDD_MM_YYYY";
import { getWeekStart } from "@/sharedComponents/lib/helpers/getWeekStart";
import { getYearWeekNumber } from "@/sharedComponents/lib/helpers/getYearWeekNumber";

export const getSelectedDay = (state: StateSchema) => state.weekForm?.selectedDay;
export const getShowedWeekNumber = (state: StateSchema) => state.weekForm?.showedWeekNumber;
export const getShowedYear = (state: StateSchema) => state.weekForm?.showedYear;

export const getShowedMonthYearString = (state: StateSchema) => {
    if(!state.weekForm) return '';

    if(getYearWeekNumber(state.weekForm?.selectedDay) !== state.weekForm?.showedWeekNumber){
        return getMonthYearString(
            new Date(state.weekForm?.showedYear, 
            getMonth(parse(String(state.weekForm?.showedWeekNumber),'I', new Date(state.weekForm?.showedYear, 0, 1))),
            1)
        );
    }
    return getMonthYearString(state.weekForm?.selectedDay);
}

export const getWeekDates = (state: StateSchema) => {
    if(!state.weekForm) return []; 
    const result: WeekDay[] = [];
    let date = getWeekStart(state.weekForm?.showedWeekNumber, state.weekForm?.showedYear)

    const weekDayNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
    for (let index = 0; index < 7; index++) {
        result.push({
            day: date.getDate(),
            date: getDD_MM_YYYY(date),
            shortName: weekDayNames[index],
            isSelected: getDD_MM_YYYY(date) === getDD_MM_YYYY(state.weekForm.selectedDay)
        });
        date = addDays(date, 1)
    }
    return result;
}