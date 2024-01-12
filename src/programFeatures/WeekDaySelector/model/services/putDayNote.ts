import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { DayNote } from '../types/weekSchema';

export const putDayNote = createAsyncThunk<
    DayNote,
    { date: string, note: string },
    ThunkConfig<string>
>('week/putDayNote', async (data, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const responseData = await $api(__API__ + `notes/dayNote?date=${data.date}`, { method: "PUT", body: JSON.stringify({ note: data.note }) });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
