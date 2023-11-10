import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { TaskProgressItem } from '../types/monthSchema';
import { getDtoForTrackerProgress } from '../selectors/selectors';

export const fetchTrackerProgress = createAsyncThunk<
    TaskProgressItem[],
    undefined,
    ThunkConfig<string>
>('month/fetchTrackerProgress', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const data = getDtoForTrackerProgress(getState());

    if (!data) return [];

    try {
        const responseData = await $api(__API__ + `tasks/${data.id}/progress?dateStart=${data.dateStart}&dateEnd=${data.dateEnd}`, { method: "GET" });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
