import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { getProductIdForService } from '../selectors/selectors';
import { Food } from '../types/product';

export const fetchProduct = createAsyncThunk<
    Food,
    undefined,
    ThunkConfig<string>
>('product/fetchProduct', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const id = getProductIdForService(getState());

    try {
        const responseData = await $api(__API__ + `products/food/${id}`, { method: "GET" });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
