/* eslint-disable prettier/prettier */
//====== File Domain =======
import { FileRules } from '../Rules/fileRules.js'
import { randomUUID } from 'crypto'
export class FilesDomain {
  constructor({
    fileId,
    name,
    size,
    userId,
    folderId = null,  // (TO DO)
    mimeType,
    encrypted = false,
    deleted = false, // status of file 
    dekId = null,
    iv, // key consist from 12 bytes to encrypt file
    authTag,
    storageKey, // مكان خزن الملف في السحابة 
    createdAt,
    updatedAt
  }) {
    // validate of file
    FileRules.validateName(name)
    FileRules.validateSize(size)
    FileRules.validateMimeType(mimeType)
    FileRules.validateStorageKey(storageKey)
    FileRules.validateIv(iv)
    FileRules.validateDekId(dekId)
    FileRules.validateFolderId(folderId)  // (TO DO)
    FileRules.validateUserId(userId)
    FileRules.validateEncrypted(encrypted)
    FileRules.validateDeleted(deleted)
    FileRules.validateAuthTag(authTag)
    // FileRules.validateCreateAt(createdAt)
    // FileRules.validateUpdateAt(updatedAt)
    
    // Initialization

    this.fileId = fileId || randomUUID()
    this.name = name
    this.mimeType = mimeType // type of file
    this.size = size // size in bytes
    // this.folderId = folderId // relationship file with folder يتم تطويره لاحقا (TO DO)
    this.userId = userId // owner of file
    this.encrypted = encrypted // status
    this.deleted = deleted // if true, file is deleted
    this.dekId = dekId // key of file upload to cloud
    this.iv = iv // Key encrypted file So that the key values do not become identical for files when encrypting files
    this.storageKey = storageKey // path to file in cloud
    this.authTag = authTag // 

    this.createdAt = createdAt || new Date() // time of creation
    this.updatedAt = updatedAt || new Date() // time update
    
  }
  // Rename File status
  rename(newName) {
    FileRules.validateName(newName)
    this.name = newName
    this.updatedAt = new Date()
  }
  // Delete File status
  delete() {
    if (this.deleted) {
      throw new Error('File is already deleted')
    }
    this.deleted = true //  delete status 
    // this.storageKey = null // delete path of file in cloud
    this.updatedAt = new Date()
  }
  // Restore File when is deleted status 
   restore() {
    if (!this.deleted) {
      throw new Error('File is not deleted')
  }
    this.deleted = false // file is not deleted
    this.updatedAt = new Date()
} 
  // Move file to folder status يتم تطويرها لاحقا (TO DO)
  //  moveToFolder(newFolderId) {
  //   this.folderId = newFolderId
  //   this.updatedAt = new Date()
  // }
}
