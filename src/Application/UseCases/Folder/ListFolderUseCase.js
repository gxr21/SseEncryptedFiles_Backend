/* eslint-disable prettier/prettier */
export class ListFolderUseCase {
    constructor(folderRepo, fileRepo) {
        this.folderRepo = folderRepo;
        this.fileRepo = fileRepo;
    }

    /**
     * @param {string} userId - معرف المستخدم
     * @param {string|null} folderId - إذا كان null يعرض "الرئيسية"، وإذا وجد يعرض ما بداخل المجلد
     */
    async execute(userId, folderId = null) {
        
        // إذا كنا في الصفحة الرئيسية (folderId == null)
        if (!folderId) {
            // 1. جلب كل المجلدات التي أنشأها المستخدم
            let folders = await this.folderRepo.findByUserId(userId);
            folders = folders.filter(folder => !folder.deleted); // فلترة المجلدات المحذوفة

            // 2. جلب الملفات التي ليست داخل أي مجلد (الملفات في الـ Root)
            // نمرر null للمجلد، و userId لضمان جلب ملفات هذا المستخدم فقط
            const files = await this.fileRepo.findByFolder(null, userId);

            return {
                currentFolderName: "الرئيسية",
                folders: folders,
                files: files
            };
        }

        // إذا كان المستخدم داخل مجلد معين
        // 1. التأكد من وجود المجلد وأنه يخص المستخدم
        // نمرر userId هنا ليقوم الريبو بالبحث والتحقق من الملكية في نفس الوقت
        const currentFolder = await this.folderRepo.findById(folderId, userId);
        // يجب التحقق أيضاً أن المجلد غير محذوف
        if (!currentFolder || currentFolder.deleted) {
            throw new Error("Folder not found or access denied");
        }

        // 2. جلب الملفات الموجودة داخل هذا المجلد فقط
        const filesInFolder = await this.fileRepo.findByFolder(folderId, userId);

        return {
            currentFolderName: currentFolder.name,
            folders: [], // لا ندعم المجلدات الفرعية حالياً
            files: filesInFolder
        };
       
    }
    
}