import { io } from "socket.io-client";

const URL = "https://basenestjs-restful-production.up.railway.app";

export const socket = io(URL);
