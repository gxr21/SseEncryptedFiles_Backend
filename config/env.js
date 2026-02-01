import { config } from 'dotenv'

// تحميل ملف البيئة المناسب حسب NODE_ENV
config({
  path: `.env.${process.env.NODE_ENV || 'development'}.local`
})

// استخراج المتغيرات من البيئة مع قيم افتراضية آمنة
export const {
  PORT,
  NODE_ENV,
  DB_URL,
  JWT_SECRET,
  JWT_EXPIRE,
  ARCJET_KEY,
  ARCJET_ENV, //
  S3_REGION,
  S3_BUCKET,
  S3_ENDPOINT,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY
} = process.env
