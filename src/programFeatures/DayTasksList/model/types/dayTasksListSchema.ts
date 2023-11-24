import { foodType } from "@/serviceEntities/Product/model/types/product";
import { IntervalType, modeType } from "@/serviceEntities/Task";

export type ListTask = {
  id: number;
  name: string;
  isTracker: boolean;
  intervalPart: IntervalType | null;
  intervalLength: number | null;
  repeatCount: number | null;
  moneyIncome: number | null;
  moneyOutcome: number | null;
  isFood: boolean;
  checked: boolean;
  deadline: string | null;

  foodId: number | null;
  food: {
    id: number;
    name: string;
    proteins: number | null;
    fats: number | null;
    carbohydrates: number | null;
    calories: number | null;
    foodType: foodType | null;
  } | null;
  foodCountToPrepare: number | null;
  foodCout: number | null;
};

export interface DayTasksListSchema {
  list: ListTask[];
  isLoading: boolean;
  error?: string;
}
