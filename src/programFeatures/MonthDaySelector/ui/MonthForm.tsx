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
  getShowedMonthNumber,
  getShowedYear,
  getMonthDates,
} from "../model/selectors/selectors";
import { useNavigate, useParams } from "react-router-dom";
import { getRouteMain } from "@/sharedComponents/config/routeConfig/routeConfig";
import { format } from "date-fns";
import { MonthDay, MonthWeek } from "../model/types/monthSchema";

export interface MonthFormProps {
  className?: string;
}

const initialReducers: ReducersList = {
  monthForm: monthReducer,
};

const weekDayNames = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

const MonthDayForm = memo(
  ({
    day,
    onClick,
  }: {
    day: MonthDay | null;
    onClick: (value: Date) => void;
  }) => {
    const onClickHandler = useCallback(() => {
      onClick(day.date);
    }, [day.date, onClick]);

    if (!day) {
      return <div></div>;
    }
    return (
      <div
        className={classNames(cls.WeekDay, {
          [cls.SelectedWeekDay]: day.isSelected,
        })}
        onClick={onClickHandler}
      >
        <div>{day.day}</div>
      </div>
    );
  }
);

const MonthWeekForm = memo(
  ({
    week,
    onDayClick,
  }: {
    week: MonthWeek;
    onDayClick: (value: Date) => void;
  }) => {
    return (
      <div>
        <div>{week.weekNumber}</div>
        {week.days.map((d, index) => (
          <MonthDayForm day={d} onClick={onDayClick} key={index} />
        ))}
      </div>
    );
  }
);

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
  const showedMonthNumber = useSelector(getShowedMonthNumber);
  const showedYear = useSelector(getShowedYear);
  const showedMonthYearString = useSelector(getShowedMonthYearString);
  const monthDates = useSelector(getMonthDates);

  const onChangeShowedYear = useCallback(
    (value: number) => {
      dispatch(monthActions.setShowedYear(value));
    },
    [dispatch]
  );
  const onChangeShowedMonthNumber = useCallback(
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
  const onSelectDay = useCallback(
    (value: Date) => {
      navigate(getRouteMain(format(value, "dd-MM-yyyy")));
    },
    [navigate]
  );
  const onSwipeRight = useCallback(() => {
    if (showedMonthNumber === 11) {
      onChangeShowedMonthNumber(0);
      onChangeShowedYear(showedYear + 1);
    } else {
      onChangeShowedMonthNumber(showedMonthNumber + 1);
    }
  }, [
    onChangeShowedMonthNumber,
    onChangeShowedYear,
    showedMonthNumber,
    showedYear,
  ]);
  const onSwipeLeft = useCallback(() => {
    if (showedMonthNumber === 0) {
      onChangeShowedMonthNumber(11);
      onChangeShowedYear(showedYear - 1);
    } else {
      onChangeShowedMonthNumber(showedMonthNumber - 1);
    }
  }, [
    onChangeShowedMonthNumber,
    onChangeShowedYear,
    showedMonthNumber,
    showedYear,
  ]);

  useEffect(() => {
    onChangeSelectedDay(paramDate);
  }, [onChangeSelectedDay, paramDate]);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = useCallback((e) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStart - touchEnd > 150) {
      console.log("right");
      onSwipeRight();
    }
    if (touchStart - touchEnd < -150) {
      console.log("left");
      onSwipeLeft();
    }
  }, [onSwipeLeft, onSwipeRight, touchEnd, touchStart]);

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div
        className={classNames(cls.MonthForm, {}, [className])}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div>
          <div></div>
          <div>{showedMonthYearString}</div>
          <div></div>
        </div>
        <div>
          {weekDayNames.map((name) => (
            <div>{name}</div>
          ))}
        </div>
        <div>
          {monthDates.map((week) => (
            <MonthWeekForm
              key={String(week.weekIndex)}
              onDayClick={onChangeSelectedDay}
              week={week}
            />
          ))}
        </div>
      </div>
    </DynamicModuleLoader>
  );
});

export default MonthForm;
