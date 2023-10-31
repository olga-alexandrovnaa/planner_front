import { useSelector } from "react-redux";
import { memo, useCallback, useMemo, useEffect } from "react";
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
  getTaskCreateMode,
  getTaskError,
  getTaskForm,
} from "../model/selectors/selectors";
import { create } from "../model/services/create";
import { getRouteMain } from "@/sharedComponents/config/routeConfig/routeConfig";
import { getDD_MM_YYYY } from "@/sharedComponents/lib/helpers/getDD_MM_YYYY";
import { update } from "../model/services/update";
import { fetchTask } from "../model/services/fetch";
import { Button } from "@/sharedComponents/ui/Button";
import { Input } from "@/sharedComponents/ui/Inputs/Input";
import { startOfDay } from "date-fns";

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

  useEffect(() => {
    if (id === "new") {
      const dateFromUrl = searchParams.get("date") as string;
      const isFoodFromUrl = searchParams.get("isFood") as string;
      dispatch(
        taskActions.setCreateMode({
          date: dateFromUrl ? dateFromUrl : startOfDay(new Date()).toISOString(),
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
    // if (form?.date) navigate(getRouteMain(getDD_MM_YYYY(new Date(form?.date))));
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

  console.log(form)

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div className={classNames(cls.UserForm, {}, [className])}>
        <div className={cls.Header}>
          <div className={cls.HeaderText}></div>
          <div className={cls.HeaderCloseIcon} onClick={onBack}>
            <Close />
          </div>
        </div>
        <div className={cls.Data}>
          <Input className={cls.Input} placeholder={"Название"} value={form?.name} onChange={onChangeName} />

            <div className={cls.Selector}>
              <div
                onClick={() => onChangeIsTracker(false)}
                className={classNames(cls.Item, {
                  [cls.ItemActive]: form?.isTracker,
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
        </div>
        <div className={cls.ButtonBlock}>
          <Button className={cls.Button} onClick={onSave}>Сохранить</Button>
        </div>
      </div>
    </DynamicModuleLoader>
  );
});

export default TaskForm;
