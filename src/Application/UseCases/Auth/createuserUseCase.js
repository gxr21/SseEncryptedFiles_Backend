// ==== Register / Signup =====
import { UserDomain } from '../../../Domain/Entities/User.domain.js'
import { JwtServices } from '../../../Infrastructure/Jwt/jwt.js'
// import {exists} from '../../../Infrastructure/DataBase/Repositories/User.repo.js'
export class CreateUserUseCase {
  constructor(userRepo) {
    this.userRepo = userRepo
    this.jwtServices = new JwtServices()
  }

  async generateUniqueUsername(name) {
    let baseName = name
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '')
    if (!baseName || baseName.length < 3) {
      baseName = 'user'
    }
    let isUnique = false
    let finalUsername = ''

    while (!isUnique) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000)
      finalUsername = `${baseName}${randomSuffix}`
      const userExists = await this.userRepo.existsByUsername(finalUsername)
      if (!userExists) {
        isUnique = true
      }
    }
    return finalUsername
  }

  async execute(InputData) {
    const { name, email, password } = InputData
    const isExist = await this.userRepo.exists(InputData.email)
    if (isExist) {
      throw new Error('User already exists')
    }

    const uniqueUsername = await this.generateUniqueUsername(name)
    const newUser = new UserDomain(name, uniqueUsername, email, password)
    const token = this.jwtServices.generateToken({
      userId: newUser.userId,
      role: newUser.email
    })
    await this.userRepo.save(newUser)

    return {
      userId: newUser.userId,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email.value,
      role: newUser.role,
      token: token,
      message: 'User registered successfully'
    }
  }
}
