import { useSelector } from 'react-redux';
import { memo, useCallback } from 'react';
import cls from './LoginForm.module.scss';
import { getLoginFormError, getLoginFormIsLoading, getLoginFormPassword, getLoginFormUserName } from '../model/selectors/selectors';
import { useAppDispatch } from '@/sharedComponents/lib/hooks/useAppDispatch/useAppDispatch';
import { loginActions, loginReducer } from '../model/slice/loginFormSlice';
import { DynamicModuleLoader, ReducersList } from '@/sharedComponents/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { classNames } from '@/sharedComponents/lib/classNames/classNames';
import { Input } from '@/sharedComponents/ui/Inputs/Input';
import { loginByUserName } from '../model/services/loginByUserName';
import { ReactComponent as Profile } from '@/sharedComponents/assets/icons/profile.svg';
import { ReactComponent as Lock } from '@/sharedComponents/assets/icons/lock.svg';
import { Loader } from '@/sharedComponents/ui/Loader';
import { Button } from '@/sharedComponents/ui/Button';

export interface LoginFormProps {
    className?: string;
    onSuccess: () => void;
}

const initialReducers: ReducersList = {
    loginForm: loginReducer,
};

const LoginForm = memo(({ className, onSuccess }: LoginFormProps) => {
    const dispatch = useAppDispatch();
    const userName = useSelector(getLoginFormUserName);
    const password = useSelector(getLoginFormPassword);
    const isLoading = useSelector(getLoginFormIsLoading);
    const error = useSelector(getLoginFormError);

    const onChangeUserName = useCallback(
        (value: string) => {
            dispatch(loginActions.setUserName(value));
        },
        [dispatch],
    );

    const onChangePassword = useCallback(
        (value: string) => {
            dispatch(loginActions.setPassword(value));
        },
        [dispatch],
    );

    const onLoginClick = useCallback(async () => {
      if(!userName || !password) return;
      const result = await dispatch(loginByUserName({ userName, password }));
      if (result.meta.requestStatus === 'fulfilled') {
          onSuccess();
      }
    }, [onSuccess, dispatch, password, userName]);

    return (
        <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
            <div className={classNames(cls.LoginForm, {}, [className])}>
                <div className={cls.LoginWidget}>
                    {!!error && <span className={cls.Error}>Вы ввели неверный userName или пароль</span> }
                    <Input
                        label="UserName"
                        onChange={onChangeUserName}
                        value={userName}
                        icon={<Profile width={25}/>}
                    />
                    <Input
                        label="Пароль"
                        type='password'
                        onChange={onChangePassword}
                        value={password}
                        icon={<Lock width={25}/>}
                    />
                    { !isLoading && <Button
                        className={cls.loginBtn}
                        onClick={onLoginClick}
                        disabled={isLoading}
                    >
                        Войти
                    </Button>}

                    {
                        isLoading && <div className={cls.loader}><Loader/></div>
                    }
                </div> 
            </div>
        </DynamicModuleLoader>
    );
});

export default LoginForm;