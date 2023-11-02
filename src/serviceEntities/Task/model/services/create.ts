import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { TaskExt } from '../types/task';
import { getCreateTaskDtoForService } from '../selectors/selectors';

export const create = createAsyncThunk<
    TaskExt,
    undefined,
    ThunkConfig<string>
>('task/create', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const data = getCreateTaskDtoForService(getState());

    try {
        const responseData = await $api(
            __API__ + `tasks`,
            { method: "POST", body: JSON.stringify(data.dto) }
        );

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
