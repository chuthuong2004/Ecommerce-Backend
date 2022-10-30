import express from "express";
import log from "./logger";
import connect from "./db/connect";
import { deserializeUser } from "./middlewares";
import routes from "./routes";
import path from "path";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";
import config from "./config/default";
const port = config.port as number;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(deserializeUser);
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(routes);
app.use(errorMiddleware);
app.listen(port, () => {
  log.info(`Server listing at port:${port}`);
  connect();
});
