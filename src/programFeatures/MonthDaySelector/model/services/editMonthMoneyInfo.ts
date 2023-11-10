import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import $api from '@/sharedComponents/api/api';
import { getDtoForUpdateMoneyInfo } from '../selectors/selectors';

export const editMonthMoneyInfo = createAsyncThunk<
    boolean,
    undefined,
    ThunkConfig<string>
>('month/editMonthMoneyInfo', async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    const data = getDtoForUpdateMoneyInfo(getState());

    if (!data) return;

    try {
        const responseData = await $api(__API__ +
            `tasks/month_wallet_info?date=${data.date}&remainder=${data.remainder}&investment=${data.investment}`,
            { method: "POST" });

        if (responseData.error) {
            throw new Error();
        }

        return responseData;

    } catch (e) {
        return rejectWithValue('error');
    }
});
