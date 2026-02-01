# ميزة إرسال الإيميل للدعم

## المشكلة
كان هناك محاولة لإنشاء ميزة إرسال إيميل للمستخدمين للتواصل مع الدعم.

## الحلول التي جُربت

### 1. Gmail مع App Password
**المشكلة:** Gmail يتطلب:
- تفعيل 2-Step Verification (2FA)
- إنشاء App Password من https://myaccount.google.com/apppasswords

**خطوات الإعداد:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

### 2. SendGrid
**المشكلة:** يتطلب:
- إنشاء API Key من https://app.sendgrid.com
- التحقق من Sender Identity

**خطوات الإعداد:**
1. Settings > API Keys > Create API Key
2. Settings > Sender Auth > Single Sender Verification
3. التأكد من حالة "Verified"

```env
SENDGRID_API_KEY=SG.xxxxxx
FROM_EMAIL=verified-email@example.com
SUPPORT_EMAIL=support@example.com
```

## الكود الذي تم إنشاؤه (محذوف الآن)

### src/Infrastructure/Email/Email.js
```javascript
import nodemailer from 'nodemailer'

export class EmailService {
  async sendSupportEmail({ userEmail, userName, subject, message }) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.SUPPORT_EMAIL,
      subject: `Support Request: ${subject}`,
      html: `...`
    }
    await transporter.sendMail(mailOptions)
  }
}
```

### src/Application/UseCases/Support/ContactSupportUseCase.js
```javascript
export class ContactSupportUseCase {
  async execute({ userEmail, userName, subject, message }) {
    // التحقق من البيانات
    if (!userEmail || !userName || !subject || !message) {
      throw new Error('All fields are required')
    }
    return await this.emailService.sendSupportEmail(...)
  }
}
```

### src/Presentation/routes/support.route.js
```javascript
SupportRouter.post('/contact', SecurityMiddleware, authSecurity, supportController.contactSupport)
```

## لإعادة تفعيل الميزة لاحقاً:
1. تثبيت nodemailer: `npm install nodemailer`
2. إنشاء الملفات من جديد
3. إضافة المتغيرات البيئية
4. التأكد من Sender Identity في مزود الإيميل
