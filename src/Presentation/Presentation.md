# 🖥 Presentation Layer

هذه الطبقة تمثل واجهة النظام الخارجية (API Layer).

## 🎯 دور الطبقة

استقبال طلبات HTTP

تحليل البيانات من المستخدم

التحقق من الـ JWT

تمرير البيانات إلى UseCases

إرجاع Response للمستخدم

## ما تحتوي عليه

Controllers

Routes

Middlewares

DTO parsers

HTTP Error Handlers

## ما يمنع داخل Presentation

✘ يمنع الاتصال بأي Adapter
✘ يمنع استدعاء DB
✘ يمنع التشفير
✘ يمنع إرسال إيميل مباشرة
✘ يمنع تنفيذ أي Business Logic

## مبدأ مهم

Presentation → UseCase فقط
ما يصير Presentation → Adapter
وما يصير Presentation → DB
وما يصير Presentation → External service

## المجلدات الخاصة بها

Presentation Layer
├── Controllers
├── Routes
├── Middlewares
├── DTOs
└── ErrorHandlers
