// main.js
import { UserDomain } from './src/Domain/Entities/User.domain.js'

console.log('--- بدء تشغيل التطبيق ---')

try {
  // 1. تجربة إنشاء مستخدم صحيح
  console.log('\n1. محاولة إنشاء مستخدم جديد...')
  const user1 = new UserDomain(
    'Ali Jalal', // Name
    'ali@example.com', // Email
    'SecureP@ssw0rd123' // Password
  )

  const user2 = new UserDomain(
    'Ammar Jalal', //
    'ammar@example.com',
    'SecureP@ssw0rd124'
  )
  console.log('✅ تم إنشاء المستخدم بنجاح:')
  console.log(user1)
  console.log(user2)
  // 2. تجربة تغيير الاسم
  console.log('\n2. محاولة تغيير الاسم...')
  user1.changeName('Ali Al-Basrawi')
  console.log('✅ الاسم الجديد:', user1.name)
  user2.changeName('Ammar Al-Basrawi')
  console.log('✅ الاسم الجديد:', user2.name)
  // 3. تجربة تفعيل الحساب
  console.log('\n3. تفعيل الحساب...')
  user1.markVerify()
  console.log('✅ حالة التفعيل:', user1.verified)
  user2.markVerify()
  console.log('✅ حالة التفعيل:', user2.verified)
  // 4. تجربة خطأ (مثلاً باسوورد ضعيف)
  console.log('\n4. تجربة إنشاء مستخدم ببيانات خاطئة (باسوورد ضعيف)...')
  new UserDomain(
    'Bad User',
    'bad@test.com',
    '123' // باسوورد خطأ
  )
} catch (error) {
  // هنا سيتم اصطياد الأخطاء التي رميناها بـ throw new Error
  console.error('❌ حدث خطأ (كما هو متوقع):')
  console.error(error.message)
}
