import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { startOfDay } from 'date-fns';
import { getYYYY_MM_DD } from '@/sharedComponents/lib/helpers/getYYYY_MM_DD';

export const deleteTask = createAsyncThunk<
    { id: number, res: boolean },
    { id: number, date: Date },
    ThunkConfig<string>
>('dayTasksList/deleteTask', async (data, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    const params = new URLSearchParams({
        date: getYYYY_MM_DD(startOfDay(data.date)),
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
