/* eslint-disable prettier/prettier */
// ==== Auth Controller =====
// ENCAPSOULATION HEADER 
import { CreateUserUseCase } from '../../Application/UseCases/Auth/CreateUserUseCase.js'
import { UserRepo } from '../../Infrastructure/DataBase/Repositories/User.repo.js'
import { LoginUseCase } from '../../Application/UseCases/Auth/LoginUseCase.js'
import { JwtServices } from '../../Infrastructure/Jwt/jwt.js'
export class AuthController {
  constructor() {
    // Dependency Injection
    // 1. تهيئة الاعتماديات مرة واحدة عند بدء التشغيل
    this.userRepo = new UserRepo()
    this.jwtServices = new JwtServices()
    this.createUserUseCase = new CreateUserUseCase(this.userRepo, this.jwtServices)
    this.loginUseCase = new LoginUseCase(this.userRepo, this.jwtServices)
  }

  // 2. حولناها إلى Arrow Function لحل مشكلة 'this'
  // الآن يمكنك استخدامها في الراوتر مباشرة بدون .bind()
  register = async (req, res) => {
    try {
      const { name, email, password } = req.body

      const result = await this.createUserUseCase.execute({ name, email, password })

      res.status(201).json(result)
    } catch (error) {
      // 400 Bad Request
      res.status(400).json({ error: error.message })
    }
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body

      const result = await this.loginUseCase.execute({ email, password })

      res.status(200).json(result)
    } catch (error) {
      res.status(401).json({ error: error.message })
    }
  }
  getMe = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(404).json({ error: "لم يتم العثور على المستخدم" });
      }

      res.status(200).json(req.user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
