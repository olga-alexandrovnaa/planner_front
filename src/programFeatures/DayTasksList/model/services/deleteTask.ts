import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';

export const deleteTask = createAsyncThunk<
    {id: number, res: boolean},
    number,
    ThunkConfig<string>
>('dayTasksList/deleteTask', async (id, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const responseData = await $api( __API__ + 'tasks/' + id, { method: "DELETE" });
        
        if (!responseData ) {
            throw new Error();
        }

        return { id: id, res: responseData};
 
    } catch (e) {
        return rejectWithValue('error');
    }
});
