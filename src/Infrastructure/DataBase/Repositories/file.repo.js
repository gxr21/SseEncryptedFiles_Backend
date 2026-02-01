/* eslint-disable prettier/prettier */
//====== File Repository =======
import { FileModel } from '../models/File.model.js'
import { FilesDomain } from '../../../Domain/Entities/Files.domain.js'
export class FileRepo {
  // convert file model to file domain
   toDomain(doc) {
    if (!doc) {return null}
    return new FilesDomain({
      // fileId: doc._id.toString(),
      fileId: doc.fileId,
      name: doc.name,
      mimeType: doc.mimeType,
      size: doc.size,
      folderId: doc.folderId, // (TO DO)
      userId: doc.userId,
      encrypted: doc.encrypted,
      deleted: doc.deleted,
      dekId: doc.dekId,
      iv: doc.iv,
      storageKey: doc.storageKey,
      authTag: doc.authTag,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    })
  }
  // save file domain to database
  async save(filesDomain) {
    // convert file domain to file model
    const persistenceData = {
      fileId: filesDomain.fileId, // file id
      folderId: filesDomain.folderId, // folder of file (TO DO)
      name: filesDomain.name, // file name
      size: filesDomain.size,
      mimeType: filesDomain.mimeType, // type of file
      storageKey: filesDomain.storageKey, // path file in cloud
      iv: filesDomain.iv, //  when download file decrypt
      dekId: filesDomain.dekId, // envlope key file when upload
      userId: filesDomain.userId, // onwer of file
      encrypted: filesDomain.encrypted, // status
      deleted: filesDomain.deleted, // file or folder is deleted
      authTag: filesDomain.authTag,
      createdAt: filesDomain.createdAt, // time of creation
      updatedAt: filesDomain.updatedAt // time update
    }
    // search file by id and update
    // نستخدم upsert: true لإنشاء الملف إذا لم يكن موجوداً، أو تحديثه إذا كان موجوداً
    // ونبحث بـ fileId بدلاً من _id لأن الـ ID هو UUID string
    const doc = await FileModel.findOneAndUpdate(
      { fileId: filesDomain.fileId },
      persistenceData,
      { new: true, upsert: true }
    );
    return this.toDomain(doc);
  }

  // ✅ تصحيح البحث بالـ ID
  async findById(fileId) {
    console.log("🔍 Repo Searching for:", fileId);
    // نبحث باستخدام fileId (UUID) بدلاً من _id
    // const doc = await FileModel.findById(fileId);
    const doc = await FileModel.findOne({ fileId: fileId })
    console.log("📄 Repo Found:", doc); // إذا طبع null يعني المشكلة في البحث أو الداتا
    return this.toDomain(doc)
  }
// ايجاد الملفات حسب المستخدم
  async findByUser(userId) {
    console.log("🔍 Repo Searching for:", userId);
    const docs = await FileModel.find({ userId }).sort({ createdAt: -1 })
    console.log("📄 Repo Found:", docs);
    return docs.map(doc => this.toDomain(doc))
  }
 // ✅ تصحيح البحث حسب المجلد (TO DO)
 
  async findByFolder(folderId, userId) {
    // بناء الاستعلام الأساسي
    const query = { 
        userId: userId, 
        deleted: false 
    };
    
    // التحقق بدقة: إذا كان folderId عبارة عن نص (UUID) نفلتر به
    // أما إذا كان null أو undefined أو كلمة "null" نصية، نبحث عن ملفات الصفحة الرئيسية 
    if (folderId && folderId !== "null" && folderId !== "undefined") {
        query.folderId = folderId;
    } else {
        // البحث عن الملفات التي لا تنتمي لأي مجلد (في الـ Root)
        query.folderId = { $in: [null, ""] }; 
    }

    const docs = await FileModel.find(query).sort({ createdAt: -1 });
    return docs.map(doc => this.toDomain(doc));
  }

  // ✅ تعديل دالة النقل لتعيد الدومين (أفضل للـ Clean Architecture) (TO DO)
  // async move(fileId, newFolderId, userId) {
  //   const doc = await FileModel.findOneAndUpdate(
  //     { fileId: fileId, userId: userId }, 
  //     { folderId: newFolderId, updatedAt: new Date() },
  //     { new: true }
  //   );
  //   return this.toDomain(doc);
  // }
  async deleteFile(fileId , userId) {
    const file = await FileModel.findOne({ fileId: fileId, userId: userId })
    if(!file){throw new Error('File not found')}
    if(file.deleted){throw new Error('File already deleted')} 
    const trash = `_TRASH_${Date.now()}`
    file.deleted = true
    file.name = trash
    await file.save()
    return this.toDomain(file)
  }
  //  ===== دالة استرجاع الملف =====
  async restoreFile(fileId , userId) {
    const file = await FileModel.findOne({ fileId: fileId, userId: userId })
    if(!file){throw new Error('File not found')}
    if(!file.deleted){throw new Error('File not deleted')}
    let originalName = file.name;
    if (originalName.startsWith('_TRASH_')) {
      originalName = originalName.replace('_TRASH_', '');
    }
    
    file.deleted = false
    file.name = originalName
    //  تحديث الدومين 
    await file.save()
    return this.toDomain(file)
  }
  // ✅ تصحيح التحديث (TO DO)
  // async restoreByFolder(folderId) {
  //   await FileModel.updateMany({ folderId }, { deleted: false, updatedAt: new Date() })
    
  // }
  // ✅ تصحيح التحديث
  async deleteByFolder(folderId) {
    await FileModel.updateMany({ folderId }, { deleted: true, updatedAt: new Date() })
  }
  // ✅ تصحيح التحديث
  async deleteById(fileId) {
    await FileModel.updateOne({ fileId: fileId }, { deleted: true, updatedAt: new Date() })
  }
  // البحث عن الملفات المحذوفة لمستخدم معين
  async findDeletedByUserId(userId) {
    const docs = await FileModel.find({ userId: userId, deleted: true }).sort({ updatedAt: -1 })
    return docs.map(doc => this.toDomain(doc))
  }
  // ✅ تصحيح الحذف النهائي
  async deletePermanent(fileId) {
    await FileModel.deleteOne({ fileId: fileId }) // 👈 نستخدم fileId
  }
  // ✅ تصحيح التحديث (TO DO)
  // async move(fileId, newFolderId) {
  //   await FileModel.updateOne({ fileId: fileId }, { folderId: newFolderId, updatedAt: new Date() })
  // }
  
}
