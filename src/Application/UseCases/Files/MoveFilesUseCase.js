/* eslint-disable prettier/prettier */  
  
export class MoveFileUseCase {  
    constructor(fileRepo, folderRepo) {  
        this.fileRepo = fileRepo  
        this.folderRepo = folderRepo
    }  
    async execute(fileId, newFolderId, userId ) {  
        // console.log(fileId, newFolderId, userId)
        const fileData = await this.fileRepo.findById(fileId)  
        if (!fileData) {  
            throw new Error('file not found')  
        }  
        if (fileData.userId !== userId) {  
            throw new Error('File is not belong to you')  
        }  

        // التحقق من المجلد الجديد (إذا لم يكن null/root)
        if (newFolderId) {
            const folder = await this.folderRepo.findById(newFolderId, userId);
            if (!folder || folder.deleted) {
                throw new Error('Destination folder not found or access denied');
            }
        }

        fileData.moveToFolder(newFolderId)  
        await this.fileRepo.save(fileData)  
        return fileData  
    }  
} 
