import { useCallback, memo } from "react";
import cls from "./DayTasksListForm.module.scss";
import { ListTask } from "../model/types/dayTasksListSchema";
import { ReactComponent as Delete } from "@/sharedComponents/assets/icons/logout.svg";
import { Checkbox } from "@/sharedComponents/ui/Checkbox/Checkbox";

export interface DayTasksListItemProps {
  data: ListTask;
  onClick: (id: number) => void;
  onDelete: (id: number) => void;
  onCheckChange: (id: number, check: boolean) => void;
}

const DayTasksListItem = memo(
  ({ data, onClick, onDelete, onCheckChange }: DayTasksListItemProps) => {
    const onClickHandler = useCallback(() => {
      onClick(data.id);
    }, [data.id, onClick]);

    const onDeleteHandler = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      onDelete(data.id);
    }, [data.id, onDelete]);

    const onCheckChangeHandler = useCallback(() => {
      onCheckChange(data.id, !data.checked);
    }, [data.checked, data.id, onCheckChange]);

    return (
      <div className={cls.DayTasksListItem} onClick={onClickHandler}>

        <Checkbox checked={data.checked} onChange={onCheckChangeHandler}/>

        {data.name}

        <div className={cls.Icon}  onClick={onDeleteHandler}>
          <Delete />
        </div>
      </div>
    );
  }
);

export default DayTasksListItem;
