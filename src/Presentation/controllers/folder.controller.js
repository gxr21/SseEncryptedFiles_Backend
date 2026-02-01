/* eslint-disable prettier/prettier */
import { CreateFolderUseCase } from '../../Application/UseCases/Folder/CreateFolderUseCase.js'
import { DeleteFolderUseCase } from '../../Application/UseCases/Folder/DeleteFolderUseCase.js'
import { ListFolderUseCase } from '../../Application/UseCases/Folder/ListFolderUseCase.js'
import { RestoreFolderUseCase } from '../../Application/UseCases/Folder/RestoreFolderUseCase.js'

export class FolderController {
  constructor(folderRepo, fileRepo) {
    this.folderRepo = folderRepo;
    this.fileRepo = fileRepo;

    this.createFolderUseCase = new CreateFolderUseCase(this.folderRepo);
    this.deleteFolderUseCase = new DeleteFolderUseCase(this.folderRepo, this.fileRepo);
    this.listFolderUseCase = new ListFolderUseCase(this.folderRepo, this.fileRepo);
    this.restoreFolderUseCase = new RestoreFolderUseCase(this.folderRepo, this.fileRepo);
  }

  // إنشاء مجلد
  createFolder = async (req, res) => {
    try {
      const { name } = req.body;
      const userId = req.user.id;
      const folderData = await this.createFolderUseCase.execute({ userId, name });
      res.status(201).json(folderData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // عرض محتويات المجلد (ملفات ومجلدات)
  listFolderContent = async (req, res) => {
    try {
      const userId = req.user.id;
const folderId = req.params.folderId || req.query.folderId || null;      const content = await this.listFolderUseCase.execute(userId, folderId);
      console.log(`📂 Fetching content for Folder: ${folderId} | User: ${userId}`);
      res.status(200).json(content);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // استعادة مجلد (الدالة التي كانت ناقصة)
  restoreFolder = async (req, res) => {
    try {
      const { folderId } = req.params;
      const userId = req.user.id;
      const result = await this.restoreFolderUseCase.execute(folderId, userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  deleteFolder = async (req, res) => {
    try {
      const { folderId } = req.params;
      const userId = req.user.id;
      await this.deleteFolderUseCase.execute(folderId, userId);
      res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // داخل كلاس FolderController
listTrashFolders = async (req, res) => {
    try {
        const userId = req.user.userId;
        // استدعاء الريبو مباشرة لجلب المجلدات التي deleted: true
        const trashFolders = await this.folderRepo.findDeletedByUserId(userId);
        res.status(200).json(trashFolders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
 }
}