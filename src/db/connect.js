"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("../logger"));
function connect() {
    const dbUri = config_1.default.get("dbUri");
    return mongoose_1.default.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
        logger_1.default.info("Database connected");
    }).catch((error) => {
        logger_1.default.error("db error", error);
        process.exit(1);
    });
}
exports.default = connect;
