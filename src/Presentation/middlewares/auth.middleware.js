/* eslint-disable prettier/prettier */
// ======= SECURITY GATE ========

import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../config/env.js';
import { User } from '../../Infrastructure/DataBase/models/User.model.js'
export const authSecurity = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // ✅ تأكد أن المسمى (userId أو id) يطابق ما وضعته في دالة Login
    const userId = decoded.userId || decoded.id; 

    const user = await User.findOne({userId:userId}).select('-password');
    
    if (!user) {
      const error = new Error('User not found or account disabled');
      error.statusCode = 401;
      throw error;
    }

    req.user = user; // الآن req.user يحتوي على بيانات المستخدم في كل الـ Controllers
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      error.message = 'Invalid token';
      error.statusCode = 401;
    } else if (error.name === 'TokenExpiredError') {
      error.message = 'Token expired';
      error.statusCode = 401;
    }
    next(error); 
  }
};
