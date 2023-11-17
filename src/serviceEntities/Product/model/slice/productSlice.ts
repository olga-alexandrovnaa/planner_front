/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Food, ProductSchema } from "../types/product";
import { create } from "../services/create";
import { update } from "../services/update";
import { fetchProduct } from "../services/fetch";

const initialState: ProductSchema = {
  data: null,
  form: null,
  id: null,
  isLoading: false,
  isCreateMode: false,
  ingredientsOptions: [],
  measureUnits: [],
  productsTypes: [],
};

const productSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    setCreateMode: (state) => {
      state.isCreateMode = true;
      state.form = {
        id: 0,
        name: '',
        calories: null,
        carbohydrates: null,
        fats: null,
        proteins: null,
        recipe: null,
        foodType: null,
        ingredients: [],
      }
    },
    onChangeName: (state, action: PayloadAction<string>) => {
      state.form.name = action.payload;
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
  },

});

export const { actions: productActions } = productSlice;
export const { reducer: productReducer } = productSlice;
