import { FC, lazy } from 'react';
import { TaskFormProps } from './TaskForm';

export const TaskFormAsync = lazy<FC<TaskFormProps>>(
    () => import('./TaskForm'),
);
