import { useSelector } from "react-redux";
import { memo, useCallback, useState, useEffect, useMemo } from "react";
import cls from "./TaskForm.module.scss";
// import { getUserAuthData, getuserName } from "../model/selectors/selectors";
import {
  DynamicModuleLoader,
  ReducersList,
} from "@/sharedComponents/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";
// import { userActions, userReducer } from "..";
import { useAppDispatch } from "@/sharedComponents/lib/hooks/useAppDispatch/useAppDispatch";
import { ReactComponent as Close } from "@/sharedComponents/assets/icons/close.svg";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { taskActions, taskReducer } from "../model/slice/taskSlice";
import {
  getCreateTaskDtoForService,
  getTask,
  getTaskCreateMode,
  getTaskError,
  getTaskForm,
  getUpdateTaskDtoForService,
} from "../model/selectors/selectors";
import { create } from "../model/services/create";
import { getRouteMain } from "@/sharedComponents/config/routeConfig/routeConfig";
import { getDD_MM_YYYY } from "@/sharedComponents/lib/helpers/getDD_MM_YYYY";
import { update } from "../model/services/update";
import { fetchTask } from "../model/services/fetch";
import { Button } from "@/sharedComponents/ui/Button";
import { Input } from "@/sharedComponents/ui/Inputs/Input";
import { startOfDay } from "date-fns";
import { CustomSelect } from "@/sharedComponents/ui/AsyncSelect/AsyncSelect";
import { getDD_Month_NotReqYYYY } from "@/sharedComponents/lib/helpers/getDD_Month_NotReqYYYY";
import {
  IntervalType,
  MoveTypeIfDayNotExists,
  UpdateTaskDto,
  WeekNumber,
} from "../model/types/task";
import WeekSelector from "./WeekSelector";
import {
  intervalTypeName,
  intervalTypeOptions,
} from "../model/consts/interval";
import { isArray, isObject } from "lodash";
import MonthSelector from "./MonthSelector";
import YearSelector from "./YearSelector";
import { isoString } from "@/sharedComponents/lib/helpers/isoString";

export interface TaskFormProps {
  className?: string;
}

const initialReducers: ReducersList = {
  task: taskReducer,
};

const TaskForm = memo(({ className }: TaskFormProps) => {
  const dispatch = useAppDispatch();
  const form = useSelector(getTaskForm);
  const isCreateMode = useSelector(getTaskCreateMode);
  const error = useSelector(getTaskError);

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const [openModalDays, setOpenModalDays] = useState(false);
  const [openModalYearDays, setOpenModalYearDays] = useState(false);

  const intervalOptions = useMemo(
    () => intervalTypeOptions(form?.intervalLength ?? 0),
    [form?.intervalLength]
  );

  useEffect(() => {
    if (id === "new") {
      const dateFromUrl = searchParams.get("date") as string;
      const isFoodFromUrl = searchParams.get("isFood") as string;
      dispatch(
        taskActions.setCreateMode({
          date: dateFromUrl
            ? dateFromUrl
            : isoString(startOfDay(new Date())),
          isFood: isFoodFromUrl === "1" ? true : false,
        })
      );
    } else {
      dispatch(taskActions.setId(Number(id)));
      dispatch(fetchTask());
    }
  }, [dispatch, id, searchParams]);

  const onSave = useCallback(async () => {
    if (isCreateMode) {
      await dispatch(create());
    } else {
      await dispatch(update());
    }
    if (error) alert(error);
    if (form?.date) navigate(getRouteMain(getDD_MM_YYYY(new Date(form?.date))));
  }, [dispatch, error, form?.date, isCreateMode, navigate]);

  const onBack = useCallback(() => {
    if (form?.date) navigate(getRouteMain(getDD_MM_YYYY(new Date(form?.date))));
  }, [form?.date, navigate]);

  const onChangeName = useCallback(
    (val: string) => {
      dispatch(taskActions.onChangeName(val));
    },
    [dispatch]
  );
  const onChangeIsTracker = useCallback(
    (val: boolean) => {
      dispatch(taskActions.onChangeIsTracker(val));
    },
    [dispatch]
  );
  const onChangeIntervalLength = useCallback(
    (val: number) => {
      dispatch(taskActions.onChangeIntervalLength(val));
    },
    [dispatch]
  );
  const onChangeIntervalPart = useCallback(
    (data: { value: IntervalType; label: string }) => {
      dispatch(taskActions.onChangeIntervalPart(data.value));
    },
    [dispatch]
  );
  const onChangeRepeatCount = useCallback(
    (val: number | undefined) => {
      dispatch(taskActions.onChangeRepeatCount(val));
    },
    [dispatch]
  );
  const onChangeMoneyIncomePlan = useCallback(
    (val: number | undefined) => {
      dispatch(taskActions.onChangeMoneyIncomePlan(val));
    },
    [dispatch]
  );
  const onChangeMoneyOutcomePlan = useCallback(
    (val: number | undefined) => {
      dispatch(taskActions.onChangeMoneyOutcomePlan(val));
    },
    [dispatch]
  );
  const onChangeMoneyIncomeFact = useCallback(
    (val: number | undefined) => {
      dispatch(taskActions.onChangeMoneyIncomeFact(val));
    },
    [dispatch]
  );
  const onChangeMoneyOutcomeFact = useCallback(
    (val: number | undefined) => {
      dispatch(taskActions.onChangeMoneyOutcomeFact(val));
    },
    [dispatch]
  );
  const onChangeMoneyDeadline = useCallback(
    (val: string | undefined) => {
      dispatch(taskActions.onChangeMoneyDeadline(val));
    },
    [dispatch]
  );
  const onChangeNote = useCallback(
    (val: string | undefined) => {
      dispatch(taskActions.onChangeNote(val));
    },
    [dispatch]
  );

  const onStartChangeDays = useCallback(() => {
    dispatch(taskActions.setDaysForChanging());
    setOpenModalDays(true);
  }, [dispatch]);

  const onStartChangeYearDays = useCallback(() => {
    dispatch(taskActions.setYearDaysForChanging());
    setOpenModalYearDays(true);
  }, [dispatch]);

  const onEndChangeDays = useCallback(() => {
    setOpenModalDays(false);
  }, []);

  const onEndChangeYearDays = useCallback(() => {
    setOpenModalYearDays(false);
  }, []);

  const onSaveDays = useCallback(() => {
    dispatch(taskActions.onSaveDays());
    onEndChangeDays();
  }, [dispatch, onEndChangeDays]);

  const onSaveYearDays = useCallback(() => {
    dispatch(taskActions.onSaveYearDays());
    onEndChangeYearDays();
  }, [dispatch, onEndChangeYearDays]);

  const onChangeDays = useCallback(
    ({
      intervalIndex,
      dayNumber,
      moveTypeIfDayNotExists,
    }: {
      intervalIndex: number;
      dayNumber: number;
      moveTypeIfDayNotExists: MoveTypeIfDayNotExists | null;
    }) => {
      dispatch(
        taskActions.onChangeDays({
          intervalIndex,
          dayNumber,
          moveTypeIfDayNotExists,
        })
      );
    },
    [dispatch]
  );
  const onChangeMonthWeekDays = useCallback(
    ({
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
    }) => {
      dispatch(
        taskActions.onChangeMonthWeekDays({
          intervalIndex,
          weekNumber,
          weekDayNumber,
          moveTypeIfDayNotExists,
          isDelete,
        })
      );
    },
    [dispatch]
  );

  const onChangeYearDays = useCallback(
    ({
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
    }) => {
      dispatch(
        taskActions.onChangeYearDays({
          intervalIndex,
          dayNumber,
          monthNumber,
          moveTypeIfDayNotExists,
          isDelete,
        })
      );
    },
    [dispatch]
  );

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div className={classNames(cls.TaskForm, {}, [className])}>
        <div className={cls.Header}>
          <div className={cls.HeaderText}></div>
          {!openModalDays && !openModalYearDays && (
            <div className={cls.HeaderCloseIcon} onClick={onBack}>
              {<Close />}
            </div>
          )}
          {openModalDays && (
            <div className={cls.HeaderCloseIcon} onClick={onEndChangeDays}>
              {<Close />}
            </div>
          )}
          {openModalYearDays && (
            <div className={cls.HeaderCloseIcon} onClick={onEndChangeYearDays}>
              {<Close />}
            </div>
          )}
        </div>
        {!openModalDays && !openModalYearDays && (
          <div className={cls.Data}>
            <Input
              className={cls.MainInput}
              placeholder={"Название"}
              value={form?.name || undefined}
              onChange={onChangeName}
            />

            <div className={cls.Selector}>
              <div
                onClick={() => onChangeIsTracker(false)}
                className={classNames(cls.SelectorItem, {
                  [cls.SelectorItemActive]: !form?.isTracker,
                })}
              >
                Задача
              </div>
              <div
                onClick={() => onChangeIsTracker(true)}
                className={classNames(cls.SelectorItem, {
                  [cls.SelectorItemActive]: form?.isTracker,
                })}
              >
                Трекер
              </div>
            </div>

            {form?.isTracker && (
              <>
                <div className={cls.InputBlock}>
                  <div className={cls.Label}>Интервал</div>
                  <Input
                    className={cls.NumberInput}
                    value={form?.intervalLength ?? undefined}
                    type="number"
                    onChange={onChangeIntervalLength}
                  />

                  <CustomSelect
                    className={cls.Input}
                    value={{
                      value: form?.intervalPart,
                      label: intervalTypeName(
                        form?.intervalPart,
                        form?.intervalLength ? form?.intervalLength : 1
                      ),
                    }}
                    onChange={onChangeIntervalPart}
                    options={intervalOptions}
                  />

                  {form.intervalPart === IntervalType.Week && (
                    <Button className={cls.Button} onClick={onStartChangeDays}>
                      Дни&nbsp;&#128396;
                    </Button>
                  )}
                  {form.intervalPart === IntervalType.Month && (
                    <Button className={cls.Button} onClick={onStartChangeDays}>
                      Дни&nbsp;&#128396;
                    </Button>
                  )}
                  {form.intervalPart === IntervalType.Year && (
                    <Button
                      className={cls.Button}
                      onClick={onStartChangeYearDays}
                    >
                      Дни&nbsp;&#128396;
                    </Button>
                  )}
                </div>
                <div className={cls.InputBlock}>
                  <div className={cls.Label}>Кол-во повторов</div>
                  <Input
                    className={cls.Input} //бессрочно или число
                    value={form?.repeatCount ?? undefined}
                    onChange={onChangeRepeatCount}
                    buttonIcon={<Close className={cls.SmallClearIcon}/>}
                    isWithEvent={true}
                    eventAction={() => onChangeRepeatCount(undefined)}
                    type="number"
                  />
                </div>

                <div className={cls.InputBlock}>
                  <div className={cls.Label}>Расход (план)</div>
                  <Input
                    className={cls.Input}
                    value={form?.moneyOutcomePlan ?? undefined}
                    onChange={onChangeMoneyOutcomePlan}
                    textAfterInput="₽"
                    type="number"
                  />
                </div>

                <div className={cls.InputBlock}>
                  <div className={cls.Label}>Доход (план)</div>
                  <Input
                    className={cls.Input}
                    value={form?.moneyIncomePlan ?? undefined}
                    onChange={onChangeMoneyIncomePlan}
                    textAfterInput="₽"
                    type="number"
                  />
                </div>
              </>
            )}

            {form?.isTracker && (
              <div className={cls.CurrentDate}>
                {getDD_Month_NotReqYYYY(
                  form?.taskRepeatDayCheck.length
                    ? new Date(form?.taskRepeatDayCheck[0].date)
                    : new Date()
                )}
              </div>
            )}

            <div className={cls.InputBlock}>
              <div className={cls.Label}>Расход</div>
              <Input
                className={cls.Input}
                value={
                  form?.taskRepeatDayCheck.length
                    ? form?.taskRepeatDayCheck[0].moneyOutcomeFact
                    : undefined
                }
                onChange={onChangeMoneyOutcomeFact}
                textAfterInput="₽"
                type="number"
              />
            </div>

            <div className={cls.InputBlock}>
              <div className={cls.Label}>Доход</div>
              <Input
                className={cls.Input}
                value={
                  form?.taskRepeatDayCheck.length
                    ? form?.taskRepeatDayCheck[0].moneyIncomeFact
                    : undefined
                }
                onChange={onChangeMoneyIncomeFact}
                textAfterInput="₽"
                type="number"
              />
            </div>

            <div className={cls.InputBlock}>
              <div className={cls.Label}>Дедлайн</div>
              <Input
                className={cls.Input}
                value={
                  form?.taskRepeatDayCheck.length
                    ? form?.taskRepeatDayCheck[0].deadline
                    : undefined
                }
                onChange={onChangeMoneyDeadline}
                width={"small"}
                type="date"
                dateValueString={
                  form?.taskRepeatDayCheck.length &&
                  form?.taskRepeatDayCheck[0].deadline
                    ? getDD_Month_NotReqYYYY(
                        new Date(form?.taskRepeatDayCheck[0].deadline),
                        true
                      )
                    : ""
                }
              />
              <Button className={cls.Button} onClick={onSave}>
                Перенос&nbsp;➔
              </Button>
            </div>

            <Input
              className={cls.TextArea}
              value={
                form?.taskRepeatDayCheck.length
                  ? form?.taskRepeatDayCheck[0].note
                  : undefined
              }
              onChange={onChangeNote}
              placeholder="Примечание"
              type="textarea"
            />
          </div>
        )}

        {openModalDays && form?.intervalPart === IntervalType.Week && (
          <WeekSelector onClick={onChangeDays} />
        )}
        {openModalDays && form?.intervalPart === IntervalType.Month && (
          <MonthSelector
            onClick={onChangeDays}
            onChangeMonthWeekDays={onChangeMonthWeekDays}
          />
        )}

        {openModalYearDays && <YearSelector onChangeYearDays={onChangeYearDays} />}

        <div className={cls.Footer}>
          <div className={cls.ButtonBlock}>
            {openModalDays && (
              <Button className={cls.MainButton} onClick={onSaveDays}>
                OK
              </Button>
            )}
            {openModalYearDays && (
              <Button className={cls.MainButton} onClick={onSaveYearDays}>
                OK
              </Button>
            )}
            {!openModalDays && !openModalYearDays && (
              <Button className={cls.MainButton} onClick={onSave}>
                Сохранить
              </Button>
            )}
          </div>
        </div>
      </div>
    </DynamicModuleLoader>
  );
});

export default TaskForm;
