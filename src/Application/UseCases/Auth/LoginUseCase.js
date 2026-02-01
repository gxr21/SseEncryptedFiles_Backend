// ==== Login / Signin =====

export class LoginUseCase {
  constructor(userRepo, jwtServices) {
    this.userRepo = userRepo
    this.jwtServices = jwtServices
  }
  async execute(InputData) {
    const { email, password } = InputData
    const user = await this.userRepo.findByEmail(email)

    if (!user) {
      throw new Error('User not found')
    }
    const isPasswordValid = await user.password.compare(password)
    if (!isPasswordValid) {
      throw new Error('Invalid password')
    }
    const token = this.jwtServices.generateToken({
      userId: user.userId,
      role: user.role
    })
    return {
      userId: user.userId,
      name: user.name,
      email: user.email.value,
      role: user.role,
      token,
      message: 'Login successful'
    }
  }
}
