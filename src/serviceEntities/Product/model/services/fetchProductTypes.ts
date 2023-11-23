import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { ProductType } from '../types/product';

export const fetchProductTypes = createAsyncThunk<
    ProductType[],
    undefined,
    ThunkConfig<string>
>('product/fetchProductTypes', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
        const responseData = await $api(__API__ + `tasks/productTypes`, { method: "GET" });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
