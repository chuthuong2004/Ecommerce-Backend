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
exports.deleteCart = exports.updateQuantityCart = exports.removeItemFromCart = exports.addItemToCart = exports.updateCart = exports.createCart = exports.getCart = exports.getAllCart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const ApiFeatures_1 = __importDefault(require("../utils/ApiFeatures"));
const user_service_1 = require("./user.service");
function getAllCart(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const features = new ApiFeatures_1.default(cart_model_1.default.find()
                .populate({
                path: "user",
                select: "_id username email isAdmin ",
            })
                .populate({
                path: "cartItems",
                populate: { path: "product", select: "_id name price discount" }, // select: '_id name price discount'
            }), query)
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
exports.getAllCart = getAllCart;
function getCart(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield cart_model_1.default.findOne(filter)
                .populate({
                path: "user",
                select: "_id username email isAdmin",
            })
                .populate({
                path: "cartItems",
                populate: {
                    path: "product",
                    select: "_id name price discount colors brand",
                    populate: { path: "brand", select: "_id name" },
                },
            });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getCart = getCart;
function createCart(userId, cartItem) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newCart = new cart_model_1.default({
                user: userId,
                cartItems: [cartItem],
            });
            yield newCart.save(); // create new cart
            yield (0, user_service_1.updateUser)({ _id: userId }, { cart: newCart._id }); // add cart id cho user
            return yield getCart({ user: userId });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createCart = createCart;
function updateCart(filter, update, options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield cart_model_1.default.findOneAndUpdate(filter, update, options)
                .populate({
                path: "user",
                select: "_id username email isAdmin",
            })
                .populate({
                path: "cartItems",
                populate: {
                    path: "product",
                    select: "_id name price discount colors",
                },
            });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.updateCart = updateCart;
function addItemToCart(cartItem, userId) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const product = yield product_model_1.default.findById(cartItem.product);
            // get image product dựa vào màu của product
            const image = (_a = findColorOfProduct(product === null || product === void 0 ? void 0 : product.colors, cartItem.color)) === null || _a === void 0 ? void 0 : _a.images[0];
            cartItem = Object.assign(Object.assign({}, cartItem), { image: image ? image : "" });
            // tìm cart nào mà user này đã đăng nhập xem có tồn tại cart hay chưa
            const cart = yield getCart({ user: userId });
            if (!cart) {
                // nếu user chưa có cart thì thêm mới 1 cart cho user
                return yield createCart(userId, cartItem);
            }
            // nếu cart tồn tại thì update số lượng product trong cart
            return yield handleUpdateCart(cart, userId, cartItem);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.addItemToCart = addItemToCart;
function removeItemFromCart(userId, cartItemId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cart = yield getCart({ user: userId });
            if (!cart)
                return { statusCode: 404, message: "Cart not found" };
            const cartItem = findCartItemById(cart.cartItems, cartItemId);
            if (!cartItem) {
                return { statusCode: 404, message: "CartItem not found" };
            }
            // nếu cart chỉ có 1 item thì xóa luôn cart
            if (cart.cartItems.length == 1) {
                yield deleteCart(cart._id);
                return { statusCode: 200, message: "Đã xóa giỏ hàng thành công !" };
            }
            // nếu cart có nhiều item thì xóa item ra khỏi cart
            const filter = {
                user: userId,
                "cartItems._id": cartItem._id,
            };
            const update = {
                $pull: { cartItems: { _id: cartItem._id } },
            };
            return yield updateCart(filter, update, { new: true });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.removeItemFromCart = removeItemFromCart;
function updateQuantityCart(userId, quantityUpdate, cartItemId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cart = yield getCart({ user: userId });
            if (!cart) {
                return { statusCode: 404, message: "Không tìm thấy giỏ hàng của bạn !" };
            }
            const cartItem = findCartItemById(cart.cartItems, cartItemId);
            if (!cartItem) {
                return { statusCode: 404, message: "CartItem not found" };
            }
            const quantityStock = quantityProductStock(cartItem, {
                color: cartItem.color,
                size: cartItem.size,
                quantity: cartItem.quantity,
            });
            if (quantityStock && quantityUpdate > quantityStock) {
                return { statusCode: 400, message: "Số lượng sản phẩm không đủ !" };
            }
            const filter = {
                user: userId,
                "cartItems._id": cartItem._id,
            };
            let update;
            if (quantityUpdate == 0) {
                if (cart.cartItems.length == 1) {
                    yield deleteCart(cart._id);
                    return { statusCode: 200, message: "Đã xóa giỏ hàng thành công !" };
                }
                update = {
                    $pull: { cartItems: { _id: cartItem._id } },
                };
            }
            else {
                update = {
                    $set: {
                        "cartItems.$.quantity": quantityUpdate,
                    },
                };
            }
            return yield updateCart(filter, update, { new: true });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.updateQuantityCart = updateQuantityCart;
function deleteCart(cartId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield Promise.all([
                user_model_1.default.updateOne({ cart: cartId }, { cart: null }),
                cart_model_1.default.findByIdAndDelete(cartId),
            ]);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.deleteCart = deleteCart;
const findCartItemById = (cartItems, cartItemId) => {
    return cartItems.find((item) => String(item._id) === cartItemId);
};
const findColorOfProduct = (colors, colorInput) => {
    if (!colors || colors.length === 0)
        return undefined;
    return colors.find((color) => color.colorName.toLowerCase() === colorInput.toLowerCase());
};
const handleUpdateCart = (cart, userId, cartItemUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = cart.cartItems.find((item) => item.product._id == cartItemUpdate.product &&
            item.color == cartItemUpdate.color &&
            item.size == cartItemUpdate.size);
        let filter, update;
        if (item) {
            const quantityStock = quantityProductStock(item, cartItemUpdate);
            if (quantityStock &&
                item.quantity + cartItemUpdate.quantity > quantityStock) {
                return { statusCode: 400, message: "Số lượng sản phẩm không đủ !" };
            }
            filter = {
                user: userId,
                "cartItems._id": item._id,
            };
            update = {
                $set: {
                    "cartItems.$.product": item.product,
                    "cartItems.$.color": item.color,
                    "cartItems.$.size": item.size,
                    "cartItems.$.quantity": item.quantity + cartItemUpdate.quantity * 1,
                },
            };
        }
        else {
            filter = { user: userId };
            update = {
                $push: { cartItems: cartItemUpdate },
            };
        }
        return yield updateCart(filter, update, {
            new: true,
        });
    }
    catch (error) {
        throw error;
    }
});
const quantityProductStock = (cartItem, cartItemUpdate) => {
    var _a;
    const color = findColorOfProduct(cartItem.product.colors, cartItemUpdate.color);
    const quantityProductStock = (_a = color === null || color === void 0 ? void 0 : color.sizes.find((size) => size.size == cartItemUpdate.size)) === null || _a === void 0 ? void 0 : _a.quantity;
    return quantityProductStock;
};
