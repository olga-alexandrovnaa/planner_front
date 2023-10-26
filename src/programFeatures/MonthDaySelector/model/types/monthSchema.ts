export interface MonthSchema {
  selectedDay: Date;
  showedMonthNumber: number;
  showedYear: number;
  holidays: Holiday[];
}

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
