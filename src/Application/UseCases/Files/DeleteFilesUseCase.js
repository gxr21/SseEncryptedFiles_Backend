/* eslint-disable prettier/prettier */
export class DeleteFileUseCase {
    constructor(fileRepo, storageServices) {
        this.fileRepo = fileRepo
        this.storageServices = storageServices
    }
    // async deletePermanent(fileId) {
    //     await FilesModel.deleteOne({ _id: fileId })
    // }
    async execute(fileId, userId, isHardDelete = false) {
        const fileData = await this.fileRepo.findById(fileId)
        if (!fileData) {
         throw new Error('File not found')
        }
        // Check if the user is the owner of the file
        if (fileData.userId !== userId) {
            throw new Error('Unauthorized')
        }
        //  Delete from storage and database
        if (isHardDelete) {
            // السماح بالحذف النهائي حتى لو الملف محذوف
            if (!fileData) {
                throw new Error('File not found')
            }
            await this.storageServices.delete(fileData.storageKey)
            await this.fileRepo.deletePermanent(fileId)
            return { success: true, message: "Deleted permanently" }
        } 
        //  Move to trash
        else {
            // التحقق إذا كان الملف محذوفاً بالفعل
            if (fileData.deleted) {
                throw new Error('File is already in trash')
            }
            fileData.delete()
            await this.fileRepo.save(fileData)
            return { success: true, message: "Moved to trash" }
        }
    }
}
