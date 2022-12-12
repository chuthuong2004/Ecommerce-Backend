import { Request } from "express";
import { Document, FilterQuery, Query } from "mongoose";
import log from "../logger";
import { UserDocument } from "../models/user.model";
export interface QueryOption {
  limit?: number;
  page?: number;
  sort?: string;
  search?: string;
  skip?: number;
}
enum EQueryOption {
  SORT = "sort",
  PAGE = "page",
  LIMIT = "limit",
  SEARCH = "search",
}
class APIFeatures {
  query: any; // Query<any,any,any,any>
  queryString: QueryOption;

  constructor(query: any, queryString: QueryOption) {
    this.query = query;
    this.queryString = queryString;
  }
  public paginating() {
    var page = this.queryString.page ? this.queryString.page * 1 : 1;
    var limit = this.queryString.limit ? this.queryString.limit * 1 : 0;
    var skip = (page - 1) * limit;
    if (this.queryString.skip) {
      skip = this.queryString.skip;
    }
    // log.info({ page, limit, skip });
    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
  public sorting() {
    var sort = this.queryString.sort || "-createdAt";
    this.query = this.query.sort(sort);
    return this;
  }

  public searching() {
    var search = this.queryString.search?.trim();
    if (search) {
      this.query = this.query.find({
        $or: [
          { name: { $regex: new RegExp(".*" + search + ".*", "i") } },
          {
            keywords: {
              $regex: new RegExp(".*" + search + ".*", "i"),
            },
          },
        ],
      });
    } else {
      this.query = this.query.find();
    }
    return this;
  }
  public filtering() {
    const queryObj = { ...this.queryString };
    // console.log(queryObj);

    const excludedField = [
      EQueryOption.PAGE,
      EQueryOption.SORT,
      EQueryOption.LIMIT,
      EQueryOption.SEARCH,
    ];
    excludedField.forEach((item) => delete queryObj[item]);
    // console.log(queryObj);
    let queryStr = JSON.stringify(queryObj);
    // console.log(queryStr);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );
    const newQuery = JSON.parse(queryStr);
    // console.log(newQuery);
    this.query = this.query.find(newQuery);
    return this;
  }
}
export default APIFeatures;
