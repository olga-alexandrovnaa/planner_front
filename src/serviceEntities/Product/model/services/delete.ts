import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { getProductIdForService } from '../selectors/selectors';

export const deleteEverywhere = createAsyncThunk<
    boolean,
    undefined,
    ThunkConfig<string>
>('product/create', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const id = getProductIdForService(getState());

    try {
        const responseData = await $api(
            __API__ + `Products/${id}`,
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
