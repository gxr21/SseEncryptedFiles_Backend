/* eslint-disable prettier/prettier */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class LocalStorageService {
    constructor() {
        // مجلد التخزين المحلي
        this.uploadDir = path.join(__dirname, '../../../upload')
        this.ensureUploadDir()
    }

    async ensureUploadDir() {
        try {
            await fs.access(this.uploadDir)
        } catch {
            await fs.mkdir(this.uploadDir, { recursive: true })
            console.log('📁 Created upload directory:', this.uploadDir)
        }
    }

    /**
     * رفع الملف المشفر محلياً
     */
    async upload(fileBuffer) {
        try {
            const fileName = `enc_${Date.now()}_${Math.round(Math.random() * 1E9)}.bin`
            const filePath = path.join(this.uploadDir, fileName)
            
            await fs.writeFile(filePath, fileBuffer)
            console.log(`💾✅ Saved locally: ${fileName}`)
            
            return fileName
        } catch (error) {
            console.error('❌ Local Upload Error:', error)
            throw new Error(`فشل حفظ الملف محلياً: ${error.message}`)
        }
    }

    /**
     * قراءة الملف المشفر محلياً
     */
    async read(fileKey) {
        try {
            const filePath = path.join(this.uploadDir, fileKey)
            
            // التحقق من وجود الملف
            try {
                await fs.access(filePath)
            } catch {
                throw new Error('الملف غير موجود')
            }

            const buffer = await fs.readFile(filePath)
            console.log(`📖 Read locally: ${fileKey}`)
            return buffer
        } catch (error) {
            console.error('❌ Local Read Error:', error)
            throw new Error(`فشل قراءة الملف: ${error.message}`)
        }
    }

    /**
     * حذف الملف المشفر محلياً
     */
    async delete(fileKey) {
        try {
            const filePath = path.join(this.uploadDir, fileKey)
            
            await fs.unlink(filePath)
            console.log(`🗑️ Deleted locally: ${fileKey}`)
        } catch (error) {
            console.error('❌ Local Delete Error:', error)
            throw new Error(`فشل حذف الملف: ${error.message}`)
        }
    }

    /**
     * التحقق من وجود الملف
     */
    async exists(fileKey) {
        const filePath = path.join(this.uploadDir, fileKey)
        try {
            await fs.access(filePath)
            return true
        } catch {
            return false
        }
    }
}
