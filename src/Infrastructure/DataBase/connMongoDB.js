/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'
import { DB_URL, NODE_ENV } from '../../../config/env.js'

if (!DB_URL) {
  console.error('❌ خطأ: متغير DB_URL غير موجود في ملف البيئة!')
  process.exit(1)
}

const connDb = async () => {
  try {
    await mongoose.connect(DB_URL)
    console.log('============ MONGODB CONNECTED ============')
    console.log(`Connect To Database ${NODE_ENV} mode`)
    console.log('==========================================')
  } catch (error) {
    console.error('❌ فشل الاتصال بقاعدة البيانات:', error.message)
    process.exit(1)
  }
}

export default connDb
