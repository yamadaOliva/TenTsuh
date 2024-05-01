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
        multiple: false,
        sources: ["local", "url", "camera"],
        maxFileSize: 5000000,
      },
      function (error, result) {
        if (!error && result && result.event === "success") {
          const fileExtension = result.info.format;
          if (fileExtension !== "png" && fileExtension !== "jpg") {
            
            return;
          }
          console.log(result.info.secure_url);
          if (result.info?.secure_url?.startsWith("http")) {
            setCurrentImage(result.info.secure_url);
          }
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
