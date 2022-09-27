import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import CatalogModel, { CatalogDocument } from "../models/catalog.model";
import CategoryModel, { CategoryDocument } from "../models/category.model";
import ProductModel from "../models/product.model";
import APIFeatures, { QueryOption } from "../utils/ApiFeatures";

export async function createCategory(
  input: DocumentDefinition<CategoryDocument>
) {
  try {
    const category = await CategoryModel.create(input);
    if (input.catalog) {
      const catalog = await CatalogModel.findById(input.catalog);
      if (catalog)
        await catalog.updateOne({ $push: { categories: category._id } });
    }
    return category;
  } catch (error) {
    throw error;
  }
}
export async function getAllCategory(
  query: QueryOption
): Promise<Array<CategoryDocument>> {
  try {
    const features = new APIFeatures(
      CategoryModel.find(),
      // .populate({
      //   path: "categories",
      //   populate: {
      //     path: "products",
      //     populate: {
      //       path: "reviews",
      //       populate: { path: "user" },
      //     },
      //   },
      // }),
      query
    )
      .paginating()
      .sorting()
      .searching()
      .filtering();
    return await features.query;
  } catch (error) {
    throw error;
  }
}
export async function getCategory(categoryId: string) {
  try {
    const category = await CategoryModel.findById(categoryId).populate({
      path: "catalog",
    });
    // .populate({
    //   path: "products",
    // populate: { path: "reviews" },
    // });
    return category;
  } catch (error) {
    throw error;
  }
}
export async function updateCategory(
  filter: FilterQuery<CategoryDocument>,
  update: UpdateQuery<CategoryDocument>,
  options: QueryOptions
) {
  try {
    const category = await CategoryModel.findOne(filter);
    if (update.catalog !== String(category?.catalog)) {
      // nếu có catalog
      var currentCatalog = category?.catalog;
      // xóa category khỏi catalog cũ
      await CatalogModel.findOneAndUpdate(
        { _id: currentCatalog },
        { $pull: { categories: category?._id } }
      );

      // và đẩy category vào catalog mới
      const catalog = await CatalogModel.findById(update.catalog);
      await catalog?.updateOne({ $addToSet: { categories: category?._id } });
    }
    const updatedCategory = await CategoryModel.findOneAndUpdate(
      filter,
      update,
      options
    );
    return await updatedCategory?.save();
  } catch (error) {
    throw error;
  }
}
export async function deleteCategory(categoryId: string) {
  try {
    await CatalogModel.updateOne(
      {
        categories: categoryId,
      },
      {
        $pull: { categories: categoryId },
      }
    );
    await ProductModel.updateMany(
      {
        category: categoryId,
      },
      { category: null }
    );
    await CategoryModel.findByIdAndDelete(categoryId);
  } catch (error) {
    throw error;
  }
}
