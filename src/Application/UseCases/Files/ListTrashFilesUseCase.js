/* eslint-disable prettier/prettier */
export class ListTrashFileUseCase {
    constructor(fileRepo) {
        this.fileRepo = fileRepo
    }
    async execute(userId) {
        const trashFiles = await this.fileRepo.findDeletedByUserId(userId)
        return trashFiles

}
}