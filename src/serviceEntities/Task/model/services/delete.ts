import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { getTaskIdForService } from '../selectors/selectors';

export const deleteEverywhere = createAsyncThunk<
    boolean,
    undefined,
    ThunkConfig<string>
>('task/create', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const id = getTaskIdForService(getState());

    try {
        const responseData = await $api(
            __API__ + `tasks/${id}`,
            { method: "DELETE" }
        );

        if (responseData.error) {
            throw new Error();
        }

        return responseData;

    } catch (e) {
        return rejectWithValue('error');
    }
});
