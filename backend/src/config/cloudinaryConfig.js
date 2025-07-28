import { v2 as cloudinary} from "cloudinary";
import "dotenv/config";

//Configura o Cloudinary com as credenciais
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // HTTPS 
});

export default cloudinary;