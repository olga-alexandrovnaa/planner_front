/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DayTasksListSchema } from "../..";
const initialState: DayTasksListSchema = {
  list: [],
  isLoading: false,
};

const dayTasksListSlice = createSlice({
  name: "dayTasksList",
  initialState,
  reducers: {
    // setUserName: (state, action: PayloadAction<string>) => {
    //   state.userName = action.payload;
    // },
    // setPassword: (state, action: PayloadAction<string>) => {
    //   state.password = action.payload;
    // },
    // setPasswordConfirm: (state, action: PayloadAction<string>) => {
    //   state.passwordConfirm = action.payload;
    // },
    // setName: (state, action: PayloadAction<string>) => {
    //   state.name = action.payload;
    // },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(loginByUserName.pending, (state) => {
  //       state.error = undefined;
  //       state.isLoading = true;
  //     })
  //     .addCase(loginByUserName.fulfilled, (state) => {
  //       state.isLoading = false;
        
  //     })
  //     .addCase(loginByUserName.rejected, (state, action: any) => {
  //       state.isLoading = false;
  //       state.error = action.payload;
  //     })
  // },
});

export const { actions: dayTasksListActions } = dayTasksListSlice;
export const { reducer: dayTasksListReducer } = dayTasksListSlice;
