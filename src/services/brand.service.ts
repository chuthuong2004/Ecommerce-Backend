import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import BrandModel, { BrandDocument } from "../models/brand.model";
import ProductModel from "../models/product.model";
import APIFeatures, { QueryOption } from "../utils/ApiFeatures";

export async function createBrand(input: DocumentDefinition<BrandDocument>) {
  const brand = new BrandModel(input);
  return await brand.save();
}
export async function getAllBrand(
  query: QueryOption
): Promise<Array<BrandDocument>> {
  try {
    const features = new APIFeatures(BrandModel.find(), query)
      .paginating()
      .sorting()
      .searching()
      .filtering();
    return await features.query;
  } catch (error) {
    throw error;
  }
}
export async function getBrand(brandId: string) {
  try {
    const brand = await BrandModel.findById(brandId).populate({
      path: "products",
    });
    return brand;
  } catch (error) {
    throw error;
  }
}
export async function updateBrand(
  filter: FilterQuery<BrandDocument>,
  update: UpdateQuery<BrandDocument>,
  options: QueryOptions
) {
  try {
    const brand = await BrandModel.findOneAndUpdate(filter, update, options);
    return await brand?.save();
  } catch (error) {
    throw error;
  }
}
export async function deleteBrand(brandId: string) {
  try {
    await ProductModel.updateMany({ brand: brandId }, { brand: null });
    await BrandModel.findByIdAndDelete(brandId);
  } catch (error) {
    throw error;
  }
}
