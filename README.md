# GENO Automation Advisor — Backend Proxy

سيرفر صغير مهمته الوحيدة إنه يحجب مفتاح Anthropic API عن متصفح الزائر.
الفرونت إند (`geno-automation-advisor.jsx`) بيبعت المشكلة لـ `/api/advisor`،
والسيرفر ده هو اللي يكلم Anthropic بمفتاحك السري ويرجّع النتيجة.

## 1) التشغيل محليًا (تجربة)

```bash
cd geno-backend
npm install
cp .env.example .env
# افتح .env واكتب مفتاح Anthropic API الحقيقي بتاعك
npm start
```

السيرفر هيشتغل على `http://localhost:3001`.

## 2) ربطه بالفرونت إند

فيه طريقتين حسب إزاي الموقع هيتنشر:

### أ) نفس الدومين (الأسهل — موصى بيها)
لو السيرفر ده والفرونت إند هيتقدموا من نفس الدومين (عن طريق Nginx أو reverse proxy
بيوجّه `/api/*` للسيرفر ده)، الكود جاهز زي ما هو — الاستدعاء `fetch("/api/advisor")`
هيشتغل من غير أي تعديل.

مثال إعداد Nginx بسيط:
```nginx
location /api/ {
    proxy_pass http://localhost:3001;
}
location / {
    root /var/www/geno-frontend/build;
    try_files $uri /index.html;
}
```

### ب) دومين منفصل للـ backend
لو السيرفر هيتنشر على دومين تاني (مثلاً `api.geno.dev`)، غيّر في الكومبوننت
السطر:
```js
fetch("/api/advisor", ...)
```
لـ:
```js
fetch("https://api.geno.dev/api/advisor", ...)
```
وتأكد إن `ALLOWED_ORIGIN` في `.env` مظبوط على دومين الموقع الأساسي بالظبط
(`https://geno.dev`) عشان الـ CORS يشتغل صح.

## 3) النشر الفعلي (Production)

أي منصة استضافة Node عادية تظبط، زي:
- Railway / Render / Fly.io (الأسهل، فيهم إعداد سريع لـ env vars)
- VPS عادي مع PM2 + Nginx

**مهم قبل النشر:**
- [ ] `ANTHROPIC_API_KEY` متحطتش في أي كود أو Git repo — بس في env vars على السيرفر
- [ ] `ALLOWED_ORIGIN` مظبوط على دومين GENO الحقيقي بالظبط (مش `*`)
- [ ] الـ rate limiter (20 طلب / 15 دقيقة لكل IP) مناسب لحجم الزيارات المتوقع —
      عدّل القيمة في `server.js` لو محتاج أعلى أو أقل
- [ ] فعّل HTTPS (أغلب منصات الاستضافة بتوفره تلقائي)

## 4) تكلفة تقريبية

كل طلب بيستهلك تقريبًا 1000-1400 output token من نموذج Sonnet. راجع
[أسعار الـ API الحالية](https://docs.claude.com) قبل النشر لحساب التكلفة
المتوقعة على حسب عدد الزوار المتوقع شهريًا.
