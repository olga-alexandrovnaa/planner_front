import { GroupBase, OptionsOrGroups } from "react-select";
import { IntervalType } from "../..";
import { MoveTypeIfDayNotExists, WeekNumber, foodType } from "../types/task";

export const moveTypeIfDayNotExistsText: Record<MoveTypeIfDayNotExists, string> = {
  [MoveTypeIfDayNotExists.currentIntervalLastDay]: 'На конец текущего месяца',
  [MoveTypeIfDayNotExists.nextIntervalFirstDay]: 'На начало следующего месяца'
}

export const foodTypeText: Record<foodType, string> = {
  [foodType.breakfast]: 'На конец текущего месяца',
  [foodType.dessert]: 'На конец текущего месяца',
  [foodType.drink]: 'На конец текущего месяца',
  [foodType.salad]: 'На конец текущего месяца',
  [foodType.second]: 'На конец текущего месяца',
  [foodType.snack]: 'На конец текущего месяца',
  [foodType.soup]: 'На конец текущего месяца',
}

export const foodTypeOptions = [
  {
    options: [
      { label: foodTypeText[foodType.breakfast], value: foodType.breakfast },
      { label: foodTypeText[foodType.dessert], value: foodType.dessert },
      { label: foodTypeText[foodType.drink], value: foodType.drink },
      { label: foodTypeText[foodType.salad], value: foodType.salad },
      { label: foodTypeText[foodType.second], value: foodType.second },
      { label: foodTypeText[foodType.snack], value: foodType.snack },
      { label: foodTypeText[foodType.soup], value: foodType.soup },
    ],
  },
];

export const moveTypeIfDayNotExistsOptions = [
  { label: moveTypeIfDayNotExistsText[MoveTypeIfDayNotExists.currentIntervalLastDay], value: MoveTypeIfDayNotExists.currentIntervalLastDay },
  { label: moveTypeIfDayNotExistsText[MoveTypeIfDayNotExists.nextIntervalFirstDay], value: MoveTypeIfDayNotExists.nextIntervalFirstDay },
];

export const WeekNumberName = (
  number: WeekNumber,
  week: number
): string => {
  const numberType =
    week === 6 ? 3 : [0, 1, 3].includes(week) ? 1 : 2;

  let res = "";

  switch (number) {
    case WeekNumber.first:
      switch (numberType) {
        case 3:
          res = "Первое";
          break;
        case 2:
          res = "Первая";
          break;
        case 1:
          res = "Первый";
          break;
        default:
          break;
      }
      break;
    case WeekNumber.second:
      switch (numberType) {
        case 3:
          res = "Второе";
          break;
        case 2:
          res = "Вторая";
          break;
        case 1:
          res = "Второй";
          break;
        default:
          break;
      }
      break;
    case WeekNumber.third:
      switch (numberType) {
        case 3:
          res = "Третье";
          break;
        case 2:
          res = "Третья";
          break;
        case 1:
          res = "Третий";
          break;
        default:
          break;
      }
      break;
    case WeekNumber.last:
      switch (numberType) {
        case 3:
          res = "Последнее";
          break;
        case 2:
          res = "Последняя";
          break;
        case 1:
          res = "Последний";
          break;
        default:
          break;
      }
      break;
    default:
      res = "";
      break;
  }

  return res;
};

export const weekNumberOptions = (length: number): OptionsOrGroups<any, GroupBase<any>> => [
  {
    options: [
      { label: WeekNumberName(WeekNumber.first, length), value: WeekNumber.first },
      { label: WeekNumberName(WeekNumber.second, length), value: WeekNumber.second },
      { label: WeekNumberName(WeekNumber.third, length), value: WeekNumber.third },
      { label: WeekNumberName(WeekNumber.last, length), value: WeekNumber.last },
    ],
  },
];

export const intervalTypeOptions = (length: number): OptionsOrGroups<any, GroupBase<any>> => [
  {
    options: [
      { label: intervalTypeName(IntervalType.Day, length), value: IntervalType.Day },
      { label: intervalTypeName(IntervalType.Week, length), value: IntervalType.Week },
      { label: intervalTypeName(IntervalType.Month, length), value: IntervalType.Month },
      { label: intervalTypeName(IntervalType.Year, length), value: IntervalType.Year },
    ],
  },
];

export const intervalTypeName = (
  type: IntervalType,
  number: number
): string => {
  const numberType =
    number % 10 === 1 ? 1 : [2, 3, 4].includes(number % 10) ? 2 : 3;

  let res = "";

  switch (type) {
    case IntervalType.Day:
      switch (numberType) {
        case 1:
          res = "день";
          break;
        case 2:
          res = "дня";
          break;
        case 3:
          res = "дней";
          break;
        default:
          break;
      }
      break;
    case IntervalType.Month:
      switch (numberType) {
        case 1:
          res = "месяц";
          break;
        case 2:
          res = "месяца";
          break;
        case 3:
          res = "месяцев";
          break;
        default:
          break;
      }
      break;
    case IntervalType.Year:
      switch (numberType) {
        case 1:
          res = "год";
          break;
        case 2:
          res = "года";
          break;
        case 3:
          res = "лет";
          break;
        default:
          break;
      }
      break;
    case IntervalType.Week:
      switch (numberType) {
        case 1:
          res = "неделя";
          break;
        case 2:
          res = "недели";
          break;
        case 3:
          res = "недель";
          break;
        default:
          break;
      }
      break;
    default:
      res = "";
      break;
  }

  return res;
};
