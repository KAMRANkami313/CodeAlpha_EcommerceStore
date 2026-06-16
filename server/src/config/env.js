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
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "fallback_dev_refresh_secret_change_me",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "15m",
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || "7d",
  COOKIE_EXPIRE: parseInt(process.env.COOKIE_EXPIRE) || 7,
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  MAX_LOGIN_ATTEMPTS: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
  LOGIN_LOCKOUT_TIME: parseInt(process.env.LOGIN_LOCKOUT_TIME) || 15, // minutes
};

// ─── Validate Critical Environment Variables ────────────────────────────────
const requiredInProduction = [
  { key: 'JWT_SECRET', value: env.JWT_SECRET, mustNotBe: 'fallback_dev_secret_change_me_in_production' },
  { key: 'JWT_REFRESH_SECRET', value: env.JWT_REFRESH_SECRET, mustNotBe: 'fallback_dev_refresh_secret_change_me' },
  { key: 'MONGODB_URI', value: env.MONGODB_URI, mustNotBe: 'mongodb://localhost:27017/codealpha_ecommerce' },
  { key: 'NODE_ENV', value: env.NODE_ENV, mustBe: 'production' },
];

if (env.NODE_ENV === 'production') {
  const missing = [];
  for (const { key, value, mustNotBe, mustBe } of requiredInProduction) {
    if (mustBe && value !== mustBe) continue; // Skip mustBe checks that don't apply
    if (mustNotBe && value === mustNotBe) {
      missing.push(`${key} is using a default/fallback value`);
    }
    if (!value) {
      missing.push(`${key} is not set`);
    }
  }
  if (missing.length > 0) {
    console.error('❌ FATAL: Production environment validation failed:');
    missing.forEach(m => console.error(`   - ${m}`));
    console.error('   Set these in your .env file before deploying.');
    process.exit(1);
  }
  console.log('✅ Production environment variables validated');
}

// Warn in development if using fallback JWT secrets
if (env.NODE_ENV === 'development') {
  if (env.JWT_SECRET === 'fallback_dev_secret_change_me_in_production') {
    console.warn('⚠️  Using fallback JWT_SECRET. Set JWT_SECRET in .env for security.');
  }
}

export default env;