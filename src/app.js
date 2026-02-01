// ==================================
// ==== ENCRYPTED FILES BACKEND =====
// ==================================
/* eslint-disable prettier/prettier */
import express from 'express'
import cors from 'cors'
import { PORT } from '../config/env.js'
import { NODE_ENV } from '../config/env.js'
import connDb from './Infrastructure/DataBase/connMongoDB.js'
import AuthRouter from './Presentation/routes/auth.route.js'
import FileRouter from './Presentation/routes/file.route.js'
// import FolderRouter from './Presentation/routes/folder.route.js'
const app = express()
// Cors FrontEnd Development
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
]
if (NODE_ENV === 'development') {
  app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // للسماح بالكوكيز والتوكن
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
}
// Middlewares
app.use(express.json())
// ==== RESTFUL API ====
// Auth Router
app.use('/api/v1/auth', AuthRouter)
app.use('/api/v1/files', FileRouter)
// Folder Router يتم تفعيلها لاحقا 
// app.use('/api/v1/folders', FolderRouter)

// ==== Server ====
app.listen(PORT, async () => {
  console.log("============ Server API Server ============")
  console.log(`Server API Server running on http://localhost:${PORT}`)
  connDb()  
})
