import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import { v4 } from "uuid";
import log from "./logger";
import { IMessageResponse } from "./models/message.model";
import { IUserResponse } from "./models/user.model";
import { updateUser } from "./services/user.service";

const EVENTS = {
  connection: "connection",
  disconnect: "disconnect",
  CLIENT: {
    ADD_USER: "add_user",
    SEND_MESSAGE: "send_message",
    KEY_DOWN: "key_down",
    LOGOUT: "logout",
  },
  SERVER: {
    GET_USERS: "get_users",
    GET_MESSAGE: "get_message",
    LOADING: "loading",
    DISCONNECTED: "disconnected",
  },
};
interface IUserSocket {
  userId: string;
  socketId: string;
}
let users: IUserSocket[] = [];
const addUser = (userId: string, socketId: string) => {
  // users.forEach((user) => {
  //   if (user.userId === userId) {
  //     user.socketId = socketId;
  //   }
  // });
  !users.some((user) => user.userId === userId && user.socketId === socketId) &&
    users.push({ userId, socketId });
};
const removeUser = (socketId: string) => {
  users = users.filter((user: IUserSocket) => user.socketId !== socketId);
};

const getUsers = (userId: string) => {
  return users.filter((user: IUserSocket) => user.userId !== userId);
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
        const receiveUsers = getUsers(receiverId);
        const senders = getUsers(message.sender._id);
        const socketIdReceivers = receiveUsers.map(
          (socketUser) => socketUser.socketId
        );
        const socketIdsSenders = senders.map(
          (socketUser) => socketUser.socketId
        );
        io.to([...socketIdReceivers, ...socketIdsSenders]).emit(
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

        const socketIdReceivers = getUsers(data.senderId).map(
          (socketUser) => socketUser.socketId
        );
        // ! console.log();

        if (socketIdReceivers.length > 0) {
          io.to([...socketIdReceivers]).emit(EVENTS.SERVER.LOADING, data);
        }
      }
    );

    // on log out
    socket.on(EVENTS.CLIENT.LOGOUT, ({ userId: string }) => {});
    socket.on(EVENTS.disconnect, (socket) => {
      console.log("disconnect: ", socket);
      console.log(socket);
      console.log("users: ", users);
      io.emit(EVENTS.SERVER.DISCONNECTED);
    });
  });
}
export default socket;
