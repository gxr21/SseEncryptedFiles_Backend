import { randomUUID } from 'crypto'
import { EmailVo } from '../valueObjects/emailvo.js'
import { PasswordVo } from '../valueObjects/passwordvo.js'
import { UserRules } from '../Rules/userRules.js'
export class UserDomain {
  constructor(
    name,
    username,
    email,
    password,
    role = 'user',
    verified = false,
    id,
    createdAt,
    updatedAt
  ) {
    // if (!name) {
    //   throw new Error('Name is required')
    // }
    // Proccess first for check name
    UserRules.validateName(name)

    this.userId = id || randomUUID()
    this.name = name
    this.username = username
    this.email = new EmailVo(email)
    this.password = new PasswordVo(password)
    this.role = role
    this.verified = verified
    this.createdAt = createdAt || new Date()
    this.updatedAt = updatedAt || new Date()
  }

  markVerify() {
    UserRules.ensureNotVerified(this.verified)

    this.verified = false
    this.updatedAt = new Date()
  }

  changeName(newname) {
    UserRules.validateName(newname)
    this.name = newname
    this.updatedAt = new Date()
  }
  changePassword(newpassword) {
    this.password = new PasswordVo(newpassword)
    this.updatedAt = new Date()
  }
}
