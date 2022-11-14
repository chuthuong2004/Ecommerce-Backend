import { object, string } from "yup";
const payload = {
  body: object({
    name: string().required("Vui lòng nhập tên brand !"),
    logo: string().notRequired(),
    image: string().notRequired(),
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
  body: object({
    name: string().notRequired(),
    logo: string().notRequired(),
    image: string().notRequired(),
  }),
});
export const getBrandSchema = object({
  ...params,
});
export const deleteBrandSchema = object({
  ...params,
});
