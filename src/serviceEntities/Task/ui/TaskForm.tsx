import { useSelector } from "react-redux";
import { memo, useCallback } from "react";
import cls from "./TaskForm.module.scss";
// import { getUserAuthData, getuserName } from "../model/selectors/selectors";
import {
  DynamicModuleLoader,
  ReducersList,
} from "@/sharedComponents/lib/components/DynamicModuleLoader/DynamicModuleLoader";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";
// import { userActions, userReducer } from "..";
import { useAppDispatch } from "@/sharedComponents/lib/hooks/useAppDispatch/useAppDispatch";
import { ReactComponent as Logout } from "@/sharedComponents/assets/icons/logout.svg";
import { useNavigate } from "react-router-dom";
import { taskReducer } from "../model/slice/taskSlice";
import { getTaskData } from "../model/selectors/selectors";

export interface TaskFormProps {
  className?: string;
}

const initialReducers: ReducersList = {
  task: taskReducer,
};

const TaskForm = memo(({ className }: TaskFormProps) => {
  const dispatch = useAppDispatch();
  const data = useSelector(getTaskData);

  const navigate = useNavigate()

  

  return (
    null
    // <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
    //   {(
    //     <div className={classNames(cls.UserForm, {}, [className])}>
    //       {/* userName: {userName ? userName : 'empty'} */}
    //       <div onClick={logoutHandler}>
    //         <Logout />
    //       </div>
    //     </div>
    //   )}
    // </DynamicModuleLoader>
  );
});

export default TaskForm;
