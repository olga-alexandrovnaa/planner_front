import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { Product } from '../types/product';
import { getProductToCreate } from '../selectors/selectors';

export const createIngredientProduct = createAsyncThunk<
    Product,
    undefined,
    ThunkConfig<string>
>('product/createIngredientProduct', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const data = getProductToCreate(getState());

    try {
        const responseData = await $api(
            __API__ + `tasks/product`,
            { method: "POST", body: JSON.stringify(data) }
        );

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
