import express from "express";
import morgan from "morgan";
import log from "./logger";
import connect from "./db/connect";
import { deserializeUser } from "./middlewares";
import routes from "./routes";
import path from "path";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware";
import config from "./config/default";
import { createServer } from "http";
import { Server } from "socket.io";
import socket from "./socket";
import swaggerDocs from "./utils/swagger";
const port = config.port as number;

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigin,
    credentials: true,
  },
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(deserializeUser);
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/check", (req, res) => {
  return res.json("123hjgsfsjdg fsdjkf sdgfjk");
});
app.use(routes);
app.use(errorMiddleware);
httpServer.listen(port, () => {
  log.info(`Server listing at port:${port}`);
  connect();
  socket({ io });
  // new ServerSocket(httpServer);
  swaggerDocs(app, port);
});
