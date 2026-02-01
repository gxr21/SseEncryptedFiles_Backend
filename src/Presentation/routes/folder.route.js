/* eslint-disable prettier/prettier */
import express from 'express';
import { FolderController } from '../controllers/folder.controller.js';
import { FileController } from '../controllers/file.controller.js'; 
import { FolderRepo } from '../../Infrastructure/DataBase/Repositories/Folder.repo.js';
import { FileRepo } from '../../Infrastructure/DataBase/Repositories/file.repo.js';
import { authSecurity } from '../middlewares/auth.middleware.js';

const FolderRouter = express.Router();
const fileController = new FileController();
const folderRepo = new FolderRepo();
const fileRepo = new FileRepo();
// يجب تمرير fileRepo لأن الكونترولر يحتاجه لعمليات الحذف والعرض
const folderController = new FolderController(folderRepo, fileRepo);
FolderRouter.post('/', authSecurity, folderController.createFolder);
FolderRouter.get('/', authSecurity, folderController.listFolderContent);
// FolderRouter.get('/files',authSecurity, fileController.getAllFiles)
FolderRouter.get('/:folderId', authSecurity, folderController.listFolderContent);
FolderRouter.delete('/:folderId', authSecurity, folderController.deleteFolder);
FolderRouter.put('/restore/:folderId', authSecurity, folderController.restoreFolder);
FolderRouter.get('/trash', authSecurity, folderController.listTrashFolders);
export default FolderRouter;
