import {v2 as cloudinary} from 'cloudinary';
import exp from 'constants';
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: 'dhayfimny', 
  api_key: '417331397855831', 
  api_secret: 'NkVESwTo0bc3Jmur_6wfBPFoVGs' 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        //upload file on cloudinary
        const response = cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        //file uploaded
        console.log("File uploaded on cloudinary!", response.url);
        return response;

    } catch (error) {
        fs.unlink(localFilePath);
        return null;
    }
}

export {uploadOnCloudinary};