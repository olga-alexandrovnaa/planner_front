import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { getProductIdForService } from '../selectors/selectors';
import { Food } from '../types/product';

export const fetchProduct = createAsyncThunk<
    Food,
    string,
    ThunkConfig<string>
>('product/fetchProduct', async (date, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const id = getProductIdForService(getState());

    try {
        const responseData = await $api(__API__ + `Products/${id}?date=${date}`, { method: "GET" });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
