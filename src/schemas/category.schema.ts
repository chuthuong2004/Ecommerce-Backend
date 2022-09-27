import { object, string } from "yup";
const payload = {
  body: object({
    name: string().required("Vui lòng nhập tên danh mục !"),
    catalog: string().required("catalog is required"),
  }),
};
const params = {
  params: object({
    categoryId: string().required("categoryId is required"),
  }),
};
export const createCategorySchema = object({
  ...payload,
});
export const updateCategorySchema = object({
  body: object({
    name: string().required("Vui lòng nhập tên danh mục !"),
  }),
});
export const getCategorySchema = object({
  ...params,
});
export const deleteCategorySchema = object({
  ...params,
});
