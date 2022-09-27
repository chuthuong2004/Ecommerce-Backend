import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import CatalogModel, { CatalogDocument } from "../models/catalog.model";
import CategoryModel from "../models/category.model";
import APIFeatures, { QueryOption } from "../utils/ApiFeatures";

export async function createCatalog(
  input: DocumentDefinition<CatalogDocument>
) {
  const catalog = new CatalogModel(input);
  return await catalog.save();
}
export async function getAllCatalog(
  query: QueryOption
): Promise<Array<CatalogDocument>> {
  try {
    const features = new APIFeatures(
      CatalogModel.find(),
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
export async function getCatalog(catalogId: string) {
  try {
    const catalog = await CatalogModel.findById(catalogId).populate({
      path: "categories",
      // populate: {
      // path: "products",
      //       populate: { path: "reviews", populate: { path: "user" } },
      // },
    });
    return catalog;
  } catch (error) {
    throw error;
  }
}
export async function updateCatalog(
  filter: FilterQuery<CatalogDocument>,
  update: UpdateQuery<CatalogDocument>,
  options: QueryOptions
) {
  try {
    const catalog = await CatalogModel.findOneAndUpdate(
      filter,
      update,
      options
    );
    return await catalog?.save();
  } catch (error) {
    throw error;
  }
}
export async function deleteCatalog(catalogId: string) {
  try {
    await CategoryModel.updateMany({ catalog: catalogId }, { catalog: null });
    await CatalogModel.findByIdAndDelete(catalogId);
  } catch (error) {
    throw error;
  }
}
