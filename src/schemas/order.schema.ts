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
    orderId: string().required("orderId is required"),
  }),
};
export const createOrderSchema = object({
  ...payload,
});
export const updateOrderSchema = object({
  body: object({
    quantity: number()
      .required("quantity is required")
      .min(0, "Số lượng phải lớn hơn 0"),
  }),
  params: object({
    cartItemId: string().required("cartItemId is required"),
  }),
});
export const getOrderSchema = object({
  ...params,
});
export const deleteOrderSchema = object({
  ...params,
});
