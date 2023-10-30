import { useSelector } from "react-redux";
import { memo, useCallback, useState, useEffect } from "react";
import cls from "./DayTasksListForm.module.scss";
import {
  getDayTasksList,
  getDayTasksError,
  getDayTasksIsLoading,
  getDayTasksDate,
  getDayTasksType,
} from "../model/selectors/selectors";
import { useAppDispatch } from "@/sharedComponents/lib/hooks/useAppDispatch/useAppDispatch";
import {
  dayTasksListActions,
  dayTasksListReducer,
} from "../model/slice/dayTasksListSlice";
import {
  DynamicModuleLoader,
  ReducersList,
} from "@/sharedComponents/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";
import { tasksType } from "@/serviceEntities/Task";
import { fetchList } from "../model/services/fetchList";
import { useNavigate } from "react-router-dom";
import { getRouteTask } from "@/sharedComponents/config/routeConfig/routeConfig";
import { deleteTask } from "../model/services/deleteTask";
import DayTasksListItem from "./DayTasksListItem";
import { Button } from "@/sharedComponents/ui/Button";
import { removeTaskCheck } from "../model/services/removeTaskCheck";
import { setTaskCheck } from "../model/services/setTaskCheck";
import { Loader } from "@/sharedComponents/ui/Loader";

export interface DayTasksListFormProps {
  date: Date;
  type: tasksType;
  className?: string;
}

const initialReducers: ReducersList = {
  dayTasks: dayTasksListReducer,
};

const DayTasksListForm = memo(
  ({ date, type, className }: DayTasksListFormProps) => {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const list = useSelector(getDayTasksList);
    const currentDate = useSelector(getDayTasksDate);
    const currentType = useSelector(getDayTasksType);
    const isLoading = useSelector(getDayTasksIsLoading);
    const error = useSelector(getDayTasksError);

    const onTaskClick = useCallback(
      (id: number) => {
        navigate(getRouteTask(String(id)));
      },
      [navigate]
    );

    const onTaskDelete = useCallback(
      (id: number) => {
        dispatch(deleteTask(id));
      },
      [dispatch]
    );

    const onCheckChange = useCallback(
      (id: number, check: boolean) => {
        if (check) {
          dispatch(setTaskCheck(id));
        } else {
          dispatch(removeTaskCheck(id));
        }
      },
      [dispatch]
    );

    const onCreate = useCallback(() => {
      navigate(getRouteTask("new"));
    }, [navigate]);

    useEffect(() => {
      dispatch(dayTasksListActions.setDate(date));
      dispatch(dayTasksListActions.setType(type));
    }, [date, dispatch, type]);

    useEffect(() => {
      if (!isLoading) dispatch(fetchList());
    }, [currentDate, dispatch, currentType, isLoading]);

    return (
      <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
        <div className={classNames(cls.DayTasksListForm, {}, [className])}>
          {isLoading && (
            <div className={cls.Loader}>
              <Loader />
            </div>
          )}

          <div className={cls.List}>
            {list.map((item) => (
              <DayTasksListItem
                data={item}
                onClick={onTaskClick}
                onDelete={onTaskDelete}
                onCheckChange={onCheckChange}
              />
            ))}
          </div>

          <div className={cls.ButtonBlock}>
            <Button className={cls.Button} onClick={onCreate}>
              Создать
            </Button>
          </div>
        </div>
      </DynamicModuleLoader>
    );
  }
);

export default DayTasksListForm;
