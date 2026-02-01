/* eslint-disable prettier/prettier */
import { randomUUID } from 'crypto'
import { FolderRules } from '../Rules/folderRules.js'
export class FolderDomain {
    constructor (folderId, name, userId, deleted = false, createdAt, updatedAt) {
        // Check if the folder name is valid
        FolderRules.validateName(name)
        // Check if the user ID is valid
        FolderRules.validateOwner(userId)
        // Check if the deleted status is valid
        FolderRules.validateDelete(deleted)

        // Set the folder properties
        this.folderId = folderId || randomUUID()
        this.name = name
        this.userId = userId
        this.deleted = deleted
        this.createdAt = createdAt || new Date()
        this.updatedAt = updatedAt || new Date()
    }
    // Rename the folder   
    rename(newname) {
        // Check if the new name is valid
        FolderRules.validateName(newname)
        this.name = newname
        this.updatedAt = new Date()
    }
    // Delete the folder 
    markDelete() {
        if (this.deleted) {
            throw new Error('Folder is already deleted')
        }
        this.deleted = true
        this.updatedAt = new Date()
    }
    // Restore the folder
    restore() {
        if (!this.deleted) {
            throw new Error('Folder is not deleted')
        }
        this.deleted = false
        this.updatedAt = new Date()
    }
}