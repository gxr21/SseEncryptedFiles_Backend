/* eslint-disable prettier/prettier */
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import path from 'path';

// تحميل الإعدادات من ملف .env
dotenv.config({ path: path.join(process.cwd(), '.env') });

export class S3StorageService {
    constructor() {
        // 1. قراءة المتغيرات (باسمائها في ملف .env الخاص بك)
        const bucketName = process.env.S3_BUCKET ? process.env.S3_BUCKET.trim() : "";
        const endpoint = process.env.S3_ENDPOINT ? process.env.S3_ENDPOINT.trim() : "";
        const accessKeyId = process.env.S3_ACCESS_KEY_ID ? process.env.S3_ACCESS_KEY_ID.trim() : "";
        const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY ? process.env.S3_SECRET_ACCESS_KEY.trim() : "";

        console.log("======= 🌩️ Cloudflare R2 Storage ========");
        console.log("📂 Root:", process.cwd());
        console.log("🎯 Endpoint:", endpoint);
        console.log("🪣 Bucket:", bucketName); // تأكد أن الاسم يظهر هنا
        console.log("=========================================");

        if (!bucketName) {
            throw new Error("❌ خطأ: لم يتم قراءة اسم البوكت S3_BUCKET من ملف .env");
        }

        // 2. إعداد الاتصال
        this.client = new S3Client({
            // 🛑 هام: نجبر المنطقة على 'us-east-1' لمنع أخطاء التوافق مع R2
            region: 'us-east-1', 
            endpoint: endpoint,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey
            },
            forcePathStyle: true // ضروري لـ Cloudflare R2
        });

        // ✅ التصحيح هنا: استخدام المتغير الذي قرأناه في الأعلى
        this.bucketName = bucketName; 
    }

    /**
     * رفع الملف المشفر
     */
    async upload(fileBuffer) {
        try {
            
            const fileName = `enc_${Date.now()}_${Math.round(Math.random() * 1E9)}.bin`;
            const command = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
                Body: fileBuffer,        
                ContentType: 'application/octet-stream'
            });

            await this.client.send(command);
            console.log(`☁️✅ Uploaded successfully: ${fileName}`);
            
            return fileName;
        } catch (error) {
            console.error("❌ R2 Upload Error:", error);
            throw new Error(`فشل رفع الملف: ${error.message}`);
        }
    }

    /**
     * قراءة الملف
     */
    async read(fileKey) {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: fileKey
            });

            const response = await this.client.send(command);
            return await this.streamToBuffer(response.Body);
        } catch (error) {
            console.error("❌ R2 Read Error:", error);
            throw new Error("فشل جلب الملف من السحابة");
        }
    }

    /**
     * حذف الملف
     */
    async delete(fileKey) {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: fileKey
            });
            await this.client.send(command);
            console.log(`🗑️ Deleted from R2: ${fileKey}`);
        } catch (error) {
            console.error("❌ R2 Delete Error:", error);
        }
    }

    async streamToBuffer(stream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            stream.on("data", (chunk) => chunks.push(chunk));
            stream.on("error", reject);
            stream.on("end", () => resolve(Buffer.concat(chunks)));
        });
    }
}