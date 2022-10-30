"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
var EQueryOption;
(function (EQueryOption) {
    EQueryOption["SORT"] = "sort";
    EQueryOption["PAGE"] = "page";
    EQueryOption["LIMIT"] = "limit";
    EQueryOption["SEARCH"] = "search";
})(EQueryOption || (EQueryOption = {}));
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    paginating() {
        var page = this.queryString.page ? this.queryString.page * 1 : 1;
        var limit = this.queryString.limit ? this.queryString.limit * 1 : 0;
        var skip = (page - 1) * limit;
        logger_1.default.info({ page, limit, skip });
        this.query = this.query.limit(limit).skip(skip);
        return this;
    }
    sorting() {
        var sort = this.queryString.sort || "-createdAt";
        this.query = this.query.sort(sort);
        return this;
    }
    searching() {
        var search = this.queryString.search;
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
        }
        else {
            this.query = this.query.find();
        }
        return this;
    }
    filtering() {
        const queryObj = Object.assign({}, this.queryString);
        console.log(queryObj);
        const excludedField = [
            EQueryOption.PAGE,
            EQueryOption.SORT,
            EQueryOption.LIMIT,
            EQueryOption.SEARCH,
        ];
        excludedField.forEach((item) => delete queryObj[item]);
        console.log(queryObj);
        let queryStr = JSON.stringify(queryObj);
        console.log(queryStr);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, (match) => "$" + match);
        const newQuery = JSON.parse(queryStr);
        console.log(newQuery);
        this.query = this.query.find(newQuery);
        return this;
    }
}
exports.default = APIFeatures;
