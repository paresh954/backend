import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "portfolio-projects",
    allowedFormats: ["jpg", "jpeg", "png", "gif"],
  },
});
const upload = multer({ storage });

export default upload;
