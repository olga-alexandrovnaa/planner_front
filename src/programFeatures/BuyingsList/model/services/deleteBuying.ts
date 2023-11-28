import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';

export const deleteBuying = createAsyncThunk<
    { id: number, res: boolean },
    { id: number },
    ThunkConfig<string>
>('dayTasksList/deleteBuying', async (data, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const responseData = await $api(__API__ + 'tasks/buying/' + data.id, { method: "DELETE" });

        if (responseData.error) {
            throw new Error();
        }

        return { id: data.id, res: responseData };

    } catch (e) {
        return rejectWithValue('error');
    }
});
