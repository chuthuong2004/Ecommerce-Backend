import { object, string } from "yup";
const payload = {
  body: object({
    size: string().required("size is required"),
    color: string().required("color is required"),
    product: string().required("product is required !"),
  }),
};
const params = {
  params: object({
    cartId: string().required("cartId is required"),
  }),
};
export const addItemToCartSchema = object({
  ...payload,
});
export const updateCartSchema = object({
  ...params,
});
export const getCartSchema = object({
  ...params,
});
export const removeItemFromCartSchema = object({
  ...params,
});
export const deleteCartSchema = object({
  ...params,
});
