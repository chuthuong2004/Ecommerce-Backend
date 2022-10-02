import { number, object, string } from "yup";
const payload = {
  body: object({
    gender: string().required("gender is required"),
    category: string().required("category is required"),
    brand: string().required("brand is required"),
    description: string().required("description is required"),
    price: number().required("price is required !"),
    name: string().required("name is required !"),
  }),
};
const params = {
  params: object({
    productId: string().required("productId is required"),
  }),
};
export const createProductSchema = object({
  ...payload,
});
export const updateProductSchema = object({
  body: object({
    // name: string().required("Vui lòng nhập tên danh mục !"),
  }),
  ...params,
});
export const getProductSchema = object({
  ...params,
});
export const deleteProductSchema = object({
  ...params,
});
export const restoreProductSchema = object({
  ...params,
});
