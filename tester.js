/* eslint-disable prettier/prettier */
// ملاحظة: تأكد من صحة المسارات حسب ترتيب ملفاتك
import { UploadFileUseCase } from './Application/UseCases/Files/UploadFileUseCase.js';
import { DownloadUseCase } from './Application/UseCases/Files/DownloadUseCase.js';
import { RestoreFileUseCase } from './Application/UseCases/Files/RestoreFileUseCase.js';
import { FilesDomain } from './Domain/Entities/Files.domain.js';
// async function bootstrap() {
//     console.log("🛠️ جاري تشغيل اختبار نظام الملفات...");
//     // 1️⃣ إنشاء خدمات "وهمية" (Fake Services) للاختبار
//     const mockFileRepo = {
//         save: async (file) => {
//             console.log("💾 [FileRepo] تم استلام البيانات وحفظها وهمياً:", file.name);
//             return true;
//         }
//     };

//     const mockEncryptionService = {
//         encryptFile: async (buffer) => {
//             console.log("🔐 [Encryption] جاري تشفير البيانات...");
//             return { 
//                 encryptedBuffer: buffer, // نرجع نفس البيانات بدون تشفير حقيقي هسة
//                 iv: "fake_iv_vector_12345" 
//             };
//         }
//     };

//     const mockStorageService = {
//         save: async (buffer, filename) => {
//             const fakePath = `/uploads/encrypted_${filename}`;
//             console.log("📁 [Storage] تم حفظ الملف في المسار:", fakePath);
//             return fakePath;
//         }
//     };
//     // 2️⃣ حقن الخدمات داخل الـ UseCase (Dependency Injection)
//     const uploadUseCase = new UploadUseCase(mockFileRepo, mockEncryptionService, mockStorageService);

//     // 3️⃣ تجهيز بيانات "ملف كاذب" (Mock File)
//     const myFakeFile = {
//         buffer: Buffer.from("هذا نص تجريبي للتأكد من عمل النظام"),
//         originalname: "my_secret_doc.txt",
//         size: 50 * 1024 * 1024 , // 100 ميجابايت
//         mimetype: "text/plain"
//     };

//     try {
//         // 4️⃣ تنفيذ العملية
//         console.log("🚀 بدء عملية الرفع...");
//         const result = await uploadUseCase.execute(myFakeFile, "user_iraq_01");

//         console.log("✅ تم الاختبار بنجاح! مخرجات الـ Domain:");
//         console.table({
//             ID: result.fileId,
//             Name: result.name,
//             Path: result.path,
//             Size: result.size,
//             IV: result.iv,
//             User: result.userId,
//             Status: result.encrypted ? "Encrypted 🔒" : "Raw 🔓",
//         });

//     } catch (error) {
//         console.error("❌ فشل الاختبار! القواعد (Rules) رفضت البيانات:");
//         console.error("السبب:", error.message);
//     }
// }

//    bootstrap();

// async function runDomainTest() {
//     console.log("🧪 بدء اختبار الـ FilesDomain بالبيانات الكاذبة...\n");

//     // --- الحالة الأولى: إنشاء ملف بياناته صحيحة ---
//     try {
//         const validFile = new FilesDomain({
//             name: "document_2025.pdf",
//             size: 5 * 1024 * 1024, // 5MB
//             mimeType: "application/pdf",
//             userId: "user_id_123",
//             path: "/uploads/encrypted_file_abc.enc",
//             iv: "iv_vector_hex_string_example",
//             encrypted: true
//         });

//         console.log("✅ حالة النجاح: تم إنشاء الكائن بنجاح!");
//         console.log(`اسم الملف: ${validFile.name} | الحالة: ${validFile.deleted ? "محذوف" : "نشط"}`);
        
//         // اختبار دالة النقل لمجلد جديد
//         validFile.moveToFolder("folder_new_999");
//         console.log(`🔄 اختبار النقل: تم النقل للمجلد: ${validFile.folderId}`);

//         // اختبار دالة الاستعادة (المفروض تضرب خطأ لأنه غير محذوف)
//         try {
//             validFile.restore();
//         } catch (e) {
//             console.log(`🛡️ اختبار الاستعادة (صحيح): تم منع الاستعادة لأن الملف غير محذوف أصلاً. (الرسالة: ${e.message})`);
//         }

//     } catch (error) {
//         console.error("❌ فشل غير متوقع في حالة النجاح:", error.message);
//     }

//     console.log("\n------------------------------------\n");

//     // --- الحالة الثانية: كسر قاعدة الاسم (اسم قصير جداً) ---
//     try {
//         console.log("🚀 اختبار كسر قاعدة الاسم (اسم حرفين فقط)...");
//         new FilesDomain({
//             name: "ab", // قصير جداً (القاعدة تقول أقل شي 3)
//             size: 2000,
//             mimeType: "text/plain",
//             userId: "user_1",
//             path: "test/path",
//             iv: "iv_test"
//         });
//     } catch (error) {
//         console.log("✅ نجاح الاختبار: القواعد منعت الاسم القصير. (الرسالة:", error.message, ")");
//     }

//     console.log("\n------------------------------------\n");

//     // --- الحالة الثالثة: كسر قاعدة الحجم (حجم أكبر من 50MB) ---
//     try {
//         console.log("🚀 اختبار كسر قاعدة الحجم (60MB)...");
//         new FilesDomain({
//             name: "huge_video.mp4",
//             size: 60 * 1024 * 1024, // 60MB
//             mimeType: "video/mp4",
//             userId: "user_1",
//             path: "test/path",
//             iv: "iv_test"
//         });
//     } catch (error) {
//         console.log("✅ نجاح الاختبار: القواعد منعت الحجم الزائد. (الرسالة:", error.message, ")");
//     }

//     console.log("\n------------------------------------\n");

//     // --- الحالة الرابعة: اختبار الحذف والاستعادة ---
//     try {
//         const fileToDelete = new FilesDomain({
//             name: "secret_file.txt",
//             size: 5000,
//             mimeType: "text/plain",
//             userId: "user_1",
//             path: "path",
//             iv: "iv",
//             deleted: true, // نفترض إنه انحذف
//         });

//         console.log(`🗑️ الملف حالياً deleted = ${fileToDelete.deleted}`);
//         fileToDelete.restore();
//         console.log(`♻️ بعد تنفيذ restore() أصبح deleted = ${fileToDelete.deleted}`);

//     } catch (error) {
//         console.error("❌ خطأ في اختبار الحذف:", error.message);
//     }
// }

// runDomainTest();


async function runMockUploadTest() {
    console.log("🧪 بدء اختبار الـ Mocking لعملية الرفع (Upload)...\n");

    // 1️⃣ تمثيل الخدمات (Mock Services)
    const mockFileRepo = {
        save: async (domain) => {
            console.log("💾 [Repo] تم حفظ السجل في الداتابيس بنجاح.");
            return domain; // نرجع الدومين كأننا حفظناه
        }
    };

    const mockEncryptedService = {
        encryptFile: async (buffer) => {
            console.log("🔐 [Crypto] تم تشفير الملف وتوليد IV و AuthTag.");
            return {
                encryptedBuffer: Buffer.from("مشفر-بشكل-وهمي"), 
                iv: Buffer.from("123456789012"), // Buffer حقيقي للاختبار
                authTag: Buffer.from("tag123456789") // Buffer حقيقي للاختبار
            };
        }
    };

    const mockStorageService = {
        save: async (buffer, filename) => {
            console.log("☁️ [Cloud] تم رفع الملف المشفر للسحابة.");
            return `cloud/storage/path/${Date.now()}_${filename}`;
        }
    };

    // 2️⃣ تهيئة الـ Use Case بالخدمات الوهمية
    const uploadUseCase = new UploadFileUseCase(mockFileRepo, mockEncryptedService, mockStorageService);

    // 3️⃣ بيانات ملف تجريبية (كأنها جاية من Multer)
    const fakeFileData = {
        buffer: Buffer.from("Hello World"),
        originalname: "secret_report.pdf",
        size: 1024,
        mimetype: "application/pdf"
    };

    const folderId = "folder_iraq_2025";
    const userId = "ali_jalal_99";

    try {
        // 4️⃣ التنفيذ
        const result = await uploadUseCase.execute(fakeFileData, folderId, userId);

        console.log("\n✨ نتيجة الاختبار (Success):");
        console.table({
            "اسم الملف": result.name,
            "المجلد": result.folderId,
            "المسار السحابي": result.storageKey,
            "الحالة": result.encrypted ? "🔒 مشفر" : "🔓 غير مشفر",
            "IV (Base64)": result.iv, // تأكد إن الـ Use Case حوله لـ String
            "AuthTag (Base64)": result.authTag
        });

    } catch (error) {
        console.error("❌ فشل الاختبار بسبب خطأ في المنطق:", error.message);
    }
}

runMockUploadTest();


async function runMockingDownloadTest() {
    console.log("🧪 بدء اختبار الـ Mocking لعملية التنزيل (Download)...\n");

    // 1️⃣ تمثيل الريبو (Mock FileRepo)
    const mockFileRepo = {
        findById: async (fileId) => {
            console.log("📂 [Database] جاري البحث عن السجل...");
            return {
                fileId: fileId,
                name: "secret_report.pdf",
                storageKey: "cloud/storage/path/1726543210_secret_report.pdf",
                iv: "MTIzNDU2Nzg5MDEy", // IV مخزن كـ Base64
                authTag: "dGFnMTIzNDU2Nzg5", // AuthTag مخزن كـ Base64
                mimeType: "application/pdf",
                encrypted: true,
                deleted: false,
                userId: "ali_jalal_99"
            };
        }
    };

    // 2️⃣ تمثيل خدمة السحاب (Mock StorageService)
    const mockStorageService = {
        read: async (storageKey) => {
            console.log(`☁️ [Cloud] جاري تحميل الملف المشفر من المسار: ${storageKey}`);
            return Buffer.from("بيانات-مشفرة-وهمية"); // محاكاة لملف مشفر
        }
    };

    // 3️⃣ تمثيل خدمة التشفير (Mock EncryptionService)
    const mockEncryptionService = {
        decryptFile: async (encryptedBuffer, iv, authTag) => {
            console.log("🔓 [Crypto] جاري فك التشفير باستخدام IV و AuthTag المسترجعة...");
            // هنا نتأكد أن المفاتيح وصلت كـ Buffers
            if (Buffer.isBuffer(iv) && Buffer.isBuffer(authTag)) {
                return Buffer.from("هذا هو محتوى الملف الأصلي بعد فك التشفير ✅");
            }
            throw new Error("فشل فك التشفير: المفاتيح ليست بتنسيق Buffer");
        }
    };

    // 4️⃣ تهيئة الـ Use Case
    const downloadUseCase = new DownloadUseCase(mockFileRepo, mockEncryptionService, mockStorageService);

    try {
        // 5️⃣ تنفيذ عملية التنزيل
        const fileId = "file_abc_123";
        const userId = "ali_jalal_99";

        console.log("🚀 تنفيذ الـ Use Case...");
        const result = await downloadUseCase.execute(fileId, userId);

        console.log("\n✨ نتيجة اختبار التنزيل (Success):");
        console.table({
            "اسم الملف المسترجع": result.name,
            "نوع الملف": result.mimeType,
            "المحتوى النهائي": result.buffer.toString()
        });

    } catch (error) {
        console.error("❌ فشل اختبار التنزيل:", error.message);
    }
}

runMockingDownloadTest();


async function runMockingRestoreTest() {
    console.log("🧪 بدء اختبار الـ Mocking لعملية استعادة الملف (Restore)...\n");

    // 1️⃣ تمثيل الريبو (Mock FileRepo)
    const mockFileRepo = {
        // محاكاة إيجاد ملف "محذوف" في الداتابيس
        findById: async (fileId) => {
            console.log("📂 [Database] جاري البحث عن الملف المحذوف...");
            return new FilesDomain({
                fileId: fileId,
                name: "old_document.pdf",
                size: 2048,
                mimeType: "application/pdf",
                storageKey: "path/to/file",
                iv: "some-iv",
                authTag: "some-tag",
                userId: "ali_jalal_99",
                deleted: true, // الملف محذوف حالياً
                createdAt: new Date(),
                updatedAt: new Date()
            });
        },
        // محاكاة حفظ الحالة الجديدة
        save: async (fileDomain) => {
            console.log("💾 [Database] جاري تحديث حالة الملف إلى 'نشط'...");
            return fileDomain;
        }
    };

    // 2️⃣ تهيئة الـ Use Case
    const restoreUseCase = new RestoreFileUseCase(mockFileRepo);

    try {
        const fileId = "file_123_deleted";
        const userId = "ali_jalal_99";

        console.log("🚀 تنفيذ الـ Use Case لعملية الاستعادة...");
        const result = await restoreUseCase.execute(fileId, userId);

        // 3️⃣ عرض النتائج
        console.log("\n✨ نتيجة اختبار الاستعادة (Success):");
        console.table({
            "اسم الملف": result.file.name,
            "الحالة قبل": "🗑️ محذوف (true)",
            "الحالة بعد": result.file.deleted ? "🗑️ محذوف" : "✅ نشط (false)",
            "تاريخ التحديث": result.file.updatedAt.toLocaleTimeString()
        });

    } catch (error) {
        console.error("❌ فشل اختبار الاستعادة:", error.message);
    }
}

runMockingRestoreTest();