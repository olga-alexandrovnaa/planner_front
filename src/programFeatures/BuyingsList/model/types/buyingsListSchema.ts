import { IncomeOutcomeType } from "@/serviceEntities/Task/model/types/task";

export type ListBuying = {
  id: number;
  userId: number;
  note: string;
  checked: boolean;
};

export type UpdateBuyingDTO = {
  note: string;
  checked: boolean;
};

export type CreateBuyingDTO = {
  note: string;
};


export interface BuyingsListSchema {
  list: ListBuying[];
  outcomeTypes: IncomeOutcomeType[]
  isLoading: boolean;
  error?: string;
}
