/* eslint-disable max-len */

import { StateSchema } from "@/app/providers/StoreProvider";

export const getDayTasks = (state: StateSchema) => state.dayTasks.list;
export const getDayTasksIsLoading = (state: StateSchema) => state.dayTasks?.isLoading;
export const getDayTasksError = (state: StateSchema) => state.dayTasks?.error;
