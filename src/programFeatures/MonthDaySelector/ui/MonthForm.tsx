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
  getShowedMonthYearString,
  getMonthDates,
  getYearMonthDates,
  getShowedYear,
} from "../model/selectors/selectors";
import { useNavigate, useParams } from "react-router-dom";
import { getRouteMain } from "@/sharedComponents/config/routeConfig/routeConfig";
import { MonthDay, MonthWeek, YearMonth } from "../model/types/monthSchema";
import { DD_MM_YYYYtoDate } from "@/sharedComponents/lib/helpers/DD_MM_YYYYtoDate";

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
    onClick?: (value: string) => void;
  }) => {
    const onClickHandler = useCallback(() => {
      if (!day || !onClick) return;
      onClick(day?.date);
    }, [day, onClick]);

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
        <div className={cls.WeekDayDate}>{day.day}</div>
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
    onDayClick?: (value: string) => void;
  }) => {
    return (
      <div className={cls.Week}>
        <div className={cls.WeekNumber}>{week.weekNumber}</div>
        {week.days.map((d, index) => (
          <MonthDayForm day={d} onClick={onDayClick} key={index} />
        ))}
      </div>
    );
  }
);

const YearMonthForm = memo(
  ({
    month,
    onClick,
  }: {
    month: YearMonth;
    onClick: (value: number) => void;
  }) => {
    const onClickHandler = useCallback(() => {
      onClick(month.monthIndex);
    }, []);

    return (
      <div key={month.monthIndex} onClick={onClickHandler}>
        <div>{month.name}</div>
        <div className={cls.Weeks}>
          {month.weeks.map((week) => (
            <MonthWeekForm key={String(week.weekIndex)} week={week} />
          ))}
        </div>
      </div>
    );
  }
);

const MonthForm = memo(({ className }: MonthFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { date } = useParams<{ date: string }>();
  const paramDate = useMemo(() => DD_MM_YYYYtoDate(date), [date]);
  useEffect(() => {
    dispatch(monthActions.setSelectedDay(paramDate));
  }, [dispatch, paramDate]);

  const [showYear, setShowYear] = useState(false);
  const onChangeShowYear = useCallback(() => {
    setShowYear(true);
  }, []);
  const onChangeShowMonth = useCallback(() => {
    setShowYear(false);
  }, []);

  const showedMonthYearString = useSelector(getShowedMonthYearString);
  const showedYear = useSelector(getShowedYear);
  const monthDates = useSelector(getMonthDates);
  const yearMonthDates = useSelector(getYearMonthDates);

  const onBack = useCallback(() => {
    navigate(getRouteMain(date));
  }, [date, navigate]);

  const onSelectDay = useCallback(
    (value: string) => {
      navigate(getRouteMain(value));
    },
    [navigate]
  );
  const onSelectMonth = useCallback(
    (value: number) => {
      dispatch(monthActions.setShowedMonthNumber(value));
      onChangeShowMonth();
    },
    [dispatch, onChangeShowMonth]
  );
  const onSwipeRight = useCallback(() => {
    if (showYear) {
      dispatch(monthActions.showNextYear());
    } else {
      dispatch(monthActions.showNextMonth());
    }
  }, [dispatch, showYear]);

  const onSwipeLeft = useCallback(() => {
    if (showYear) {
      dispatch(monthActions.showLastYear());
    } else {
      dispatch(monthActions.showLastMonth());
    }
  }, [dispatch, showYear]);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStart - touchEnd > 150) {
      onSwipeRight();
    }
    if (touchStart - touchEnd < -150) {
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
        <div className={cls.Header}>
          <div className={cls.HeaderLeft}>
            <div className={cls.WeekOrMonthSelector}>
              <div
                onClick={onChangeShowMonth}
                className={classNames(cls.WeekOrMonthSelectorItem, {
                  [cls.WeekOrMonthSelectorItemActive]: !showYear,
                })}
              >
                Месяц
              </div>
              <div
                onClick={onChangeShowYear}
                className={classNames(cls.WeekOrMonthSelectorItem, {
                  [cls.WeekOrMonthSelectorItemActive]: showYear,
                })}
              >
                Год
              </div>
            </div>
          </div>
          <div className={cls.HeaderCenter}>
            <button onClick={onSwipeLeft}>{"<"}</button>
            <div className={cls.Month}>
              {showYear ? showedYear : showedMonthYearString}
            </div>
            <button onClick={onSwipeRight}>{">"}</button>
          </div>
          <div className={cls.HeaderRight}>
            <button onClick={onBack}>Назад</button>
          </div>
        </div>

        {!showYear && (
          <>
            <div className={cls.WeekDaysNames}>
              <div className={cls.WeekDayName}>#</div>
              {weekDayNames.map((name) => (
                <div className={cls.WeekDayName}>{name}</div>
              ))}
            </div>
            <div className={cls.Weeks}>
              {monthDates.map((week) => (
                <MonthWeekForm
                  key={String(week.weekIndex)}
                  onDayClick={onSelectDay}
                  week={week}
                />
              ))}
            </div>
          </>
        )}

        {showYear &&
          yearMonthDates.map((month) => (
            <YearMonthForm month={month} onClick={onSelectMonth} />
          ))}
      </div>
    </DynamicModuleLoader>
  );
});

export default MonthForm;
