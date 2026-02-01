/* eslint-disable prettier/prettier */
export class DeleteFolderUseCase {
  constructor(folderRepo, fileRepo) {
    this.folderRepo = folderRepo
    this.fileRepo = fileRepo
  }

  async execute(folderId, userId) {
    // جلب المجلد والتحقق من الملكية في خطوة واحدة
    const folderData = await this.folderRepo.findById(folderId, userId)

    if (!folderData || folderData.deleted) {
      throw new Error('Folder not found or access denied')
    }

    folderData.markDelete() // تصحيح الاسم من markDeleted إلى markDelete
    await this.folderRepo.save(folderData)

    // حذف جميع الملفات داخل هذا المجلد (Soft Delete)
    await this.fileRepo.deleteByFolder(folderId)

    return folderData
  }
}
