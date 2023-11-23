import { useSelector } from "react-redux";
import { memo, useCallback, useState, useEffect, useMemo } from "react";
import cls from "./ProductForm.module.scss";
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
import { productActions, productReducer } from "../model/slice/productSlice";
import {
  getProductCreateMode,
  getProductError,
  getProductForm,
  getProductIngredientToCreate,
  getProductIngredientsOptions,
  getProductMeasureUnits,
  getProductMeasureUnitsByIngredient,
  getProductProductsTypes,
} from "../model/selectors/selectors";
import { create } from "../model/services/create";
import { getRouteMain } from "@/sharedComponents/config/routeConfig/routeConfig";
import { getDD_MM_YYYY } from "@/sharedComponents/lib/helpers/getDD_MM_YYYY";
import { update } from "../model/services/update";
import { fetchProduct } from "../model/services/fetch";
import { startOfDay } from "date-fns";
import { getYYYY_MM_DD } from "@/sharedComponents/lib/helpers/getYYYY_MM_DD";
import { Modal } from "@/sharedComponents/ui/Modal";
import { deleteEverywhere } from "../model/services/delete";
import { Input } from "@/sharedComponents/ui/Inputs/Input";
import {
  CustomAsyncCreatableSelect,
  CustomSelect,
} from "@/sharedComponents/ui/AsyncSelect/AsyncSelect";
import {
  MeasureUnit,
  OutcomeMeasureUnit,
  Product,
  ProductType,
  foodType,
  foodTypeOptions,
  foodTypeText,
} from "../model/types/product";
import { Button } from "@/sharedComponents/ui/Button";
import Ingredient from "./Ingredient";

export interface ProductFormProps {
  className?: string;
}

const initialReducers: ReducersList = {
  product: productReducer,
};

const ProductForm = memo(({ className }: ProductFormProps) => {
  const dispatch = useAppDispatch();
  const form = useSelector(getProductForm);
  const ingredientToCreate = useSelector(getProductIngredientToCreate);

  const ingredientOptions = useSelector(getProductIngredientsOptions);

  const productsTypes = useSelector(getProductProductsTypes);

  const measureUnits = useSelector(getProductMeasureUnits);

  const measureUnitsByIngredient = useSelector(
    getProductMeasureUnitsByIngredient
  );

  const isCreateMode = useSelector(getProductCreateMode);
  const error = useSelector(getProductError);

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const search = useLocation().search;
  const backPath = new URLSearchParams(search).get("backPath");

  useEffect(() => {
    if (id === "new") {
      dispatch(productActions.setCreateMode());
    } else {
      dispatch(productActions.setId(Number(id)));
      dispatch(fetchProduct());
    }
  }, [dispatch, id, searchParams]);

  const onSave = useCallback(async () => {
    if (isCreateMode) {
      await dispatch(create());
    } else {
      await dispatch(update());
    }
    if (error) alert(error);

    navigate(backPath);
  }, [backPath, dispatch, error, isCreateMode, navigate]);

  const onBack = useCallback(() => {
    navigate(backPath);
  }, [backPath, navigate]);

  const onChangeName = useCallback(
    (val: string) => {
      dispatch(productActions.onChangeName(val));
    },
    [dispatch]
  );
  const onChangeRecipe = useCallback(
    (val: string) => {
      dispatch(productActions.onChangeRecipe(val));
    },
    [dispatch]
  );
  const onChangeProteins = useCallback(
    (val: number) => {
      dispatch(productActions.onChangeProteins(val));
    },
    [dispatch]
  );
  const onChangeFats = useCallback(
    (val: number) => {
      dispatch(productActions.onChangeFats(val));
    },
    [dispatch]
  );
  const onChangeCarbohydrates = useCallback(
    (val: number) => {
      dispatch(productActions.onChangeCarbohydrates(val));
    },
    [dispatch]
  );
  const onChangeCalories = useCallback(
    (val: number) => {
      dispatch(productActions.onChangeCalories(val));
    },
    [dispatch]
  );
  const onChangeFoodType = useCallback(
    (type: { value: foodType; label: string }) => {
      dispatch(productActions.onChangeFoodType(type.value));
    },
    [dispatch]
  );

  const [openDeleteModal, setDeleteModalOpen] = useState(false);

  const onStartDeleteHandler = useCallback(() => {
    setDeleteModalOpen(true);
  }, []);

  const onCancelDeleteHandler = useCallback(() => {
    setDeleteModalOpen(false);
  }, []);

  const onDeleteHandler = useCallback(async () => {
    await dispatch(deleteEverywhere());
    setDeleteModalOpen(false);
    onBack();
  }, [dispatch, onBack]);

  const onDeleteIngredientHandler = useCallback(
    (id: number) => {
      dispatch(productActions.onDeleteIngredient(id));
    },
    [dispatch]
  );
  const onAddIngredient = useCallback(() => {
    dispatch(productActions.onAddIngredient());
  }, [dispatch]);
  const onChangeAddedIngredentMeasureUnit = useCallback(
    (data: { value: MeasureUnit; label: string }) => {
      dispatch(productActions.onChangeAddedIngredentMeasureUnit(data.value));
    },
    [dispatch]
  );
  const onChangeAddedIngredentCount = useCallback(
    (id: number) => {
      dispatch(productActions.onChangeAddedIngredentCount(id));
    },
    [dispatch]
  );
  const onChangeAddedIngredentProduct = useCallback(
    (data: { value: Product; label: string }) => {
      dispatch(productActions.onChangeAddedIngredentProduct(data.value));
    },
    [dispatch]
  );
  const onChangeAddedIngredentProductType = useCallback(
    (data: { value: ProductType; label: string }) => {
      dispatch(productActions.onChangeAddedIngredentProductType(data.value));
    },
    [dispatch]
  );

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div className={classNames(cls.ProductForm, {}, [className])}>
        <div className={cls.Header}>
          <div className={cls.HeaderText}></div>
          <div className={cls.HeaderCloseIcon} onClick={onBack}>
            {<Close />}
          </div>
        </div>

        <div className={cls.Data}>
          <Input
            className={cls.MainInput}
            placeholder={"Название"}
            value={form?.name || undefined}
            onChange={onChangeName}
          />

          <Input
            className={cls.TextArea}
            value={form?.recipe || undefined}
            onChange={onChangeRecipe}
            placeholder="Примечание"
            type="textarea"
          />

          <div className={cls.InputBlock}>
            <div className={cls.Label}>Белки</div>
            <Input
              className={cls.Input}
              value={form?.proteins || 0}
              onChange={onChangeProteins}
              type="number"
            />
          </div>
          <div className={cls.InputBlock}>
            <div className={cls.Label}>Жиры</div>
            <Input
              className={cls.Input}
              value={form?.fats || 0}
              onChange={onChangeFats}
              type="number"
            />
          </div>
          <div className={cls.InputBlock}>
            <div className={cls.Label}>Углеводы</div>
            <Input
              className={cls.Input}
              value={form?.carbohydrates || 0}
              onChange={onChangeCarbohydrates}
              type="number"
            />
          </div>
          <div className={cls.InputBlock}>
            <div className={cls.Label}>Калории</div>
            <Input
              className={cls.Input}
              value={form?.calories || 0}
              onChange={onChangeCalories}
              type="number"
            />
          </div>
          <div className={cls.InputBlock}>
            <div className={cls.Label}>Тип</div>
            <CustomSelect
              className={cls.Input}
              menuPlacement="top"
              value={
                form?.foodType
                  ? {
                      value: form?.foodType,
                      label: foodTypeText[form?.foodType],
                    }
                  : undefined
              }
              onChange={onChangeFoodType}
              options={foodTypeOptions}
            />
          </div>

          <div className={cls.addIngredientsForm}>
            <div className={cls.headerOfAddIngredientsForm}>
              Добавление игредиента
            </div>
            <div className={cls.InputBlock}>
              <div className={cls.Label}>Тип</div>
              <CustomSelect
                className={cls.Input}
                menuPlacement="top"
                value={
                  ingredientToCreate.type
                    ? {
                        value: ingredientToCreate.type,
                        label: ingredientToCreate.type.name,
                      }
                    : undefined
                }
                onChange={onChangeAddedIngredentProductType}
                options={productsTypes.map((e) => ({
                  value: e,
                  label: e.name,
                }))}
              />
            </div>
            <div className={cls.InputBlock}>
              <div className={cls.Label}>Продукт</div>
              <CustomAsyncCreatableSelect
                className={cls.Input}
                menuPlacement="top"
                value={
                  ingredientToCreate.product
                    ? {
                        value: ingredientToCreate.product,
                        label: ingredientToCreate.product.name,
                      }
                    : undefined
                }
                onChange={onChangeAddedIngredentProduct}
                options={ingredientOptions.map((e) => ({
                  value: e,
                  label: e.name,
                }))}
                isClearable
              />
            </div>
            <div className={cls.InputBlock}>
              <div className={cls.Label}>Кол-во</div>
              <Input
                className={cls.Input}
                value={ingredientToCreate?.count || 0}
                onChange={onChangeAddedIngredentCount}
                type="number"
              />
            </div>
            <div className={cls.InputBlock}>
              <div className={cls.Label}>Ед. изм.</div>
              <CustomSelect
                className={cls.Input}
                menuPlacement="top"
                value={
                  ingredientToCreate.measureUnit
                    ? {
                        value: ingredientToCreate.measureUnit,
                        label: ingredientToCreate.measureUnit.name,
                      }
                    : undefined
                }
                onChange={onChangeAddedIngredentMeasureUnit}
                options={measureUnitsByIngredient.map((e) => ({
                  value: e,
                  label: e.name,
                }))}
              />
            </div>
            <Button className={cls.Button} onClick={onAddIngredient}>
              Добавить ингр.
            </Button>
          </div>

          <div className={cls.addedIngredients}>
            {!!form?.ingredients.length && (
              <div className={cls.headerOfAddedIngredients}>
                Добавленные игредиенты
              </div>
            )}

            {form?.ingredients.map((e) => (
              <Ingredient
                ingredient={e}
                key={e.id}
                onDelete={onDeleteIngredientHandler}
              />
            ))}
          </div>
        </div>

        <div className={cls.Footer}>
          <div className={cls.ButtonBlock}>
            {id !== "new" && (
              <Button
                className={cls.SecondaryButton}
                onClick={onStartDeleteHandler}
              >
                Удалить трекер
              </Button>
            )}

            {!openDeleteModal && (
              <Button className={cls.MainButton} onClick={onSave}>
                Сохранить
              </Button>
            )}
          </div>
        </div>
      </div>
    </DynamicModuleLoader>
  );
});

export default ProductForm;
