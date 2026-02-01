# 🏗 Infrastructure (Adapters)

هذه الطبقة تتضمن تنفيذ Ports وتتعامل مع العالم الخارجي.

## دور الطبقة

تنفيذ كل Port

الاتصال بالخدمات الخارجية:

MongoDB

AWS S3

AWS KMS

Node Crypto

SendGrid

ArcJet

توفير تنفيذ ملموس (Concrete Implementation) لكل Port

## ما تحتوي عليه

JWT Adapter

Mongo UserRepository Adapter

Mongo FileRepository Adapter

AWS S3 Adapter

AWS KMS Adapter

Node Crypto Engine Adapter

SendGrid Adapter

ArcJet Adapter

## المجلدات الخاصة بها

📂 src/infrastructure
   ├── adapters
   │   ├── jwt
   │   │   └── jwt.adapter.ts
   │   ├── mongo
   │   │   ├── mongo.user-repository.adapter.ts
   │   │   └── mongo.file-repository.adapter.ts
   │   ├── aws
   │   │   ├── aws.s3.adapter.js
   │   │   └── aws.kms.adapter.js
   │   ├── node
   │   │   └── node.crypto-engine.adapter.js
   │   ├── sendgrid
   │   │   └── sendgrid.adapter.js
   │   └── arcjet
   │       └── arcjet.adapter.js
   └── index.ts

## 🛑 ما يمنع داخل Adapters

✘ يمنع كتابة Business Logic
✘ يمنع استدعاء UseCases من هنا
✘ يمنع التعامل مع Domain مباشرة
✘ يمنع تنفيذ شروط خاصة بالنظام (مثل: التحقق من صلاحيات المستخدم)
✘ يمنع التعامل مع أي من الحلول الخارجية (MongoDB, AWS, SendGrid, etc.)
✘ يمنع التعامل مع أي من الحلول الداخلية (Node Crypto, etc.)

## مبدأ مهم

Adapters تعتمد على Ports، وليس العكس
