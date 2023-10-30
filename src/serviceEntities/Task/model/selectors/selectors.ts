import { StateSchema } from "@/app/providers/StoreProvider";
import { createSelector } from "@reduxjs/toolkit";
import { CreateTaskDto, UpdateTaskDto } from "../types/task";
import { isArray, isObject } from "lodash";

export const getTask = (state: StateSchema) => state.task;
export const getTaskData = (state: StateSchema) => state.task?.data;
export const getTaskForm = (state: StateSchema) => state.task?.form;
export const getTaskId = (state: StateSchema) => state.task?.id;
export const getTaskCreateMode = (state: StateSchema) => state.task?.isCreateMode;
export const getTaskIsLoading = (state: StateSchema) => state.task?.isLoading;
export const getTaskError = (state: StateSchema) => state.task?.error;

export const getTaskIdForService = createSelector(getTaskId, (id) => {
    return id;
});

export const getCreateTaskDtoForService = createSelector(getTask, (data): { id: number, dto:  CreateTaskDto } => {
    return {
        id: data.id,
        dto: data.form,
    };
});

export const getUpdateTaskDtoForService = createSelector(getTask, (data): { id: number, dto: UpdateTaskDto } => {
    if(!data || !data.data || !data.form) return;

    const loaded = data.data;
    const changed = data.form;

    const dto: UpdateTaskDto = {
        id: loaded.id,
    };

    const compare = (l: any, c: any, level = 1) => () => {
        for (const [k , v] of Object.entries(l)) {
            if(!isObject(v) && l[k] === c[k]){
                return false;
            }
            if(!isObject(v) && l[k] !== c[k]){
                dto[k] = c[k];
                return true;
            } else if (isArray(v)) {
                if(v.length !== c[k].length){
                    if(level === 1){
                        dto[k] = c[k];
                    }
                    return true;
                }
                for (const i of v) {
                    const res = compare(i, c[k][i], level + 1);
                    if(res && level === 1){
                        dto[k] = c[k];
                    }
                    return res;
                }
            } else {
                const res = compare(v, c[k], level + 1);
                if(res && level === 1){
                    dto[k] = c[k];
                }
                return res;
            }
        }
    }

    compare(loaded, changed);

    return {
        id: data.id,
        dto: dto,
    };
});