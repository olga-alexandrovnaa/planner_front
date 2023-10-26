/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Holiday, MonthSchema } from "../types/monthSchema";
import { getMonth, getYear } from 'date-fns'

const initialState: MonthSchema = {
  selectedDay: new Date(),
  showedMonthNumber: getMonth(new Date()), //0-11
  showedYear: getYear(new Date()),
  holidays: [],
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
    // setShowedYear: (state, action: PayloadAction<number>) => {
    //   state.showedYear = action.payload;
    // },
    
    showNextYear: (state) => {
      state.showedYear = state.showedYear + 1;
    },
    showLastYear: (state) => {
      state.showedYear = state.showedYear - 1;
    },

    showNextMonth: (state) => {
      if (state.showedMonthNumber === 11) {
        state.showedMonthNumber = 0;
        state.showedYear = state.showedYear + 1;
      } else {
        state.showedMonthNumber = state.showedMonthNumber + 1;
      }
    },
    showLastMonth: (state) => {
      if (state.showedMonthNumber === 0) {
        state.showedMonthNumber = 11;
        state.showedYear = state.showedYear - 1;
      } else {
        state.showedMonthNumber = state.showedMonthNumber - 1;
      }
    },
    setHolidays: (state, action: PayloadAction<Holiday[]>) => {
        state.holidays = action.payload;
      }
    },
  },
);

export const { actions: monthActions } = monthSlice;
export const { reducer: monthReducer } = monthSlice;
