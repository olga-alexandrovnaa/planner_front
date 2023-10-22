import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { User, userActions } from '@/serviceEntities/User';
import { USER_LOCALSTORAGE_KEY } from '@/sharedComponents/const/localstorage';
import { getRegistrationDataForService } from '../selectors/selectors';
import $api from '@/sharedComponents/api/api';


export const registration = createAsyncThunk<
    User,
    undefined,
    ThunkConfig<string>
>('login/registration', async (_, thunkApi) => {
    const { dispatch, rejectWithValue, getState } = thunkApi;
    
    const data = getRegistrationDataForService(getState());

    try {
        const responseData = await $api(
            __API__ + 'auth/registration', 
            {
                // credentials: 'include',
                method: "POST",
                body: JSON.stringify(data)
            }
        );
        if (!responseData.user ) {
            throw new Error();
        }
        
        await dispatch(userActions.setAuthData(responseData));

        localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(responseData));
        
        return responseData;
 
    } catch (e) {
        
        return rejectWithValue('error');
    }
});
