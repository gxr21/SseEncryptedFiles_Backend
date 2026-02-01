import bcrypt from 'bcrypt'
export class PasswordVo {
  constructor(password) {
    if (!password) {
      throw new Error('Password is required')
    }
    const isAlreadyHashed = /^\$2[ayb]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(password)

    if (isAlreadyHashed) {
      this.value = password
      return
    }
    if (typeof password !== 'string') {
      throw new Error('Password must be a string')
    }
    if (password.trim().length < 8) {
      throw new Error('Password too weak, minimum 8 characters required')
    }
    this.value = bcrypt.hashSync(password.trim(), 10)
  }
  compare(plainPassword) {
    return bcrypt.compareSync(plainPassword, this.value)
  }
}
