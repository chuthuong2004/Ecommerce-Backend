import { array, number, object, string } from "yup";
const payload = {
  body: object({
    gender: string().required("gender is required"),
    category: string().required("category is required"),
    brand: string().required("brand is required"),
    description: string().required("description is required"),
    colors: array().min(1).required("array colors is required"),
    // .of(
    // object({
    // star: number()
    // .required("star is required")
    // .min(1, "Giá trị nhỏ nhất của star là 1")
    // .max(5, "Giá trị lớn nhất của star là 5"),
    // content: string().required("content is required"),
    // orderItemId: string().required("orderItemId is required"),
    // }).required()
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
