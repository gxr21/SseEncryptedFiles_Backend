/* eslint-disable prettier/prettier */
// DELETE FILE PERMANENTLY
export class DeletePermanentFileUseCase {
    constructor(fileRepo, storageServices) {
        this.fileRepo = fileRepo
        this.storageServices = storageServices
    }
    async execute(fileId, userId) {
        console.log("🗑️ DeletePermanentUseCase called:", { fileId, userId });
        
        const fileData = await this.fileRepo.findById(fileId)
        if (!fileData) {
            console.log("❌ File not found:", fileId);
            throw new Error('File not found')
        }
        console.log("📄 File data:", fileData);
        
        // Check if the user is the owner of the file
        if (fileData.userId !== userId) {
            console.log("❌ Unauthorized:", { fileUserId: fileData.userId, requestUserId: userId });
            throw new Error('Unauthorized')
        }
        
        console.log("🗑️ Performing PERMANENT DELETE from database and storage...");
        
        // Delete from cloud storage
        await this.storageServices.delete(fileData.storageKey)
        
        // Delete from database
        await this.fileRepo.deletePermanent(fileId)
        
        console.log("✅ File permanently deleted!");
        return { success: true, message: "File deleted permanently" }
    }
}
