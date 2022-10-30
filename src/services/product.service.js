"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forceDestroyProduct = exports.restoreProduct = exports.deleteProduct = exports.handleFavorite = exports.updateProduct = exports.getProduct = exports.getAllProduct = exports.createProduct = void 0;
const product_controller_1 = require("../controllers/product.controller");
const brand_model_1 = __importDefault(require("../models/brand.model"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const category_model_1 = __importDefault(require("../models/category.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const review_model_1 = __importDefault(require("../models/review.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const ApiFeatures_1 = __importDefault(require("../utils/ApiFeatures"));
function createProduct(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = new product_model_1.default(input);
            yield product.save();
            yield category_model_1.default.updateOne({
                _id: input.category,
            }, {
                $push: { products: product._id },
            });
            yield brand_model_1.default.updateOne({
                _id: input.brand,
            }, {
                $push: { products: product._id },
            });
            return product;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createProduct = createProduct;
function getAllProduct(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const features = new ApiFeatures_1.default(product_model_1.default.find().populate({ path: "brand", select: "-products" }), query)
                .paginating()
                .sorting()
                .searching()
                .filtering();
            return yield features.query;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getAllProduct = getAllProduct;
function getProduct(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(filter);
            const product = yield product_model_1.default.findOne(filter)
                .populate("brand")
                .populate("category");
            return product;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getProduct = getProduct;
// * update product --- DONE
function updateProduct(productId, update) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // kiểm tra nếu update có ID brand thì xóa product khỏi brand cũ và add product vào brand mới
            const product = yield product_model_1.default.findById(productId);
            if (update.brand) {
                // xử lý cập nhật lại brand
                const newBrand = yield brand_model_1.default.findById(update.brand);
                // nếu brand mới này mà chưa có product thì update lại brand
                if (!(newBrand === null || newBrand === void 0 ? void 0 : newBrand.products.includes(productId))) {
                    // Thêm product vào brand mới
                    yield brand_model_1.default.updateOne({
                        _id: update.brand,
                    }, {
                        $push: { products: productId },
                    });
                    // xóa product khỏi brand cũ
                    yield brand_model_1.default.updateOne({
                        _id: product === null || product === void 0 ? void 0 : product.brand,
                    }, { $pull: { products: productId } });
                }
            }
            if (update.category) {
                // xử lý cập nhật lại category
                const newCategory = yield category_model_1.default.findById(update.category);
                // nếu category mới này mà chưa có product thì update lại category
                if (!(newCategory === null || newCategory === void 0 ? void 0 : newCategory.products.includes(productId))) {
                    // Thêm product vào category mới
                    yield category_model_1.default.updateOne({
                        _id: update.category,
                    }, {
                        $push: { products: productId },
                    });
                    // xóa product khỏi brand cũ
                    yield category_model_1.default.updateOne({
                        _id: product === null || product === void 0 ? void 0 : product.category,
                    }, { $pull: { products: productId } });
                }
            }
            return yield product_model_1.default.findByIdAndUpdate(productId, update, {
                new: true,
            });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.updateProduct = updateProduct;
// * xử lý yêu thích sản phẩm --- DONE
function handleFavorite(productId, userId, actionFavorite) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let updateProduct = actionFavorite === product_controller_1.ActionFavorite.ADD
                ? { $addToSet: { favorites: userId } }
                : { $pull: { favorites: userId } };
            const [product, user] = yield Promise.all([
                product_model_1.default.findByIdAndUpdate(productId, updateProduct, // nếu product chưa có userId này thì add vào,
                { new: true }),
                user_model_1.default.findById(userId),
            ]);
            if (!product)
                return null;
            product.likeCount = product.favorites.length; // gán lại lượt thích bằng độ dài của mảng favorites
            let updateUser;
            if (actionFavorite === product_controller_1.ActionFavorite.ADD) {
                // nếu không truyền vào favorite thì sẽ lấy favorite phần tử thứ 0 của product
                const favorite = {
                    product: product._id,
                    color: product.colors[0].colorName,
                    colorId: (_a = product.colors[0]) === null || _a === void 0 ? void 0 : _a._id,
                    size: product.colors[0].sizes[0].size,
                    quantity: 1,
                };
                updateUser = { $push: { favorites: favorite } };
            }
            else if (actionFavorite === product_controller_1.ActionFavorite.REMOVE) {
                // tìm xem product này đã có trong favorite nào của user không nếu có trả về 1 Favorite còn không trả về undefined
                const favoriteForUser = (_b = user === null || user === void 0 ? void 0 : user.favorites) === null || _b === void 0 ? void 0 : _b.find((favorite) => favorite.product == productId);
                updateUser = { $pull: { favorites: favoriteForUser } };
            }
            // nếu không có favorite thì mới thêm vào user
            yield user_model_1.default.findByIdAndUpdate(userId, updateUser, { new: true });
            return yield product.save();
        }
        catch (error) {
            throw error;
        }
    });
}
exports.handleFavorite = handleFavorite;
function deleteProduct(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deleteProduct = yield product_model_1.default.delete({ _id: productId });
            console.log(deleteProduct);
            return deleteProduct;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.deleteProduct = deleteProduct;
function restoreProduct(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const restoreProduct = yield product_model_1.default.restore({ _id: productId });
            console.log(restoreProduct);
            return restoreProduct;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.restoreProduct = restoreProduct;
function forceDestroyProduct(productId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // muốn xóa 1 sản phẩm khỏi db thì phải xóa tất cả dữ liệu liên quan đến nó
            const [carts] = yield Promise.all([
                cart_model_1.default.find({
                    "cartItems.$.product": productId,
                }),
                category_model_1.default.updateMany({
                    products: productId,
                }, {
                    $pull: { products: productId },
                }),
                review_model_1.default.findOneAndDelete({ product: productId }),
            ]);
            // * DELETE ITEM FROM CART SUCCESSFULLY
            if (carts) {
                carts.forEach((cart) => __awaiter(this, void 0, void 0, function* () {
                    if (cart.cartItems.length == 1) {
                        // nếu cart này chỉ có 1 item là sản phẩm cần xóa thì tiến hành xóa luôn cart này và update lại user
                        yield Promise.all([
                            user_model_1.default.updateOne({ cart: cart._id }, { cart: null }),
                            cart_model_1.default.findByIdAndDelete(cart._id),
                        ]);
                        // await UserModel.updateOne({ cart: cart._id }, { cart: null });
                        // await CartModel.findByIdAndDelete(cart._id);
                    }
                    else {
                        // nếu cart này mà có nhiều hơn 1 item thì xóa product khỏi các cart này ra
                        yield cart_model_1.default.updateMany({ "cartItems.$.product": productId }, { $pull: { cartItems: { product: productId } } });
                    }
                }));
            }
            return yield product_model_1.default.deleteOne({
                _id: productId,
            });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.forceDestroyProduct = forceDestroyProduct;
