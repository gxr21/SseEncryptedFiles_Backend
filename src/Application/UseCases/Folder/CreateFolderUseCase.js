/* eslint-disable prettier/prettier */
import { FolderDomain } from '../../../Domain/Entities/Folder.domain.js'
export class CreateFolderUseCase {
    constructor(folderRepo) {
        this.folderRepo = folderRepo
    }
    async execute(folderData) {
        const {name, userId} = folderData
        if (!name || !userId) {
            throw new Error('Name and userId are required')
        }
        const folder = new FolderDomain(
            undefined,
            name,
            userId,
            false, // يجب تمرير false بدلاً من undefined
            undefined,
            undefined
        )
         await this.folderRepo.save(folder)
         return folder
    }
}