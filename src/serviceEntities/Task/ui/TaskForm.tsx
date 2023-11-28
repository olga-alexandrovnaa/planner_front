import { useSelector } from "react-redux";
import { memo, useCallback, useState, useEffect, useMemo } from "react";
import cls from "./TaskForm.module.scss";
import {
  DynamicModuleLoader,
  ReducersList,
} from "@/sharedComponents/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";
import { useAppDispatch } from "@/sharedComponents/lib/hooks/useAppDispatch/useAppDispatch";
import { ReactComponent as Close } from "@/sharedComponents/assets/icons/close.svg";
import { ReactComponent as Edit } from "@/sharedComponents/assets/icons/edit.svg";
import { ReactComponent as Create } from "@/sharedComponents/assets/icons/create.svg";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { taskActions, taskReducer } from "../model/slice/taskSlice";
import {
  getTaskCreateMode,
  getTaskCurrentFoodType,
  getTaskError,
  getTaskFoodOptions,
  getTaskForm,
} from "../model/selectors/selectors";
import { create } from "../model/services/create";
import {
  getRouteMain,
  getRouteProduct,
} from "@/sharedComponents/config/routeConfig/routeConfig";
import { getDD_MM_YYYY } from "@/sharedComponents/lib/helpers/getDD_MM_YYYY";
import { update } from "../model/services/update";
import { fetchTask } from "../model/services/fetch";
import { Button } from "@/sharedComponents/ui/Button";
import { Input } from "@/sharedComponents/ui/Inputs/Input";
import { startOfDay } from "date-fns";
import { CustomSelect } from "@/sharedComponents/ui/AsyncSelect/AsyncSelect";
import { getDD_Month_NotReqYYYY } from "@/sharedComponents/lib/helpers/getDD_Month_NotReqYYYY";
import {
  Food,
  Ingredient,
  IntervalType,
  MoveTypeIfDayNotExists,
  WeekNumber,
  foodType,
} from "../model/types/task";
import WeekSelector from "./WeekSelector";
import {
  intervalTypeName,
  intervalTypeOptions,
} from "../model/consts/interval";
import MonthSelector from "./MonthSelector";
import YearSelector from "./YearSelector";
import { getYYYY_MM_DD } from "@/sharedComponents/lib/helpers/getYYYY_MM_DD";
import { Modal } from "@/sharedComponents/ui/Modal";
import { deleteEverywhere } from "../model/services/delete";
import {
  foodTypeOptions,
  foodTypeText,
} from "@/serviceEntities/Product/model/types/product";
import { fetchFoodOptionsByType } from "../model/services/fetchFoodOptionsByType";

export interface TaskFormProps {
  className?: string;
}

const initialReducers: ReducersList = {
  task: taskReducer,
};

const TaskForm = memo(({ className }: TaskFormProps) => {
  const dispatch = useAppDispatch();
  const form = useSelector(getTaskForm);
  const foodOptions = useSelector(getTaskFoodOptions);
  const currentFoodType = useSelector(getTaskCurrentFoodType);
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

  const search = useLocation().search;
  const backPath = new URLSearchParams(search).get("backPath");
  const dateFromUrl = searchParams.get("date") as string;
  const isFoodFromUrl = searchParams.get("isFood") as string;
  const typeFromUrl = searchParams.get("type") as string;

  useEffect(() => {
    if (id === "new") {
      dispatch(
        taskActions.setCreateMode({
          date: dateFromUrl
            ? dateFromUrl
            : getYYYY_MM_DD(startOfDay(new Date())),
          isFood: isFoodFromUrl === "1" ? true : false,
        })
      );
    } else {
      const dateFromUrl = searchParams.get("date") as string;
      dispatch(taskActions.setId(Number(id)));
      dispatch(fetchTask(dateFromUrl));
    }
  }, [dateFromUrl, dispatch, id, isFoodFromUrl, searchParams]);

  const onSave = useCallback(async () => {
    if (isCreateMode) {
      await dispatch(create());
    } else {
      await dispatch(update());
    }
    if (error) alert(error);
    if (!backPath) {
      navigate(getRouteMain(getDD_MM_YYYY(new Date(form?.date))));
    } else {
      navigate(backPath);
    }
  }, [backPath, dispatch, error, form?.date, isCreateMode, navigate]);

  const onBack = useCallback(() => {
    if (!backPath) {
      navigate(getRouteMain(getDD_MM_YYYY(new Date(form?.date))));
    } else {
      navigate(backPath);
    }
  }, [backPath, form?.date, navigate]);

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
  const onChangeFoodCountToPrepare = useCallback(
    (val: number | undefined) => {
      dispatch(taskActions.onChangeFoodCountToPrepare(val));
    },
    [dispatch]
  );
  const onChangeFoodCout = useCallback(
    (val: number | undefined) => {
      dispatch(taskActions.onChangeFoodCout(val));
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

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newDate, setNewDate] = useState<string>();

  // useEffect(() => {
  //   if (
  //     newDate !== (form?.taskRepeatDayCheck?.length
  //       ? form.taskRepeatDayCheck[0].newDate !== null
  //         ? form.taskRepeatDayCheck[0].newDate
  //         : form.taskRepeatDayCheck[0].date
  //       : form?.date)
  //   )
  //     setNewDate(
  //       form?.taskRepeatDayCheck?.length
  //         ? form.taskRepeatDayCheck[0].newDate !== null
  //           ? form.taskRepeatDayCheck[0].newDate
  //           : form.taskRepeatDayCheck[0].date
  //         : form?.date
  //     );
  // }, [form?.date, form?.taskRepeatDayCheck, newDate]);

  const onSelectOtherDayHandler = useCallback(() => {
    setModalOpen(true);
  }, []);

  const onEndSelectOtherDayHandler = useCallback(() => {
    dispatch(taskActions.onChangeDate(newDate));
    setNewDate(undefined);
    setModalOpen(false);
  }, [dispatch, newDate]);

  const onCancelSelectOtherDayHandler = useCallback(() => {
    setModalOpen(false);
  }, []);

  const onStartDeleteHandler = useCallback(() => {
    setDeleteModalOpen(true);
  }, []);

  const onCancelDeleteHandler = useCallback(() => {
    setDeleteModalOpen(false);
  }, []);

  const onChangeNewDate = useCallback((date: string) => {
    setNewDate(date);
  }, []);

  const onDeleteHandler = useCallback(async () => {
    await dispatch(deleteEverywhere());
    setDeleteModalOpen(false);
    onBack();
  }, [dispatch, onBack]);

  const onChangeFood = useCallback(
    (data: { value: number; label: string; data: Food }) => {
      dispatch(taskActions.onChangeFood(data));
    },
    [dispatch]
  );
  const onChangeCurrentFoodType = useCallback(
    (data: { value: foodType; label: string }) => {
      dispatch(taskActions.onChangeFoodType(data ? data.value : undefined));
    },
    [dispatch]
  );

  const onEditFood = useCallback(() => {
    const params: OptionalRecord<string, string> = {
      trackerBackPath: backPath,
      dateFromUrl: dateFromUrl,
      type: currentFoodType,
      taskId: id,
    };
    navigate(getRouteProduct(String(form?.foodId), params));
  }, [backPath, currentFoodType, dateFromUrl, form?.foodId, id, navigate]);

  const onCreateNewFood = useCallback(() => {
    const params: OptionalRecord<string, string> = {
      trackerBackPath: backPath,
      dateFromUrl: dateFromUrl,
      type: currentFoodType,
      taskId: id,
    };
    navigate(getRouteProduct("new", params));
  }, [backPath, currentFoodType, dateFromUrl, id, navigate]);

  const createdProduct = new URLSearchParams(search).get("createdProduct");

  useEffect(() => {
    if (typeFromUrl) {
      const fT: foodType = Object.values(foodType).find(
        (v) => v === typeFromUrl
      );
      dispatch(taskActions.onChangeFoodType(fT));
    }
  }, [dispatch, typeFromUrl]);

  const loadFoodOptions = useCallback(async () => {
    await dispatch(
      fetchFoodOptionsByType({
        type: currentFoodType,
        date: getYYYY_MM_DD(
          form?.taskRepeatDayCheck?.length
            ? form?.taskRepeatDayCheck[0].newDate
              ? new Date(form?.taskRepeatDayCheck[0].newDate)
              : new Date(form?.taskRepeatDayCheck[0].date)
            : new Date()
        ),
      })
    );
    if (createdProduct) {
      dispatch(taskActions.onChangeFoodByUrlId(Number(createdProduct)));
    }
  }, [createdProduct, currentFoodType, dispatch, form?.taskRepeatDayCheck]);

  useEffect(() => {
    loadFoodOptions();
  }, [dispatch, loadFoodOptions]);

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div className={classNames(cls.TaskForm, {}, [className])}>
        {!!modalOpen && (
          <Modal isOpen={true}>
            <div className={cls.Data}>
              <div className={cls.LabelTopCenter}>
                На какую дату перенести задачу?
              </div>
              <div className={cls.InputBlock}>
                <Input
                  className={cls.Input}
                  value={newDate}
                  type="date"
                  onChange={onChangeNewDate}
                  dateValueString={
                    newDate
                      ? getDD_Month_NotReqYYYY(new Date(newDate), true)
                      : ""
                  }
                />
              </div>
              <div style={{ marginTop: "10px" }} className={cls.ButtonBlock}>
                <Button
                  onClick={onCancelSelectOtherDayHandler}
                  className={cls.SecondaryButton}
                >
                  Отмена
                </Button>
                <Button
                  onClick={onEndSelectOtherDayHandler}
                  className={cls.MainButton}
                >
                  ОК
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {!!deleteModalOpen && (
          <Modal isOpen={true}>
            <div className={cls.Data}>
              <div className={cls.LabelTopCenter}>
                Удалить трекер сегодня и в будущих днях?
              </div>

              <div className={cls.ButtonBlock}>
                <Button
                  onClick={onCancelDeleteHandler}
                  className={cls.SecondaryButton}
                >
                  Отмена
                </Button>
                <Button onClick={onDeleteHandler} className={cls.MainButton}>
                  ОК
                </Button>
              </div>
            </div>
          </Modal>
        )}

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
            {!form?.isFood && (
              <Input
                className={cls.MainInput}
                placeholder={"Название"}
                value={form?.name || undefined}
                onChange={onChangeName}
              />
            )}

            <div className={cls.Selector}>
              <div
                onClick={() => onChangeIsTracker(false)}
                className={classNames(cls.SelectorItem, {
                  [cls.SelectorItemActive]: !form?.isTracker,
                })}
              >
                Один раз
              </div>
              <div
                onClick={() => onChangeIsTracker(true)}
                className={classNames(cls.SelectorItem, {
                  [cls.SelectorItemActive]: form?.isTracker,
                })}
              >
                Повторять
              </div>
            </div>

            {form?.isFood && (
              <div className={cls.InputBlock}>
                <div className={cls.Label}>Тип</div>
                <CustomSelect
                  className={cls.Input}
                  menuPlacement="top"
                  value={
                    currentFoodType
                      ? {
                          value: currentFoodType,
                          label: foodTypeText[currentFoodType],
                        }
                      : undefined
                  }
                  onChange={onChangeCurrentFoodType}
                  options={foodTypeOptions}
                />
              </div>
            )}

            {form?.isFood && !!currentFoodType && (
              <div className={cls.InputBlock}>
                <Input
                  className={cls.InputFood}
                  isWithEvent={true}
                  eventAction={() => {
                    // setAddressFormOpen(true);
                  }}
                  buttonIcon={
                    form?.food ? (
                      <div
                        style={{ cursor: "pointer" }}
                        title="Редактировать"
                        onClick={onEditFood}
                      >
                        <Edit width={20} />
                      </div>
                    ) : (
                      <div
                        style={{ cursor: "pointer" }}
                        title="Создать"
                        onClick={onCreateNewFood}
                      >
                        <Create width={20} />
                      </div>
                    )
                  }
                >
                  <CustomSelect
                    value={
                      form?.food
                        ? {
                            value: form.foodId,
                            label: form.food.name,
                            data: form.food,
                          }
                        : ""
                    }
                    onChange={onChangeFood}
                    isClearable
                    options={foodOptions}
                  />
                </Input>
              </div>
            )}

            {form?.isFood && (
              <div className={cls.InputBlock}>
                <div className={cls.Label}>Сколько приготовить</div>
                <Input
                  className={cls.Input} //бессрочно или число
                  value={form?.foodCountToPrepare ?? undefined}
                  onChange={onChangeFoodCountToPrepare}
                  buttonIcon={<Close className={cls.SmallClearIcon} />}
                  isWithEvent={true}
                  eventAction={() => onChangeFoodCountToPrepare(undefined)}
                  type="number"
                />
              </div>
            )}

            {form?.isFood && (
              <div className={cls.InputBlock}>
                <div className={cls.Label}>Сколько съели</div>
                <Input
                  className={cls.Input} //бессрочно или число
                  value={form?.foodCout ?? undefined}
                  onChange={onChangeFoodCout}
                  buttonIcon={<Close className={cls.SmallClearIcon} />}
                  isWithEvent={true}
                  eventAction={() => onChangeFoodCout(undefined)}
                  type="number"
                />
              </div>
            )}

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
                    buttonIcon={<Close className={cls.SmallClearIcon} />}
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
                  form?.taskRepeatDayCheck?.length
                    ? form?.taskRepeatDayCheck[0].newDate
                      ? new Date(form?.taskRepeatDayCheck[0].newDate)
                      : new Date(form?.taskRepeatDayCheck[0].date)
                    : new Date()
                )}
              </div>
            )}

            <div className={cls.InputBlock}>
              <div className={cls.Label}>Расход</div>
              <Input
                className={cls.Input}
                value={
                  form?.taskRepeatDayCheck?.length
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
                  form?.taskRepeatDayCheck?.length
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
                  form?.taskRepeatDayCheck?.length
                    ? form?.taskRepeatDayCheck[0].deadline
                    : undefined
                }
                onChange={onChangeMoneyDeadline}
                width={"small"}
                type="date"
                dateValueString={
                  form?.taskRepeatDayCheck?.length &&
                  form?.taskRepeatDayCheck[0].deadline
                    ? getDD_Month_NotReqYYYY(
                        new Date(form?.taskRepeatDayCheck[0].deadline),
                        true
                      )
                    : ""
                }
              />
              <Button className={cls.Button} onClick={onSelectOtherDayHandler}>
                Перенос&nbsp;➔
              </Button>
            </div>

            {!form?.isFood && (
              <Input
                className={cls.TextArea}
                value={
                  form?.taskRepeatDayCheck?.length
                    ? form?.taskRepeatDayCheck[0].note
                    : undefined
                }
                onChange={onChangeNote}
                placeholder="Примечание"
                type="textarea"
              />
            )}

            {!!form?.taskBuyings?.length && (
              <div className={cls.BuyingsInfo}>
                <div className={cls.BuyingsLabel}>Покупки:</div>
                <ul>
                  {form.taskBuyings.map((e) => (
                    <li className={cls.Buying}>{e.buying.note}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className={cls.FoodInfo}>
              {!!form?.isFood && !!form?.food && !!form.food.recipe && (
                <div className={cls.Fats}>
                  <div className={cls.FatsLabel}>БЖУ порции:</div>
                  <div className={cls.FatsData}>
                    {form.foodCout
                      ? form.food.proteins ?? 0 * form.foodCout
                      : form.food.proteins ?? 0}
                    &nbsp; белков&nbsp;&nbsp;{" "}
                    {form.foodCout
                      ? form.food.fats ?? 0 * form.foodCout
                      : form.food.fats ?? 0}
                    &nbsp; жиров&nbsp;&nbsp;{" "}
                    {form.foodCout
                      ? form.food.carbohydrates ?? 0 * form.foodCout
                      : form.food.carbohydrates ?? 0}
                    &nbsp; угл.&nbsp;&nbsp;{" "}
                    {form.foodCout
                      ? form.food.calories ?? 0 * form.foodCout
                      : form.food.calories ?? 0}
                    &nbsp; ккал
                  </div>
                </div>
              )}

              {!!form?.isFood && !!form?.food && !!form.food.recipe && (
                <div className={cls.FoodRecipe}>
                  <div className={cls.FoodRecipeLabel}>Рецепт:</div>
                  <div className={cls.FoodRecipeData}>{form.food.recipe}</div>
                </div>
              )}

              {!!form?.isFood &&
                !!form?.food &&
                !!form?.food?.ingredients?.length && (
                  <div className={cls.FoodIngredients}>
                    <div className={cls.FoodIngredientsLabel}>Игредиенты:</div>
                    <div className={cls.FoodIngredientsData}>
                      {form.food.ingredients.map((e) => (
                        <div className={cls.FoodIngredient}>
                          <div className={cls.FoodIngredientName}>
                            {e.product.name}
                          </div>
                          <div className={cls.FoodIngredientCount}>
                            {`${
                              form.foodCountToPrepare
                                ? e.count * form.foodCountToPrepare
                                : e.count
                            } ${e.measureUnit.name}`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
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

        {openModalYearDays && (
          <YearSelector onChangeYearDays={onChangeYearDays} />
        )}

        <div className={cls.Footer}>
          {id !== "new" ? (
            <div className={cls.ButtonBlock}>
              <Button
                className={cls.SecondaryButton}
                onClick={onStartDeleteHandler}
              >
                Удалить трекер
              </Button>

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
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </DynamicModuleLoader>
  );
});

export default TaskForm;
