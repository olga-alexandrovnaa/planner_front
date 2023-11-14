import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { isoString } from '@/sharedComponents/lib/helpers/isoString';
import { startOfDay } from 'date-fns';
import { getYYYY_MM_DD } from '@/sharedComponents/lib/helpers/getYYYY_MM_DD';

export const setTaskCheck = createAsyncThunk<
    { id: number, res: boolean },
    { id: number, date: Date },
    ThunkConfig<string>
>('dayTasksList/setTaskCheck', async ({ id, date }, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    const params = new URLSearchParams({
        date: getYYYY_MM_DD(startOfDay(date)),
    });

    try {
        const responseData = await $api(__API__ + `tasks/${id}/setTaskCheck?` + params, { method: "PATCH" });

        if (responseData.error) {
            throw new Error();
        }

        return { id: id, res: responseData };

    } catch (e) {
        return rejectWithValue('error');
    }
});
