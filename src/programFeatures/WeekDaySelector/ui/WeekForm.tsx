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
  getRouteTask,
} from "@/sharedComponents/config/routeConfig/routeConfig";
import { WeekDay } from "../model/types/weekSchema";
import { getDD_MM_YYYY } from "@/sharedComponents/lib/helpers/getDD_MM_YYYY";
import { DD_MM_YYYYtoDate } from "@/sharedComponents/lib/helpers/DD_MM_YYYYtoDate";
import { ReactComponent as Left } from "@/sharedComponents/assets/icons/left-arrow.svg";
import { ReactComponent as Right } from "@/sharedComponents/assets/icons/right-arrow.svg";
import { ReactComponent as Calendar } from "@/sharedComponents/assets/icons/calendar.svg";
import { ReactComponent as Link } from "@/sharedComponents/assets/icons/link.svg";
import { getAllHolidays } from "@/sharedComponents/lib/helpers/holidays/getAllHolidays";
import { UserAuthDataForm } from "@/serviceEntities/User";
import { DayTasksListForm } from "@/programFeatures/DayTasksList";
import { tasksType } from "@/serviceEntities/Task";
import { Button } from "@/sharedComponents/ui/Button";

export interface WeekFormProps {
  className?: string;
}

const initialReducers: ReducersList = {
  weekForm: weekReducer,
};

const WeekDayForm = memo(
  ({ day, onClick }: { day: WeekDay; onClick: (value: string) => void }) => {
    const onClickHandler = useCallback(() => {
      onClick(day.date);
    }, [day.date, onClick]);

    return (
      <div
        className={classNames(cls.WeekDay, {
          [cls.SelectedWeekDay]: day.isSelected,
          [cls.CurrentDate]: day.isCurrent,
          [cls.DayOffDate]: day.isDayOff || !!day.holiday,
        })}
        onClick={onClickHandler}
      >
        <div className={cls.WeekDayName}>{day.shortName}</div>
        <div className={cls.WeekDayDate}>{day.day}</div>
      </div>
    );
  }
);

const WeekForm = memo(({ className }: WeekFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { date } = useParams<{ date: string }>();
  const paramDate = useMemo(() => {
    return DD_MM_YYYYtoDate(String(date));
  }, [date]);

  useEffect(() => {
    if (
      getDD_MM_YYYY(paramDate) === getDD_MM_YYYY(new Date()) &&
      date !== getDD_MM_YYYY(new Date())
    ) {
      navigate(getRouteMain(getDD_MM_YYYY(new Date())));
    }
    dispatch(weekActions.setSelectedDay(paramDate));
  }, [date, dispatch, navigate, paramDate]);

  const selectedDay = useSelector(getSelectedDay);
  const showedWeekNumber = useSelector(getShowedWeekNumber);
  const showedYear = useSelector(getShowedYear);
  const showedMonthYearString = useSelector(getShowedMonthYearString);
  const weekDates = useSelector(getWeekDates);

  useEffect(() => {
    if (showedYear) {
      dispatch(weekActions.setHolidays(getAllHolidays(showedYear)));
    }
  }, [dispatch, showedYear]);

  const onSelectDay = useCallback(
    (value: string) => {
      const d = DD_MM_YYYYtoDate(value);
      dispatch(weekActions.setSelectedDay(d));
      const route = getRouteMain(value);
      navigate(route);
    },
    [dispatch, navigate]
  );

  const onSelectToday = useCallback(() => {
    onSelectDay(getDD_MM_YYYY(new Date()));
  }, [onSelectDay]);

  const onOpenCalendar = useCallback(() => {
    navigate(getRouteCalendar(getDD_MM_YYYY(selectedDay)));
  }, [navigate, selectedDay]);

  const onSwipeRight = useCallback(() => {
    dispatch(weekActions.showNextWeek());
  }, [dispatch]);

  const onSwipeLeft = useCallback(() => {
    dispatch(weekActions.showLastWeek());
  }, [dispatch]);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      setTouchStart(e.targetTouches[0].clientX);
      setTouchEnd(0);
    },
    []
  );

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchStart - touchEnd > 150 && touchEnd !== 0) {
      onSwipeRight();
    }
    if (touchStart - touchEnd < -150 && touchEnd !== 0) {
      onSwipeLeft();
    }
  }, [onSwipeLeft, onSwipeRight, touchEnd, touchStart]);


  const onCreate = useCallback(() => {
    const params: OptionalRecord<string, string> = {
      date: selectedDay.toISOString(),
      isFood: '0', //tasksType.all === tasksType.food ? "1" : "0",
    };

    navigate(getRouteTask("new"), params);
  }, [selectedDay, navigate]);

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div
        className={classNames(cls.WeekForm, {}, [className])}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={cls.Header}>
          <div className={cls.DatesHeader}>
            <div className={cls.DatesHeaderLeft}></div>
            <div className={cls.DatesHeaderCenter}>
              <div className={cls.Icon} onClick={onSwipeLeft}>
                <Left />
              </div>
              <div className={cls.Month} onClick={onOpenCalendar}>
                {showedMonthYearString}
                <div className={cls.Icon} onClick={onSwipeLeft}>
                  <Calendar />
                </div>
              </div>
              <div className={cls.Icon} onClick={onSwipeRight}>
                <Right />
              </div>
            </div>
            <div className={cls.DatesHeaderRight}>
              <UserAuthDataForm />
            </div>
          </div>

          <div className={cls.TodayLink} onClick={onSelectToday}>
            <span>cегодня</span> &nbsp; <Link />
          </div>

          <div className={cls.Dates}>
            <div className={cls.WeekDay}>
              <div className={cls.WeekDayName}>#</div>
              <div className={cls.WeekDayName}>{showedWeekNumber}</div>
            </div>

            {weekDates.map((d, index) => (
              <WeekDayForm day={d} key={index} onClick={onSelectDay} />
            ))}
          </div>
        </div>

        <div className={cls.Content}>
          <DayTasksListForm date={selectedDay} type={tasksType.all} />
        </div>

        <div className={cls.ButtonBlock}>
            <Button className={cls.Button} onClick={onCreate}>
              Создать
            </Button>
        </div>

        <div className={cls.Footer}>{/* Здесь будут кнопки */}</div>
      </div>
    </DynamicModuleLoader>
  );
});

export default WeekForm;
