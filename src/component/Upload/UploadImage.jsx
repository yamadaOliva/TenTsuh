/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import "./Upload.scss";
export default function Upload(props) {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  // eslint-disable-next-line react/prop-types
  const [currentImage, setCurrentImage] = useState(props?.backgroundImage);
  useEffect(() => {
    console.log(props?.backgroundImage);
    cloudinaryRef.current = window.cloudinary;
    console.log("cloud:", cloudinaryRef.current);
    widgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: "subarasuy",
        uploadPreset: "o4umo4il",
      },
      function (error, result) {
        console.log(result.info.secure_url);
        console.log(result?.info?.secure_url?.startsWith("http"));
        if (result.info?.secure_url?.startsWith("http")) {
          setCurrentImage(result.info.secure_url);
        }
      }
    );
    console.log(cloudinaryRef.current);
  }, []);
  useEffect(() => {
    props.setAvatarUrl(currentImage);
  }, [currentImage]);
  return (
    <button
      onClick={() => {
        widgetRef.current?.open();
      }}
      className="upload-button"
    >
      <img src={props.backgroundImage}></img>
    </button>
  );
}
