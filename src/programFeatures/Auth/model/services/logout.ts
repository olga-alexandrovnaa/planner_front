import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { User, userActions } from '@/serviceEntities/User';
import { USER_LOCALSTORAGE_KEY } from '@/sharedComponents/const/localstorage';
import { getUserNameForService } from '../selectors/selectors';

interface RegistrationProps {
    name: string;
    userName: string;
    password: string;
    passwordConfirm: string;
}

export const registration = createAsyncThunk<
    User,
    RegistrationProps,
    ThunkConfig<string>
>('login/registration', async (authData, thunkApi) => {
    const { dispatch, rejectWithValue, getState } = thunkApi;

    //return $api.get<boolean>('/auth/logout');
    
    const currentUserName = getUserNameForService(getState());

    try {
        // const formData = new URLSearchParams();
        // formData.append('userName', authData.userName);
        // formData.append('password', authData.password);

        // const response = await fetch(
        //     __API__ + 'login', 
        //     {
        //         credentials: 'include',
        //         method: "POST",
        //         body: formData
        //     }
        // );
        // const responseJSON = await response.json();

        // if (!responseJSON.result || responseJSON.result !== true ) {
        //     throw new Error();
        // }

        
        const responseJSON = {
            data: {
                id: '11111',
                userName: authData.userName,
            }
        }
        
        await dispatch(userActions.setAuthData(responseJSON.data));

        localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(responseJSON.data));
        
        return responseJSON.data;
 
    } catch (e) {
        
        return rejectWithValue('error');
    }
});
