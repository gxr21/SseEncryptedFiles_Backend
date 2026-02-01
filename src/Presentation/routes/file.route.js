/* eslint-disable prettier/prettier */
// ====== RESTFUL API ======
import express from 'express';
import multer from 'multer';
import { FileController } from '../controllers/file.controller.js'
import { FileRepo } from '../../Infrastructure/DataBase/Repositories/file.repo.js'
// import { StorageServices } from '../../Infrastructure/Cloud/StorageFiles.js'
import {EncryptedServices} from '../../Infrastructure/CryptoEngine/CryptoFiles.js'
import { FolderRepo } from '../../Infrastructure/DataBase/Repositories/Folder.repo.js'
import { authSecurity } from '../middlewares/auth.middleware.js'
import { S3StorageService } from '../../Infrastructure/Cloud/StorageFiles.js';

const FileRouter = express.Router();

// إعداد Multer لتخزين الملف في الذاكرة (Buffer)
const upload = multer({ storage: multer.memoryStorage() });

const fileRepo = new FileRepo();
const folderRepo = new FolderRepo();
const encryptedServices = new EncryptedServices();
const storageServices = new S3StorageService();

// نمرر الخدمات الوهمية بدلاً من null
const fileController = new FileController(fileRepo, encryptedServices, storageServices , folderRepo);
FileRouter.get('/', authSecurity, fileController.getAllFiles);
FileRouter.post('/upload', authSecurity, upload.single('file'), fileController.uploadFile);
FileRouter.get('/trash', authSecurity, fileController.listTrashFiles); // ✅ نقلناها للأعلى للأمان
FileRouter.get('/download/:fileId', authSecurity, fileController.downloadFile);
FileRouter.delete('/:fileId', authSecurity,  fileController.deleteFile);
FileRouter.delete('/:fileId/permanent', authSecurity,  fileController.deletePermanent); // حذف نهائي للملف 
// FileRouter.put('/move', authSecurity, fileController.moveFile); 
FileRouter.put('/restore/:fileId', authSecurity, fileController.restoreFile);
export default FileRouter;
