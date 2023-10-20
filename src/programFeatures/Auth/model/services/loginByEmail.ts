import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { User, userActions } from '@/serviceEntities/User';
import { USER_LOCALSTORAGE_KEY } from '@/sharedComponents/const/localstorage';
import { getLoginDataForService, getPasswordForService, getUserNameForService } from '../selectors/selectors';
import $api from '@/sharedComponents/api/api';

export const loginByUserName = createAsyncThunk<
    User,
    undefined,
    ThunkConfig<string>
>('login/loginByUserName', async (_, thunkApi) => {
    const { dispatch, rejectWithValue, getState } = thunkApi;

    const data = getLoginDataForService(getState());

    try {

        const response = await $api(
            __API__ + 'auth/login', 
            {
                credentials: 'include',
                method: "POST",
                body: JSON.stringify(data)
            }
        );
        if (!response.result || response.result !== true ) {
            throw new Error();
        }

        await dispatch(userActions.setAuthData(response.data));

        localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(response.data));
        
        return response.data;
 
    } catch (e) {
        return rejectWithValue('error');
    }
});
