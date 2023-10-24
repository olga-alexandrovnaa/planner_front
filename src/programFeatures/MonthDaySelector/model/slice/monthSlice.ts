/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MonthSchema } from "../types/monthSchema";
import { getMonth, getYear } from 'date-fns'

const initialState: MonthSchema = {
  selectedDay: new Date(),
  showedMonthNumber: getMonth(new Date()), //0-11
  showedYear: getYear(new Date()),
};

const monthSlice = createSlice({
  name: "month",
  initialState,
  reducers: {
    setSelectedDay: (state, action: PayloadAction<Date>) => {
      state.selectedDay = action.payload;
      state.showedMonthNumber = getMonth(action.payload);
      state.showedYear = getYear(action.payload);
    },
    setShowedMonthNumber: (state, action: PayloadAction<number>) => {
      state.showedMonthNumber = action.payload;
    },
    setShowedYear: (state, action: PayloadAction<number>) => {
      state.showedYear = action.payload;
    },
  },

});

export const { actions: monthActions } = monthSlice;
export const { reducer: monthReducer } = monthSlice;
