import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { UpdateBuyingDTO, ListBuying } from '../types/buyingsListSchema';

export const updateBuying = createAsyncThunk<
    ListBuying,
    { id: number, data: UpdateBuyingDTO },
    ThunkConfig<string>
>('buyingsList/updateBuying', async (data, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const responseData = await $api(__API__ + `buyings/${data.id}`,
            { method: "PATCH", body: JSON.stringify(data.data) });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
