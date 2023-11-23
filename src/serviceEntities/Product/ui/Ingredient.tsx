
import { memo, useCallback } from "react";
import { Ingredient as IngredientType } from "../model/types/product";
import cls from "./ProductForm.module.scss";

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
      {ingredient.product.name}
      {ingredient.count}
      {ingredient.measureUnit.measureUnit.name}

      <div onClick={onDeleteHandler}>delete</div>
    </div>
  );
});

export default Ingredient;
