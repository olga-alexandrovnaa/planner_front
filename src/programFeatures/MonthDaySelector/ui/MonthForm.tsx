import { useSelector } from "react-redux";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import cls from "./MonthForm.module.scss";
import { useAppDispatch } from "@/sharedComponents/lib/hooks/useAppDispatch/useAppDispatch";
import {
  DynamicModuleLoader,
  ReducersList,
} from "@/sharedComponents/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";
import { monthActions, monthReducer } from "../model/slice/monthSlice";
import {
  getSelectedDay,
  getShowedMonthYearString,
  getShowedWeekNumber,
  getShowedYear,
} from "../model/selectors/selectors";
import { useNavigate, useParams } from "react-router-dom";
import { getRouteMain } from "@/sharedComponents/config/routeConfig/routeConfig";
import { format } from "date-fns";

export interface MonthFormProps {
  className?: string;
}

const initialReducers: ReducersList = {
  monthForm: monthReducer,
};

const MonthForm = memo(({ className }: MonthFormProps) => {
  const { date } = useParams<{ date: string }>();
  const paramDate = useMemo(() => {
    const arr = date.split("-").map((e) => Number(e));
    if (arr.length !== 3 || isNaN(new Date(arr[2], arr[1], arr[0]).valueOf())) {
      return new Date();
    }
    return new Date(arr[2], arr[1], arr[0]);
  }, [date]);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const selectedDay = useSelector(getSelectedDay);
  const showedWeekNumber = useSelector(getShowedWeekNumber);
  const showedYear = useSelector(getShowedYear);
  const showedMonthYearString = useSelector(getShowedMonthYearString);

  const onChangeShowedYear = useCallback(
    (value: number) => {
      dispatch(monthActions.setShowedYear(value));
    },
    [dispatch]
  );
  const onChangeShowedWeekNumber = useCallback(
    (value: number) => {
      //0-11
      dispatch(monthActions.setShowedMonthNumber(value));
    },
    [dispatch]
  );
  const onChangeSelectedDay = useCallback(
    (value: Date) => {
      dispatch(monthActions.setSelectedDay(value));
    },
    [dispatch]
  );
  const onSelectDay = useCallback((value: Date) => {
    navigate(getRouteMain(format(value, "dd-MM-yyyy")));
  }, [navigate]);

  useEffect(() => {
    onChangeSelectedDay(paramDate);
  }, [onChangeSelectedDay, paramDate]);

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div className={classNames(cls.MonthForm, {}, [className])}></div>
    </DynamicModuleLoader>
  );
});

export default MonthForm;
