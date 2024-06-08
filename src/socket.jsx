import { io } from "socket.io-client";

const URL = "http://192.168.1.14:8001";

export const socket = io(URL);
