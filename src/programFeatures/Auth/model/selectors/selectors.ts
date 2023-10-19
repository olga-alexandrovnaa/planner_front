/* eslint-disable max-len */

import { StateSchema } from "@/app/providers/StoreProvider";
import { createSelector } from "@reduxjs/toolkit";

export const getLoginFormPassword = (state: StateSchema) => state.loginForm?.password;
export const getLoginFormUserName = (state: StateSchema) => state.loginForm?.userName;
export const getLoginFormPasswordConfirm = (state: StateSchema) => state.loginForm?.passwordConfirm;
export const getLoginFormName = (state: StateSchema) => state.loginForm?.name;
export const getLoginFormIsLoading = (state: StateSchema) => state.loginForm?.isLoading;
export const getLoginFormError = (state: StateSchema) => state.loginForm?.error;

export const getUserNameForService = createSelector(getLoginFormUserName, (userName) => {
    return userName;
});