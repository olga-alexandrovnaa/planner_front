/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskExt, TaskSchema } from "../types/task";
import { fetchTask } from "../services/fetch";
import { create } from "../services/create";
import { update } from "../services/update";

const initialState: TaskSchema = {
  data: null,
  form: null,
  id: null,
  isLoading: false,
  isCreateMode: false,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    setCreateMode: (state, action: PayloadAction<{date: string, isFood?: string}>) => {
      state.isCreateMode = true;
      state.form = {
        id: 0,
        date: action.payload.date,
        isDeleted: false,
        isFood: !!action.payload.isFood,
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
        if(action.payload === null) return;
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
        if(action.payload === null) return;
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
