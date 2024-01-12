import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { MeasureUnit } from '../types/product';

export const fetchMeasureUnitsByIngredient = createAsyncThunk<
    MeasureUnit[],
    number,
    ThunkConfig<string>
>('product/fetchMeasureUnitsByIngredient', async (product, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
        const responseData = await $api(__API__ + `products/measureUnitsByIngredient/${product}`, { method: "GET" });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
