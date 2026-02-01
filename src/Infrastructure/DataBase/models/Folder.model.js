/* eslint-disable prettier/prettier */
import mongoose from "mongoose"
const FolderSchema = new mongoose.Schema({
 folderId: {
     type: String,
     required: true,
     unique: true
 },
  name: {
     type: String,
     required: true,
     index: true // to make it searchable
 },
     userId: {
     type: String, // يجب أن يكون String ليقبل UUID
     ref: "User",  // Mongoose الحديث يدعم الربط عبر String إذا كان الـ _id في User هو String أو مخصص
     required: true
 },
 deleted: {
     type: Boolean,
     default: false
 }
}, {
    timestamps: true
})


export const Folder = mongoose.model("Folder", FolderSchema)
