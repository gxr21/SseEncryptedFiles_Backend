/* eslint-disable prettier/prettier */  
export class ListFilesUseCase {  
    constructor(fileRepo) {  
        this.fileRepo = fileRepo;  
    }  
    async execute(userId, folderId = null) {  
        if (!userId) {  
            throw new Error('User ID is required to list files');  
        } 
        // تم تعديل الترتيب هنا ليتوافق مع الريبو (folderId, userId)
        const files = await this.fileRepo.findByFolder(folderId, userId); 
        
        return files.sort((a, b) => b.createdAt - a.createdAt);  
    }  
} 
