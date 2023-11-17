import { FC, lazy } from 'react';
import { ProductFormProps } from './ProductForm';

export const ProductFormAsync = lazy<FC<ProductFormProps>>(
    () => import('./ProductForm'),
);
