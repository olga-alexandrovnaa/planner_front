import { FC, lazy } from 'react';
import { BuyingsListFormProps } from './BuyingsListForm';

export const BuyingsListFormAsync = lazy<FC<BuyingsListFormProps>>(
    () => import('./BuyingsListForm'),
);
