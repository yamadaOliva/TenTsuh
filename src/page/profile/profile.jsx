import Upload from "../../component/Upload/UploadImage";
import { useState } from "react";
export default function Profile() {
  const [image, setImage] = useState(
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
  );
  return (
    <>
      <Upload backgroundImage={image} setAvatarUrl={setImage} ></Upload>
    </>
  );
}
