import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { getUpdateProductDtoForService } from '../selectors/selectors';
import $api from '@/sharedComponents/api/api';
import { Food } from '../types/product';

export const update = createAsyncThunk<
    Food,
    undefined,
    ThunkConfig<string>
>('product/update', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const data = getUpdateProductDtoForService(getState());

    if (!Object.entries(data.dto).length) return null;

    try {
        const responseData = await $api(
            __API__ + `products/food/${data.id}`,
            { method: "PATCH", body: JSON.stringify(data.dto) }
        );

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
