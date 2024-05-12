/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "./Upload.scss";
export default function Upload(props) {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  // eslint-disable-next-line react/prop-types
  const [currentImage, setCurrentImage] = useState(props?.backgroundImage);
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
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
            toast.error("anh phải có định dạng jpg hoặc png");
            return;
          } 
          console.log(result.info.secure_url);
          if (result.info?.secure_url?.startsWith("http")) {
            setCurrentImage(result.info.secure_url);
            if(props.setSomethingChange){
              props.setSomethingChange(true);
            }
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
