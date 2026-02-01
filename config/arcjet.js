/* eslint-disable prettier/prettier */
import arcjet, { shield, detectBot, tokenBucket } from '@arcjet/node'
import { ARCJET_KEY } from './env.js' 
console.log("=========== 🔑 Arcjet =============")
console.log('🔑 Checking Key:', ARCJET_KEY ? 'Loaded ✅' : 'Missing ❌', ARCJET_KEY)

export const aj = arcjet({
  key: ARCJET_KEY,
  characteristics: ['ip.src'], 
  rules: [
    // 1. الحماية العامة - حولناها لوضع التجربة
    shield({ mode: 'DRY_RUN' }), 

    // 2. كشف البوتات - حولناها لوضع التجربة (هذا هو الحل لمشكلة Postman)
    detectBot({
      mode: 'DRY_RUN', // <--- التغيير الجوهري هنا
      allow: ['CATEGORY:SEARCH_ENGINE'] 
    }),

    // 3. تحديد السرعة - حولناها لوضع التجربة
    tokenBucket({
      mode: 'DRY_RUN',
      refillRate: 10,
      interval: 60,
      capacity: 10
    })
  ]
})

// ... باقي الميدل وير كما هو ...
export const arcjetMiddleware = async (req, res, next) => {
    // ... (نفس الكود السابق)
    // لكن بما أننا في وضع DRY_RUN، دالة decision.isDenied() سترجع false دائماً
    // وسيتم السماح لـ Postman بالمرور
    try {
        const decision = await aj.protect(req)
        // لن يتم الدخول في شرط الـ deny أثناء الـ DRY_RUN
        if (decision.isDenied()) {
             // ...
        }
        next()
    } catch (error) {
        console.error('Arcjet Error:', error)
        next()
    }
}
