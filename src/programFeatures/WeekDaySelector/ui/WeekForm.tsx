import { useSelector } from "react-redux";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import cls from "./WeekForm.module.scss";
import { useAppDispatch } from "@/sharedComponents/lib/hooks/useAppDispatch/useAppDispatch";
import { weekActions, weekReducer } from "../model/slice/weekSlice";
import {
  DynamicModuleLoader,
  ReducersList,
} from "@/sharedComponents/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";
import {
  getSelectedDay,
  getShowedMonthYearString,
  getShowedWeekNumber,
  getShowedYear,
  getWeekDates,
} from "../model/selectors/selectors";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRouteCalendar,
  getRouteMain,
} from "@/sharedComponents/config/routeConfig/routeConfig";
import { format } from "date-fns";
import { WeekDay } from "../model/types/weekSchema";

export interface WeekFormProps {
  className?: string;
}

const initialReducers: ReducersList = {
  weekForm: weekReducer,
};

const WeekFormDay = memo(({ day }: { day: WeekDay }) => {
  return (
    <div className={classNames(cls.WeekDay, { [cls.SelectedWeekDay]: day.isSelected })}>
      <div>{day.shortName}</div>
      <div>{day.day}</div>
    </div>
  );
});

const WeekForm = memo(({ className }: WeekFormProps) => {
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
  const weekDates = useSelector(getWeekDates);

  const onChangeShowedYear = useCallback(
    (value: number) => {
      dispatch(weekActions.setShowedYear(value));
    },
    [dispatch]
  );
  const onChangeShowedWeekNumber = useCallback(
    (value: number) => {
      dispatch(weekActions.setShowedWeekNumber(value));
    },
    [dispatch]
  );
  const onChangeSelectedDay = useCallback(
    (value: Date) => {
      dispatch(weekActions.setSelectedDay(value));
    },
    [dispatch]
  );
  const onSelectDay = useCallback(
    (value: Date) => {
      navigate(getRouteMain(format(value, "dd-MM-yyyy")));
    },
    [navigate]
  );

  const onOpenCalendar = useCallback(
    (value: Date) => {
      navigate(getRouteCalendar(format(value, "dd-MM-yyyy")));
    },
    [navigate]
  );

  useEffect(() => {
    onChangeSelectedDay(paramDate);
  }, [onChangeSelectedDay, paramDate]);

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div className={classNames(cls.WeekForm, {}, [className])}>
        <div>
          <div></div>
          <div>{showedMonthYearString}</div>
          <div></div>
        </div>
        <div>
          {weekDates.map((d) => (
            <WeekFormDay day={d} key={String(d.date)} />
          ))}
        </div>
      </div>
    </DynamicModuleLoader>
  );
});

export default WeekForm;
