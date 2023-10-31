/* eslint-disable max-len */

import { StateSchema } from "@/app/providers/StoreProvider";
import { createSelector } from "@reduxjs/toolkit";

export const getDayTasks = (state: StateSchema) => state.dayTasks;
export const getDayTasksList = (state: StateSchema) => state.dayTasks?.list;
export const getDayTasksType = (state: StateSchema) => state.dayTasks?.type;
export const getDayTasksDate = (state: StateSchema) => state.dayTasks?.date;
export const getDayTasksIsLoading = (state: StateSchema) => state.dayTasks?.isLoading;
export const getDayTasksError = (state: StateSchema) => state.dayTasks?.error;

export const getDayTasksDayAndTypeForService = createSelector(getDayTasks, (data) => {
    return { date: data.date, type: data.type };
});