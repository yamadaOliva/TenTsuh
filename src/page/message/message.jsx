import { useEffect } from "react";
import "./message.scss";
// Client example using socket.io-client
import { io } from "socket.io-client";
import Chat from "../../component/Message/Chat";
export default function Message() {
  useEffect(() => {
    const socket = io("http://192.168.1.14:8001");
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });
    socket.on("disconnect", () => {
      console.log(socket.id); // undefined
    });
    socket.on("sendMessage", (data) => {
      console.log(data);
    });
  }, []);
  return (
    <>
      <section>
        <Chat />
      </section>
    </>
  );
}
