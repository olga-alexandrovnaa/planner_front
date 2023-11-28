import { useCallback, memo } from "react";
import cls from "./BuyingsListForm.module.scss";
import { ListBuying } from "../model/types/buyingsListSchema";
import { ReactComponent as Delete } from "@/sharedComponents/assets/icons/delete.svg";
import { Checkbox } from "@/sharedComponents/ui/Checkbox/Checkbox";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";

export interface BuyingsListItemProps {
  data: ListBuying;
  onDelete: (id: number) => void;
  onCheckChange: (id: number, check: boolean) => void;
}

const BuyingsListItem = memo(
  ({ data, onDelete, onCheckChange }: BuyingsListItemProps) => {

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
        className={classNames(cls.BuyingsListItem, {
          [cls.BuyingsListItemChecked]: data.checked,
        })}
      >
        <Checkbox
          className={cls.BuyingsListCheckBox}
          checked={data.checked}
          onChange={onCheckChangeHandler}
        />

        <div className={cls.BuyingsListItemData}>
          <div className={cls.BuyingsListItemText}>{data.note}</div>

          <div className={cls.Icon} onClick={onDeleteHandler}>
            <Delete />
          </div>
        </div>
      </div>
    );
  }
);

export default BuyingsListItem;
