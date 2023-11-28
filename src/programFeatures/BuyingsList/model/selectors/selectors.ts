/* eslint-disable max-len */

import { StateSchema } from "@/app/providers/StoreProvider";

export const getBuyingsListForm = (state: StateSchema) => state.buyings;
export const getBuyingsListList = (state: StateSchema) => state.buyings?.list;
export const getBuyingsListCheckedList = (state: StateSchema) => state.buyings?.list.filter((e) => e.checked);
export const getBuyingsListOutcomeTypes = (state: StateSchema) => state.buyings?.outcomeTypes;
export const getBuyingsListIsLoading = (state: StateSchema) => state.buyings?.isLoading;
export const getBuyingsListError = (state: StateSchema) => state.buyings?.error;

