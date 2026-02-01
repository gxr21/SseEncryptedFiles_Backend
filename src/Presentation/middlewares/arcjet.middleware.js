/* eslint-disable prettier/prettier */
import { aj } from '../../../config/arcjet.js'
export const SecurityMiddleware = async (req, res, next) => {
  try {
    // ✅ السطر الجديد (الحل): نخبره يخصم 1 من الرصيد
    const decision = await aj.protect(req, { requested: 1 })

    // ... باقي الكود كما هو (اللوجات والفحوصات)
    if (decision.isDenied()) {
      console.log('🚨 Arcjet blocked request:', JSON.stringify(decision, null, 2))

      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: 'Too many requests. Slow down!' })
      }
      // ...
      return res.status(403).json({ error: 'Access denied' })
    }
    
    next()
  } catch (error) {
    console.error('💥 Critical Middleware Error:', error)
    next()
  }
}
