/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IntervalType, MoveTypeIfDayNotExists, TaskExt, TaskSchema, WeekNumber } from "../types/task";
import { fetchTask } from "../services/fetch";
import { create } from "../services/create";
import { update } from "../services/update";
import { getWeekDayNumber } from "@/sharedComponents/lib/helpers/getWeekDayNumber";

const initialState: TaskSchema = {
  data: null,
  form: null,
  id: null,
  isLoading: false,
  isCreateMode: false,
  formRepeatDays: [],
  formRepeatIfYearIntervalDays: []
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    setCreateMode: (state, action: PayloadAction<{ date: string, isFood?: boolean }>) => {
      state.isCreateMode = true;
      state.form = {
        id: 0,
        date: action.payload.date,
        isDeleted: false,
        isFood: action.payload.isFood,
        isTracker: false,
        name: '',
        intervalLength: null,
        intervalPart: null,
        moneyIncomePlan: null,
        moneyOutcomePlan: null,
        recipe: null,
        repeatCount: null,
        ingredients: [],
        repeatDays: [],
        repeatIfYearIntervalDays: [],
        taskRepeatDayCheck: [{
          id: 0,
          checked: false,
          date: action.payload.date,
          isDeleted: false,
          trackerId: 0,
          deadline: null,
          moneyIncomeFact: null,
          moneyOutcomeFact: null,
          newDate: null,
          note: '',
        }]
      }
    },
    onChangeName: (state, action: PayloadAction<string>) => {
      state.form.name = action.payload;
    },
    onChangeIsTracker: (state, action: PayloadAction<boolean>) => {
      state.form.isTracker = action.payload;
      state.form.intervalLength = 1;
      state.form.intervalPart = IntervalType.Day;
    },
    onChangeIntervalLength: (state, action: PayloadAction<number>) => {
      state.form.intervalLength = action.payload;

      if (state.form.intervalPart === IntervalType.Year) {
        if (state.form.repeatIfYearIntervalDays.length > action.payload) {
          state.form.repeatIfYearIntervalDays = state.form.repeatIfYearIntervalDays
            .filter((e) => e.intervalPartIndex <= action.payload)
        }

      } else if (state.form.intervalPart !== IntervalType.Day) {
        if (state.form.repeatDays.length > action.payload) {
          state.form.repeatDays = state.form.repeatDays
            .filter((e) => e.intervalPartIndex <= action.payload)
        }
      }
    },
    onChangeIntervalPart: (state, action: PayloadAction<IntervalType>) => {
      state.form.intervalPart = action.payload;
      state.form.repeatDays = [];
      state.form.repeatIfYearIntervalDays = [];

      if (action.payload === IntervalType.Year) {
        state.form.repeatIfYearIntervalDays.push({
          id: 0,
          intervalPartIndex: 1,
          trackerId: state.form.id,
          yearDateDay: (new Date(state.form.date)).getDate(),
          yearDateMonth: (new Date(state.form.date)).getMonth(),
        })
      } else if (action.payload !== IntervalType.Day) {
        state.form.repeatDays.push({
          id: 0,
          intervalPartIndex: 1,
          trackerId: state.form.id,
          weekDayNumber: null,
          weekNumber: null,
          moveTypeIfDayNotExists: null,
          dayFromBeginningInterval: action.payload === IntervalType.Month
            ? (new Date(state.form.date)).getDate()
            : getWeekDayNumber(new Date(state.form.date))
        })
      }
    },
    onChangeRepeatCount: (state, action: PayloadAction<number | undefined>) => {
      state.form.repeatCount = action.payload ? action.payload : null;
    },
    onChangeMoneyIncomePlan: (state, action: PayloadAction<number | undefined>) => {
      state.form.moneyIncomePlan = action.payload ? action.payload : null;
    },
    onChangeMoneyOutcomePlan: (state, action: PayloadAction<number | undefined>) => {
      state.form.moneyOutcomePlan = action.payload ? action.payload : null;
    },
    onChangeMoneyIncomeFact: (state, action: PayloadAction<number | undefined>) => {
      if (state.form.taskRepeatDayCheck.length)
        state.form.taskRepeatDayCheck[0].moneyIncomeFact = action.payload ? action.payload : null;
    },
    onChangeMoneyOutcomeFact: (state, action: PayloadAction<number | undefined>) => {
      if (state.form.taskRepeatDayCheck.length)
        state.form.taskRepeatDayCheck[0].moneyOutcomeFact = action.payload ? action.payload : null;
    },
    onChangeMoneyDeadline: (state, action: PayloadAction<string | undefined>) => {
      if (state.form.taskRepeatDayCheck.length)
        state.form.taskRepeatDayCheck[0].deadline = action.payload ? action.payload : null;
    },
    onChangeNote: (state, action: PayloadAction<string | undefined>) => {
      if (state.form.taskRepeatDayCheck.length)
        state.form.taskRepeatDayCheck[0].note = action.payload ? action.payload : null;
    },



    setDaysForChanging: (state) => {
      state.formRepeatDays = JSON.parse(JSON.stringify(state.form.repeatDays));
    },
    setYearDaysForChanging: (state) => {
      state.formRepeatIfYearIntervalDays = JSON.parse(JSON.stringify(state.form.repeatIfYearIntervalDays));
    },

    onChangeDays: (state, action: PayloadAction<{ intervalIndex: number, dayNumber: number, moveTypeIfDayNotExists: MoveTypeIfDayNotExists | null }>) => {
      const arr = state.formRepeatDays
        .filter((e) => e.intervalPartIndex === action.payload.intervalIndex)
        .map(e => e.dayFromBeginningInterval);

      if (arr.includes(action.payload.dayNumber)) {
        state.formRepeatDays = state.formRepeatDays
          .filter((e) => !(e.intervalPartIndex === action.payload.intervalIndex
            && e.dayFromBeginningInterval === action.payload.dayNumber))
      } else {
        state.formRepeatDays = [
          ...state.formRepeatDays,
          {
            id: 0,
            trackerId: state.form.id,
            dayFromBeginningInterval: action.payload.dayNumber,
            intervalPartIndex: action.payload.intervalIndex,
            moveTypeIfDayNotExists: action.payload.moveTypeIfDayNotExists,
            weekDayNumber: null,
            weekNumber: null,
          },
        ];
      }
    },
    onChangeMonthWeekDays: (state, action: PayloadAction<{
      intervalIndex: number,
      weekDayNumber: number,
      weekNumber: WeekNumber,
      moveTypeIfDayNotExists: MoveTypeIfDayNotExists | null,
      isDelete: boolean
    }>) => {
      if (action.payload.isDelete) {
        state.formRepeatDays = state.formRepeatDays
          .filter((e) => !(e.intervalPartIndex === action.payload.intervalIndex
            && e.weekNumber === action.payload.weekNumber
            && e.weekDayNumber === action.payload.weekDayNumber
          ))
      } else {
        state.formRepeatDays = [
          ...state.formRepeatDays,
          {
            id: 0,
            trackerId: state.form.id,
            dayFromBeginningInterval: null,
            intervalPartIndex: action.payload.intervalIndex,
            moveTypeIfDayNotExists: action.payload.moveTypeIfDayNotExists,
            weekDayNumber: action.payload.weekDayNumber,
            weekNumber: action.payload.weekNumber,
          },
        ];
      }
    },
    onChangeYearDays: (state, action: PayloadAction<{
      intervalIndex: number,
      dayNumber: number,
      monthNumber: number,
      moveTypeIfDayNotExists: MoveTypeIfDayNotExists | null,
      isDelete: boolean
    }>) => {
      if (action.payload.isDelete) {
        state.formRepeatIfYearIntervalDays = state.formRepeatIfYearIntervalDays
          .filter((e) => !(e.intervalPartIndex === action.payload.intervalIndex
            && e.yearDateDay === action.payload.dayNumber && e.yearDateMonth === action.payload.monthNumber))
      } else {
        state.formRepeatIfYearIntervalDays = [
          ...state.formRepeatIfYearIntervalDays,
          {
            id: 0,
            trackerId: state.form.id,
            intervalPartIndex: action.payload.intervalIndex,
            moveTypeIfDayNotExists: action.payload.moveTypeIfDayNotExists,
            yearDateDay: action.payload.dayNumber,
            yearDateMonth: action.payload.monthNumber,
          },
        ];
      }
    },



    onSaveDays: (state) => {
      state.form.repeatDays = JSON.parse(JSON.stringify(state.formRepeatDays));
    },
    onSaveYearDays: (state) => {
      state.form.repeatIfYearIntervalDays = JSON.parse(JSON.stringify(state.formRepeatIfYearIntervalDays));
    },


  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTask.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(fetchTask.fulfilled, (state, action: PayloadAction<TaskExt>) => {
        state.isLoading = false;
        state.data = JSON.parse(JSON.stringify(action.payload))
        state.form = JSON.parse(JSON.stringify(action.payload))
      })
      .addCase(fetchTask.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(create.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(create.fulfilled, (state, action: PayloadAction<TaskExt>) => {
        state.isLoading = false;
        if (action.payload === null) return;
        state.data = JSON.parse(JSON.stringify(action.payload))
        state.form = JSON.parse(JSON.stringify(action.payload))
      })
      .addCase(create.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(update.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(update.fulfilled, (state, action: PayloadAction<TaskExt>) => {
        state.isLoading = false;
        if (action.payload === null) return;
        state.data = JSON.parse(JSON.stringify(action.payload))
        state.form = JSON.parse(JSON.stringify(action.payload))
      })
      .addCase(update.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      })
  },

});

export const { actions: taskActions } = taskSlice;
export const { reducer: taskReducer } = taskSlice;
