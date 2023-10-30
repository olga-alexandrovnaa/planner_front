import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { getDayTasksDayAndTypeForService } from '../selectors/selectors';
import $api from '@/sharedComponents/api/api';
import { ListTask } from '../types/dayTasksListSchema';

export const fetchList = createAsyncThunk<
    ListTask[],
    undefined,
    ThunkConfig<string>
>('dayTasksList/fetchList', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const data = getDayTasksDayAndTypeForService(getState());

    const params = new URLSearchParams({
        date: data.date.toISOString(),
        type: String(data.type),
    })

    try {
        const responseData = await $api( __API__ + 'tasks/dayTasks?' + params, { method: "GET" });
        
        if (!responseData ) {
            throw new Error();
        }

        return responseData;
 
    } catch (e) {
        return rejectWithValue('error');
    }
});
