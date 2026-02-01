/* eslint-disable prettier/prettier */
export class FileRules {
  static MAX_FILE_SIZE = 50 * 1024 * 1024   // 50MB in bytes 
  static MIN_FILE_SIZE = 1 * 8 // 1 bytes
  static MIN_NAME_LENGTH = 3
  static MAX_NAME_LENGTH = 255
  // Must update when we add more file types
  static ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
  // Validate of file name
  static validateName(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Name must be a string')
    }
    const trimmedName = name.trim()
    if (trimmedName.length < this.MIN_NAME_LENGTH || trimmedName.length > this.MAX_NAME_LENGTH) {
      throw new Error(
        `Name must be between ${this.MIN_NAME_LENGTH} and ${this.MAX_NAME_LENGTH} characters`
      )
    }
    return trimmedName
  }

  // validate of file size
  static validateSize(size) {
    if (!size || typeof size !== 'number') {
      throw new Error('Size missing or invalid')
    }
    if (size > this.MAX_FILE_SIZE) {
      throw new Error('File size exceeds the maximum allowed size of 50MB')
    }
    if (size < this.MIN_FILE_SIZE) {
      throw new Error('File size is too small')
    }
    return size
  }

  // validate of file type
  static validateMimeType(mimeType) {
    if (!mimeType || typeof mimeType !== 'string') {
      throw new Error('Mime type must be a string')
    }
    if (!this.ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error('Invalid file type')
    }
    return mimeType
  }

  // validate of file path
  // ! path is the path of the file in the storage in the cloud
  static validateStorageKey(storageKey) {
    if (!storageKey || typeof storageKey !== 'string') {
      throw new Error('Path must be a string')
    }
    return storageKey
  }

  // validate of file folderId
  static validateFolderId(folderId) {
    if (folderId === null || folderId === undefined) {
      return null
    }
    if (typeof folderId !== 'string') {
      throw new Error('Folder ID must be a string')
    }
    return folderId
  }

  // validate of file userId
  static validateUserId(userId) {
    if (!userId || typeof userId !== 'string') {
      throw new Error('User ID must be a string')
    }
    return userId
  }

  // validate of file dekId
  // ! if the dekId is null or undefined, return null for the dekId
  static validateDekId(dekId) {
    if (dekId === null || dekId === undefined) {
      return null
    }
    if (typeof dekId !== 'string') {
      throw new Error('DEK ID must be a string')
    }
    return dekId
  }

  // validate of file iv
  // ! decrypt an file
  static validateIv(iv) {
    if (iv === null) {return null} 
  }

  // validate of file encrypted
  // ! status if file is encrypted or not
  static validateEncrypted(encrypted) {
    if (typeof encrypted !== 'boolean') {
      throw new Error('Encrypted must be a boolean')
    }
    return encrypted
  }

  // validate of file deleted
  static validateDeleted(deleted) {
    if (typeof deleted !== 'boolean') {
      throw new Error('Deleted must be a boolean')
    }
    return deleted
  }
  static validateAuthTag(authTag) {
    if (authTag === null) {return null}
    // if (!authTag || typeof authTag !== 'string') {
    //   throw new Error('Auth tag must be a string')
    // }
    // return authTag
  }
  // validate of file createAt
  static validateCreateAt(createdAt) {
    if (!createdAt || !(createdAt instanceof Date)) {
      throw new Error('Create at must be a Date')
    }
    return createdAt
  }

  // validate of file updateAt
  static validateUpdateAt(updatedAt) {
    if (!updatedAt || !(updatedAt instanceof Date)) {
      throw new Error('Update at must be a Date')
    }
    return updatedAt
  }
}
