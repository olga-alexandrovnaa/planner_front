/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DayTasksListSchema } from "../..";
import { fetchList } from "../services/fetchList";
import { ListTask } from "../types/dayTasksListSchema";
import { deleteTask } from "../services/deleteTaskInDate";
import { removeTaskCheck } from "../services/removeTaskCheck";
import { setTaskCheck } from "../services/setTaskCheck";
const initialState: DayTasksListSchema = {
  list: [],
  isLoading: false,
};

const dayTasksListSlice = createSlice({
  name: "dayTasksList",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchList.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(fetchList.fulfilled, (state, action: PayloadAction<ListTask[]>) => {
        state.list = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchList.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<{ id: number, res: boolean }>) => {
        if (action.payload.res) {
          state.list = state.list.filter((e) => e.id !== action.payload.id);
        }
        state.isLoading = false;
      })

      .addCase(removeTaskCheck.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeTaskCheck.fulfilled, (state, action: PayloadAction<{ id: number, res: boolean }>) => {
        if (action.payload.res) {
          const item = state.list.find((e) => e.id === action.payload.id);
          item.checked = false;
        }
        state.isLoading = false;
      })

      .addCase(setTaskCheck.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setTaskCheck.fulfilled, (state, action: PayloadAction<{ id: number, res: boolean }>) => {
        if (action.payload.res) {
          const item = state.list.find((e) => e.id === action.payload.id);
          item.checked = true;
        }
        state.isLoading = false;
      })
  },
});

export const { actions: dayTasksListActions } = dayTasksListSlice;
export const { reducer: dayTasksListReducer } = dayTasksListSlice;
