import { memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import cls from "./TaskForm.module.scss";
import {
  getTaskFormIntervalLength,
  getTaskFormRepeatDaysForChanging,
} from "../model/selectors/selectors";
import { ReactComponent as Left } from "@/sharedComponents/assets/icons/left-arrow.svg";
import { ReactComponent as Right } from "@/sharedComponents/assets/icons/right-arrow.svg";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";

export interface Props {
  onClick: (intervalIndex: number, dayNumber: number) => void;
}

const weekDayNames = [
  { name: "Понедельник", day: 1 },
  { name: "Вторник", day: 2 },
  { name: "Среда", day: 3 },
  { name: "Четверг", day: 4 },
  { name: "Пятница", day: 5 },
  { name: "Суббота", day: 6 },
  { name: "Воскресенье", day: 7 },
];

export interface DayProps {
  day: number;
  selected: boolean;
  name: string;
  onClick: (day: number) => void;
}

const WeekSelectorDay = memo(({ day, selected, name, onClick }: DayProps) => {
  const onClickHandler = useCallback(() => {
    onClick(day);
  }, [day, onClick]);

  return (
    <div className={cls.SelectorDayBlock}>
      <div
        className={classNames(cls.SelectorDay, {
          [cls.SelectorSelectedDay]: selected,
        })}
        onClick={onClickHandler}
      >
        {name}
      </div>
    </div>
  );
});

const WeekSelector = memo((props: Props) => {
  const { onClick } = props;

  const days = useSelector(getTaskFormRepeatDaysForChanging);

  const [currentIndex, setCurrentIndex] = useState(1);

  const onChangeIndex = useCallback(
    (value: number) => {
      setCurrentIndex(
        value >= 1 && value <= days.length ? value : currentIndex
      );
    },
    [currentIndex, days.length]
  );

  const onClickHandler = useCallback(
    (day: number) => {
      onClick(currentIndex, day);
    },
    [currentIndex, onClick]
  );

  const onSwipeRight = useCallback(() => {
    onChangeIndex(currentIndex + 1);
  }, [currentIndex, onChangeIndex]);

  const onSwipeLeft = useCallback(() => {
    onChangeIndex(currentIndex - 1);
  }, [currentIndex, onChangeIndex]);

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

  if (!days) return null;

  return (
    <div
      className={cls.WeekSelector}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={cls.SelectorHeader}>
        <div className={cls.DatesHeaderLeft}></div>
        <div className={cls.DatesHeaderCenter}>
          <div className={cls.Icon} onClick={onSwipeLeft}>
            <Left />
          </div>
          <div className={cls.Month}>Неделя&nbsp;№{currentIndex}</div>
          <div className={cls.Icon} onClick={onSwipeRight}>
            <Right />
          </div>
        </div>
        <div className={cls.DatesHeaderRight}></div>
      </div>

      <div className={cls.WeekSelectorWeek}>
        {weekDayNames.map((e) => (
          <WeekSelectorDay
            day={e.day}
            name={e.name}
            onClick={onClickHandler}
            key={e.day}
            selected={
              !!days.find(
                (d) =>
                  d.dayFromBeginningInterval === e.day &&
                  currentIndex === d.intervalPartIndex
              )
            }
          />
        ))}
      </div>
    </div>
  );
});

export default WeekSelector;
