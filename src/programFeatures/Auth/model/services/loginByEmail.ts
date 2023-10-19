import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from '@/app/providers/StoreProvider';
import { User, userActions } from '@/serviceEntities/User';
import { USER_LOCALSTORAGE_KEY } from '@/sharedComponents/const/localstorage';
import { getUserNameForService } from '../selectors/selectors';

interface LoginByUserNameProps {
    userName: string;
    password: string;
}

export const loginByUserName = createAsyncThunk<
    User,
    LoginByUserNameProps,
    ThunkConfig<string>
>('login/loginByUserName', async (authData, thunkApi) => {
    const { dispatch, rejectWithValue, getState } = thunkApi;

    const currentUserName = getUserNameForService(getState());

    try {


        //  //const myHeaders = new Headers();
        // //myHeaders.append('Content-Type', 'application/json');
        // // myHeaders.append('Authorization', 'Bearer ' + token);


        // const formData = new URLSearchParams();
        // formData.append('userName', authData.userName);
        // formData.append('password', authData.password);

        // const response = await fetch(
        //     __API__ + 'login', 
        //     {
        //         credentials: 'include',
            //     //headers: myHeaders,
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
