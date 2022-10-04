import { array, boolean, number, object, string } from "yup";
const payload = {
  body: object({
    deliveryInformation: object({
      address: string().trim().required("address is required"),
      ward: string().trim().required("ward is required"),
      district: string().trim().required("district is required"),
      province: string().trim().required("province is required"),
      phone: string()
        .required("phone is required !")
        .matches(
          /^(03|09|08|07)[0-9]{8}$/,
          "Vui lòng nhập số điện thoại hợp lệ !"
        ),
      lastName: string().trim().required("lastName is required"),
      firstName: string().trim().required("firstName is required"),
    }).required("deliveryInformation is required"),
    cartItemsId: array()
      .required("cartItemsId is required")
      .min(1, "Vui lòng nhập cartItem id "),
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
