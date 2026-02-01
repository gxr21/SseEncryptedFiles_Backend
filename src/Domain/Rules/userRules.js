export class UserRules {
  static validateName(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Name is required')
    }
    const trimmedName = name.trim()
    if (trimmedName.length < 3 || trimmedName.length > 50) {
      throw new Error('Name must be between 3 and 50 characters')
    }
    const RegexEnglishContext = /^[a-zA-Z\s-.']+$/
    if (!RegexEnglishContext.test(trimmedName)) {
      throw new Error('Name must be in English only')
    }
  }
  static ensureNotVerified(isVerified) {
    if (isVerified === true) {
      throw new Error('User is already verified')
    }
  }
}
