import { useSelector } from "react-redux";
import { memo, useCallback, useEffect } from "react";
import cls from "./DayTasksListForm.module.scss";
import {
  getDayTasksList,
  getDayTasksError,
  getDayTasksIsLoading,
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
import { useLocation, useNavigate } from "react-router-dom";
import { getRouteTask } from "@/sharedComponents/config/routeConfig/routeConfig";
import { deleteTask } from "../model/services/deleteTaskInDate";
import DayTasksListItem from "./DayTasksListItem";
import { removeTaskCheck } from "../model/services/removeTaskCheck";
import { setTaskCheck } from "../model/services/setTaskCheck";
import { Loader } from "@/sharedComponents/ui/Loader";
import { isoString } from "@/sharedComponents/lib/helpers/isoString";
import { getYYYY_MM_DD } from "@/sharedComponents/lib/helpers/getYYYY_MM_DD";

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
    const isLoading = useSelector(getDayTasksIsLoading);
    const error = useSelector(getDayTasksError);

    const search = useLocation().search;

    const onTaskClick = useCallback(
      (id: number) => {
        const params: OptionalRecord<string, string> = {
          date: getYYYY_MM_DD(date),
          isFood: type === tasksType.food ? "1" : "0",
          backPath: new URLSearchParams(search).get('backPath'),
        };

        navigate(getRouteTask(String(id), params));
      },
      [date, type, search, navigate]
    );

    const onTaskDelete = useCallback(
      (id: number) => {
        dispatch(deleteTask({ id, date }));
      },
      [date, dispatch]
    );

    const onCheckChange = useCallback(
      (id: number, check: boolean) => {
        if (check) {
          dispatch(setTaskCheck({ id, date }));
        } else {
          dispatch(removeTaskCheck({ id, date }));
        }
      },
      [date, dispatch]
    );

    useEffect(() => {
      if (!isLoading && date) dispatch(fetchList({ date, type }));
    }, [date, dispatch, type]);

    return (
      <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
        <div className={classNames(cls.DayTasksListForm, {}, [className])}>
          {isLoading && (
            <div className={cls.Loader}>
              <Loader />
            </div>
          )}

          <div className={cls.List}>
            {!!list &&
              list.map((item) => (
                <DayTasksListItem
                  data={item}
                  onClick={onTaskClick}
                  onDelete={onTaskDelete}
                  onCheckChange={onCheckChange}
                  key={item.id}
                />
              ))}
          </div>

        </div>
      </DynamicModuleLoader>
    );
  }
);

export default DayTasksListForm;
