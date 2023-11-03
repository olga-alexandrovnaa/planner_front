import { memo, useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import cls from "./TaskForm.module.scss";
import {
  getTaskFormIntervalLength,
  getTaskFormRepeatYearDaysForChanging,
} from "../model/selectors/selectors";
import { ReactComponent as Left } from "@/sharedComponents/assets/icons/left-arrow.svg";
import { ReactComponent as Right } from "@/sharedComponents/assets/icons/right-arrow.svg";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";
import { MoveTypeIfDayNotExists } from "../model/types/task";
import { Modal } from "@/sharedComponents/ui/Modal";
import { CustomSelect } from "@/sharedComponents/ui/AsyncSelect/AsyncSelect";
import { moveTypeIfDayNotExistsOptions } from "../model/consts/interval";
import { Button } from "@/sharedComponents/ui/Button";

export interface Props {
  onChangeYearDays: ({
    intervalIndex,
    dayNumber,
    monthNumber,
    moveTypeIfDayNotExists,
    isDelete,
  }: {
    intervalIndex: number;
    dayNumber: number;
    monthNumber: number;
    moveTypeIfDayNotExists: MoveTypeIfDayNotExists | null;
    isDelete: boolean;
  }) => void;
}

const monthDays = [
  { name: "Январь", days: 31 },
  { name: "Февраль", days: 29 },
  { name: "Март", days: 31 },
  { name: "Апрель", days: 30 },
  { name: "Май", days: 31 },
  { name: "Июнь", days: 30 },
  { name: "Июль", days: 31 },
  { name: "Август", days: 31 },
  { name: "Сентябрь", days: 30 },
  { name: "Октябрь", days: 31 },
  { name: "Ноябрь", days: 30 },
  { name: "Декабрь", days: 31 },
];

export interface DayProps {
  day: number;
  selected: boolean;
  onClick: (day: number) => void;
}

const YearSelectorDay = memo(({ day, selected, onClick }: DayProps) => {
  const onClickHandler = useCallback(() => {
    onClick(day);
  }, [day, onClick]);

  return (
    <div className={cls.SelectorDayBlock} onClick={onClickHandler}>
      <div
        className={classNames(cls.SelectorYearDay, {
          [cls.SelectorSelectedYearDay]: selected,
        })}
      >
        {day}
      </div>
    </div>
  );
});

export interface MonthProps {
  currentIndex: number;
  month: number;
  onClick: (
    currentIndex: number,
    day: number,
    month: number,
    isDelete: boolean
  ) => void;
}

const YearSelectorMonth = memo(
  ({ currentIndex, month, onClick }: MonthProps) => {
    const days = useSelector(getTaskFormRepeatYearDaysForChanging);

    const onClickHandler = useCallback(
      (day: number) => {
        onClick(
          currentIndex,
          day,
          month,
          !!days.find(
            (d) =>
              d.yearDateDay === day &&
              d.yearDateMonth === month &&
              currentIndex === d.intervalPartIndex
          )
        );
      },
      [currentIndex, days, month, onClick]
    );

    const arr = useMemo(() => {
      const data = [];
      for (let index = 0; index < monthDays[month].days; index++) {
        data.push(index + 1);
      }
      return data;
    }, [month]);

    return (
      <div className={cls.SelectorMonthBlock}>
        <div className={cls.SelectorMonthHeader}>{monthDays[month].name}</div>
        <div className={cls.SelectorMonth}>
          {arr.map((day) => (
            <YearSelectorDay
              day={day}
              onClick={onClickHandler}
              key={day}
              selected={
                !!days.find(
                  (d) =>
                    d.yearDateDay === day &&
                    d.yearDateMonth === month &&
                    currentIndex === d.intervalPartIndex
                )
              }
            />
          ))}
        </div>
      </div>
    );
  }
);

const YearSelector = memo((props: Props) => {
  const { onChangeYearDays } = props;

  const days = useSelector(getTaskFormRepeatYearDaysForChanging);
  const length = useSelector(getTaskFormIntervalLength);

  const [currentIndex, setCurrentIndex] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [moveTypeModal, setMoveTypeModal] = useState<{
    value: MoveTypeIfDayNotExists;
    label: string;
  }>();

  const onChangeIndex = useCallback(
    (value: number) => {
      setCurrentIndex(value >= 1 && value <= length ? value : currentIndex);
    },
    [currentIndex, length]
  );

  const onClickHandler = useCallback(
    (currentIndex: number, day: number, month: number, isDelete: boolean) => {
      if (day === 29 && month === 1 && !isDelete) {
        setModalOpen(true);
      } else {
        onChangeYearDays({
          intervalIndex: currentIndex,
          dayNumber: day,
          monthNumber: month,
          moveTypeIfDayNotExists: null,
          isDelete: isDelete,
        });
      }
    },
    [onChangeYearDays]
  );

  const onClickEndHandler = useCallback(() => {
    onChangeYearDays({
      intervalIndex: currentIndex,
      dayNumber: 29,
      monthNumber: 1,
      moveTypeIfDayNotExists: moveTypeModal ? moveTypeModal.value : null,
      isDelete: false,
    });
    setModalOpen(undefined);
  }, [currentIndex, moveTypeModal, onChangeYearDays]);

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
      className={cls.YearSelector}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {!!modalOpen && (
        <Modal isOpen={true}>
          <div className={cls.Data}>
            <div className={cls.LabelTopCenter}>
              Переносить дату, если ее не существует?
            </div>
            <div className={cls.InputBlock}>
              <CustomSelect
                className={classNames(cls.Input, {}, [cls.OneInput])}
                value={moveTypeModal || { label: "Не переносить", value: null }}
                onChange={(val) => setMoveTypeModal(val)}
                options={moveTypeIfDayNotExistsOptions}
                isClearable
              />
            </div>
            <Button onClick={onClickEndHandler} className={cls.ModalButton}>
              ОК
            </Button>
          </div>
        </Modal>
      )}

      <div className={cls.SelectorHeader}>
        <div className={cls.DatesHeaderLeft}></div>
        <div className={cls.DatesHeaderCenter}>
          <div className={cls.Icon} onClick={onSwipeLeft}>
            {length > 1 && <Left />}
          </div>
          <div className={cls.Month}>Год&nbsp;№{currentIndex}</div>
          <div className={cls.Icon} onClick={onSwipeRight}>
            {length > 1 && <Right />}
          </div>
        </div>
        <div className={cls.DatesHeaderRight}></div>
      </div>

      <div className={cls.YearSelectorMonths}>
        {monthDays.map((e, index) => (
          <YearSelectorMonth
            month={index}
            onClick={onClickHandler}
            key={index}
            currentIndex={currentIndex}
          />
        ))}
      </div>
    </div>
  );
});

export default YearSelector;
