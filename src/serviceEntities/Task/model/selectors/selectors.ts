import { StateSchema } from "@/app/providers/StoreProvider";
import { createSelector } from "@reduxjs/toolkit";
import { CreateTaskDto, UpdateTaskDto } from "../types/task";
import { isArray, isObject } from "lodash";

export const getTask = (state: StateSchema) => state.task;
export const getTaskData = (state: StateSchema) => state.task?.data;
export const getTaskForm = (state: StateSchema) => state.task?.form;
export const getTaskFormRepeatDaysForChanging = (state: StateSchema) => state.task?.formRepeatDays;
export const getTaskFormRepeatYearDaysForChanging = (state: StateSchema) => state.task?.formRepeatIfYearIntervalDays;
export const getTaskFormIntervalLength = (state: StateSchema) => state.task?.form.intervalLength;
export const getTaskFormIntervalPart = (state: StateSchema) => state.task?.form.intervalPart;
export const getTaskFormRepeatDays = (state: StateSchema) => state.task?.form?.repeatDays;
export const getTaskFormRepeatYearDays = (state: StateSchema) => state.task?.form?.repeatIfYearIntervalDays;
export const getTaskId = (state: StateSchema) => state.task?.id;
export const getTaskCreateMode = (state: StateSchema) => state.task?.isCreateMode;
export const getTaskIsLoading = (state: StateSchema) => state.task?.isLoading;
export const getTaskError = (state: StateSchema) => state.task?.error;

export const getTaskIdForService = createSelector(getTaskId, (id) => {
  return id;
});

export const getCreateTaskDtoForService = createSelector(getTask, (data): { id: number, dto: CreateTaskDto } => {

  if (!data || !data.isCreateMode || !data.form) return;

  const dto: CreateTaskDto = {};

  for (const [k, v] of Object.entries(data.form)) {
    if (v !== null) {
      dto[k] = v;
    }
  }

  return {
    id: data.id,
    dto: dto,
  };
});

export const getUpdateTaskDtoForService = createSelector(getTask, (data) => {
  if (!data || !data.data || !data.form) return;

  const loaded = data.data;
  const changed = data.form;

  const dto: UpdateTaskDto = {
    id: loaded.id,
  };

  const compare =
    (l: any, c: any, level = 1): boolean => {
      let found = false;
      if (!l || !c) return false;
      for (const [k, v] of Object.entries(l)) {
        if (!isObject(v) && l[k] === c[k]) {
          continue;
        }
        if (!isObject(v) && l[k] !== c[k]) {
          if (level === 1) {
            dto[k] = c[k];
          }
          found = true;
          continue;
        } else if (isArray(v)) {
          if (v.length !== c[k].length) {
            found = true;
            if (level === 1) {
              dto[k] = c[k];
            }
            continue;
          }
          for (let i = 0; i < v.length; i++) {
            found = compare(v[i], c[k][i], level + 1);
            if (found && level === 1) {
              dto[k] = c[k];
            }
            if (found) {
              continue;
            }
          }
        } else {
          found = compare(v, c[k], level + 1);
          if (found && level === 1) {
            dto[k] = c[k];
          }
          if (found) {
            continue;
          }
        }
      }
      return found;
    };

  compare(loaded, changed);

  return {
    id: data.id,
    dto: dto,
  };
});