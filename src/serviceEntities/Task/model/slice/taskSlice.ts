/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getISOWeeksInYear, getYear} from 'date-fns'
import { getYearWeekNumber } from "@/sharedComponents/lib/helpers/getYearWeekNumber";
import { TaskSchema } from "../types/task";

const initialState: TaskSchema = {
  data: null,
  form: null,
  isCreating: false,
  isLoading: false,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    // setShowedYear: (state, action: PayloadAction<number>) => {
    //   state.showedYear = action.payload;
    // },
  },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginByUserName.pending, (state) => {
//         state.error = undefined;
//         state.isLoading = true;
//       })
//       .addCase(loginByUserName.fulfilled, (state) => {
//         state.isLoading = false;
        
//       })
//       .addCase(loginByUserName.rejected, (state, action: any) => {
//         state.isLoading = false;
//         state.error = action.payload;
//       })
//   },

});

export const { actions: taskActions } = taskSlice;
export const { reducer: taskReducer } = taskSlice;
