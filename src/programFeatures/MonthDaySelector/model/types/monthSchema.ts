export interface MonthSchema {
  selectedDay: Date;
  showedMonthNumber: number;
  showedYear: number;
}

export type MonthWeek = {
  weekNumber: number;
  weekIndex: number;
  days: (MonthDay | null)[];
};

export type MonthDay = {
  day: number;
  date: Date;
  isSelected: boolean;
};
