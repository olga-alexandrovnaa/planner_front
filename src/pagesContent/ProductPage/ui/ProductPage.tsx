

import { ProductForm } from "@/serviceEntities/Product";
import cls from "./ProductPage.module.scss";

function ProductPage() {
  return (
    <div className={cls.ProductPage}>
      <ProductForm />
    </div>
  );
}

export default ProductPage;
