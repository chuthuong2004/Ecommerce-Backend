import { Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import { v4 } from "uuid";
import log from "./logger";

const EVENTS = {
  connection: "connection",
  handshake: "handshake",
};
function socket({ io }: { io: Server }) {
  log.info(`Sockets enabled`);
  io.on(EVENTS.connection, (socket: Socket) => {
    log.info(`User connected ${socket.id}`);
    // socket.on(EVENTS.handshake, (uid: string, users: string[]) => {
    //   console.log(uid);
    // });
  });
}
export default socket;

// export class ServerSocket {
//   public static instance: ServerSocket;
//   public io: Server;
//   //  ['adsdfdsfsd']
//   public users: { [uid: string]: string };
//   constructor(server: HTTPServer) {
//     ServerSocket.instance = this;
//     this.users = {};
//     this.io = new Server(server, {
//       serveClient: false,
//       pingInterval: 10000,
//       pingTimeout: 5000,
//       cookie: false,
//       cors: {
//         origin: "http://localhost:3000",
//       },
//     });
//     this.io.on("connect", this.StartListeners);
//     console.log("Socket IO started");
//   }

//   StartListeners = (socket: Socket) => {
//     console.log("Message received from " + socket.id);
//     socket.on(
//       "handshake",
//       (callback: (uid: string, users: string[]) => void) => {
//         console.log("Handshake received from " + socket.id);
//         const reconnected = Object.values(this.users).includes(socket.id);
//         if (reconnected) {
//           console.log("This user has reconnected");
//           const uid = this.GetUidFromSocketId(socket.id);
//           const users = Object.values(this.users);
//           if (uid) {
//             console.log("Sending callback for reconnect...");
//             callback(uid, users);
//             return;
//           }
//         }
//         // Generate new user
//         const uid = v4();
//         this.users[uid] = socket.id;
//         const users = Object.values(this.users);
//         console.log("Sending callback for handshake...");
//         callback(uid, users);

//         this.SendMessage(
//           "user_connected",
//           users.filter((id) => id !== socket.id)
//         ),
//           users;
//       }
//     );
//     socket.on("disconnect", () => {
//       console.log("Disconnect received from " + socket.id);
//       const uid = this.GetUidFromSocketId(socket.id);
//       if (uid) {
//         delete this.users[uid];
//         const users = Object.values(this.users);
//         this.SendMessage("user_disconnected", users, uid);
//       }
//     });
//   };
//   GetUidFromSocketId = (id: string) =>
//     Object.keys(this.users).find((uid) => this.users[uid] === id);

//   /**
//    *
//    * @param name The name of the event, ex: handshake
//    * @param users List of socket id's
//    * @param payload any information needed by the user for state updates
//    */
//   SendMessage = (name: string, users: string[], payload?: Object) => {
//     console.log("Emmitting event: " + name);
//     users.forEach((id) =>
//       payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name)
//     );
//   };
// }
