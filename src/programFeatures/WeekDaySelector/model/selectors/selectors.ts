/* eslint-disable max-len */

import { StateSchema } from "@/app/providers/StoreProvider";
import { getMonthYearString } from "@/sharedComponents/lib/helpers/getMonthYearString";
import { addDays, getMonth, parse } from "date-fns";
import { WeekDay } from "../types/weekSchema";
import { getDD_MM_YYYY } from "@/sharedComponents/lib/helpers/getDD_MM_YYYY";
import { getWeekStart } from "@/sharedComponents/lib/helpers/getWeekStart";
import { getYearWeekNumber } from "@/sharedComponents/lib/helpers/getYearWeekNumber";
import { getWeekDayNumber } from "@/sharedComponents/lib/helpers/getWeekDayNumber";
import { createSelector } from "@reduxjs/toolkit";

export const getForm = (state: StateSchema) => state.weekForm;
export const getSelectedDay = (state: StateSchema) => state.weekForm?.selectedDay;
export const getShowedWeekNumber = (state: StateSchema) => state.weekForm?.showedWeekNumber;
export const getShowedYear = (state: StateSchema) => state.weekForm?.showedYear;

export const getShowedMonthYearString = (state: StateSchema) => {
    if (!state.weekForm) return '';

    if (getYearWeekNumber(state.weekForm?.selectedDay) !== state.weekForm?.showedWeekNumber) {
        return getMonthYearString(
            new Date(state.weekForm?.showedYear,
                getMonth(parse(String(state.weekForm?.showedWeekNumber), 'I', new Date(state.weekForm?.showedYear, 0, 1))),
                1)
        );
    }
    return getMonthYearString(state.weekForm?.selectedDay);
}

const weekDayNames = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

export const getWeekDates = createSelector(getForm, (weekForm) => {
    if (!weekForm) return [];
    const result: WeekDay[] = [];
    let date = getWeekStart(weekForm?.showedWeekNumber, weekForm?.showedYear)

    for (let index = 0; index < 7; index++) {
        result.push({
            day: date.getDate(),
            date: getDD_MM_YYYY(date),
            shortName: weekDayNames[index],
            isSelected: getDD_MM_YYYY(date) === getDD_MM_YYYY(weekForm.selectedDay),
            isCurrent: getDD_MM_YYYY(date) === getDD_MM_YYYY(new Date()),
            isDayOff: [5, 6].includes(getWeekDayNumber(date)),
            holiday: weekForm.holidays.find((e) => getDD_MM_YYYY(e.date) === getDD_MM_YYYY(date)),
        });
        date = addDays(date, 1)
    }
    return result;
});


export const getAllIngredientsEnd = (state: StateSchema) => state.weekForm?.allIngredientsEnd;
export const getAllIngredientsStart = (state: StateSchema) => state.weekForm?.allIngredientsStart;
export const getAllIngredients = (state: StateSchema) => state.weekForm?.allIngredients;
export const getAllIngredientsDates = createSelector(getForm, (form) => {
    return {
        dateStart: form?.allIngredientsStart,
        dateEnd: form?.allIngredientsEnd
    };
});
