/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WeekSchema } from "../types/weekSchema";
import { getWeek, getYear} from 'date-fns'
import { ru } from 'date-fns/locale'

const initialState: WeekSchema = {
  selectedDay: new Date(),
  showedWeekNumber: getWeek(new Date(), {locale: ru }), 
  showedYear: getYear(new Date()),
};

const weekSlice = createSlice({
  name: "week",
  initialState,
  reducers: {
    setSelectedDay: (state, action: PayloadAction<Date>) => {
      state.selectedDay = action.payload;
      state.showedWeekNumber = getWeek(action.payload);
      state.showedYear = getYear(action.payload);
    },
    setShowedWeekNumber: (state, action: PayloadAction<number>) => {
      state.showedWeekNumber = action.payload;
    },
    setShowedYear: (state, action: PayloadAction<number>) => {
      state.showedYear = action.payload;
    },
  },

});

export const { actions: weekActions } = weekSlice;
export const { reducer: weekReducer } = weekSlice;
