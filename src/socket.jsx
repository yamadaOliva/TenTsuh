import { io } from "socket.io-client";

const URL = "http://192.168.2.36:8001";

export const socket = io(URL);
