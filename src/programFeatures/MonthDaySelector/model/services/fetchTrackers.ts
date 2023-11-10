import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { TaskShort } from '../types/monthSchema';

export const fetchTrackers = createAsyncThunk<
    TaskShort[],
    undefined,
    ThunkConfig<string>
>('month/fetchTrackers', async (_, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const responseData = await $api(__API__ + `tasks/userTrackers`, { method: "GET" });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
