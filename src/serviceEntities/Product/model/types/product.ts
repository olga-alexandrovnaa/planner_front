
export type Ingredient = {
  id: number;
  trackerId: number;
  productId: number;
  product: {
    id: number;
    name: string;
    typeId?: number;
    type?: {
      id: number;
      name: string;
      userId?: number;
      isDeleted: boolean;
    };
    measureUnitId: number;
    measureUnit: {
      id: number;
      name: string;
    };
  };
  count: number;
  measureUnitId?: number | null;
  measureUnit?: {
    measureUnitId: number;
    measureUnit: {
      id: number;
      name: string;
    };
    outcomeOfProduct: number;
  };
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

export type Product = {
  id: number;

  name: string;
  typeId?: number;
  type?: ProductType;
  measureUnitId?: number;
  measureUnit?: MeasureUnit;

  foodType?: foodType;
  recipe?: string;
  ingredients: Ingredient[]
};

export type MeasureUnit = {
  id: number;
  name: string;
  outcomeMeasureUnits: OutcomeMeasureUnit[]
}

export type OutcomeMeasureUnit = {
  measureUnitId: number;
  measureUnit: MeasureUnit;
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
  isLoading?: boolean;
  isCreateMode?: boolean;
  error?: string;
}
