import { Ingredient } from "@/serviceEntities/Product/model/types/product";
import { GroupBase } from "react-select";

export enum IntervalType {
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
  Year = 'Year',
}

export enum WeekNumber {
  first = 'first',
  second = 'second',
  third = 'third',
  last = 'last',
}
export enum MoveTypeIfDayNotExists {
  nextIntervalFirstDay = 'nextIntervalFirstDay',
  currentIntervalLastDay = 'currentIntervalLastDay',
}

export type RepeatDayTaskWithNotYearInterval = {
  id: number;
  trackerId: number;
  intervalPartIndex?: number | null;
  dayFromBeginningInterval?: number | null;
  weekNumber?: WeekNumber | null;
  weekDayNumber?: number | null;
  moveTypeIfDayNotExists?: MoveTypeIfDayNotExists | null;
  hour: number;
  minute: number;
};

export type RepeatDayTaskWithYearInterval = {
  id: number;
  trackerId: number;
  intervalPartIndex: number;
  yearDateDay: number;
  yearDateMonth: number;
  moveTypeIfDayNotExists?: MoveTypeIfDayNotExists | null;
  hour: number;
  minute: number;
};

export type RepeatDayTaskCheck = {
  id: number;
  trackerId: number;
  date: string;
  newDate?: string | null;
  checked: boolean;
  note?: string;
  moneyIncomeFact?: number | null;
  moneyOutcomeFact?: number | null;
  deadline?: string | null;
  isDeleted: boolean;
  hour: number;
  minute: number;
};

export type Food = {
  id: number;

  name: string;
  proteins?: number;
  fats?: number;
  carbohydrates?: number;
  calories?: number;

  foodType?: foodType;
  recipe?: string;
  ingredients: Ingredient[]
};

export type IncomeOutcomeType = {
  id: number;
  name: string;
}

export interface TaskExt extends Record<string, any> {
  id: number;
  date: string;
  name?: string;
  isTracker: boolean;
  intervalPart?: IntervalType | null;
  intervalLength?: number | null;
  repeatCount?: number | null;
  moneyIncomePlan?: number | null;
  moneyOutcomePlan?: number | null;
  isHoliday: boolean;
  isFood: boolean;
  repeatDays: RepeatDayTaskWithNotYearInterval[];
  repeatIfYearIntervalDays: RepeatDayTaskWithYearInterval[];
  taskRepeatDayCheck: RepeatDayTaskCheck[];
  isDeleted: boolean;
  deletedAt?: Date;
  foodId?: number | null;
  food?: Food | null;
  foodCountToPrepare?: number | null;
  foodCout?: number | null;
  taskBuyings: {
    buying: {
      note: string;
    }
  }[];

  outcomeTypeId?: number | null;
  outcomeType?: IncomeOutcomeType | null;

  incomeTypeId?: number | null;
  incomeType?: IncomeOutcomeType | null;

  hour: number;
  minute: number;

}

export interface CreateTaskDto extends Record<string, any> {
  date: string;
  hour: number;
  minute: number;
  name: string;
  isTracker?: boolean;
  isHoliday?: boolean;
  intervalPart?: IntervalType | null;
  intervalLength?: number | null;
  repeatCount?: number | null;
  moneyIncomePlan?: number | null;
  moneyOutcomePlan?: number | null;

  outcomeTypeId?: number | null;
  outcomeType?: IncomeOutcomeType | null;

  incomeTypeId?: number | null;
  incomeType?: IncomeOutcomeType | null;

  isFood?: boolean;
  recipe?: string | null;
  ingredients?: Ingredient[];
  repeatDays?: RepeatDayTaskWithNotYearInterval[];
  repeatIfYearIntervalDays?: RepeatDayTaskWithYearInterval[];
  taskRepeatDayCheck?: RepeatDayTaskCheck[];
  taskBuyings?: number[]
}

export interface UpdateTaskDto extends Record<string, any> {
  name?: string;
  isTracker?: boolean;
  intervalPart?: IntervalType | null;
  isHoliday?: boolean;
  intervalLength?: number | null;
  repeatCount?: number | null;
  moneyIncomePlan?: number | null;
  moneyOutcomePlan?: number | null;

  outcomeTypeId?: number | null;
  outcomeType?: IncomeOutcomeType | null;

  incomeTypeId?: number | null;
  incomeType?: IncomeOutcomeType | null;

  isFood?: boolean;
  recipe?: string | null;
  ingredients?: {
    trackerId: number;
    productId: number;
    count?: number;
    measureUnitId?: number;
  }[];
  repeatDays?: {
    id: number;
    trackerId: number;
    intervalPartIndex?: number;
    dayFromBeginningInterval?: number;
    weekNumber?: WeekNumber;
    weekDayNumber?: number;
    hour: number;
    minute: number;
  }[];
  repeatIfYearIntervalDays?: {
    id: number;
    trackerId: number;
    intervalPartIndex: number;
    yearDateDay: number;
    yearDateMonth: number;
    hour: number;
    minute: number;
  }[];
  taskRepeatDayCheck?: {
    id: number;
    trackerId: number;
    date: string;
    newDate?: string;
    checked?: boolean;
    note?: string;
    moneyIncomeFact?: number;
    moneyOutcomeFact?: number;
    deadline?: string;
    hour: number;
    minute: number;
  }[];
}

export type DeleteTaskDto = {
  id: number;
};

export type DeleteTaskInDateDto = {
  id: number;
  date: number;
};

export enum modeType {
  events = 'events',
  tasks = 'tasks',
  food = 'food',
  selfInfo = 'selfInfo',
  bag = 'bag',
}

export enum foodType {
  breakfast = 'breakfast',
  soup = 'soup',
  second = 'second',
  dessert = 'dessert',
  salad = 'salad',
  drink = 'drink',
  snack = 'snack',
}

export type GetDayTasksDto = {
  date: string;
  type: modeType;
};

export class ResheduleTaskDto {
  id: number;
  date: string;
  newDate: string;
}

export class SetTaskCheckDto {
  id: number;
  date: string;
  checked: boolean;
}

export class TaskProgressDto {
  id: number;
  dateStart: string;
  dateEnd: string;
}

export interface TaskSchema {
  id: number;
  form?: TaskExt;
  data?: TaskExt;
  formRepeatDays?: RepeatDayTaskWithNotYearInterval[];
  formRepeatIfYearIntervalDays?: RepeatDayTaskWithYearInterval[];
  currentFoodType?: foodType;
  outcomeTypes: IncomeOutcomeType[]
  incomeTypes: IncomeOutcomeType[]
  foodOptions: GroupBase<{
    value: number;
    label: string;
    data: Food;
  }>[];
  isLoading?: boolean;
  isCreateMode?: boolean;
  error?: string;
}
