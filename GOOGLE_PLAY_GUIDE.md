# دليل رفع لعبة ZipLine إلى Google Play Console وإنشاء ملف AAB

تم تجهيز المشروع بالكامل كـ **Progressive Web App (PWA)** متوافق مع معايير Google Play ومتطلبات Trusted Web Activity (TWA) والأجهزة الذكية.

---

## الخطوة 1: دفع المشروع إلى حسابك في GitHub (Push to GitHub)

افتح سطر الأوامر (Terminal) ونفّذ الأوامر التالية لربط المشروع بمستودعك على GitHub:

```bash
# 1. إضافة الرابط الخاص بمستودعك على GitHub (استبدل USERNAME و REPO_NAME برابط مستودعك)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# 2. التأكد من اسم الفرع الرئيسي main
git branch -M main

# 3. دفع الكود إلى GitHub
git push -u origin main
```

> **ملاحظة:** إذا كنت تستخدم مفتاح الوصول الشخصي (Personal Access Token - PAT) أو SSH، يمكنك استخدام رابط الـ SSH: `git@github.com:USERNAME/REPO_NAME.git`.

---

## الخطوة 2: إنشاء ملف الـ AAB (Android App Bundle) لرفعه على Google Play Console

لديك **3 طرق معتمدة وسريعة** للحصول على ملف `.aab`:

### الطريقة الأولى (الأسهل والأسرع - عبر PWABuilder المدعوم رسمياً من Google):
1. افتح الموقع الرسمي: [https://www.pwabuilder.com](https://www.pwabuilder.com)
2. ضع رابط اللعبة المنشورة (أو الرابط الخاص بك).
3. اضغط **Package for Stores** ثم اختر **Google Play**.
4. حدد إعدادات الحزمة:
   - **Package ID:** `com.zipline.game.puzzle`
   - **App Name:** `ZipLine`
   - **Version Name:** `1.0.0`
5. اضغط **Generate Package** وسيقوم الموقع فوراً بإنشاء ملف `.aab` الموقّع والجاهز للرفع على Google Play Console!

---

### الطريقة الثانية (عبر أداة Google الرسمية Bubblewrap CLI):
إذا كنت تفضل بناء الملف محلياً على جهازك:

```bash
# تثبيت أداة Google الرسمية
npm install -g @bubblewrap/cli

# تهيئة حزمة أندرويد
bubblewrap init --manifest=https://YOUR_APP_URL/manifest.webmanifest

# بناء ملف AAB الموقّع
bubblewrap build
```
سيُنتج لك هذا الأمر ملف `app-release-bundle.aab` في المجلد الحالي مباشرة.

---

### الطريقة الثالثة (أتمتة البناء عبر GitHub Actions):
تم تضمين ملف سير عمل جاهز داخل المشروع:
`.github/workflows/build-android-bundle.yml`
بمجرد دفع الكود إلى GitHub، يمكنك التوجه إلى تبويب **Actions** في مستودعك وتشغيل الـ Workflow لتحميل ناتج البناء كملف مضغوط (Artifact).

---

## متطلبات إضافية لـ Google Play Console:
- **اسم الحزمة (Package ID):** مثل `com.zipline.game.puzzle`
- **الأيقونات:** موجودة بجودة عالية في مجلد `public/` (بمقاسات 192x192 و 512x512 مع أيقونة Maskable متوافقة مع شاشات Android الحديثة).
- **سياسة الخصوصية (Privacy Policy):** يلزم توفير رابط سياسة خصوصية بسيط عند رفع اللعبة.
- **ملف الربط (Digital Asset Links):** في حال رغبت بإخفاء شريط العنوان للمتصفح بالكامل، يمكنك رفع ملف `assetlinks.json` الذي توفره لك أداة Bubblewrap أو Google Console.
