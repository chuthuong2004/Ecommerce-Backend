"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteOrder = exports.cancelOrder = exports.updateOrder = exports.updateStatusOrder = exports.getOrder = exports.getAllOrder = exports.createOrder = void 0;
const order_model_1 = __importStar(require("../models/order.model"));
const cart_service_1 = require("./cart.service");
const user_service_1 = require("./user.service");
const ApiFeatures_1 = __importDefault(require("../utils/ApiFeatures"));
const mailer_1 = __importDefault(require("../utils/mailer"));
const product_service_1 = require("./product.service");
const product_controller_1 = require("../controllers/product.controller");
function createOrder(input, listCartItemId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deliveryInformation = input.deliveryInformation;
            const isPaid = input.isPaid;
            let shippingPrice = input.shippingPrice;
            const cart = yield (0, cart_service_1.getCart)({ user: userId });
            if (!cart) {
                return { statusCode: 404, message: "Không tìm thấy giỏ hàng !" };
            }
            // lọc ra những cartItem được order
            const cartItems = cart.cartItems.filter((cartItem) => listCartItemId.includes(String(cartItem._id)));
            if (cartItems.length == 0) {
                return { statusCode: 404, message: "Không tìm thấy cartItems !" };
            }
            let provisionalPrice = 0;
            const orderItems = cartItems.map((cartItem) => {
                provisionalPrice +=
                    (cartItem.product.price -
                        cartItem.product.price * (cartItem.product.discount / 100)) *
                        cartItem.quantity;
                return {
                    product: cartItem.product._id,
                    name: cartItem.product.name,
                    price: cartItem.product.price,
                    discount: cartItem.product.discount,
                    quantity: cartItem.quantity,
                    size: cartItem.size,
                    color: cartItem.color,
                    image: cartItem.image,
                    brandName: cartItem.product.brand.name,
                };
            });
            // !  handle remove item cart here --- khi có 2 item thì không xóa cart
            listCartItemId.forEach((itemId) => __awaiter(this, void 0, void 0, function* () {
                yield (0, cart_service_1.removeItemFromCart)(userId, itemId);
            }));
            const cartRemoved = yield (0, cart_service_1.getCart)({ user: userId });
            if ((cartRemoved === null || cartRemoved === void 0 ? void 0 : cartRemoved.cartItems.length) === 0) {
                yield (0, cart_service_1.deleteCart)(cartRemoved._id);
            }
            if (!shippingPrice) {
                if (deliveryInformation.province.includes("Thành phố Hồ Chí Minh")) {
                    if (deliveryInformation.ward.includes("Phường Hiệp Bình Phước"))
                        shippingPrice = 0;
                    else {
                        shippingPrice = 10000;
                    }
                }
                else {
                    shippingPrice = 30000;
                }
            }
            const newOrder = new order_model_1.default({
                deliveryInformation,
                orderItems,
                user: userId,
                shippingPrice,
                provisionalPrice,
                totalPrice: shippingPrice + provisionalPrice,
            });
            if (isPaid) {
                newOrder.isPaid = true;
                newOrder.paidAt = new Date();
                newOrder.shippingPrice = 0;
                newOrder.totalPrice = provisionalPrice;
            }
            yield newOrder.save();
            // handle update quantity product of color
            // * handle here --- DONE
            // cập nhật lại số lượng sản phẩm đã đặt (số lượng sp hiện tại trừ cho sl sp được đặt)
            updateQuantityProductOfColor(newOrder.orderItems, product_controller_1.ActionFavorite.REMOVE);
            yield (0, user_service_1.updateUser)({ _id: userId }, { $push: { orders: newOrder._id } });
            return newOrder;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createOrder = createOrder;
function getAllOrder(filter, query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const features = new ApiFeatures_1.default(order_model_1.default.find(filter).populate({
                path: "user",
                select: "_id email username isAdmin",
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
exports.getAllOrder = getAllOrder;
function getOrder(filter) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield order_model_1.default.findOne(filter).populate({
                path: "user",
                select: "_id email username isAdmin",
            });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getOrder = getOrder;
function updateStatusOrder(orderId, orderStatus) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order = yield getOrder({ _id: orderId });
            if (!order)
                return {
                    statusCode: 404,
                    message: "Không tìm thấy đơn đặt hàng với ID trên !",
                };
            if (order.orderStatus === order_model_1.EOrderStatus.Delivered) {
                return {
                    statusCode: 400,
                    message: "Đơn hàng này đã được giao !",
                };
            }
            const isValidStatus = checkValidOrderStatus(order, orderStatus);
            if (!isValidStatus) {
                return {
                    statusCode: 400,
                    message: "Trạng thái cập nhật đơn hàng không hợp lệ !",
                };
            }
            let options = {
                email: order.user.email,
                subject: "",
                message: "",
            };
            if (orderStatus === order_model_1.EOrderStatus.Shipping) {
                order.shippingAt = new Date();
                options.subject = "Đơn hàng tại ChuthuongOnline đang được vận chuyển";
                options.message = "Đơn hàng của bạn đang được vận chuyển ";
            }
            if (orderStatus === order_model_1.EOrderStatus.Delivery) {
                order.deliveryAt = new Date();
                options.subject = "Đơn hàng tại ChuthuongOnline đang giao đến bạn";
                options.message = "Đơn hàng của bạn đang giao đến bạn";
            }
            if (orderStatus == order_model_1.EOrderStatus.Delivered) {
                // * handle update quantitySold product --- DONE
                updateQuantitySoldProduct(order.orderItems);
                order.deliveredAt = new Date();
                order.paidAt = new Date();
                order.isPaid = true;
                options.subject = "Đơn hàng tại ChuthuongOnline đã được giao thành công";
                options.message = "Đơn hàng của bạn đã giao thành công ";
            }
            order.orderStatus = orderStatus;
            const [newOrder] = yield Promise.all([
                order.save({ validateBeforeSave: false }),
                (0, mailer_1.default)(options),
            ]);
            return newOrder;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.updateStatusOrder = updateStatusOrder;
const checkValidOrderStatus = (order, orderStatus) => {
    return ((order.orderStatus === order_model_1.EOrderStatus.Processing &&
        orderStatus === order_model_1.EOrderStatus.Shipping) ||
        (order.orderStatus === order_model_1.EOrderStatus.Shipping &&
            orderStatus === order_model_1.EOrderStatus.Delivery) ||
        (order.orderStatus === order_model_1.EOrderStatus.Delivery &&
            orderStatus === order_model_1.EOrderStatus.Delivered));
};
const updateQuantitySoldProduct = (orderItems) => {
    try {
        orderItems.forEach((orderItem) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield (0, product_service_1.getProduct)(orderItem.product);
            if (product) {
                product.quantitySold = product.quantitySold + orderItem.quantity;
                yield product.save();
            }
        }));
    }
    catch (error) {
        throw error;
    }
};
const updateQuantityProductOfColor = (orderItems, action) => {
    orderItems.forEach((orderItem) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield (0, product_service_1.getProduct)(orderItem.product);
        product === null || product === void 0 ? void 0 : product.colors.forEach((color) => {
            if (color.colorName === orderItem.color) {
                color.sizes.forEach((size) => {
                    if (String(size.size).toLowerCase() ===
                        String(orderItem.size).toLowerCase()) {
                        if (action === product_controller_1.ActionFavorite.ADD)
                            size.quantity += orderItem.quantity;
                        if (action === product_controller_1.ActionFavorite.REMOVE)
                            size.quantity -= orderItem.quantity;
                    }
                });
            }
        });
        yield (product === null || product === void 0 ? void 0 : product.save());
    }));
};
function updateOrder(filter, update, option) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield order_model_1.default.findOneAndUpdate(filter, update, option);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.updateOrder = updateOrder;
function cancelOrder(orderId, userId, canceledReason) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order = yield getOrder({ _id: orderId, user: userId });
            if (!order) {
                return {
                    statusCode: 404,
                    message: "Không tìm thấy đơn đặt hàng !",
                };
            }
            if (order.orderStatus !== order_model_1.EOrderStatus.Processing) {
                return {
                    statusCode: 400,
                    message: "Không thể hủy đơn đặt hàng, đơn hàng của bạn đã được xử lý !",
                };
            }
            let options = {
                email: order.user.email,
                message: "",
                subject: "",
            };
            order.orderStatus = order_model_1.EOrderStatus.Canceled;
            order.canceledReason = canceledReason;
            order.canceledAt = new Date();
            options.subject = "Đơn hàng tại ChuthuongOnline đã được hủy thành công !";
            options.message = "Hủy đơn hàng thành công !";
            // cộng lại sl sản phẩm mua vào sl của sp
            updateQuantityProductOfColor(order.orderItems, product_controller_1.ActionFavorite.ADD);
            yield Promise.all([
                (0, mailer_1.default)(options),
                order.save({ validateBeforeSave: false }),
            ]);
            return { statusCode: 200, message: "Đã hủy đơn hàng thành công !" };
        }
        catch (error) {
            throw error;
        }
    });
}
exports.cancelOrder = cancelOrder;
function deleteOrder(orderId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const order = yield getOrder({ _id: orderId });
            if (!order)
                return {
                    statusCode: 404,
                    message: "Không tìm thấy đơn đặt hàng với ID được chỉ định !",
                };
            yield Promise.all([
                (0, user_service_1.updateUser)({ _id: userId }, { $pull: { orders: orderId } }),
                order.remove(),
            ]);
            return {
                statusCode: 200,
                message: "Đã xóa đơn hàng thành công !",
            };
        }
        catch (error) {
            throw error;
        }
    });
}
exports.deleteOrder = deleteOrder;
