import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { Food, foodType } from '../types/task';

export const fetchFoodOptionsByType = createAsyncThunk<
    {
        label: string;
        options: {
            value: number;
            label: string;
            data: Food;
        }[];
    }[],
    { type: foodType, date: string },
    ThunkConfig<string>
>('task/fetchFoodOptionsByType', async (data, thunkApi) => {
    const { rejectWithValue } = thunkApi;


    try {
        const responseData = await $api(__API__ + `products/foodOptionsByType?type=${data.type}&date=${data.date}`, { method: "GET" });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
