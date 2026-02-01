/* eslint-disable prettier/prettier */
export class FolderRules {
    static validateName(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Name is required')
        }
        if (name.length < 2 || name.length > 255) {
            throw new Error('Name must be between 2 and 255 characters')
        }
    }
    static validateOwner(userId) {
        if (!userId || userId.length !== 24) {
            throw new Error('User ID is required')
        }
    }
    static validateDelete(deleted) {
        if (typeof deleted !== 'boolean') {
            throw new Error('Deleted must be boolean')
        }
    }
}