import { GroupBase, OptionsOrGroups } from "react-select";
import { IntervalType } from "../..";

export const intervalTypeOptions: OptionsOrGroups<any, GroupBase<any>> = [
  {
    options: [
      { label: "день", value: IntervalType.Day },
      { label: "неделя", value: IntervalType.Week },
      { label: "месяц", value: IntervalType.Month },
      { label: "год", value: IntervalType.Year },
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
