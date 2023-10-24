import { FC, lazy } from 'react';
import { MonthFormProps } from './MonthForm';

export const MonthFormAsync = lazy<FC<MonthFormProps>>(
    () => import('./MonthForm'),
);
