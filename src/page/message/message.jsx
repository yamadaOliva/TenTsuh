import { useEffect } from "react";
import "./message.scss";
// Client example using socket.io-client
import { io } from "socket.io-client";
import Chat from "../../component/Message/Chat";
import { useState } from "react";
import { getMe } from "../../service/user.service";
import { useSelector } from "react-redux";


export default function Message() {
  const accessToken = useSelector((state) => state.user.accessToken);
  const [user, setUser] = useState(null);
  const partnerId = ['48c227ed-b10c-4558-aa22-0c46cd8f4bfb','8d1820b6-0250-43be-a5b7-389a451e512f']
  const [socket, setSocket] = useState(null);
  const sendMessage = (text) => {
    const partner = partnerId.find((id) => id !== user.id);
    console.log("hehe",user.id);
    socket.emit("message", {
      message : text,
     userID: partner,
     sourceID: user.id, 
    });
  };

  useEffect(() => {
    const fetchMe = async () => {
      const res = await getMe(accessToken);
      if (res?.EC === 200) {
        setUser(res.data);
      }
      const socket = io("http://192.168.1.14:8001");
    setSocket(socket);
    const room = `user_${res.data.id}`
    socket.emit("join",  room)
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    });
    socket.on("disconnect", () => {
      console.log(socket.id); // undefined
    });
    socket.on("sendMessage", (data) => {
      console.log(data);
    });
    socket.on("message", (data) => {
      console.log(data);
    }
    );
    };
    fetchMe();
    
  }, []);
  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <>
      <section>
        <Chat />
        <button
          onClick={() => {
            sendMessage(`Hello from ${user?.name}`);
          }}
        >
          Test
        </button>
      </section>
    </>
  );
}
