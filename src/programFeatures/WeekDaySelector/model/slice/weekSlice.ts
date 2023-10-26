/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Holiday, WeekSchema } from "../types/weekSchema";
import { getISOWeeksInYear, getYear} from 'date-fns'
import { getYearWeekNumber } from "@/sharedComponents/lib/helpers/getYearWeekNumber";

const initialState: WeekSchema = {
  selectedDay: new Date(),
  showedWeekNumber: getYearWeekNumber(new Date()), 
  showedYear: getYear(new Date()),
  holidays: []
};

const weekSlice = createSlice({
  name: "week",
  initialState,
  reducers: {
    setSelectedDay: (state, action: PayloadAction<Date>) => {
      state.selectedDay = action.payload;
      state.showedWeekNumber = getYearWeekNumber(action.payload);
      state.showedYear = getYear(action.payload);
    },
    // setShowedWeekNumber: (state, action: PayloadAction<number>) => {
    //   state.showedWeekNumber = action.payload;
    // },
    // setShowedYear: (state, action: PayloadAction<number>) => {
    //   state.showedYear = action.payload;
    // },

    showNextWeek: (state) => {
      const yearWeeksCount = getISOWeeksInYear(new Date(state.showedYear, 0, 1));
      if (state.showedWeekNumber === yearWeeksCount) {
        state.showedWeekNumber = 1;
        state.showedYear = state.showedYear + 1;
      } else {
        state.showedWeekNumber = state.showedWeekNumber + 1;
      }
    },
    showLastWeek: (state) => {
      const yearFirstWeek = getYearWeekNumber(new Date(state.showedYear, 0, 1));
      const lastYearLastWeek = getISOWeeksInYear(new Date(state.showedYear - 1, 0, 1));

      if (state.showedWeekNumber === yearFirstWeek) {
        state.showedWeekNumber = lastYearLastWeek;
        state.showedYear = state.showedYear - 1;
      }
      if (state.showedWeekNumber === 1) {
        state.showedWeekNumber = yearFirstWeek;
        state.showedYear = state.showedYear - 1;
      } else {
        state.showedWeekNumber = state.showedWeekNumber - 1;
      }
    },

    setHolidays: (state, action: PayloadAction<Holiday[]>) => {
      state.holidays = action.payload;
    }
  },

});

export const { actions: weekActions } = weekSlice;
export const { reducer: weekReducer } = weekSlice;
