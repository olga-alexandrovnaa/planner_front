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
import { MonthWeek } from "../types/monthSchema";
import { ru } from "date-fns/locale";
import { getYYYY_MM_DD } from "@/sharedComponents/lib/helpers/getYYYY_MM_DD";

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

export const getMonthDates = (state: StateSchema) => {
  if(!state.monthForm) return []; 

  const result: MonthWeek[] = [];
  let date = new Date(
    state.monthForm?.showedYear,
    state.monthForm?.showedMonthNumber,
    1
  );

  const daysCount = getDaysInMonth(
    new Date(state.monthForm?.showedYear, state.monthForm?.showedMonthNumber)
  );
  const weeksCount = getWeeksInMonth(
    new Date(
      state.monthForm?.showedYear,
      state.monthForm?.showedMonthNumber,
      1
    ),
    { weekStartsOn: 1 }
  );

  let index = 0;
  for (let weekIndex = 0; weekIndex < weeksCount; weekIndex++) {
    //   const weekDay = getDay(date);
    //   const weekDayWithMondayStart = weekDay === 0 ? 6 : weekDay - 1;

    //создать неделю
    const week: MonthWeek = {
      weekIndex: weekIndex,
      weekNumber: getWeek(date, { locale: ru }),
      days: [],
    };

    //текущий день недели
    const weekDayWithMondayStart = date.getDay();

    //не понедельник - добавить пустые дни до текущего дня недели
    for (
      let indexOfEmptyDays = 0;
      indexOfEmptyDays < weekDayWithMondayStart;
      indexOfEmptyDays++
    ) {
      week.days.push(null);
    }
    //пока не началась следующая неделя добавлять дни
    while (date.getDay() < 7) {
      week.days.push({
        date: { ...date },
        day: date.getDate(),
        isSelected:
          getYYYY_MM_DD(date) === getYYYY_MM_DD(state.weekForm.selectedDay),
      });

      //все дни выведены - заполнить пустыми днями
      if (index + 1 === daysCount) {
        for (
          let indexOfEmptyDays = weekDayWithMondayStart;
          indexOfEmptyDays < 7;
          indexOfEmptyDays++
        ) {
          week.days.push(null);
        }
        return result;
      }

      index = index + 1;
      date = addDays(date, 1);
    }

    result.push(week);
  }

  return result;
};
