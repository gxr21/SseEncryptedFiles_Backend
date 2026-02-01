export class EmailVo {
  constructor(email) {
    if (!email || !this.isValidEmail(email)) {
      throw new Error('Invalid email format')
    }
    this.value = email.toLowerCase()
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
