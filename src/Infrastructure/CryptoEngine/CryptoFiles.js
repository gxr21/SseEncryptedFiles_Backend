/* eslint-disable */
import Crypto from 'crypto' // انتبه: الحرف الأول كبير
import dotenv from 'dotenv'

dotenv.config()

// ✅ جعلناها export class (بدون default) لتجنب مشاكل الاستيراد
export class EncryptedServices {
    constructor(){
        this.algorithm = 'aes-256-gcm'
        
        // ✅ تصحيح الاسم: وحدنا الاسم ليكون secretKey
        this.secretKey = Buffer.from(process.env.Encryption_Key, 'hex')
        
        if(this.secretKey.length !== 32) {
            throw new Error('Encryption_Key must be 32 bytes long')
        }
    }

    /**
     * @param {Buffer} fileBuffer 
     * @returns {Object} { encryptedBuffer, iv, authTag }
     */
    async encryptedFile(fileBuffer) {
        try {
            // ✅ استخدام Crypto (الحرف الكبير حسب الاستيراد)
            const iv = Crypto.randomBytes(12) // GCM يفضل 12 بايت للـ IV
            const cipher = Crypto.createCipheriv(this.algorithm, this.secretKey, iv)
            
            const encryptionBuffer = Buffer.concat([
                cipher.update(fileBuffer),
                cipher.final()
            ])
            
            const authTag = cipher.getAuthTag()
            
            return {
                encryptedBuffer: encryptionBuffer,
                iv: iv.toString('hex'),
                authTag: authTag.toString('hex')
            }
        }
        catch (error) {
            console.log('Encryption Error:', error)
            throw new Error('Error while encrypting file')
        }
    }

    /**
     * دالة فك التشفير
     */
    async DecryptionFile(encryptedBuffer, ivHex, authTagHex) {
        try {
            const iv = Buffer.from(ivHex, 'hex')
            const authTag = Buffer.from(authTagHex, 'hex');
            
            // ✅ تصحيح الخطأ السابق: استخدام secretKey بدلاً من security
            // ✅ تصحيح الخطأ السابق: استخدام Crypto بدلاً من crypto
            const decipher = Crypto.createDecipheriv(this.algorithm, this.secretKey, iv);
            
            decipher.setAuthTag(authTag);
            
            const decryptedBuffer = Buffer.concat([
                decipher.update(encryptedBuffer),
                decipher.final()
            ]);
            
            return decryptedBuffer;
        } 
        catch (error) {
            console.log('Decryption Error:', error.message);
            throw new Error('Error while decrypting file');
        }
    }
}