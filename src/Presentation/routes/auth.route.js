// ====== RESTFUL API ======
import express from 'express'
import { AuthController } from '../controllers/auth.controller.js'
// import { arcjetMiddleware } from '../../../config/arcjet.js'
import { SecurityMiddleware } from '../middlewares/Arcjet.middleware.js'
import { authSecurity } from '../middlewares/auth.middleware.js'
const AuthRouter = express.Router()
const authController = new AuthController()
AuthRouter.post('/register', SecurityMiddleware, authController.register)
AuthRouter.post('/login', SecurityMiddleware, authController.login)
AuthRouter.get('/me', SecurityMiddleware, authSecurity, authController.getMe)

export default AuthRouter
