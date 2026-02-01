/* eslint-disable prettier/prettier */
import { FilesDomain } from '../../../Domain/Entities/Files.domain.js'
import { FileRules } from '../../../Domain/Rules/fileRules.js'
export class UploadFileUseCase {
    constructor(fileRepo, encryptedServices, storageServices) {
        this.fileRepo = fileRepo
        this.encryptedServices = encryptedServices;
        this.storageServices = storageServices;  
    }

    async execute(fileData, folderId, userId) {
        const correctName = Buffer.from(fileData.originalname, 'latin1').toString('utf8');
        fileData.originalname = correctName;
        
        // ✅ التحقق من نوع الملف قبل الرفع
        FileRules.validateMimeType(fileData.mimetype);
        FileRules.validateSize(fileData.size);
        FileRules.validateName(fileData.originalname);
        const { encryptedBuffer, iv, authTag } = await this.encryptedServices.encryptedFile(fileData.buffer);        // 2. ننشئ الدومين بقيم وهمية للحقول الإجبارية
        const storageKey = await this.storageServices.upload(encryptedBuffer);
        const fileDomain = new FilesDomain({
            name: fileData.originalname,
            size: fileData.size,
            mimeType: fileData.mimetype,
            folderId: folderId,    
            // ✅ لازم نمرر هذي القيم حتى لو وهمية لأن المودل غالباً يطلبها (Required)
            storageKey: storageKey, 
            iv: iv, 
            authTag: authTag, 
            userId: userId,
            encrypted: true, // نحدد أنه غير مشفر
            deleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        // 3. نحفظ السجل في قاعدة البيانات
        const savedFile = await this.fileRepo.save(fileDomain)
        return savedFile
    }
}