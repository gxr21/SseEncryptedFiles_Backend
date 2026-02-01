/* eslint-disable prettier/prettier */
export class DownloadUseCase {
    // ✅ 1. تصحيح الإملاء هنا (storageServices)
    constructor(fileRepo, encryptedServices, storageServices) {
        this.fileRepo = fileRepo
        this.encryptedServices = encryptedServices
        this.storageServices = storageServices
    }

    async execute(fileId, userId) {
        const fileData = await this.fileRepo.findById(fileId)
        
        if (!fileData) {
            throw new Error('File not found')
        }
        
        if (fileData.userId !== userId) {
            throw new Error('File does not belong to you')
        }
        
        if (fileData.deleted) {
            throw new Error('File is deleted')
        }

        console.log(`📥 Fetching encrypted file from disk: ${fileData.storageKey}`)
        
        // جلب الملف المشفر من القرص
        const encryptedBuffer = await this.storageServices.read(fileData.storageKey)

        // ✅ 2. نمرر الـ iv و authTag كما هم (نصوص Hex)
        // لأن دالة DecryptionFile هي التي ستحولهم إلى Buffer
        const decryptedBuffer = await this.encryptedServices.DecryptionFile(
            encryptedBuffer, 
            fileData.iv,      // نرسل النص مباشرة (Hex String)
            fileData.authTag  // نرسل النص مباشرة (Hex String)
        ) 

        return {
            buffer: decryptedBuffer,
            name: fileData.name,
            mimeType: fileData.mimeType
        }
    }
}