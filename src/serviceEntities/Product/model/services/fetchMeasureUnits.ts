import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { MeasureUnit } from '../types/product';

export const fetchMeasureUnits = createAsyncThunk<
    MeasureUnit[],
    undefined,
    ThunkConfig<string>
>('product/fetchMeasureUnits', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
        const responseData = await $api(__API__ + `tasks/measureUnits`, { method: "GET" });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
