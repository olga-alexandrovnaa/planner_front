import { FC, lazy } from 'react';
import { DayTasksListFormProps } from './DayTasksListForm';

export const DayTasksListFormAsync = lazy<FC<DayTasksListFormProps>>(
    () => import('./DayTasksListForm'),
);
