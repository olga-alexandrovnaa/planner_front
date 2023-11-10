import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { MoneyInfo } from '../types/monthSchema';
import { getDtoForMoneyInfo } from '../selectors/selectors';

export const fetchMonthWalletInfo = createAsyncThunk<
    MoneyInfo,
    undefined,
    ThunkConfig<string>
>('month/fetchMonthWalletInfo', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const data = getDtoForMoneyInfo(getState());

    if (!data) return null;

    try {
        const responseData = await $api(__API__ + `tasks/month_wallet_info?dateStart=${data.dateStart}&dateEnd=${data.dateEnd}`, { method: "GET" });

        if (!responseData.data) {
            throw new Error();
        }

        return responseData.data;

    } catch (e) {
        return rejectWithValue('error');
    }
});
