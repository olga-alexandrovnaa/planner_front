import {
  AnyAction, CombinedState, EnhancedStore, Reducer, ReducersMapObject,
} from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { LoginSchema } from '@/programFeatures/Auth';
import { rtkApi } from '@/sharedComponents/api/rtkApi';
import { UserSchema } from '@/serviceEntities/User';
import { WeekSchema } from '@/programFeatures/WeekDaySelector';
import { TaskSchema } from '@/serviceEntities/Task';
import { MonthSchema } from '@/programFeatures/MonthDaySelector';
import { DayTasksListSchema } from '@/programFeatures/DayTasksList';
import { ProductSchema } from '@/serviceEntities/Product';
import { BuyingsListSchema } from '@/programFeatures/BuyingsList';

export interface StateSchema {
  user: UserSchema;
  [rtkApi.reducerPath]: ReturnType<typeof rtkApi.reducer>;

  // Асинхронные редюсеры
  loginForm?: LoginSchema;
  monthForm?: MonthSchema;
  weekForm?: WeekSchema;
  task?: TaskSchema;
  dayTasks?: DayTasksListSchema;
  product?: ProductSchema;
  buyings?: BuyingsListSchema;
}

export type StateSchemaKey = keyof StateSchema;
export type MountedReducers = OptionalRecord<StateSchemaKey, boolean>;

export interface ReducerManager {
  getReducerMap: () => ReducersMapObject<StateSchema>;
  reduce: (
    state: StateSchema,
    action: AnyAction,
  ) => CombinedState<StateSchema>;
  add: (key: StateSchemaKey, reducer: Reducer) => void;
  remove: (key: StateSchemaKey) => void;
  // true - вмонтирован, false - демонтирован
  getMountedReducers: () => MountedReducers;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
  reducerManager: ReducerManager;
}

export interface ThunkExtraArg {
  api: AxiosInstance;
}

export interface ThunkConfig<T> {
  rejectValue: T;
  extra: ThunkExtraArg;
  state: StateSchema;
}
