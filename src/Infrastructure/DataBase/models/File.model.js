/* eslint-disable prettier/prettier */
import mongoose from 'mongoose'
import { FileRules } from '../../../Domain/Rules/fileRules.js'
const fileSchema = new mongoose.Schema(
  {
    fileId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      // index: true // سنستبدله بفهرس مركب بالأسفل
    },
    mimeType: {
      type: String,
      required: true,
      enum: FileRules.ALLOWED_MIME_TYPES 
    },
    size: {
      type: Number,
      required: true
    },
    storageKey: {
      type: String,
      required: true
    },
    iv: {
      type: String,
      required: true
    },
    dekId: {
      type: String,
      required: false,
      default: null
    },
    authTag: {
      type: String,
      required: false,
      default: null
    },
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    encrypted: {
      type: Boolean,
      required: true,
      default: false
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false
    },
    // يتم تطويره لاحقا !! (TO DO)
    // folderId: {
    //   type: String,
    //   required: false,
    //   default: null
    // }
  },
  {
    timestamps: true,
  }
 
)

fileSchema.index(
  { userId: 1, folderId: 1, name: 1 }, 
  // { userId: 1, name: 1 },
  { 
    unique: true, 
    partialFilterExpression: { deleted: false } // 👈 هذا هو السر
  }
  )

export const FileModel = mongoose.model('File', fileSchema)
