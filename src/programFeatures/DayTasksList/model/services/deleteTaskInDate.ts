import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { startOfDay } from 'date-fns';
import { isoString } from '@/sharedComponents/lib/helpers/isoString';

export const deleteTask = createAsyncThunk<
    { id: number, res: boolean },
    { id: number, date: Date },
    ThunkConfig<string>
>('dayTasksList/deleteTask', async (data, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    const params = new URLSearchParams({
        date: isoString(startOfDay(data.date)),
    });

    try {
        const responseData = await $api(__API__ + 'tasks/' + data.id + '/deleteTaskInDate?' + params, { method: "DELETE" });

        if (responseData.error) {
            throw new Error();
        }

        return { id: data.id, res: responseData };

    } catch (e) {
        return rejectWithValue('error');
    }
});
