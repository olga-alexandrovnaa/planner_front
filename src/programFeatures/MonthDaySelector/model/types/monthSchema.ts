export interface MonthSchema {
  selectedDay: Date;
  showedMonthNumber: number;
  showedYear: number;
  holidays: Holiday[];

  remainder: number;
  investment: number;
  moneyInfo: MoneyInfo;

  userTrackers: TaskShort[];
  currentSelectedTracker: TaskShort;
  trackerProgressInfo: TaskProgressItem[];
}
export type MoneyInfoDaysItem = {
  date: string;
  income: number;
  outcome: number;
  remainder: number;
}

export type MoneyInfo = {
  startRemainder: number;
  investSum: number;
  endRemainder: number;
  days: MoneyInfoDaysItem[];
}

export type TaskProgressItem = {
  date: string;
  planed: boolean;
  checked: boolean;
};

export type TaskShort = {
  id: number;
  name: string;
  isFood: boolean;
  isMoney: boolean;
};

export type YearMonth = {
  monthIndex: number;
  name: string;
  weeks: MonthWeek[];
  isSelected: boolean;
};

export type MonthWeek = {
  weekNumber: number;
  weekIndex: number;
  days: (MonthDay | null)[];
};

export type MonthDay = {
  day: number;
  date: string;
  isSelected: boolean;
  isCurrent: boolean;
  isDayOff: boolean;
  holiday?: Holiday,
};


export type Holiday = {
  "date": Date,
  "type_text": string,
  "note": string,
  "week_day": string,
  "working_hours": number
}
