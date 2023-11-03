import { memo, useCallback, useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import cls from "./TaskForm.module.scss";
import {
  getTaskFormIntervalLength,
  getTaskFormRepeatDaysForChanging,
} from "../model/selectors/selectors";
import { ReactComponent as Left } from "@/sharedComponents/assets/icons/left-arrow.svg";
import { ReactComponent as Right } from "@/sharedComponents/assets/icons/right-arrow.svg";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";
import { MoveTypeIfDayNotExists, WeekNumber } from "../model/types/task";
import {
  WeekNumberName,
  moveTypeIfDayNotExistsOptions,
  moveTypeIfDayNotExistsText,
  weekNumberOptions,
} from "../model/consts/interval";
import { ReactComponent as Delete } from "@/sharedComponents/assets/icons/delete.svg";
import { CustomSelect } from "@/sharedComponents/ui/AsyncSelect/AsyncSelect";
import { Button } from "@/sharedComponents/ui/Button";
import { Modal } from "@/sharedComponents/ui/Modal";

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

  onChangeMonthWeekDays: ({
    intervalIndex,
    weekDayNumber,
    weekNumber,
    moveTypeIfDayNotExists,
    isDelete,
  }: {
    intervalIndex: number;
    weekDayNumber: number;
    weekNumber: WeekNumber;
    moveTypeIfDayNotExists: MoveTypeIfDayNotExists | null;
    isDelete: boolean;
  }) => void;
}

const weekDayOptions = [
  { label: "Понедельник", value: 0 },
  { label: "Вторник", value: 1 },
  { label: "Среда", value: 2 },
  { label: "Четверг", value: 3 },
  { label: "Пятница", value: 4 },
  { label: "Суббота", value: 5 },
  { label: "Воскресенье", value: 6 },
];

export interface DayProps {
  day: number;
  selected: boolean;
  moveType: MoveTypeIfDayNotExists;
  onClick: (day: number) => void;
}

const MonthSelectorDay = memo(({ day, selected, onClick }: DayProps) => {
  const onClickHandler = useCallback(() => {
    onClick(day);
  }, [day, onClick]);

  return (
    <div className={cls.SelectorDayBlock}>
      <div
        className={classNames(cls.SelectorMonthDay, {
          [cls.SelectorSelectedMonthDay]: selected,
        })}
        onClick={onClickHandler}
      >
        {day}
        {/* //moveType */}
      </div>
    </div>
  );
});

export interface WeekProps {
  number: number;
  week: WeekNumber;
  moveTypeIfDayNotExists: MoveTypeIfDayNotExists;
  onDelete: (number: number, week: WeekNumber) => void;
}

const MonthSelectorWeek = memo(
  ({ number, week, moveTypeIfDayNotExists, onDelete }: WeekProps) => {
    const onDeleteHandler = useCallback(() => {
      onDelete(number, week);
    }, [number, onDelete, week]);

    return (
      <div className={cls.SelectorWeekBlock}>
        <div className={cls.SelectorWeek}>
          {WeekNumberName(week, number)}{" "}
          {(
            weekDayOptions.find((e) => e.value === number).label ?? ""
          ).toLocaleLowerCase()}{" "}
          {`(${
            moveTypeIfDayNotExists
              ? moveTypeIfDayNotExistsText[
                  moveTypeIfDayNotExists
                ].toLocaleLowerCase()
              : "не переносить"
          })`}
        </div>
        <div className={cls.SelectorWeekIcon} onClick={onDeleteHandler}>
          <Delete />
        </div>
      </div>
    );
  }
);

const MonthSelector = memo((props: Props) => {
  const { onClick, onChangeMonthWeekDays } = props;

  const days = useSelector(getTaskFormRepeatDaysForChanging);
  const length = useSelector(getTaskFormIntervalLength);

  const [currentIndex, setCurrentIndex] = useState(1);

  const [modalOpen, setModalOpen] = useState<number>();
  const [moveTypeModal, setMoveTypeModal] = useState<{
    value: MoveTypeIfDayNotExists;
    label: string;
  }>();

  const [weekForAdd, setWeekForAdd] = useState<{
    value: WeekNumber;
    label: string;
  }>();
  const [weekDayForAdd, setWeekDayForAdd] = useState<{
    value: number;
    label: string;
  }>();
  const [moveTypeForAdd, setMoveTypeForAdd] = useState<{
    value: MoveTypeIfDayNotExists;
    label: string;
  }>();

  const weekOptions = useMemo(
    () => weekNumberOptions(weekDayForAdd ? weekDayForAdd.value : 0),
    [weekDayForAdd]
  );
  useEffect(() => {
    if (weekDayForAdd && weekForAdd) {
      setWeekForAdd({
        value: weekForAdd.value,
        label: WeekNumberName(weekForAdd.value, weekDayForAdd.value),
      });
    }
  }, [weekDayForAdd]);

  const onChangeIndex = useCallback(
    (value: number) => {
      setCurrentIndex(value >= 1 && value <= length ? value : currentIndex);
    },
    [currentIndex, length]
  );

  const onClickHandler = useCallback(
    (day: number) => {
      if (
        [31, 30, 29].includes(day) &&
        !days.find(
          (d) =>
            d.dayFromBeginningInterval === day &&
            currentIndex === d.intervalPartIndex
        )
      ) {
        setModalOpen(day);
      } else {
        onClick({
          intervalIndex: currentIndex,
          dayNumber: day,
          moveTypeIfDayNotExists: null,
        });
      }
    },
    [currentIndex, days, onClick]
  );

  const onClickEndHandler = useCallback(() => {
    onClick({
      intervalIndex: currentIndex,
      dayNumber: modalOpen,
      moveTypeIfDayNotExists: moveTypeModal ? moveTypeModal.value : null,
    });
    setModalOpen(undefined);
  }, [currentIndex, modalOpen, moveTypeModal, onClick]);

  const onDeleteHandler = useCallback(
    (weekDayNumber: number, weekNumber: WeekNumber) => {
      onChangeMonthWeekDays({
        intervalIndex: currentIndex,
        moveTypeIfDayNotExists: null,
        weekDayNumber,
        weekNumber,
        isDelete: true,
      });
    },
    [currentIndex, onChangeMonthWeekDays]
  );

  const onAddHandler = useCallback(() => {
    if (!weekDayForAdd || !weekForAdd) return;
    onChangeMonthWeekDays({
      intervalIndex: currentIndex,
      moveTypeIfDayNotExists: moveTypeForAdd ? moveTypeForAdd.value : null,
      weekDayNumber: weekDayForAdd.value,
      weekNumber: weekForAdd.value,
      isDelete: false,
    });
    setWeekForAdd(null);
    setWeekDayForAdd(null);
    setMoveTypeForAdd(null);
  }, [
    currentIndex,
    moveTypeForAdd,
    onChangeMonthWeekDays,
    weekDayForAdd,
    weekForAdd,
  ]);

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
      className={cls.MonthSelector}
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
          <div className={cls.Month}>Месяц&nbsp;№{currentIndex}</div>
          <div className={cls.Icon} onClick={onSwipeRight}>
            {length > 1 && <Right />}
          </div>
        </div>
        <div className={cls.DatesHeaderRight}></div>
      </div>

      <div className={cls.MonthSelectorMonth}>
        {[
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
        ].map((e) => (
          <MonthSelectorDay
            day={e}
            moveType={
              days.find(
                (d) =>
                  d.dayFromBeginningInterval === e &&
                  currentIndex === d.intervalPartIndex
              )?.moveTypeIfDayNotExists
            }
            onClick={onClickHandler}
            key={e}
            selected={
              !!days.find(
                (d) =>
                  d.dayFromBeginningInterval === e &&
                  currentIndex === d.intervalPartIndex
              )
            }
          />
        ))}
      </div>

      <div className={cls.MonthSelectorMonthWeeks}>
        <div className={cls.MonthSelectorMonthWeeksCreating}>
          <div className={cls.CreatingHeader}>
            <div className={cls.CreatingHeaderText}>
              Настройки по дням недели
            </div>
            <Button className={cls.Button} onClick={onAddHandler}>
              Добавить
            </Button>
          </div>
          <div className={cls.InputBlock}>
            <div className={cls.Label}>Номер недели</div>

            <CustomSelect
              className={cls.Input}
              value={weekForAdd}
              onChange={(val) => setWeekForAdd(val)}
              options={weekOptions}
            />
          </div>
          <div className={cls.InputBlock}>
            <div className={cls.Label}>День недели</div>

            <CustomSelect
              className={cls.Input}
              value={weekDayForAdd}
              onChange={(val) => setWeekDayForAdd(val)}
              options={weekDayOptions}
            />
          </div>
          <div className={cls.LabelTop}>
            Переносить дату, если ее не существует?
          </div>
          <div className={cls.InputBlock}>
            <CustomSelect
              className={classNames(cls.Input, {}, [cls.OneInput])}
              value={moveTypeForAdd || { label: "Не переносить", value: null }}
              onChange={(val) => setMoveTypeForAdd(val)}
              options={moveTypeIfDayNotExistsOptions}
              isClearable
            />
          </div>
        </div>
        <div className={cls.MonthSelectorMonthWeeksList}>
          {days
            .filter((e) => e.dayFromBeginningInterval === null)
            .map((e) => (
              <MonthSelectorWeek
                number={e.weekDayNumber}
                week={e.weekNumber}
                moveTypeIfDayNotExists={e.moveTypeIfDayNotExists}
                onDelete={onDeleteHandler}
                key={`${e.weekDayNumber}_${e.weekNumber}`}
              />
            ))}
        </div>
      </div>
    </div>
  );
});

export default MonthSelector;
