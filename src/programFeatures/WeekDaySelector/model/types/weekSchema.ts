export interface WeekSchema {
  selectedDay: Date;
  showedWeekNumber: number;
  showedYear: number;
  holidays: Holiday[];
}

export type WeekDay = {
  day: number, 
  date: string, 
  shortName: string, 
  isSelected: boolean,
  isCurrent: boolean,
  isDayOff: boolean,
  holiday?: Holiday,
};

export type Holiday = {
  "date": Date,
  "type_text": string,
  "note": string,
  "week_day": string,
  "working_hours": number
}