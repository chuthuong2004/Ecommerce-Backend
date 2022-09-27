import { object, string } from "yup";
const payload = {
  body: object({
    name: string().required("Vui lòng nhập tên catalog !"),
  }),
};
const params = {
  params: object({
    catalogId: string().required("catalogId is required"),
  }),
};
export const createCatalogSchema = object({
  ...payload,
});
export const updateCatalogSchema = object({
  ...params,
  ...payload,
});
export const getCatalogSchema = object({
  ...params,
});
export const deleteCatalogSchema = object({
  ...params,
});
