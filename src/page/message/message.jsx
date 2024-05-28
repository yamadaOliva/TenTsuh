// Client example using socket.io-client

import Chat from "../../component/Message/Chat";
import Header from "../../component/Header/Header";
export default function Message() {
  return (
    <>
      {" "}
      <Header />
      <section>
        <Chat />
      </section>
    </>
  );
}
