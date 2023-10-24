/* eslint-disable max-len */

import { StateSchema } from "@/app/providers/StoreProvider";
import { getMonthYearString } from "@/sharedComponents/lib/helpers/getMonthYearString";

export const getSelectedDay = (state: StateSchema) => state.monthForm?.selectedDay;
export const getShowedWeekNumber = (state: StateSchema) => state.monthForm?.showedMonthNumber;
export const getShowedYear = (state: StateSchema) => state.monthForm?.showedYear;
export const getShowedMonthYearString = (state: StateSchema) => getMonthYearString(
    new Date(state.monthForm?.showedYear, state.monthForm?.showedMonthNumber, 1)
);