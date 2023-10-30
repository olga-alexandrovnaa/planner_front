export enum IntervalType {
  Day,
  Week,
  Month,
  Year,
}
export enum WeekNumber {
  first,
  second,
  third,
  last,
}
export enum MoveTypeIfDayNotExists {
  nextIntervalFirstDay,
  currentIntervalLastDay,
}

export type Ingredient = {
  id: number;
  trackerId: number;
  productId: number;
  product: {
    id: number;
    name: string;
    typeId?: number;
    type?: {
      id: number;
      name: string;
      userId?: number;
      isDeleted: boolean;
    };
    measureUnitId: number;
    measureUnit: {
      id: number;
      name: string;
    };
  };
  count: number;
  measureUnitId?: number;
  measureUnit?: {
    measureUnitId: number;
    measureUnit: {
      id: number;
      name: string;
    };
    outcomeOfProduct: number;
  };
};

export type RepeatDayTaskWithNotYearInterval = {
  id: number;
  trackerId: number;
  intervalPartIndex?: number;
  dayFromBeginningInterval?: number;
  weekNumber?: WeekNumber;
  weekDayNumber?: number;
  moveTypeIfDayNotExists?: MoveTypeIfDayNotExists;
};

export type RepeatDayTaskWithYearInterval = {
  id: number;
  trackerId: number;
  intervalPartIndex: number;
  yearDateDay: number;
  yearDateMonth: number;
  moveTypeIfDayNotExists?: MoveTypeIfDayNotExists;
};

export type RepeatDayTaskCheck = {
  id: number;
  trackerId: number;
  date: string;
  newDate?: string;
  checked: boolean;
  note?: string;
  moneyIncomeFact?: number;
  moneyOutcomeFact?: number;
  deadline?: string;
  isDeleted: boolean;
};

export interface TaskExt extends Record<string, any> {
  id: number;
  date: string;
  name: string;
  isTracker: boolean;
  intervalPart?: IntervalType;
  intervalLength?: number;
  repeatCount?: number;
  moneyIncomePlan?: number;
  moneyOutcomePlan?: number;
  isFood: boolean;
  recipe?: string;
  ingredients: Ingredient[];
  repeatDays: RepeatDayTaskWithNotYearInterval[];
  repeatIfYearIntervalDays: RepeatDayTaskWithYearInterval[];
  taskRepeatDayCheck: RepeatDayTaskCheck[];
  isDeleted: boolean;
  deletedAt?: Date;
}

export interface CreateTaskDto extends Record<string, any> {
  date: string;
  name: string;
  isTracker?: boolean;
  intervalPart?: IntervalType;
  intervalLength?: number;
  repeatCount?: number;
  moneyIncomePlan?: number;
  moneyOutcomePlan?: number;
  isFood?: boolean;
  recipe?: string;
  ingredients?: Ingredient[];
  repeatDays?: RepeatDayTaskWithNotYearInterval[];
  repeatIfYearIntervalDays?: RepeatDayTaskWithYearInterval[];
  taskRepeatDayCheck?: RepeatDayTaskCheck[];
}

export interface UpdateTaskDto extends Record<string, any> {
  name?: string;
  isTracker?: boolean;
  intervalPart?: IntervalType;
  intervalLength?: number;
  repeatCount?: number;
  moneyIncomePlan?: number;
  moneyOutcomePlan?: number;
  isFood?: boolean;
  recipe?: string;
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
  }[];
  repeatIfYearIntervalDays?: {
    id: number;
    trackerId: number;
    intervalPartIndex: number;
    yearDateDay: number;
    yearDateMonth: number;
  }[];
  taskRepeatDayCheck?: {
    trackerId: number;
    date: string;
    newDate?: string;
    checked?: boolean;
    note?: string;
    moneyIncomeFact?: number;
    moneyOutcomeFact?: number;
    deadline?: string;
  }[];
}

export type DeleteTaskDto = {
  id: number;
};

export type DeleteTaskInDateDto = {
  id: number;
  date: number;
};

export enum tasksType {
  all,
  outcome,
  income,
  food,
  trackers,
  notTrackers,
}

export type GetDayTasksDto = {
  date: string;
  type: tasksType;
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
  isLoading?: boolean;
  isCreateMode?: boolean;
  error?: string;
}
