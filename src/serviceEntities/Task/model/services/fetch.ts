import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { TaskExt } from '../types/task';
import { getTaskIdForService } from '../selectors/selectors';

export const fetchTask = createAsyncThunk<
    TaskExt,
    undefined,
    ThunkConfig<string>
>('task/fetchTask', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const id = getTaskIdForService(getState());

    try {
        const responseData = await $api(__API__ + `tasks/${id}`, { method: "GET" });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
