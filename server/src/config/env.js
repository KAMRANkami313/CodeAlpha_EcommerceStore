import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root directory (where server.js lives)
dotenv.config({ path: path.join(__dirname, "../../.env") });

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/codealpha_ecommerce",
  JWT_SECRET: process.env.JWT_SECRET || "fallback_dev_secret_change_me_in_production",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
  COOKIE_EXPIRE: parseInt(process.env.COOKIE_EXPIRE) || 7,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};

export default env;