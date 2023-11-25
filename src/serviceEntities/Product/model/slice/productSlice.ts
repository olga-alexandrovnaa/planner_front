/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Food, foodType, MeasureUnit, Product, ProductSchema, ProductType } from "../types/product";
import { create } from "../services/create";
import { update } from "../services/update";
import { fetchProduct } from "../services/fetch";
import { createIngredientProduct } from "../services/createIngredientProduct";
import { fetchProductTypes } from "../services/fetchProductTypes";
import { fetchProductsByType } from "../services/fetchProductsByType";
import { fetchMeasureUnits } from "../services/fetchMeasureUnits";
import { fetchMeasureUnitsByIngredient } from "../services/fetchMeasureUnitsByIngredient";

const initialState: ProductSchema = {
  data: null,
  form: null,
  id: null,
  isLoading: false,
  isCreateMode: false,
  ingredientsOptions: [],
  measureUnits: [],
  productsTypes: [],
  productToCreate: {
    id: 0,
    name: undefined,
    measureUnit: undefined,
    measureUnitId: undefined,
    type: undefined,
    typeId: undefined,
  },
  measureUnitsByIngredient: [],
  addedIngredientsCount: 0,
  ingredientToCreate: {
    id: 0,
    count: 0,
    productId: undefined,
    product: undefined,
    measureUnit: undefined,
    measureUnitId: undefined,
    type: undefined,
  }
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    setCreateMode: (state, action: PayloadAction<foodType>) => {
      state.isCreateMode = true;
      state.form = {
        id: 0,
        name: '',
        calories: null,
        carbohydrates: null,
        fats: null,
        proteins: null,
        recipe: null,
        foodType: action.payload,
        ingredients: [],
      }
    },
    onChangeName: (state, action: PayloadAction<string>) => {
      state.form.name = action.payload;
    },
    onChangeRecipe: (state, action: PayloadAction<string>) => {
      state.form.recipe = action.payload;
    },
    onChangeProteins: (state, action: PayloadAction<number>) => {
      state.form.proteins = action.payload;
    },
    onChangeFats: (state, action: PayloadAction<number>) => {
      state.form.fats = action.payload;
    },
    onChangeCarbohydrates: (state, action: PayloadAction<number>) => {
      state.form.carbohydrates = action.payload;
    },
    onChangeCalories: (state, action: PayloadAction<number>) => {
      state.form.calories = action.payload;
    },
    onChangeFoodType: (state, action: PayloadAction<foodType>) => {
      state.form.foodType = action.payload;
    },
    onChangeAddedIngredentProduct: (state, action: PayloadAction<Product>) => {
      state.ingredientToCreate.productId = action.payload ? action.payload.id : undefined;
      state.ingredientToCreate.product = action.payload;
    },
    onChangeAddedIngredentCount: (state, action: PayloadAction<number>) => {
      state.ingredientToCreate.count = action.payload;
    },
    onChangeAddedIngredentMeasureUnit: (state, action: PayloadAction<MeasureUnit>) => {
      state.ingredientToCreate.measureUnitId = action.payload ? action.payload.id : undefined;
      state.ingredientToCreate.measureUnit = action.payload;
    },
    onChangeAddedIngredentProductType: (state, action: PayloadAction<ProductType>) => {
      state.ingredientToCreate.type = action.payload;
    },
    onAddIngredient: (state) => {
      state.form.ingredients = [...state.form.ingredients,
      {
        ...state.ingredientToCreate
      }];
      state.ingredientToCreate = {
        id: (-1) * state.addedIngredientsCount,
        count: 0,
        type: undefined,
        productId: undefined,
        product: undefined,
        measureUnit: undefined,
        measureUnitId: undefined
      }
      state.addedIngredientsCount += 1;
    },
    onDeleteIngredient: (state, action: PayloadAction<number>) => {
      state.form.ingredients = state.form.ingredients.filter((e) => e.id !== action.payload)
    },

    onChangeTypeCreatedProduct: (state, action: PayloadAction<ProductType>) => {
      state.productToCreate.type = action.payload;
      state.productToCreate.typeId = action.payload ? action.payload.id : undefined;
    },
    onChangeNameCreatedProduct: (state, action: PayloadAction<string>) => {
      state.productToCreate.name = action.payload;
    },
    onChangeMeasureUnitCreatedProduct: (state, action: PayloadAction<MeasureUnit>) => {
      state.productToCreate.measureUnitId = action.payload ? action.payload.id : undefined; 
      state.productToCreate.measureUnit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(fetchProduct.fulfilled, (state, action: PayloadAction<Food>) => {
        state.isLoading = false;
        state.data = JSON.parse(JSON.stringify(action.payload))
        state.form = JSON.parse(JSON.stringify(action.payload))
      })
      .addCase(fetchProduct.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(create.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(create.fulfilled, (state, action: PayloadAction<Food>) => {
        state.isLoading = false;
        if (action.payload === null) return;
        state.data = JSON.parse(JSON.stringify(action.payload))
        state.form = JSON.parse(JSON.stringify(action.payload))
      })
      .addCase(create.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(update.pending, (state) => {
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(update.fulfilled, (state, action: PayloadAction<Food>) => {
        state.isLoading = false;
        if (action.payload === null) return;
        state.data = JSON.parse(JSON.stringify(action.payload))
        state.form = JSON.parse(JSON.stringify(action.payload))
      })
      .addCase(update.rejected, (state, action: any) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createIngredientProduct.pending, (state) => {
        // state.error = undefined;
      })
      .addCase(createIngredientProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.productToCreate = {
          id: 0,
          name: undefined,
          measureUnit: undefined,
          measureUnitId: undefined,
          type: undefined,
          typeId: undefined,
        };
        state.ingredientToCreate.productId = action.payload ? action.payload.id : undefined;
        state.ingredientToCreate.product = action.payload;
      })

      .addCase(fetchProductTypes.pending, (state) => {
        state.productsTypes = [];
      })
      .addCase(fetchProductTypes.fulfilled, (state, action: PayloadAction<ProductType[]>) => {
        state.productsTypes = action.payload;
      })

      .addCase(fetchProductsByType.pending, (state) => {
        state.ingredientsOptions = [];
      })
      .addCase(fetchProductsByType.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.ingredientsOptions = action.payload;
      })

      .addCase(fetchMeasureUnits.pending, (state) => {
        state.measureUnits = [];
      })
      .addCase(fetchMeasureUnits.fulfilled, (state, action: PayloadAction<MeasureUnit[]>) => {
        state.measureUnits = action.payload;
      })

      .addCase(fetchMeasureUnitsByIngredient.pending, (state) => {
        state.measureUnitsByIngredient = [];
      })
      .addCase(fetchMeasureUnitsByIngredient.fulfilled, (state, action: PayloadAction<MeasureUnit[]>) => {
        state.measureUnitsByIngredient = action.payload;
      })

  },

});

export const { actions: productActions } = productSlice;
export const { reducer: productReducer } = productSlice;
