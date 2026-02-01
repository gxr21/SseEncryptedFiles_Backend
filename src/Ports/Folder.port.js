/* eslint-disable prettier/prettier */
/**
 * @interface
 * @description
 * يحدد كيفية تعامل النظام مع المجلدات
 */
export class IFolderRepository {
    /**
     * حفظ مجلد جديد
     * @param {import('../../Domain/Entities/Folder.domain.js').FolderDomain} folderDomain
     */
    async save(folderDomain) {
        throw new Error('save() not implemented');
    }

    /**
     * جلب مجلد حسب المعرف
     * @param {string} folderId
     */
    async findById(folderId) {
        throw new Error('findById() not implemented');
    }

    /**
     * جلب جميع مجلدات مستخدم معين
     * @param {string} userId
     */
    async findByUserId(userId) {
        throw new Error('findByUserId() not implemented');
    }

    /**
     * تحديث مجلد
     * @param {string} folderId
     * @param {FolderDomain} folderDomain
     */
    async update(folderId, folderDomain) {
        throw new Error('update() not implemented');
    }

    /**
     * حذف مجلد
     * @param {string} folderId
     */
    async delete(folderId) {
        throw new Error('delete() not implemented');
    }
    async restore(folderId) { 
        throw new Error('restore() not implemented');
    }
}