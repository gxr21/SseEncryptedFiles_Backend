/* eslint-disable prettier/prettier */
export class RestoreFileUseCase {
    constructor(fileRepo) {
        this.fileRepo = fileRepo;
    }
    async execute(fileId, userId) {
        // 1. جلب الملف من الريبو
        const fileData = await this.fileRepo.findById(fileId);
        
        if (!fileData) {
            throw new Error('File not found');
        }
        // 2. التأكد من الملكية
        if (fileData.userId !== userId) {
            throw new Error('Unauthorized: This file does not belong to you');
        }
        // 3. استدعاء دالة الدومين للاستعادة (التي برمجناها سابقاً)
        fileData.restore();
        // 4. حفظ الحالة الجديدة في الداتابيس
        const restoredFile = await this.fileRepo.save(fileData);     
        return { 
            success: true, 
            message: "File restored successfully", 
            file: restoredFile 
        };
    }
}