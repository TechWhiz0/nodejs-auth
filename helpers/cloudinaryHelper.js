const cloudinary=require("../config/cloudinary")


const uploadToCloudinary = async (filepath) => {
    try {
        const result = await cloudinary.uploader.upload(filepath);
        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (e) {
        console.log('Error while uploading to Cloudinary:', e);
        console.error(e.stack); // Log the error stack for more details
        throw new Error("Error while uploading to Cloudinary");
    }
}

module.exports={
    uploadToCloudinary
}