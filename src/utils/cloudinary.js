import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";

dotenv.config()
// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    if ( !localFilePath) return null;
    try{
        const response = await cloudinary.uploader.upload(
            localFilePath, {
                resource_type: "auto"
            }
        )

        console.log(`File Uploaded on Clodinary. File Src: ${response.url}` );


        // Once the file is uploaded we would like to delete it from the servers

        fs.unlinkSync(localFilePath);

        return response;
    }catch(error){
        console.log(`Error on Clodinary: ${error}`);
        fs.unlinkSync(localFilePath);
        return null;
    }
}

const deleteFromCloudinary = async(publicId) => {
    try{
        cloudinary.uploader.destroy(publicId);
        console.log("Deleted from CLoudinary: PublicId", publicId);
    }catch(error){
        console.log("Error deleting from Cloudinary", error);
        return null;
    }
}
export {uploadOnCloudinary,deleteFromCloudinary};