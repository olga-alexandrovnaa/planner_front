import { FC, lazy } from 'react';
import { WeekFormProps } from './WeekForm';

export const WeekFormAsync = lazy<FC<WeekFormProps>>(
    () => import('./WeekForm'),
);
