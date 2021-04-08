import { io } from "socket.io-client";

const socketClient = io("https://api.casadecarnesisrael.com.br");

export default socketClient;