/* eslint-disable max-len */

import { StateSchema } from "@/app/providers/StoreProvider";
import { getMonthYearString } from "@/sharedComponents/lib/helpers/getMonthYearString";
import {
  addDays,
  getDay,
  getDaysInMonth,
  getWeek,
  getWeeksInMonth,
} from "date-fns";
import { MonthWeek, YearMonth } from "../types/monthSchema";
import { ru } from "date-fns/locale";
import { getDD_MM_YYYY } from "@/sharedComponents/lib/helpers/getDD_MM_YYYY";
import { getYearWeekNumber } from "@/sharedComponents/lib/helpers/getYearWeekNumber";
import { getWeekDayNumber } from "@/sharedComponents/lib/helpers/getWeekDayNumber";

export const getSelectedDay = (state: StateSchema) =>
  state.monthForm?.selectedDay;
export const getShowedMonthNumber = (state: StateSchema) =>
  state.monthForm?.showedMonthNumber;
export const getShowedYear = (state: StateSchema) =>
  state.monthForm?.showedYear;
export const getShowedMonthYearString = (state: StateSchema) => {
  if (!state.monthForm) return "";
  return getMonthYearString(
    new Date(state.monthForm?.showedYear, state.monthForm?.showedMonthNumber, 1)
  );
};
export const getMonthDates = (state: StateSchema, month?: number) => {

  if(!state.monthForm) return []; 

  const showedMonthNumber = month !== undefined ? month : state.monthForm?.showedMonthNumber;

  const result: MonthWeek[] = [];
  let date = new Date(
    state.monthForm?.showedYear,
    showedMonthNumber,
    1
  );

  const daysCount = getDaysInMonth(
    new Date(state.monthForm?.showedYear, showedMonthNumber)
  );
  const weeksCount = getWeeksInMonth(
    new Date(
      state.monthForm?.showedYear,
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
        getDD_MM_YYYY(date) === getDD_MM_YYYY(state.monthForm?.selectedDay),
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
};

export const getYearMonthDates = (state: StateSchema) => {

  if(!state.monthForm) return []; 

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
      weeks: getMonthDates(state, index) 
    })
  }

  return result;
  
};
