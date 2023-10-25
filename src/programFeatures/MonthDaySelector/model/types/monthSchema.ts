export interface MonthSchema {
  selectedDay: Date;
  showedMonthNumber: number;
  showedYear: number;
}

export type YearMonth = {
  monthIndex: number;
  name: string;
  weeks: MonthWeek[];
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
};
