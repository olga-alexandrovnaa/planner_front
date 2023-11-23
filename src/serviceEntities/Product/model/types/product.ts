
export type Ingredient = {
  id: number;
  productId: number;
  product: Product;
  count: number;
  measureUnitId?: number | null;
  measureUnit?: MeasureUnit;
};


export type Food = {
  id: number;

  name: string;
  proteins?: number;
  fats?: number;
  carbohydrates?: number;
  calories?: number;

  foodType?: foodType;
  recipe?: string;
  ingredients: Ingredient[]
};



export interface CreateDto extends Record<string, any> {
  name: string;
}

export interface UpdateDto extends Record<string, any> {
  name?: string;

}

export type DeleteDto = {
  id: number;
};


export enum foodType {
  breakfast = 'breakfast',
  soup = 'soup',
  second = 'second',
  dessert = 'dessert',
  salad = 'salad',
  drink = 'drink',
  snack = 'snack',
}

export const foodTypeText: Record<foodType, string> = {
  [foodType.breakfast]: "Завтрак",
  [foodType.soup]: "Суп",
  [foodType.second]: "Второе",
  [foodType.dessert]: "Десерт",
  [foodType.salad]: "Салат",
  [foodType.drink]: "Напитки",
  [foodType.snack]: "Закуски",
};


export const foodTypeOptions = Object.values(foodType).map(
  (value: foodType) => ({ value: value, label: foodTypeText[value] })
);

export type Product = {
  id: number;
  name: string;
  typeId?: number;
  type?: ProductType;
  measureUnitId?: number;
  measureUnit?: MeasureUnit;
};

export type MeasureUnit = {
  id: number;
  name: string;
  outcomeMeasureUnits: OutcomeMeasureUnit[]
}

export type OutcomeMeasureUnit = {
  id: number;
  measureUnitId: number;
  measureUnit: {
    id: number;
    name: string;
  };
  outcomeOfProduct: number;
}

export type ProductType = {
  id: number;
  name: string;
};


export interface ProductSchema {
  id: number;
  form?: Food;
  data?: Food;
  productsTypes: ProductType[]
  ingredientsOptions: Product[]
  measureUnits: MeasureUnit[]
  measureUnitsByIngredient: MeasureUnit[]
  productToCreate?: Product;
  ingredientToCreate?: Ingredient & { type: ProductType };
  addedIngredientsCount: number;
  isLoading?: boolean;
  isCreateMode?: boolean;
  error?: string;
}
