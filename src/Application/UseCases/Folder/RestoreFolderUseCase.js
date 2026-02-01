/* eslint-disable prettier/prettier */

export class RestoreFolderUseCase {
    constructor(folderRepo, fileRepo) {
        this.folderRepo = folderRepo;
        this.fileRepo = fileRepo;
    }

    async execute(folderId, userId) {
        // 1. جلب كائن النطاق
        const folder = await this.folderRepo.findById(folderId);

        if (!folder) {
            throw new Error('Folder not found');
        }

        // 2. التحقق من الصلاحيات والمنطق
        if (folder.userId !== userId) {
            throw new Error('Access denied');
        }

        // يتم التحقق من حالة الحذف داخل تابع restore() في FolderDomain
        folder.restore(); 

        // 3. حفظ تغيير الحالة عبر المستودع
        await this.folderRepo.save(folder);

        // 4. استعادة الملفات بشكل جماعي (Bulk Restore)
        // التوصية: يجب إضافة تابع restoreByFolder(folderId) إلى fileRepo
        await this.fileRepo.restoreByFolder(folderId); 

        return { message: 'Folder restored successfully' };
    }
}