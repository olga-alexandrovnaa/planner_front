import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { AllIngredient } from '../types/weekSchema';
import { getAllIngredientsDates } from '../selectors/selectors';

export const fetchAllIngredients = createAsyncThunk<
    AllIngredient[],
    undefined,
    ThunkConfig<string>
>('week/fetchAllIngredients', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const data = getAllIngredientsDates(getState());

    try {
        const responseData = await $api(__API__ + `products/allIngredients?dateStart=${data.dateStart}&dateEnd=${data.dateEnd}`, { method: "GET" });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
