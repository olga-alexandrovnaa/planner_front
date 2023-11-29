import { memo, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import cls from "./TaskForm.module.scss";
import {
  getTaskFormIntervalLength,
  getTaskFormRepeatDaysForChanging,
} from "../model/selectors/selectors";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";
import { MoveTypeIfDayNotExists } from "../model/types/task";

export interface Props {
  onClick: ({
    intervalIndex,
    dayNumber,
    moveTypeIfDayNotExists,
  }: {
    intervalIndex: number;
    dayNumber: number;
    moveTypeIfDayNotExists: MoveTypeIfDayNotExists | null;
  }) => void;
}

export interface DayProps {
  day: number;
  selected: boolean;
  onClick: (day: number) => void;
}

const DaySelectorDay = memo(({ day, selected, onClick }: DayProps) => {
  const onClickHandler = useCallback(() => {
    onClick(day);
  }, [day, onClick]);

  return (
    <div className={cls.SelectorDayBlock}>
      <div
        className={classNames(cls.SelectorDaysDay, {
          [cls.SelectorSelectedDaysDay]: selected,
        })}
        onClick={onClickHandler}
      >
        {day}
      </div>
    </div>
  );
});

const DaySelector = memo((props: Props) => {
  const { onClick } = props;

  const days = useSelector(getTaskFormRepeatDaysForChanging);
  const length = useSelector(getTaskFormIntervalLength);

  const onClickHandler = useCallback(
    (day: number) => {
      onClick({
        intervalIndex: null,
        dayNumber: day,
        moveTypeIfDayNotExists: null,
      });
    },
    [onClick]
  );

  const data = useMemo(() => {
    const arr: number[] = [];
    for (let index = 1; index <= length; index++) {
      arr.push(index);
    }
    return arr;
  }, [length]);

  if (!days) return null;

  return (
    <div className={cls.DaySelector}>
      <div className={cls.DaySelectorDays}>
        {data.map((e) => (
          <DaySelectorDay
            day={e}
            onClick={onClickHandler}
            key={e}
            selected={!!days.find((d) => d.dayFromBeginningInterval === e)}
          />
        ))}
      </div>
    </div>
  );
});

export default DaySelector;
