/**
 * @interface IUserRepository
 * @description واجهة منفذ المستخدم (User Repository Port)
 * هذا هو العقد الذي يجب أن تلتزم به أي أداة تخزين (Database Adapter)
 */
export class IUserRepository {
  /**
   * حفظ المستخدم (سواء كان جديداً أو تحديثاً لبيانات قديمة)
   * @param {import('../../Domain/Entities/User.domain.js').UserDomain} userDomain - كيان المستخدم
   * @returns {Promise<void>}
   */
  async save() {
    throw new Error('Method save() not implemented.')
  }

  /**
   * البحث عن مستخدم بواسطة البريد الإلكتروني
   * @param {string} email - البريد الإلكتروني
   * @returns {Promise<import('../../Domain/Entities/User.domain.js').UserDomain | null>} المستخدم أو null
   */
  async findByEmail() {
    throw new Error('Method findByEmail() not implemented.')
  }

  /**
   * البحث عن مستخدم بواسطة المعرف
   * @param {string} userId - معرف المستخدم (UUID)
   * @returns {Promise<import('../../Domain/Entities/User.domain.js').UserDomain | null>} المستخدم أو null
   */
  async findById() {
    throw new Error('Method findById() not implemented.')
  }

  /**
   * التحقق من وجود مستخدم
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async exists() {
    throw new Error('Method exists() not implemented.')
  }
}
