import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { User, userActions } from '@/serviceEntities/User';
import { USER_LOCALSTORAGE_KEY } from '@/sharedComponents/const/localstorage';
import { getUserNameForService } from '../selectors/selectors';
import $api from '@/sharedComponents/api/api';


export const registration = createAsyncThunk<
    User,
    undefined,
    ThunkConfig<string>
>('login/registration', async (_, thunkApi) => {
    const { dispatch, rejectWithValue, getState } = thunkApi;
    
    const currentUserName = getUserNameForService(getState());
    const currentPassword = getUserNameForService(getState());
    const currentName = getUserNameForService(getState());

    try {
        const formData = new URLSearchParams();
        formData.append('userName', currentUserName);
        formData.append('password', currentPassword);
        formData.append('name', currentName);

        const response = await $api(
            __API__ + 'auth/registration', 
            {
                credentials: 'include',
                method: "POST",
                body: formData
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
