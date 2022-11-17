import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import { v4 } from "uuid";
import log from "./logger";
import { IMessageResponse } from "./models/message.model";
import { IUserResponse } from "./models/user.model";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    ADD_USER: "add_user",
    SEND_MESSAGE: "send_message",
    KEY_DOWN: "key_down",
  },
  SERVER: {
    GET_USERS: "get_users",
    GET_MESSAGE: "get_message",
    LOADING: "loading",
  },
};
interface IUserSocket {
  userId: string;
  socketId: string;
}
let users: IUserSocket[] = [];
const addUser = (userId: string, socketId: string) => {
  users.forEach((user) => {
    if (user.userId === userId) {
      user.socketId = socketId;
    }
  });
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const removeUser = (socketId: string) => {
  users = users.filter((user: IUserSocket) => user.socketId !== socketId);
};

const getUser = (userId: string) => {
  return users.find((user: IUserSocket) => user.userId === userId);
};
function socket({ io }: { io: Server }) {
  log.info(`Sockets enabled`);
  io.on(EVENTS.connection, (socket: Socket) => {
    log.info(`User connected ${socket.id}`);
    socket.on(EVENTS.CLIENT.ADD_USER, (userId: string) => {
      addUser(userId, socket.id);
      io.emit(EVENTS.SERVER.GET_USERS, users);
      console.log("add", users);
    });
    // server received message
    socket.on(
      EVENTS.CLIENT.SEND_MESSAGE,
      ({
        message,
        receiverId,
      }: {
        message: IMessageResponse;
        receiverId: string;
      }) => {
        console.log({ message, receiverId });
        const socketIdReceiver: string = getUser(receiverId)?.socketId || "";
        const socketIdSender: string =
          getUser(message.sender._id)?.socketId || "";
        console.log("socketIdReceiver: ", socketIdReceiver);

        io.to([socketIdReceiver, socketIdSender]).emit(
          EVENTS.SERVER.GET_MESSAGE,
          {
            message,
            receiverId,
          }
        );
      }
    );
    // server received event keydown
    socket.on(
      EVENTS.CLIENT.KEY_DOWN,
      (data: {
        isKeyPressedDown: boolean;
        senderId: string;
        receiverId: string;
        conversationId: string;
      }) => {
        console.log(data);
        const userReceived = getUser(data.receiverId);
        if (userReceived) {
          io.to(userReceived.socketId).emit(EVENTS.SERVER.LOADING, data);
        }
      }
    );
  });
}
export default socket;
