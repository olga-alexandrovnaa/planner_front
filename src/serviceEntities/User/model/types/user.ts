import { UserRole } from '../consts/userConsts';

export interface User {
    id: string;
    userName: string;
    avatar?: string;
    token ?: string;
    roles?: UserRole[];
}

export interface UserSchema {
    authData?: User;

    _inited: boolean;
}
