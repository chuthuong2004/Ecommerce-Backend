import { array, boolean, number, object, string } from "yup";
const payload = {
  body: object({
    reviews: array()
      .min(1)
      .required("array reviews is required")
      .of(
        object({
          star: number()
            .required("star is required")
            .min(1, "Giá trị nhỏ nhất của star là 1")
            .max(5, "Giá trị lớn nhất của star là 5"),
          content: string().required("content is required"),
          orderItemId: string().required("orderItemId is required"),
        }).required()
      ),
  }),
};
const params = {
  params: object({
    reviewId: string().required("reviewId is required"),
  }),
};
export const createReviewSchema = object({
  ...payload,
});
export const updateReviewSchema = object({
  ...params,
});
export const getReviewSchema = object({
  ...params,
});
export const getAllReviewByProductSchema = object({
  params: object({
    productId: string().required("productId is required"),
  }),
});
export const deleteReviewSchema = object({
  ...params,
});
