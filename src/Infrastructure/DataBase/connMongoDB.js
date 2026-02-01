/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'
import { DB_URL, NODE_ENV } from '../../../config/env.js'

if (!DB_URL) {
  console.log('connection failed !')
}

const connDb = async () => {
  try {
    await mongoose.connect(DB_URL)
    console.log("============ MONGODB CONNECTED ============")
    console.log(`Connect To Database ${NODE_ENV} mode`)
    console.log('==========================================')
  } catch {
    console.log('connection failed !')
  }
}

export default connDb
