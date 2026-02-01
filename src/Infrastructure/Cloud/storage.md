# دليل التحويل من التخزين المحلي إلى التخزين السحابي

> **ملاحظة:** هذا الملف للقراءة فقط ولا يجوز تعديله.

## نظرة عامة

يهدف هذا الدليل إلى شرح كيفية تحويل نظام التخزين من التخزين المحلي (Local Storage) إلى التخزين السحابي (Cloud Storage) باستخدام خدمات مثل AWS S3 أو Azure Blob Storage أو Google Cloud Storage.

---

## 1. الوضع الحالي: التخزين المحلي

### 1.1 المشكلة

التخزين المحلي له عدة عيوب:

| العيب | الوصف |
|-------|-------|
| **قابلية التوسع محدودة** | لا يمكن توسيع سعة التخزين بسهولة |
| **نقطة فشل واحدة** | فقدان الملفات في حالة تلف القرص |
| **عدم إمكانية الوصول عن بُعد** | الملفات محصورة في الخادم المحلي |
| **صعوبة النسخ الاحتياطي** | يتطلب نسخ يدوي للملفات |

### 1.2 الكود الحالي

```javascript
// src/Infrastructure/Cloud/StorageFiles.js
export class LocalStorageService {
    constructor() {
        this.uploadDir = path.join(process.cwd(), 'upload');
        // إنشاء المجلد إذا لم يكن موجوداً
    }

    async upload(fileBuffer) {
        // حفظ الملف محلياً على القرص
    }

    async read(fileName) {
        // قراءة الملف من القرص المحلي
    }

    async delete(fileName) {
        // حذف الملف من القرص المحلي
    }
}
```

---

## 2. الحل: التخزين السحابي

### 2.1 المزايا

| الميزة | الوصف |
|--------|-------|
| **عالية التوسع** | سعة تخزين غير محدودة تقريباً |
| **متانة عالية** | نسخ تلقائي للملفات (99.999999999%) |
| **إمكانية الوصول العالمي** | الوصول للملفات من أي مكان |
| **نسخ احتياطي تلقائي** | حماية من فقدان البيانات |
| **تكلفة مرنة** | الدفع حسب الاستخدام |

### 2.2 الخدمات المدعومة

#### AWS S3 (الموصى به)

```bash
npm install @aws-sdk/client-s3
```

#### Azure Blob Storage

```bash
npm install @azure/storage-blob
```

#### Google Cloud Storage

```bash
npm install @google-cloud/storage
```

---

## 3. خطوات التنفيذ

### 3.1 الخطوة 1: تثبيت الاعتماديات

```bash
# لـ AWS S3
npm install @aws-sdk/client-s3

# أو لـ Azure
npm install @azure/storage-blob

# أو لـ Google Cloud
npm install @google-cloud/storage
```

### 3.2 الخطوة 2: إعداد متغيرات البيئة

```env
# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-bucket-name

# أو Azure
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_STORAGE_CONTAINER_NAME=your-container-name

# أو Google Cloud
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
GCS_BUCKET_NAME=your-bucket-name
```

### 3.3 الخطوة 3: إنشاء خدمة التخزين السحابي

#### مثال لـ AWS S3:

```javascript
// src/Infrastructure/Cloud/CloudStorageService.js
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class CloudStorageService {
    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        this.bucketName = process.env.AWS_S3_BUCKET_NAME;
    }

    async upload(fileBuffer, mimeType = 'application/octet-stream') {
        const fileName = `enc_${Date.now()}_${Math.round(Math.random() * 1E9)}.bin`;
        
        await this.s3Client.send(new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: mimeType,
        }));

        console.log(`✅ File uploaded to S3: ${fileName}`);
        return fileName;
    }

    async read(fileName) {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
        });

        const response = await this.s3Client.send(command);
        
        // تحويل Stream إلى Buffer
        const chunks = [];
        for await (const chunk of response.Body) {
            chunks.push(chunk);
        }
        
        return Buffer.concat(chunks);
    }

    async delete(fileName) {
        await this.s3Client.send(new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
        }));

        console.log(`🗑️ File deleted from S3: ${fileName}`);
    }

    async getSignedUrl(fileName, expiresIn = 3600) {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
        });

        return await getSignedUrl(this.s3Client, command, { expiresIn });
    }
}
```

### 3.4 الخطوة 4: تحديث Factory Pattern

```javascript
// src/Infrastructure/Cloud/StorageFactory.js
import { LocalStorageService } from './StorageFiles.js';
import { CloudStorageService } from './CloudStorageService.js';

export class StorageFactory {
    static createStorageService() {
        const useCloudStorage = process.env.USE_CLOUD_STORAGE === 'true';

        if (useCloudStorage) {
            console.log('☁️ Using Cloud Storage (AWS S3)');
            return new CloudStorageService();
        }

        console.log('💾 Using Local Storage');
        return new LocalStorageService();
    }
}
```

### 3.5 الخطوة 5: تحديث نقاط الاستخدام

```javascript
// في أي مكان تستخدم فيه التخزين
import { StorageFactory } from '../Infrastructure/Cloud/StorageFactory.js';

const storageService = StorageFactory.createStorageService();
await storageService.upload(fileBuffer);
```

---

## 4. قائمة التحقق للانتقال

- [ ] إنشاء حساب على خدمة التخزين السحابي
- [ ] إنشاء Bucket/Container للتخزين
- [ ] إعداد صلاحيات الوصول (IAM)
- [ ] تثبيت الاعتماديات المطلوبة
- [ ] إضافة متغيرات البيئة
- [ ] إنشاء خدمة التخزين السحابي
- [ ] اختبار الخدمة في وضع التطوير
- [ ] نقل الملفات الموجودة إلى السحابة
- [ ] تحديث البيئة للإنتاج

---

## 5. ترحيل الملفات الموجودة

```javascript
// migration script
import { LocalStorageService } from './StorageFiles.js';
import { CloudStorageService } from './CloudStorageService.js';
import fs from 'fs';
import path from 'path';

async function migrateFiles() {
    const localService = new LocalStorageService();
    const cloudService = new CloudStorageService();

    const files = fs.readdirSync(localService.uploadDir);

    for (const file of files) {
        const filePath = path.join(localService.uploadDir, file);
        const fileBuffer = await fs.promises.readFile(filePath);
        
        await cloudService.upload(fileBuffer);
        console.log(`✅ Migrated: ${file}`);
    }

    console.log('🎉 Migration complete!');
}
```

---

## 6. ملاحظات هامة

1. **التكلفة**: راقب تكاليف التخزين السحابي لتجنب المفاجآت
2. **الأمان**: تأكد من تشفير الملفات قبل رفعها للسحابة
3. **النسخ الاحتياطي**:_service_Cloud توفر حماية تلقائية، لكن يُنصح بعمل نسخ إضافية
4. **الأداء**: استخدم CDN لتسريع الوصول للملفات

---

## 7. المراجع

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Azure Blob Storage Documentation](https://docs.microsoft.com/azure/storage/blobs/)
- [Google Cloud Storage Documentation](https://cloud.google.com/storage/docs)

---

> **تاريخ الإنشاء:** 2026-01-20  
> **آخر تحديث:** 2026-01-20  
> **kilo code:** فريق التطوير
