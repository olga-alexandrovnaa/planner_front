import { memo, useCallback } from "react";
import { Ingredient as IngredientType } from "../model/types/product";
import cls from "./ProductForm.module.scss";
import { ReactComponent as Delete } from "@/sharedComponents/assets/icons/delete.svg";

export interface Props {
  ingredient: IngredientType;
  onDelete: (id: number) => void;
}

const Ingredient = memo(({ ingredient, onDelete }: Props) => {
  const onDeleteHandler = useCallback(() => {
    onDelete(ingredient.id);
  }, [ingredient.id, onDelete]);

  return (
    <div className={cls.Ingredient}>
      <div className={cls.IngredientData}>
        <div  className={cls.IngredientDataName}>{ingredient.product.name}</div>

        <div  className={cls.IngredientDataCount}>
          {`${ingredient.count} ${ingredient.measureUnit.name}`}
        </div>
      </div>

      <div className={cls.Icon} onClick={onDeleteHandler}>
        <Delete />
      </div>
    </div>
  );
});

export default Ingredient;
