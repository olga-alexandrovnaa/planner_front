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
  getCurrentSelectedTracker,
  getUserTrackers,
  getTrackerProgressInfo,
  getMoneyInfo,
  getRemainder,
  getInvestment,
} from "../model/selectors/selectors";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRouteCalendar,
  getRouteMain,
} from "@/sharedComponents/config/routeConfig/routeConfig";
import {
  MonthDay,
  MonthWeek,
  TaskShort,
  YearMonth,
} from "../model/types/monthSchema";
import { DD_MM_YYYYtoDate } from "@/sharedComponents/lib/helpers/DD_MM_YYYYtoDate";
import { ReactComponent as Left } from "@/sharedComponents/assets/icons/left-arrow.svg";
import { ReactComponent as Right } from "@/sharedComponents/assets/icons/right-arrow.svg";
import { ReactComponent as Close } from "@/sharedComponents/assets/icons/close.svg";
import { ReactComponent as Link } from "@/sharedComponents/assets/icons/link.svg";
import { getAllHolidays } from "@/sharedComponents/lib/helpers/holidays/getAllHolidays";
import { getDD_MM_YYYY } from "@/sharedComponents/lib/helpers/getDD_MM_YYYY";
import { fetchTrackers } from "../model/services/fetchTrackers";
import { fetchTrackerProgress } from "../model/services/fetchTrackerProgress";
import { CustomSelect } from "@/sharedComponents/ui/AsyncSelect/AsyncSelect";
import { fetchMonthWalletInfo } from "../model/services/fetchMonthWalletInfo";
import { Input } from "@/sharedComponents/ui/Inputs/Input";

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
    isPlanned,
    isChecked,
    income,
    outcome,
    remainder,
  }: {
    day: MonthDay | null;
    onClick?: (value: string) => void;
    isPlanned?: boolean;
    isChecked?: boolean;
    income?: number;
    outcome?: number;
    remainder?: number;
  }) => {
    const onClickHandler = useCallback(() => {
      if (!day || !onClick) return;
      onClick(day?.date);
    }, [day, onClick]);

    if (!day) {
      return <div className={cls.WeekDay}>&nbsp;</div>;
    }
    return (
      <div
        className={classNames(cls.WeekDay, {
          [cls.isPlanned]: isPlanned,
          [cls.isChecked]: isChecked,
          [cls.SelectedWeekDay]: day.isSelected,
          [cls.CurrentDate]: day.isCurrent,
          [cls.DayOffDate]: day.isDayOff || !!day.holiday,
        })}
        onClick={onClickHandler}
      >
        <div className={cls.WeekDayDate}>{day.day}</div>

        {!!income && <div className={cls.WeekDayIncome}>{income}</div>}
        {!!outcome && <div className={cls.WeekDayOutcome}>{outcome}</div>}
        {!!remainder && <div className={cls.WeekDayRemainder}>{remainder}</div>}
      </div>
    );
  }
);

const MonthWeekForm = memo(
  ({
    isYear,
    week,
    onDayClick,
  }: {
    isYear?: boolean;
    week: MonthWeek;
    onDayClick?: (value: string) => void;
  }) => {
    const trackerProgressInfo = useSelector(getTrackerProgressInfo);
    const trackerMoneyInfo = useSelector(getMoneyInfo);

    console.log(trackerProgressInfo, trackerMoneyInfo, week);
    const isPlanned = true;
    const isChecked = true;
    const income = 111220;
    const outcome = 135220;
    const remainder = 124330;

    return (
      <div className={cls.Week}>
        <div className={cls.WeekNumber}>{week.weekNumber}</div>
        {week.days.map((d, index) => (
          <MonthDayForm
            day={d}
            onClick={onDayClick}
            key={index}
            isPlanned={isPlanned}
            isChecked={isChecked}
            income={!isYear && income}
            outcome={!isYear && outcome}
            remainder={!isYear && remainder}
          />
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
    }, [month.monthIndex, onClick]);

    return (
      <div
        className={classNames(cls.Month, {
          [cls.SelectedMonth]: month.isSelected,
        })}
        key={month.monthIndex}
        onClick={onClickHandler}
      >
        <div className={cls.MonthName}>{month.name}</div>

        <div className={cls.WeekDaysNames}>
          <div className={cls.WeekDayName}>#</div>
          {weekDayNames.map((name) => (
            <div className={cls.WeekDayName} key={name}>
              {name}
            </div>
          ))}
        </div>

        <div className={cls.Weeks}>
          {month.weeks.map((week) => (
            <MonthWeekForm key={String(week.weekIndex)} week={week} isYear={true}/>
          ))}
        </div>
      </div>
    );
  }
);

const MonthForm = memo(({ className }: MonthFormProps) => {
  //получение данных
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { date } = useParams<{ date: string }>();
  const paramDate = useMemo(() => DD_MM_YYYYtoDate(date), [date]);
  useEffect(() => {
    dispatch(monthActions.setSelectedDay(paramDate));
  }, [dispatch, paramDate]);

  //даты
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

  useEffect(() => {
    if (showedYear) {
      dispatch(monthActions.setHolidays(getAllHolidays(showedYear)));
    }
  }, [dispatch, showedYear]);

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

  const onSelectToday = useCallback(() => {
    navigate(getRouteCalendar(getDD_MM_YYYY(new Date())));
  }, [navigate]);

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

  //трекер
  const currentSelectedTracker = useSelector(getCurrentSelectedTracker);
  const userTrackers = useSelector(getUserTrackers);

  const userTrackersOptions = useMemo(() => {
    return userTrackers
      ? userTrackers.map((e) => ({
          value: e.id,
          label: e.name,
          data: e,
        }))
      : [];
  }, [userTrackers]);

  const currentSelectedTrackerValue = useMemo(() => {
    return currentSelectedTracker
      ? {
          value: currentSelectedTracker.id,
          label: currentSelectedTracker.name,
          data: currentSelectedTracker,
        }
      : undefined;
  }, [currentSelectedTracker]);

  const setCurrentSelectedTracker = useCallback(
    (value: { value: number; label: string; data: TaskShort }) => {
      dispatch(monthActions.setCurrentSelectedTracker(value.data));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchTrackers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTrackerProgress());
  }, [dispatch, currentSelectedTracker]);

  //деньги
  const trackerMoneyInfo = useSelector(getMoneyInfo);
  const remainder = useSelector(getRemainder);
  const investment = useSelector(getInvestment);

  const setRemainder = useCallback(
    async (value: number) => {
      await dispatch(monthActions.setRemainder(value));
      dispatch(fetchMonthWalletInfo());
    },
    [dispatch]
  );

  const setInvestment = useCallback(
    async (value: number) => {
      await dispatch(monthActions.setRemainder(value));
      dispatch(fetchMonthWalletInfo());
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchMonthWalletInfo());
  }, [dispatch, showedMonthYearString]);

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div
        className={classNames(cls.MonthForm, {}, [className])}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={cls.Header}>
          <div className={cls.DatesHeader}>
            <div className={cls.DatesHeaderLeft}>
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
            <div className={cls.DatesHeaderCenter}>
              <div className={cls.Icon} onClick={onSwipeLeft}>
                <Left />
              </div>
              <div className={cls.Month}>
                {showYear ? showedYear : showedMonthYearString}
              </div>
              <div className={cls.Icon} onClick={onSwipeRight}>
                <Right />
              </div>
            </div>
            <div className={cls.DatesHeaderRight}>
              <div className={cls.Icon} onClick={onBack}>
                <Close />
              </div>
            </div>
          </div>

          <div className={cls.MonthNavbar}>
            <CustomSelect
              className={cls.Selector}
              value={currentSelectedTrackerValue}
              onChange={setCurrentSelectedTracker}
              options={userTrackersOptions}
            />

            <div className={cls.MonthNavbarRight}>
              <div className={cls.MoneyDesc}>
                <div className={cls.MoneyDescCircleGreen}></div>
                <span>&nbsp;Доход</span>
                &nbsp;&nbsp;
                <div className={cls.MoneyDescCircleRed}></div>
                <span>&nbsp;Расход</span>
                &nbsp;&nbsp;
                <div className={cls.MoneyDescCircleBlue}></div>
                <span>&nbsp;Баланс</span>
              </div>
              <div className={cls.TodayLink} onClick={onSelectToday}>
                <span>cегодня</span> &nbsp; <Link />
              </div>
            </div>
          </div>

          {!showYear && (
            <div className={cls.WeekDaysNames}>
              <div className={cls.WeekDayName}>#</div>
              {weekDayNames.map((name) => (
                <div key={name} className={cls.WeekDayName}>
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>

        {!showYear && (
          <>
            <div className={cls.Content}>
              <div className={cls.Weeks}>
                {monthDates.map((week) => (
                  <MonthWeekForm
                    key={String(week.weekIndex)}
                    onDayClick={onSelectDay}
                    week={week}
                  />
                ))}
              </div>

              <div className={cls.MoneyInfoBlock}>
                <div className={cls.MoneyInfoBlockLeft}>
                  <div className={cls.InputBlock}>
                    <div className={cls.Label}>На начало</div>
                    <Input
                      className={cls.Input}
                      value={remainder ?? undefined}
                      onChange={setRemainder}
                      textAfterInput="₽"
                      type="number"
                    />
                  </div>
                  <div className={cls.InputBlock}>
                    <div className={cls.Label}>Отложить</div>
                    <Input
                      className={cls.Input}
                      value={investment ?? undefined}
                      onChange={setInvestment}
                      textAfterInput="₽"
                      type="number"
                    />
                  </div>
                </div>

                <div className={cls.MoneyInfoBlockRight}>
                  <div className={cls.MoneyInfoBlockLabel}>
                    Остаток на конец месяца:
                  </div>
                  {!!trackerMoneyInfo && (
                    <div className={cls.MoneyInfoBlockEndRemainder}>
                      {trackerMoneyInfo.endRemainder} ₽
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* <div className={cls.Footer}>
              <div className={cls.FooterContent}>
                
              </div>
            </div> */}
          </>
        )}

        {showYear && (
          <div className={cls.Content}>
            <div className={cls.Months}>
              <div className={cls.Margin}></div>
              {yearMonthDates.map((month) => (
                <YearMonthForm
                  month={month}
                  onClick={onSelectMonth}
                  key={month.monthIndex}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </DynamicModuleLoader>
  );
});

export default MonthForm;
