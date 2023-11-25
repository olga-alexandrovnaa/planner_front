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
  getProductIngredientProductToCreate,
  getProductIngredientToCreate,
  getProductIngredientsOptions,
  getProductMeasureUnits,
  getProductMeasureUnitsByIngredient,
  getProductProductsTypes,
} from "../model/selectors/selectors";
import { create } from "../model/services/create";
import { getRouteTask } from "@/sharedComponents/config/routeConfig/routeConfig";
import { update } from "../model/services/update";
import { fetchProduct } from "../model/services/fetch";
import { Modal } from "@/sharedComponents/ui/Modal";
import { deleteEverywhere } from "../model/services/delete";
import { Input } from "@/sharedComponents/ui/Inputs/Input";
import {
  CustomAsyncCreatableSelect,
  CustomSelect,
} from "@/sharedComponents/ui/AsyncSelect/AsyncSelect";
import {
  MeasureUnit,
  Product,
  ProductType,
  foodType,
  foodTypeOptions,
  foodTypeText,
} from "../model/types/product";
import { Button } from "@/sharedComponents/ui/Button";
import Ingredient from "./Ingredient";
import { fetchProductTypes } from "../model/services/fetchProductTypes";
import { fetchProductsByType } from "../model/services/fetchProductsByType";
import { fetchMeasureUnitsByIngredient } from "../model/services/fetchMeasureUnitsByIngredient";
import { createIngredientProduct } from "../model/services/createIngredientProduct";
import { fetchMeasureUnits } from "../model/services/fetchMeasureUnits";

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
  const ingredientProductToCreate = useSelector(
    getProductIngredientProductToCreate
  );
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

  const trackerBackPath = searchParams.get("trackerBackPath") as string;
  const dateFromUrl = searchParams.get("dateFromUrl") as string;
  const type = searchParams.get("type") as string;
  const taskId = searchParams.get("taskId") as string;

  useEffect(() => {
    if (id === "new") {
      const fT: foodType = Object.values(foodType).find((v) => v === type);
      dispatch(productActions.setCreateMode(fT));
    } else {
      dispatch(productActions.setId(Number(id)));
      dispatch(fetchProduct());
    }
  }, [dispatch, id, searchParams, type]);

  const onSave = useCallback(async () => {
    let result;
    if (isCreateMode) {
      result = await dispatch(create());
    } else {
      result = await dispatch(update());
    }
    if (error) alert(error);

    const params: OptionalRecord<string, string> = {
      backPath: trackerBackPath,
      dateFromUrl: dateFromUrl,
      type: type,
      isFood: "1",
    };

    if (typeof result.payload !== "string") {
      params.createdProduct = String(result.payload.id);
      navigate(getRouteTask(taskId, params));
    }
    navigate(getRouteTask(taskId, params));
  }, [
    dateFromUrl,
    dispatch,
    error,
    isCreateMode,
    navigate,
    taskId,
    trackerBackPath,
    type,
  ]);

  const onBack = useCallback(() => {
    const params: OptionalRecord<string, string> = {
      backPath: trackerBackPath,
      dateFromUrl: dateFromUrl,
      type: type,
      isFood: "1",
    };
    navigate(getRouteTask(taskId, params));
  }, [dateFromUrl, navigate, taskId, trackerBackPath, type]);

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
    (data: { value: MeasureUnit; label: string } | undefined) => {
      dispatch(
        productActions.onChangeAddedIngredentMeasureUnit(
          data ? data.value : undefined
        )
      );
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
    (data: { value: Product; label: string } | undefined) => {
      dispatch(
        productActions.onChangeAddedIngredentProduct(
          data ? data.value : undefined
        )
      );
    },
    [dispatch]
  );
  const onChangeAddedIngredentProductType = useCallback(
    (data: { value: ProductType; label: string } | undefined) => {
      dispatch(
        productActions.onChangeAddedIngredentProductType(
          data ? data.value : undefined
        )
      );
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchProductTypes());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchMeasureUnits());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProductsByType(ingredientToCreate?.type?.id));
  }, [dispatch, ingredientToCreate?.type?.id]);

  useEffect(() => {
    dispatch(fetchMeasureUnitsByIngredient(ingredientToCreate?.productId));
  }, [dispatch, ingredientToCreate?.productId]);

  const [openProductCreateModal, setProductCreateModalOpen] = useState(false);

  const onStartProductCreateHandler = useCallback(
    (inputValue: string) => {
      dispatch(productActions.onChangeNameCreatedProduct(inputValue));
      if (ingredientToCreate?.type) {
        dispatch(
          productActions.onChangeTypeCreatedProduct(ingredientToCreate.type)
        );
      }
      setProductCreateModalOpen(true);
    },
    [dispatch, ingredientToCreate?.type]
  );

  const onCancelProductCreateHandler = useCallback(() => {
    setProductCreateModalOpen(false);
  }, []);

  const onProductCreateHandler = useCallback(async () => {
    await dispatch(createIngredientProduct());
    dispatch(fetchProductsByType(ingredientToCreate?.type?.id));
    setProductCreateModalOpen(false);
  }, [dispatch, ingredientToCreate?.type?.id]);

  const onChangeNameCreatedProduct = useCallback(
    (val: string) => {
      dispatch(productActions.onChangeNameCreatedProduct(val));
    },
    [dispatch]
  );
  const onChangeMeasureUnitCreatedProduct = useCallback(
    (data: { value: MeasureUnit; label: string } | undefined) => {
      dispatch(
        productActions.onChangeMeasureUnitCreatedProduct(
          data ? data.value : undefined
        )
      );
    },
    [dispatch]
  );
  const onChangeTypeCreatedProduct = useCallback(
    (data: { value: ProductType; label: string } | undefined) => {
      dispatch(
        productActions.onChangeTypeCreatedProduct(data ? data.value : undefined)
      );
    },
    [dispatch]
  );

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div className={classNames(cls.ProductForm, {}, [className])}>
        {!!openProductCreateModal && (
          <Modal isOpen={true}>
            <div className={cls.Data}>
              <div className={cls.LabelTopCenter}>Создание продукта</div>
              <div className={cls.InputBlock}>
                <div className={cls.Label}>Название</div>
                <Input
                  className={cls.Input}
                  placeholder={"Название"}
                  value={ingredientProductToCreate.name || undefined}
                  onChange={onChangeNameCreatedProduct}
                />
              </div>
              <div className={cls.InputBlock}>
                <div className={cls.Label}>Тип</div>
                <CustomSelect
                  className={cls.Input}
                  menuPlacement="top"
                  isSearchable
                  value={
                    ingredientProductToCreate?.type
                      ? {
                          value: ingredientProductToCreate?.type,
                          label: ingredientProductToCreate?.type.name,
                        }
                      : ""
                  }
                  onChange={onChangeTypeCreatedProduct}
                  options={
                    productsTypes
                      ? productsTypes.map((e) => ({
                          value: e,
                          label: e.name,
                        }))
                      : []
                  }
                />
              </div>
              <div className={cls.InputBlock}>
                <div className={cls.Label}>Ед. изм.</div>
                <CustomSelect
                  className={cls.Input}
                  menuPlacement="top"
                  isSearchable
                  value={
                    ingredientProductToCreate?.measureUnit
                      ? {
                          value: ingredientProductToCreate?.measureUnit,
                          label: ingredientProductToCreate?.measureUnit.name,
                        }
                      : ""
                  }
                  onChange={onChangeMeasureUnitCreatedProduct}
                  options={
                    measureUnits
                      ? measureUnits.map((e) => ({
                          value: e,
                          label: e.name,
                        }))
                      : []
                  }
                />
              </div>
              <div style={{ marginTop: "10px" }} className={cls.ButtonBlock}>
                <Button
                  onClick={onCancelProductCreateHandler}
                  className={cls.SecondaryButton}
                >
                  Отмена
                </Button>
                <Button
                  onClick={onProductCreateHandler}
                  className={cls.MainButton}
                >
                  ОК
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {!!openDeleteModal && (
          <Modal isOpen={true}>
            <div className={cls.Data}>
              <div className={cls.LabelTopCenter}>Удалить блюдо?</div>

              <div className={cls.ButtonBlock}>
                <Button
                  onClick={onCancelDeleteHandler}
                  className={cls.SecondaryButton}
                >
                  Отмена
                </Button>
                <Button onClick={onDeleteHandler} className={cls.MainButton}>
                  ОК
                </Button>
              </div>
            </div>
          </Modal>
        )}

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
            value={form?.name ?? ""}
            onChange={onChangeName}
          />

          <Input
            className={cls.TextArea}
            value={form?.recipe ?? ""}
            onChange={onChangeRecipe}
            placeholder="Примечание"
            type="textarea"
          />

          <div className={cls.InputBlock}>
            <div className={cls.Label}>Белки</div>
            <Input
              className={cls.Input}
              value={form?.proteins ?? ""}
              onChange={onChangeProteins}
              type="number"
            />
          </div>
          <div className={cls.InputBlock}>
            <div className={cls.Label}>Жиры</div>
            <Input
              className={cls.Input}
              value={form?.fats ?? ""}
              onChange={onChangeFats}
              type="number"
            />
          </div>
          <div className={cls.InputBlock}>
            <div className={cls.Label}>Углеводы</div>
            <Input
              className={cls.Input}
              value={form?.carbohydrates ?? ""}
              onChange={onChangeCarbohydrates}
              type="number"
            />
          </div>
          <div className={cls.InputBlock}>
            <div className={cls.Label}>Калории</div>
            <Input
              className={cls.Input}
              value={form?.calories ?? ""}
              onChange={onChangeCalories}
              type="number"
            />
          </div>
          <div className={cls.InputBlock}>
            <div className={cls.Label}>Тип</div>
            <CustomSelect
              className={cls.Input}
              menuPlacement="top"
              isSearchable
              value={
                form?.foodType
                  ? {
                      value: form?.foodType,
                      label: foodTypeText[form?.foodType],
                    }
                  : ""
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
                isSearchable
                value={
                  ingredientToCreate?.type
                    ? {
                        value: ingredientToCreate?.type,
                        label: ingredientToCreate?.type.name,
                      }
                    : ""
                }
                onChange={onChangeAddedIngredentProductType}
                options={
                  productsTypes
                    ? productsTypes.map((e) => ({
                        value: e,
                        label: e.name,
                      }))
                    : []
                }
              />
            </div>
            {!!ingredientToCreate?.type && (
              <div className={cls.InputBlock}>
                <div className={cls.Label}>Продукт</div>
                <CustomAsyncCreatableSelect
                  onCreateOption={onStartProductCreateHandler}
                  className={cls.Input}
                  menuPlacement="top"
                  isSearchable
                  value={
                    ingredientToCreate?.product
                      ? {
                          value: ingredientToCreate?.product,
                          label: ingredientToCreate?.product.name,
                        }
                      : ""
                  }
                  onChange={onChangeAddedIngredentProduct}
                  defaultOptions={
                    ingredientOptions
                      ? ingredientOptions.map((e) => ({
                          value: e,
                          label: e.name,
                        }))
                      : []
                  }
                  isClearable
                />
              </div>
            )}
            {!!ingredientToCreate?.product && (
              <div className={cls.InputBlock}>
                <div className={cls.Label}>Кол-во</div>
                <Input
                  className={cls.Input}
                  value={ingredientToCreate?.count ?? ""}
                  onChange={onChangeAddedIngredentCount}
                  type="number"
                />
              </div>
            )}
            {!!ingredientToCreate?.product && (
              <div className={cls.InputBlock}>
                <div className={cls.Label}>Ед. изм.</div>
                <CustomSelect
                  className={cls.Input}
                  menuPlacement="top"
                  isSearchable
                  value={
                    ingredientToCreate?.measureUnit
                      ? {
                          value: ingredientToCreate?.measureUnit,
                          label: ingredientToCreate?.measureUnit.name,
                        }
                      : ""
                  }
                  onChange={onChangeAddedIngredentMeasureUnit}
                  options={
                    measureUnitsByIngredient
                      ? measureUnitsByIngredient.map((e) => ({
                          value: e,
                          label: e.name,
                        }))
                      : []
                  }
                />
              </div>
            )}
            {!!ingredientToCreate?.type &&
              !!ingredientToCreate?.product &&
              !!ingredientToCreate?.count &&
              !!ingredientToCreate?.measureUnit && (
                <Button className={cls.Button} onClick={onAddIngredient}>
                  Добавить ингредиент
                </Button>
              )}
          </div>

          <div className={cls.addedIngredients}>
            {!!form?.ingredients?.length && (
              <div className={cls.headerOfAddedIngredients}>
                Добавленные игредиенты
              </div>
            )}

            {form?.ingredients?.map((e) => (
              <Ingredient
                ingredient={e}
                key={e.id}
                onDelete={onDeleteIngredientHandler}
              />
            ))}
          </div>
        </div>

        <div className={cls.Footer}>
          {id !== "new" ? (
            <div className={cls.ButtonBlock}>
              <Button
                className={cls.SecondaryButton}
                onClick={onStartDeleteHandler}
              >
                Удалить блюдо
              </Button>

              {!openDeleteModal && form?.name && (
                <Button className={cls.MainButton} onClick={onSave}>
                  Сохранить
                </Button>
              )}
            </div>
          ) : (
            <>
              {!openDeleteModal && form?.name && (
                <Button className={cls.MainButton} onClick={onSave}>
                  Сохранить
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </DynamicModuleLoader>
  );
});

export default ProductForm;
