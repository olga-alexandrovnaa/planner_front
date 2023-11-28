/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BuyingsListSchema } from "../..";
import { fetchList } from "../services/fetchList";
import { ListBuying } from "../types/buyingsListSchema";
import { fetchOutcomeTypes } from "../services/fetchOutcomeTypes";
import { IncomeOutcomeType } from "@/serviceEntities/Task/model/types/task";

const initialState: BuyingsListSchema = {
  list: [],
  isLoading: false,
  outcomeTypes: [],
};

const buyingsListSlice = createSlice({
  name: "buyingsList",
  initialState,
  reducers: {
    changeCheck: (state, action) => {
      const data = state.list.find((e) => e.id === action.payload);
      if (data) {
        data.checked = !data.checked
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchList.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
        state.list = []
      })
      .addCase(fetchList.fulfilled, (state, action: PayloadAction<ListBuying[]>) => {
        state.list = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchList.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchOutcomeTypes.pending, (state) => {
        state.outcomeTypes = [];
      })
      .addCase(fetchOutcomeTypes.fulfilled, (state, action: PayloadAction<IncomeOutcomeType[]>) => {
        state.outcomeTypes = action.payload;
      })

  },
});

export const { actions: buyingsListActions } = buyingsListSlice;
export const { reducer: buyingsListReducer } = buyingsListSlice;
