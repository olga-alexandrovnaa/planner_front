import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { Food } from '../types/product';
import { getCreateProductDtoForService } from '../selectors/selectors';

export const create = createAsyncThunk<
    Food,
    undefined,
    ThunkConfig<string>
>('product/create', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const data = getCreateProductDtoForService(getState());

    try {
        const responseData = await $api(
            __API__ + `tasks/food`,
            { method: "POST", body: JSON.stringify(data.dto) }
        );

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
