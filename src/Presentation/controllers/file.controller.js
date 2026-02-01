/* eslint-disable prettier/prettier */
//====== File Controller =======
//  ENCAPSOULATION HEADER
// File controller - imports handled in routes

import { DeleteFileUseCase } from '../../Application/UseCases/Files/DeleteFilesUseCase.js'
import { DeletePermanentFileUseCase } from '../../Application/UseCases/Files/DeletePermanentFilesUseCase.js'
import { ListFilesUseCase } from '../../Application/UseCases/Files/ListFilesUseCase.js'
import { DownloadUseCase } from '../../Application/UseCases/Files/DownloadFilesUseCase.js'
// import { MoveFileUseCase } from '../../Application/UseCases/Files/MoveFilesUseCase.js' (TO DO)
import {RestoreFileUseCase } from '../../Application/UseCases/Files/RestoreFilesUseCase.js'
import { UploadFileUseCase } from '../../Application/UseCases/Files/UploadfilesUseCase.js'   
import { ListTrashFileUseCase } from '../../Application/UseCases/Files/ListTrashFilesUseCase.js'
export class FileController {
    constructor(fileRepo, encryptedServices, storegeServices, folderRepo) {
        // if (!encryptedServices) {
        //     throw new Error('EncryptedServices is required in FileController constructor');
        // }
        this.fileRepo = fileRepo
        this.encryptedServices = encryptedServices
        this.storegeServices = storegeServices
        this.folderRepo = folderRepo
        // Dependency Injection 
        this.deleteFileUseCase = new DeleteFileUseCase(fileRepo, storegeServices)
        this.deletePermanentFileUseCase = new DeletePermanentFileUseCase(fileRepo, storegeServices)
        this.listTrashFileUseCase = new ListTrashFileUseCase(fileRepo)
        this.listFilesUseCase = new ListFilesUseCase(fileRepo)
        this.downloadUseCase = new DownloadUseCase(fileRepo, encryptedServices, storegeServices)
        // this.moveFileUseCase = new MoveFileUseCase(fileRepo, folderRepo) (TO DO)
        this.restoreFileUseCase = new RestoreFileUseCase(fileRepo)
        this.uploadFileUseCase = new UploadFileUseCase(fileRepo, encryptedServices, storegeServices)
        // this.fileRepo = new FileRepo()
    }
  getAllFiles = async (req, res)=>{
    try {
        const userId = req.user.id
        const folderId = req.query.folderId || req.params.folderId || null;        
        const files = await this.listFilesUseCase.execute(userId, folderId)
        res.status(200).json(files)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
  }
  
  uploadFile = async (req, res) => {
    try {
        // Multer يخزن الملف الواحد في req.file
        const file = req.file
        if (!file) {throw new Error('No file uploaded')}
        const userId = req.user.id
        const { folderId } = req.body
        // تصحيح ترتيب المعاملات ليتوافق مع الـ UseCase (file, folderId, userId)
        const fileData = await this.uploadFileUseCase.execute(file, folderId, userId)
        res.status(201).json(fileData)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
  }
  downloadFile = async (req,res)=> {
    try {
            const { fileId } = req.params;
            const userId = req.user.id; 
            console.log(`⬇️ Download Request for: ${fileId}`)
            // الـ Use Case هنا سيقوم بجلب الملف من السحاب وفك تشفيره بـ AES-256
            const { buffer, name: fileName, mimeType } = await this.downloadUseCase.execute(fileId, userId);
            const encodedFileName = encodeURIComponent(fileName);
            // إرسال الملف للمتصفح ليتم تحميله
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFileName}`);
            res.send(buffer);
            console.log("Success Download !")
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    // يتم تطويره لاحقا !! (TO DO)
    // moveFile = async (req, res) => {
    //     try {
    //         console.log("Body request ->", req.body)
    //         const { fileId, newFolderId } = req.body;
    //         const userId = req.user.id;
    //         await this.moveFileUseCase.execute(fileId, newFolderId, userId);
    //         res.status(200).json({ message: "File moved successfully" });
    //     } catch (error) {
    //         res.status(400).json({ error: error.message});
    //     }
    // }
     restoreFile = async(req, res) => {
        try {
            const { fileId } = req.params;
            const userId = req.user.id;

            const result = await this.restoreFileUseCase.execute(fileId, userId);
            res.status(200).json(result);
            console.log("Success Restore !")
        } catch(error) {
            res.status(400).json({ error: error.message });
        }
    }
    deleteFile = async (req, res) => {
        try {

            const { fileId } = req.params; // استقبال fileId من الرابط
            const userId = req.user.id; 
            const isHardDelete = req.query.permanent === 'true' || (req.body && req.body.permanent === true);
            
            await this.deleteFileUseCase.execute(fileId, userId, isHardDelete);
            res.status(200).json({ message: isHardDelete ? "File deleted permanently" : "File moved to trash" });
            console.log("Success Delete !")
        } catch (error) {
            res.status(400).json({ error: error.message});
        }
    } 
    // DELETE FILE FROM TRASH
    deletePermanent = async (req, res) => {
        try {
            const { fileId } = req.params;
            const userId = req.user.id;
            
            await this.deletePermanentFileUseCase.execute(fileId, userId);
            res.status(200).json({ message: "File deleted permanently" });
            console.log("Success Permanent Delete !")
        } catch (error) {
            res.status(400).json({ error: error.message});
        }
    } 
    listTrashFiles = async (req, res) => {
    try{
        const userId = req.user.id;
        const files = await this.listTrashFileUseCase.execute(userId);
        console.log("Fetching trash for user:", userId);
        res.status(200).json(files);
        console.log("Success List Trash Files !")
    }
    catch(error){
        console.error("Error in listTrashFiles:", error);
        res.status(400).json({ error: error.message });
    }
} 

}

