/* eslint-disable prettier/prettier */
export class MoveFileUseCase {
  constructor(fileRepo, folderRepo) {
    this.fileRepo = fileRepo;
    this.folderRepo = folderRepo;
  }

  async execute(fileId, targetFolderId, userId) {
    // 1. البحث عن الملف
    const file = await this.fileRepo.findById(fileId);
    
    if (!file) {
      throw new Error('file not found');
    }

    // 2. التحقق من الملكية
    if (file.userId !== userId) {
      throw new Error('Unauthorized: You do not own this file');
    }

    // 3. التحقق من المجلد الهدف (إذا وجد)
    if (targetFolderId) {
      const folder = await this.folderRepo.findById(targetFolderId);
      if (!folder) {
        throw new Error('Target folder not found');
      }
      if (folder.userId !== userId) {
        throw new Error('Unauthorized: Target folder belongs to another user');
      }
    }

    // 4. تنفيذ النقل
    file.moveToFolder(targetFolderId);

    // 5. حفظ التغييرات
    return await this.fileRepo.save(file);
  }
}