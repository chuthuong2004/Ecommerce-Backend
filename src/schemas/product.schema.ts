import { array, number, object, string } from "yup";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateProductInput:
 *       type: object
 *       required:
 *        - name
 *        - price
 *        - description
 *        - colors
 *        - brand
 *        - category
 *        - gender
 *       properties:
 *         name:
 *           type: string
 *           default: Name of product
 *         description:
 *           type: string
 *           default: Description of product
 *         price:
 *           type: number
 *           default: 1500000
 *         brand:
 *           type: string
 *           default: Id of brand
 *         category:
 *           type: string
 *           default: id of category
 *         gender:
 *           type: string
 *           default: Nam
 *         colors:
 *           type: array
 *           default: [{imageMedium: '/public/products/filename', imageSmall: '/public/products/filename', images: ['/public/products/filename'], sizes: [{size: 'XL', quantity:50}], colorName: 'green'}]
 */

const payload = {
  body: object({
    gender: string().required("gender is required"),
    category: string().required("category is required"),
    brand: string().required("brand is required"),
    description: string().required("description is required"),
    colors: array().min(1).required("array colors is required"),
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
