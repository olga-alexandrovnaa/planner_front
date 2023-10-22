import { useSelector } from "react-redux";
import { memo, useCallback } from "react";
import cls from "./UserAuthDataForm.module.scss";
import { getUserAuthData, getuserName } from "../model/selectors/selectors";
import {
  DynamicModuleLoader,
  ReducersList,
} from "@/sharedComponents/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";
import { userActions, userReducer } from "..";
import { useAppDispatch } from "@/sharedComponents/lib/hooks/useAppDispatch/useAppDispatch";
import { ReactComponent as Logout } from "@/sharedComponents/assets/icons/logout.svg";
import { useNavigate } from "react-router-dom";
import logout from "@/sharedComponents/api/logout";

export interface UserAuthDataFormProps {
  className?: string;
}

const initialReducers: ReducersList = {
  user: userReducer,
};

const UserAuthDataForm = memo(({ className }: UserAuthDataFormProps) => {
  const dispatch = useAppDispatch();
  const userName = useSelector(getuserName);

  const navigate = useNavigate()

  const logoutHandler = useCallback(async () => {
    await logout();
    dispatch(userActions.logout());
    navigate(0)
  }, [dispatch, navigate]);

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      {(
        <div className={classNames(cls.UserForm, {}, [className])}>
          userName: {userName ? userName : 'empty'}
          <div onClick={logoutHandler}>
            <Logout />
          </div>
        </div>
      )}
    </DynamicModuleLoader>
  );
});

export default UserAuthDataForm;
