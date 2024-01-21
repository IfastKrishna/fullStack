import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_COLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("Upload successful on cloudinary :: " + response);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the localy Saveed file  temporary file as the upload opretions got faild
    return null;
  }
};

export { uploadOnCloudinary };
