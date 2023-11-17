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

export interface ProductFormProps {
  className?: string;
}

const initialReducers: ReducersList = {
  product: productReducer,
};

const ProductForm = memo(({ className }: ProductFormProps) => {
  const dispatch = useAppDispatch();
  const form = useSelector(getProductForm);
  const isCreateMode = useSelector(getProductCreateMode);
  const error = useSelector(getProductError);

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const search = useLocation().search;
  const backPath = new URLSearchParams(search).get("backPath");

  useEffect(() => {
    if (id === "new") {
      const dateFromUrl = searchParams.get("date") as string;
      const isFoodFromUrl = searchParams.get("isFood") as string;
      console.log(dateFromUrl, isFoodFromUrl);
      dispatch(productActions.setCreateMode());
    } else {
      const dateFromUrl = searchParams.get("date") as string;
      dispatch(productActions.setId(Number(id)));
      dispatch(fetchProduct(dateFromUrl));
    }
  }, [dispatch, id, searchParams]);

  const onSave = useCallback(async () => {
    if (isCreateMode) {
      await dispatch(create());
    } else {
      await dispatch(update());
    }
    if (error) alert(error);
    if (!backPath) {
      navigate(getRouteMain(getDD_MM_YYYY(new Date(form?.date))));
    } else {
      navigate(backPath);
    }
  }, [backPath, dispatch, error, form?.date, isCreateMode, navigate]);

  const onBack = useCallback(() => {
    if (!backPath) {
      navigate(getRouteMain(getDD_MM_YYYY(new Date(form?.date))));
    } else {
      navigate(backPath);
    }
  }, [backPath, form?.date, navigate]);

  const onChangeName = useCallback(
    (val: string) => {
      dispatch(productActions.onChangeName(val));
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

  return (
    <DynamicModuleLoader removeAfterUnmount reducers={initialReducers}>
      <div className={classNames(cls.ProductForm, {}, [className])}></div>
    </DynamicModuleLoader>
  );
});

export default ProductForm;
