import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { User, userActions } from '@/serviceEntities/User';
import { USER_LOCALSTORAGE_KEY } from '@/sharedComponents/const/localstorage';
import { getUserNameForService } from '../selectors/selectors';

export const loginByUserName = createAsyncThunk<
    User,
    undefined,
    ThunkConfig<string>
>('login/loginByUserName', async (_, thunkApi) => {
    const { dispatch, rejectWithValue, getState } = thunkApi;

    const currentUserName = getUserNameForService(getState());
    const currentPassword = getUserNameForService(getState());

    try {
        const formData = new URLSearchParams();
        formData.append('userName', currentUserName);
        formData.append('password', currentPassword);

        const response = await fetch(
            __API__ + 'auth/login', 
            {
                credentials: 'include',
                method: "POST",
                body: formData
            }
        );
        const responseJSON = await response.json();

        if (!responseJSON.result || responseJSON.result !== true ) {
            throw new Error();
        }

        await dispatch(userActions.setAuthData(responseJSON.data));

        localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(responseJSON.data));
        
        return responseJSON.data;
 
    } catch (e) {
        
        return rejectWithValue('error');
    }
});
