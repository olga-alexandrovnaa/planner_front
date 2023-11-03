import { useCallback, memo } from "react";
import cls from "./DayTasksListForm.module.scss";
import { ListTask } from "../model/types/dayTasksListSchema";
import { ReactComponent as Delete } from "@/sharedComponents/assets/icons/delete.svg";
import { Checkbox } from "@/sharedComponents/ui/Checkbox/Checkbox";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";

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

    const onDeleteHandler = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        onDelete(data.id);
        e.stopPropagation();
      },
      [data.id, onDelete]
    );

    const onCheckChangeHandler = useCallback(() => {
      onCheckChange(data.id, !data.checked);
    }, [data.checked, data.id, onCheckChange]);

    return (
      <div
        className={classNames(cls.DayTasksListItem, {
          [cls.DayTasksListItemChecked]: data.checked,
        })}
      >
        <Checkbox
          className={cls.DayTasksListCheckBox}
          checked={data.checked}
          onChange={onCheckChangeHandler}
        />

        <div className={cls.DayTasksListItemData} onClick={onClickHandler}>
          <div className={cls.DayTasksListItemText}>
            {data.name}
          </div>

          <div className={cls.Icon} onClick={onDeleteHandler}>
            <Delete />
          </div>
        </div>
      </div>
    );
  }
);

export default DayTasksListItem;
