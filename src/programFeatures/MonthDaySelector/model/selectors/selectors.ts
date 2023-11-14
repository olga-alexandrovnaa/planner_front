/* eslint-disable max-len */

import { StateSchema } from "@/app/providers/StoreProvider";
import { getMonthYearString } from "@/sharedComponents/lib/helpers/getMonthYearString";
import {
  addDays,
  endOfMonth,
  getDaysInMonth,
  getWeeksInMonth,
} from "date-fns";
import { MonthWeek, YearMonth } from "../types/monthSchema";
import { getDD_MM_YYYY } from "@/sharedComponents/lib/helpers/getDD_MM_YYYY";
import { getYearWeekNumber } from "@/sharedComponents/lib/helpers/getYearWeekNumber";
import { getWeekDayNumber } from "@/sharedComponents/lib/helpers/getWeekDayNumber";
import { createSelector } from "@reduxjs/toolkit";
import { isoString } from "@/sharedComponents/lib/helpers/isoString";
import { getYYYY_MM_DD } from "@/sharedComponents/lib/helpers/getYYYY_MM_DD";

export const getForm = (state: StateSchema) =>
  state.monthForm;
export const getFormAndMonth = (state: StateSchema, month?: number) =>
  ({ monthForm: state.monthForm, month });
export const getSelectedDay = (state: StateSchema) =>
  state.monthForm?.selectedDay;
export const getShowedMonthNumber = (state: StateSchema) =>
  state.monthForm?.showedMonthNumber;
export const getShowedYear = (state: StateSchema) =>
  state.monthForm?.showedYear;
export const getCurrentSelectedTracker = (state: StateSchema) =>
  state.monthForm?.currentSelectedTracker;
export const getTrackerProgressInfo = (state: StateSchema) =>
  state.monthForm?.trackerProgressInfo;
export const getUserTrackers = (state: StateSchema) =>
  state.monthForm?.userTrackers;

export const getRemainder = (state: StateSchema) =>
  state.monthForm?.remainder;
export const getInvestment = (state: StateSchema) =>
  state.monthForm?.investment;
export const getMoneyInfo = (state: StateSchema) =>
  state.monthForm?.moneyInfo;

export const getDtoForTrackerProgress = createSelector(getForm, (data) => {
  if (!data || !data.currentSelectedTracker || !data.showedMonthNumber || !data.showedYear) return null;
  return {
    id: data.currentSelectedTracker.id,
    dateStart: getYYYY_MM_DD(new Date(data.showedYear, data.showedMonthNumber, 1)),
    dateEnd: getYYYY_MM_DD(endOfMonth(new Date(data.showedYear, data.showedMonthNumber, 1))),
  }
})

export const getDtoForMoneyInfo = createSelector(getForm, (data) => {
  if (!data || !data.showedMonthNumber || !data.showedYear) return null;
  return {
    dateStart: getYYYY_MM_DD(new Date(data.showedYear, data.showedMonthNumber, 1)),
    dateEnd: getYYYY_MM_DD(endOfMonth(new Date(data.showedYear, data.showedMonthNumber, 1))),
  }
})

export const getDtoForUpdateMoneyInfo = createSelector(getForm, (data) => {
  if (!data || !data.showedMonthNumber || !data.showedYear) return null;
  return {
    date: getYYYY_MM_DD(new Date(data.showedYear, data.showedMonthNumber, 1)),
    remainder: data.remainder,
    investment: data.investment,
  }
})

export const getShowedMonthYearString = (state: StateSchema) => {
  if (!state.monthForm) return "";
  return getMonthYearString(
    new Date(state.monthForm?.showedYear, state.monthForm?.showedMonthNumber, 1)
  );
};

export const getMonthDates = createSelector(getFormAndMonth, (data) => {
  const { monthForm, month } = data;

  if (!monthForm) return [];

  const showedMonthNumber = month !== undefined ? month : monthForm?.showedMonthNumber;

  const result: MonthWeek[] = [];
  let date = new Date(
    monthForm?.showedYear,
    showedMonthNumber,
    1
  );

  const daysCount = getDaysInMonth(
    new Date(monthForm?.showedYear, showedMonthNumber)
  );
  const weeksCount = getWeeksInMonth(
    new Date(
      monthForm?.showedYear,
      showedMonthNumber,
      1
    ),
    { weekStartsOn: 1 }
  );

  let index = 0;
  for (let weekIndex = 0; weekIndex < weeksCount; weekIndex++) {
    //создать неделю
    const week: MonthWeek = {
      weekIndex: weekIndex,
      weekNumber: getYearWeekNumber(date),
      days: [],
    };

    //текущий день недели
    let weekDay = getWeekDayNumber(date);

    //не понедельник - добавить пустые дни до текущего дня недели
    for (
      let indexOfEmptyDays = 0;
      indexOfEmptyDays < weekDay;
      indexOfEmptyDays++
    ) {
      week.days.push(null);
    }

    let isFirstWeekDay = true;

    //пока не началась следующая неделя добавлять дни
    while (weekDay > 0 || isFirstWeekDay) {
      week.days.push({
        date: getDD_MM_YYYY(date),
        day: date.getDate(),
        isSelected:
          getDD_MM_YYYY(date) === getDD_MM_YYYY(monthForm?.selectedDay),
        isCurrent: getDD_MM_YYYY(date) === getDD_MM_YYYY(new Date()),
        isDayOff: [5, 6].includes(getWeekDayNumber(date)),
        holiday: monthForm.holidays.find((e) => getDD_MM_YYYY(e.date) === getDD_MM_YYYY(date)),
      });

      //все дни выведены - заполнить пустыми днями
      if (index + 1 === daysCount) {
        for (
          let indexOfEmptyDays = weekDay + 1;
          indexOfEmptyDays < 7;
          indexOfEmptyDays++
        ) {
          week.days.push(null);
        }
        result.push(week);
        return result;
      }

      isFirstWeekDay = false;
      index = index + 1;
      date = addDays(date, 1);
      weekDay = getWeekDayNumber(date);
    }

    result.push(week);
  }

  return result;
});

export const getYearMonthDates = (state: StateSchema) => {
  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const result: YearMonth[] = [];
  for (let index = 0; index < 12; index++) {
    result.push({
      monthIndex: index,
      name: months[index],
      weeks: getMonthDates(state, index),
      isSelected: index === state?.monthForm?.showedMonthNumber,
    })
  }

  return result;

};
