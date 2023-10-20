import { useSelector } from "react-redux";
import { memo, useCallback, useState } from "react";
import cls from "./LoginForm.module.scss";
import {
  getLoginFormError,
  getLoginFormIsLoading,
  getLoginFormName,
  getLoginFormPassword,
  getLoginFormPasswordConfirm,
  getLoginFormUserName,
} from "../model/selectors/selectors";
import { useAppDispatch } from "@/sharedComponents/lib/hooks/useAppDispatch/useAppDispatch";
import { loginActions, loginReducer } from "../model/slice/loginFormSlice";
import {
  DynamicModuleLoader,
  ReducersList,
} from "@/sharedComponents/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";
import { Input } from "@/sharedComponents/ui/Inputs/Input";
import { ReactComponent as Profile } from "@/sharedComponents/assets/icons/profile.svg";
import { ReactComponent as Lock } from "@/sharedComponents/assets/icons/lock.svg";
import { Loader } from "@/sharedComponents/ui/Loader";
import { Button } from "@/sharedComponents/ui/Button";
import { registration } from "../model/services/registration";
import { loginByUserName } from "../model/services/loginByEmail";

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
  const name = useSelector(getLoginFormName);
  const passwordConfirm = useSelector(getLoginFormPasswordConfirm);

  const isLoading = useSelector(getLoginFormIsLoading);
  const error = useSelector(getLoginFormError);

  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const onChangeIsRegistrationOpen = useCallback(() => {
    setIsRegistrationOpen(!isRegistrationOpen);
  }, [isRegistrationOpen]);

  const onChangeUserName = useCallback(
    (value: string) => {
      dispatch(loginActions.setUserName(value));
    },
    [dispatch]
  );

  const onChangePassword = useCallback(
    (value: string) => {
      dispatch(loginActions.setPassword(value));
    },
    [dispatch]
  );

  const onChangeName = useCallback(
    (value: string) => {
      dispatch(loginActions.setName(value));
    },
    [dispatch]
  );

  const onChangePasswordConfirm = useCallback(
    (value: string) => {
      dispatch(loginActions.setPasswordConfirm(value));
    },
    [dispatch]
  );

  const onLoginClick = useCallback(async () => {
    if (!userName || !password) return;
    const result = await dispatch(loginByUserName());
    if (result.meta.requestStatus === "fulfilled") {
      onSuccess();
    }
  }, [onSuccess, dispatch, password, userName]);

  const onRegistrationClick = useCallback(async () => {
    if (
      !userName ||
      !password ||
      !passwordConfirm ||
      !name ||
      password !== passwordConfirm
    )
      return;
    const result = await dispatch(registration());
    if (result.meta.requestStatus === "fulfilled") {
      onSuccess();
    }
  }, [userName, password, passwordConfirm, name, dispatch, onSuccess]);

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div className={classNames(cls.LoginForm, {}, [className])}>
        <div className={cls.LoginWidget}>
          {!!error && (
            <span className={cls.Error}>
              Вы ввели неверный userName или пароль
            </span>
          )}
          <Input
            placeholder="UserName"
            onChange={onChangeUserName}
            value={userName}
            rowStartIcon={<Profile width={25} />}
          />
          <Input
            placeholder="Пароль"
            type="password"
            onChange={onChangePassword}
            value={password}
            rowStartIcon={<Lock width={25} />}
          />
          <Input
            placeholder="Name"
            onChange={onChangeName}
            value={name}
            rowStartIcon={<Profile width={25} />}
          />
          <Input
            placeholder="Пароль подтверждение"
            type="password"
            onChange={onChangePasswordConfirm}
            value={passwordConfirm}
            rowStartIcon={<Lock width={25} />}
          />
          {!isLoading && (
            <Button
              className={cls.loginBtn}
              onClick={onLoginClick}
              disabled={isLoading}
            >
              Войти
            </Button>
          )}
          {!isLoading && (
            <Button
              className={cls.loginBtn}
              onClick={onRegistrationClick}
              disabled={isLoading}
            >
              Регистрация
            </Button>
          )}

          {isLoading && (
            <div className={cls.loader}>
              <Loader />
            </div>
          )}
        </div>
      </div>
    </DynamicModuleLoader>
  );
});

export default LoginForm;
