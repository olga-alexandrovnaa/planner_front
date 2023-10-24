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
import { format, getISOWeeksInYear } from "date-fns";
import { WeekDay } from "../model/types/weekSchema";

export interface WeekFormProps {
  className?: string;
}

const initialReducers: ReducersList = {
  weekForm: weekReducer,
};

const WeekDayForm = memo(
  ({ day, onClick }: { day: WeekDay; onClick: (value: Date) => void }) => {
    const onClickHandler = useCallback(() => {
      onClick(day.date);
    }, [day.date, onClick]);

    return (
      <div
        className={classNames(cls.WeekDay, {
          [cls.SelectedWeekDay]: day.isSelected,
        })}
        onClick={onClickHandler}
      >
        <div>{day.shortName}</div>
        <div>{day.day}</div>
      </div>
    );
  }
);

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
    () => {
      navigate(getRouteCalendar(format(selectedDay, "dd-MM-yyyy")));
    },
    [navigate, selectedDay]
  );

  const onSwipeRight = useCallback(() => {
    if (showedWeekNumber === getISOWeeksInYear(new Date(showedYear, 1, 1))) {
      onChangeShowedWeekNumber(0);
      onChangeShowedYear(showedYear + 1);
    } else {
      onChangeShowedWeekNumber(showedWeekNumber + 1);
    }
  }, [
    onChangeShowedWeekNumber,
    onChangeShowedYear,
    showedWeekNumber,
    showedYear,
  ]);

  const onSwipeLeft = useCallback(() => {
    if (showedWeekNumber === 0) {
      onChangeShowedWeekNumber(
        getISOWeeksInYear(new Date(showedYear - 1, 1, 1))
      );
      onChangeShowedYear(showedYear - 1);
    } else {
      onChangeShowedWeekNumber(showedWeekNumber - 1);
    }
  }, [
    onChangeShowedWeekNumber,
    onChangeShowedYear,
    showedWeekNumber,
    showedYear,
  ]);

  useEffect(() => {
    onChangeSelectedDay(paramDate);
  }, [onChangeSelectedDay, paramDate]);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = useCallback((e) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, [])

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (touchStart - touchEnd > 150) {
      console.log("right");
      onSwipeRight();
    }
    if (touchStart - touchEnd < -150) {
      console.log("left");
      onSwipeLeft();
    }
  }, [onSwipeLeft, onSwipeRight, touchEnd, touchStart])

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div
        className={classNames(cls.WeekForm, {}, [className])}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div>
          <div></div>
          <div onClick={onOpenCalendar}>{showedMonthYearString}</div>
          <div></div>
        </div>
        <div>
          {weekDates.map((d, index) => (
            <WeekDayForm
              day={d}
              key={index}
              onClick={onSelectDay}
            />
          ))}
        </div>
      </div>
    </DynamicModuleLoader>
  );
});

export default WeekForm;
