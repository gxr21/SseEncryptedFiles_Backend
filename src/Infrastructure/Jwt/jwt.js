/* eslint-disable prettier/prettier */
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../../config/env.js'

export class JwtServices {
  constructor() {
    this.secret = JWT_SECRET || 'fallback_secret_dev_only'
  }
  
  generateToken(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: '36500d' })
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.secret)
      return decoded
    } catch {
      throw new Error('Invalid token')
    }
  }
}
console.log("=========== 🔐 JWT Services =============")
console.log("🔑 Secret:", JWT_SECRET ? 'Loaded ✅' : 'Missing ❌', JWT_SECRET)

