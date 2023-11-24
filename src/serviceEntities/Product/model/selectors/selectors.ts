import { StateSchema } from "@/app/providers/StoreProvider";
import { createSelector } from "@reduxjs/toolkit";
import { isArray, isObject } from "lodash";
import { CreateDto, UpdateDto } from "../types/product";

export const getProduct = (state: StateSchema) => state.product;
export const getProductData = (state: StateSchema) => state.product?.data;
export const getProductForm = (state: StateSchema) => state.product?.form;
export const getProductId = (state: StateSchema) => state.product?.id;
export const getProductCreateMode = (state: StateSchema) => state.product?.isCreateMode;
export const getProductIsLoading = (state: StateSchema) => state.product?.isLoading;
export const getProductError = (state: StateSchema) => state.product?.error;
export const getProductIngredientsOptions = (state: StateSchema) => state.product?.ingredientsOptions;
export const getProductProductsTypes = (state: StateSchema) => state.product?.productsTypes;
export const getProductMeasureUnits = (state: StateSchema) => state.product?.measureUnits;
export const getProductMeasureUnitsByIngredient = (state: StateSchema) => state.product?.measureUnitsByIngredient;
export const getProductIngredientToCreate = (state: StateSchema) => state.product?.ingredientToCreate;
export const getProductIngredientProductToCreate = (state: StateSchema) => state.product?.productToCreate;


export const getProductToCreate = createSelector(getProduct, (data) => {
  return { ...data.productToCreate, id: undefined };
});

export const getProductIdForService = createSelector(getProductId, (id) => {
  return id;
});

export const getCreateProductDtoForService = createSelector(getProduct, (data): { id: number, dto: CreateDto } => {

  if (!data || !data.isCreateMode || !data.form) return;

  const dto: CreateDto = {};

  for (const [k, v] of Object.entries(data.form)) {
    if (v !== null) {
      dto[k] = v;
    }
  }

  return {
    id: data.id,
    dto: dto,
  };
});

export const getUpdateProductDtoForService = createSelector(getProduct, (data) => {
  if (!data || !data.data || !data.form) return;

  const loaded = data.data;
  const changed = data.form;

  const dto: UpdateDto = {
    id: loaded.id,
  };

  const compare =
    (l: any, c: any, level = 1): boolean => {
      let found = false;
      if (!l || !c) return false;
      for (const [k, v] of Object.entries(l)) {
        if (!isObject(v) && l[k] === c[k]) {
          continue;
        }
        if (!isObject(v) && l[k] !== c[k]) {
          if (level === 1) {
            dto[k] = c[k];
          }
          found = true;
          continue;
        } else if (isArray(v)) {
          if (v.length !== c[k].length) {
            found = true;
            if (level === 1) {
              dto[k] = c[k];
            }
            continue;
          }
          for (let i = 0; i < v.length; i++) {
            found = compare(v[i], c[k][i], level + 1);
            if (found && level === 1) {
              dto[k] = c[k];
            }
            if (found) {
              continue;
            }
          }
        } else {
          found = compare(v, c[k], level + 1);
          if (found && level === 1) {
            dto[k] = c[k];
          }
          if (found) {
            continue;
          }
        }
      }
      return found;
    };

  compare(loaded, changed);

  return {
    id: data.id,
    dto: dto,
  };
});