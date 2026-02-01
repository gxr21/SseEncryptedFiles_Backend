/* eslint-disable prettier/prettier */
/**
 * FileRepository Port
 * @interface
 * @description
 * يحدد كيفية تعامل النظام مع ملفات المستخدم
 */
export class IFileRepository {
 /**
  * @returns {import('../../Domain/Entities/Files.domain.js').FilesDomain}
  * @description حفظ ملف جديد 
  * @param {import('../../Domain/Entities/Files.domain.js').FilesDomain} fileDomain
  */
  async save(_fileDomain) {
    throw new Error('save() not implemented')
  }

  /**
   * @description جلب ملف حسب المعرف
   * @param {string} fileId
   * @returns {import('../../Domain/Entities/Files.domain.js').FilesDomain}
   */
  async findById(_fileId) {
    throw new Error('findById() not implemented')
  }

  /**
   * @description جلب جميع ملفات مستخدم معين
   * @param {string} userId
   * @returns {import('../../Domain/Entities/Files.domain.js').FilesDomain[]}
   */
  async findByUserId(_userId) {
    throw new Error('findByUserId() not implemented')
  }

  /**
   * @description جلب جميع الملفات داخل مجلد معين
   * @param {string} folderId
   * @returns {import('../../Domain/Entities/Files.domain.js').FilesDomain[]}
   */
  async findByFolderId(_folderId) {
    throw new Error('findByFolderId() not implemented')
  }

  /**
   * @description حذف منطقي للملف (Soft Delete)
   * @param {string} fileId
   * @returns {import('../../Domain/Entities/Files.domain.js').FilesDomain}
   */
  async softDelete(_fileId) {
    throw new Error('softDelete() not implemented')
  }

  /**
   * @description حذف نهائي للملف (Hard Delete)
   * @param {string} fileId
   * @returns {import('../../Domain/Entities/Files.domain.js').FilesDomain}
   */
  async hardDelete(_fileId) {
    throw new Error('hardDelete() not implemented')
  }
  
  async findDeletedFolder(_folderId) {
    throw new Error('findDeletedFolder() not implemented')
  }

  async restore(_fileId){
    throw new Error('restore() not implemented')
  }
}
