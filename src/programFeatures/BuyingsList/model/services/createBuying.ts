import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { CreateBuyingDTO, ListBuying } from '../types/buyingsListSchema';

export const createBuying = createAsyncThunk<
    ListBuying,
    CreateBuyingDTO,
    ThunkConfig<string>
>('buyingsList/createBuying', async (data, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const responseData = await $api(__API__ + `tasks/buying`,
            { method: "POST", body: JSON.stringify(data) });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
