import { number, object, string } from "yup";
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
  body: object({
    quantity: number()
      .required("quantity is required")
      .min(0, "Số lượng phải lớn hơn 0"),
  }),
  params: object({
    cartItemId: string().required("cartItemId is required"),
  }),
});
export const getCartSchema = object({
  ...params,
});
export const removeItemFromCartSchema = object({
  params: object({
    cartItemId: string().required("cartItemId is required"),
  }),
});
export const deleteCartSchema = object({
  ...params,
});
