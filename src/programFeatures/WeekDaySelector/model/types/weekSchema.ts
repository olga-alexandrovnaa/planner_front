export interface WeekSchema {
  selectedDay: Date;
  showedWeekNumber: number;
  showedYear: number;
}

export type WeekDay = {day: number, date: string, shortName: string, isSelected: boolean};
