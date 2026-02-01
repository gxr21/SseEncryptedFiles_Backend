/* eslint-disable prettier/prettier */
import { Folder } from "../models/Folder.model.js"
import { FolderDomain } from "../../../Domain/Entities/Folder.domain.js"
export class FolderRepo {
   async save(folderDomain) {
    const persistenceData = {
      folderId: folderDomain.folderId,
      name: folderDomain.name,
      userId: folderDomain.userId,
      deleted: folderDomain.deleted,
      createdAt: folderDomain.createdAt,
      updatedAt: folderDomain.updatedAt
    }
    const doc = await Folder.findOneAndUpdate(
      { folderId: folderDomain.folderId },
      persistenceData,
      { upsert: true, new: true }
    )
    return this.toDomain(doc)
  }
  async findById(folderId, userId = null) {
    const query = { folderId }
    if (userId) {
      query.userId = userId
    }
    const doc = await Folder.findOne(query)
    return this.toDomain(doc)
  }
  async findByUserId(userId) {
    const docs = await Folder.find({ userId, deleted: false }).sort({ createdAt: -1 })
    return docs.map(doc => this.toDomain(doc))
  }
  toDomain(doc) {
    if (!doc) {return null}
    return new FolderDomain(
       doc.folderId,
       doc.name,
       doc.userId,
       doc.deleted,
       doc.createdAt,
       doc.updatedAt
   )
  }
}
