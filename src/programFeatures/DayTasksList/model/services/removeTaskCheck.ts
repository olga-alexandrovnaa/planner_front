import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';

export const removeTaskCheck = createAsyncThunk<
    {id: number, res: boolean},
    number,
    ThunkConfig<string>
>('dayTasksList/removeTaskCheck', async (id, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const responseData = await $api( __API__ + `tasks/${id}/removeTaskCheck`, { method: "PATCH" });
        
        if (!responseData ) {
            throw new Error();
        }

        return { id: id, res: responseData};
 
    } catch (e) {
        return rejectWithValue('error');
    }
});
