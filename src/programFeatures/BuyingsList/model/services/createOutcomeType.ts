import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { TaskExt } from '@/serviceEntities/Task/model/types/task';

export const createOutcomeType = createAsyncThunk<
    TaskExt,
    string,
    ThunkConfig<string>
>('buyingsList/createOutcomeType', async (name, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const responseData = await $api(__API__ + `tasks/outcomeType`, { body: JSON.stringify({ name: name }), method: "POST" });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
