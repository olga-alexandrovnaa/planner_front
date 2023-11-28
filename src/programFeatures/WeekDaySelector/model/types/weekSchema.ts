import { Product } from "@/serviceEntities/Product/model/types/product";

export interface WeekSchema {
  selectedDay: Date;
  showedWeekNumber: number;
  showedYear: number;
  allIngredients: AllIngredient[];
  allIngredientsStart: string;
  allIngredientsEnd: string;
  holidays: Holiday[];
}

export type DayNote = {
  userId: number;
  date: string;
  note: string;
}

export type AllIngredient = {
  product: Product;
  count: number;
  countInPack: number;
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