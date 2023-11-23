import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { Product } from '../types/product';

export const fetchProductsByType = createAsyncThunk<
    Product[],
    number,
    ThunkConfig<string>
>('product/fetchProductsByType', async (type, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
        const responseData = await $api(__API__ + `tasks/productsByType/${type}`, { method: "GET" });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
