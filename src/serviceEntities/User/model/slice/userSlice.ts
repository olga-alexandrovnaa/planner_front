import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserSchema, User } from '../types/user';
import { USER_LOCALSTORAGE_KEY } from '@/sharedComponents/const/localstorage';
import logout from '@/sharedComponents/api/logout';
import localstorageAuthData from '@/sharedComponents/api/localstorageAuthData';

const initialState: UserSchema = {
    _inited: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<User>) => {
            state.authData = action.payload;
            state._inited = true;
        },
        initAuthData: (state) => {
            const user = localstorageAuthData();
            if (user) {
                state.authData = user.user;
            }
            state._inited = true;
        },
        logout: (state) => {
            state.authData = undefined;
            localStorage.removeItem(USER_LOCALSTORAGE_KEY);
            logout();
        },
    },
});

// Action creators are generated for each case reducer function
export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;
