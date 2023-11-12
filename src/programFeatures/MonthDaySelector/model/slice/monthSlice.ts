/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Holiday, MoneyInfo, MonthSchema, TaskProgressItem, TaskShort } from "../types/monthSchema";
import { getMonth, getYear } from 'date-fns'
import { fetchTrackers } from "../services/fetchTrackers";
import { fetchTrackerProgress } from "../services/fetchTrackerProgress";
import { fetchMonthWalletInfo } from "../services/fetchMonthWalletInfo";
import { editMonthMoneyInfo } from "../services/editMonthMoneyInfo";

const initialState: MonthSchema = {
  selectedDay: new Date(),
  showedMonthNumber: getMonth(new Date()), //0-11
  showedYear: getYear(new Date()),
  holidays: [],
  currentSelectedTracker: null,
  trackerProgressInfo: [],
  userTrackers: [],
  investment: 0,
  remainder: 0,
  moneyInfo: null,
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
    },


    setCurrentSelectedTracker: (state, action: PayloadAction<TaskShort>) => {
      state.currentSelectedTracker = action.payload;
    },
    setRemainder: (state, action: PayloadAction<number>) => {
      state.remainder = action.payload;
    },
    setInvestment: (state, action: PayloadAction<number>) => {
      state.investment = action.payload;
    },

  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTrackers.pending, (state) => {
        state.userTrackers = [];
      })
      .addCase(fetchTrackers.fulfilled, (state, action: PayloadAction<TaskShort[]>) => {
        state.userTrackers = action.payload;
      })

      .addCase(fetchTrackerProgress.pending, (state) => {
        state.trackerProgressInfo = [];
      })
      .addCase(fetchTrackerProgress.fulfilled, (state, action: PayloadAction<TaskProgressItem[]>) => {
        state.trackerProgressInfo = action.payload;
      })

      .addCase(fetchMonthWalletInfo.pending, (state) => {
        state.moneyInfo = null;
      })
      .addCase(fetchMonthWalletInfo.fulfilled, (state, action: PayloadAction<MoneyInfo>) => {
        state.moneyInfo = action.payload;
        state.remainder = action.payload.startRemainder;
        state.investment = action.payload.investSum;
      })

  },

},
);

export const { actions: monthActions } = monthSlice;
export const { reducer: monthReducer } = monthSlice;
