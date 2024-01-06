import "./register.scss";
import { getMajor } from "../../service/helper.service";
import { useEffect } from "react";
export default function Register() {
  //useState
  //useEffect
  useEffect(() => {
    const get = async () => {
      const res = await getMajor();
      console.log(res);
    };
    get();
  }, []);
  return (
    <>
      <section className="auth">
        <h1></h1>
      </section>
    </>
  );
}
