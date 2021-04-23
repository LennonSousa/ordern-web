import { io } from "socket.io-client";

const socketClient = io("http://localhost:3333/");

export default socketClient;