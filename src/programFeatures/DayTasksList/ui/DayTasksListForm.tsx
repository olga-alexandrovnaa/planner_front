import { useSelector } from "react-redux";
import { memo, useCallback, useState } from "react";
import cls from "./DayTasksListForm.module.scss";
import { getDayTasks, getDayTasksError, getDayTasksIsLoading } from "../model/selectors/selectors";
import { useAppDispatch } from "@/sharedComponents/lib/hooks/useAppDispatch/useAppDispatch";
import { dayTasksListReducer } from "../model/slice/dayTasksListSlice";
import {
  DynamicModuleLoader,
  ReducersList,
} from "@/sharedComponents/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";
import { Input } from "@/sharedComponents/ui/Inputs/Input";
import { ReactComponent as Profile } from "@/sharedComponents/assets/icons/profile.svg";
import { ReactComponent as Lock } from "@/sharedComponents/assets/icons/lock.svg";
import { Loader } from "@/sharedComponents/ui/Loader";
import { Button, ButtonSize } from "@/sharedComponents/ui/Button";

export interface DayTasksListFormProps {
  className?: string;
}

const initialReducers: ReducersList = {
  dayTasks: dayTasksListReducer,
};

const DayTasksListForm = memo(({ className }: DayTasksListFormProps) => {
  const dispatch = useAppDispatch();
  const list = useSelector(getDayTasks);
  const isLoading = useSelector(getDayTasksIsLoading);
  const error = useSelector(getDayTasksError);

  // const onChangeUserName = useCallback(
  //   (value: string) => {
  //     dispatch(loginActions.setUserName(value));
  //   },
  //   [dispatch]
  // );


  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div className={classNames(cls.DayTasksListForm, {}, [className])}>
      </div>
    </DynamicModuleLoader>
  );
});

export default DayTasksListForm;
