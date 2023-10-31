import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { getUpdateTaskDtoForService } from '../selectors/selectors';
import $api from '@/sharedComponents/api/api';
import { TaskExt } from '../types/task';

export const update = createAsyncThunk<
    TaskExt,
    undefined,
    ThunkConfig<string>
>('task/update', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const data = getUpdateTaskDtoForService(getState());

    if(!Object.entries(data.dto).length) return null;

    try {
        const responseData = await $api(
            __API__ + `tasks/${data.id}`, 
            { method: "PATCH", body: JSON.stringify(data.dto)}
        );
        
        if (responseData.error) {
            throw new Error();
        }

        return responseData;
 
    } catch (e) {
        return rejectWithValue('error');
    }
});
