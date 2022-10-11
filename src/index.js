"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./logger"));
const connect_1 = __importDefault(require("./db/connect"));
const middlewares_1 = require("./middlewares");
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const port = config_1.default.get("port");
const host = config_1.default.get("host");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(middlewares_1.deserializeUser);
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "public")));
app.use(routes_1.default);
app.use(error_middleware_1.default);
app.listen(port, host, () => {
    logger_1.default.info(`Server listing at http://${host}:${port}`);
    (0, connect_1.default)();
});
