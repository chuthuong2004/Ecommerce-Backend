import { object, string } from "yup";
const payload = {
  body: object({
    name: string().required("Vui lòng nhập tên brand !"),
  }),
};
const params = {
  params: object({
    brandId: string().required("brandId is required"),
  }),
};
export const createBrandSchema = object({
  ...payload,
});
export const updateBrandSchema = object({
  ...params,
  ...payload,
});
export const getBrandSchema = object({
  ...params,
});
export const deleteBrandSchema = object({
  ...params,
});
