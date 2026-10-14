# دليل رفع لعبة ZipLine إلى Google Play Console وإنشاء ملف AAB

تم تجهيز المشروع بالكامل بحزمة Native Android (عبر Capacitor) وتطبيق PWA متوافق مع كافة معايير Google Play Console.

---

## سبب ظهور الخطأ السابق وحله (Fix Explanation)

الخطأ الذي ظهر في GitHub Actions:
```
Error: Dependencies lock file is not found in /home/runner/work/...
Supported file patterns: package-lock.json,npm-shrinkwrap.json,yarn.lock
```
**السبب:**
خطوة `actions/setup-node@v4` كانت مفعّلة بخاصية التخزين المؤقت `cache: 'npm'`، والتي تتطلب وجود ملف `package-lock.json` في المستودع لحساب بصمة التخزين، ولم يكن الملف مضافاً للـ Git.

**ما تم إصلاحه الآن:**
1. تم توليد ملف `package-lock.json` نظيف ومتوافق 100% مع كافة التبعيات.
2. تم ضبط إعدادات التبعيات (`--legacy-peer-deps`) لمنع أي تعارض مستقبلي.
3. تم تضمين مشروع أندرويد الأصلي مع `gradlew` وأيقونات الدقة العالية (Mipmaps).
4. تم تحديث ملف سير العمل (`.github/workflows/build-android-bundle.yml`) ليبني ملف الـ `.aab` الموقّع وملف `.apk` التجريبي تلقائياً مع كل رفع (Push).

---

## الخطوة 1: دفع التحديثات إلى GitHub

نفّذ الأوامر التالية لرفع ملفات القفل والمشروع إلى مستودعك:

```bash
# 1. إضافة كل الملفات الجديدة (بما فيها package-lock.json ومشروع الأندرويد)
git add .

# 2. تسجيل التغييرات
git commit -m "fix: add package-lock.json and complete Android AAB workflow"

# 3. التأكد من اسم الفرع
git branch -M main

# 4. الدفع إلى مستودعك على GitHub
git push -u origin main
```

---

## الخطوة 2: تحميل ملف الـ AAB من GitHub Actions

بمجرد تشغيل أمر `git push`:
1. افتح مستودعك على موقع **GitHub**.
2. اذهب إلى تبويب **Actions** من الأعلى.
3. ستجد سير العمل قيد التشغيل: **Build Android App Bundle (.aab) & APK**.
4. عند اكتمال البناء (يظهر بعلامة صح خضراء ✔️):
   - اضغط على اسم الـ Run.
   - انزل لأسفل الصفحة لقسم **Artifacts**.
   - حمّل ملف: **`Google-Play-ZipLine-AAB`** (هذا هو الملف الجاهز للرفع الفوري على Google Play Console).
   - يتوفر أيضاً ملف: **`ZipLine-Test-APK`** لتثبيته وتجربته على هاتفك الأندرويد مباشرة!

---

## الخطوة 3: رفع الملف إلى Google Play Console

1. ادخل إلى [Google Play Console](https://play.google.com/console).
2. اختر تطبيقك أو أنشئ تطبيقاً جديداً (**Create App**):
   - اسم التطبيق: **ZipLine**
   - النوع: لعبة مجانية (Game - Free).
3. انتقل إلى **Release** -> **Production** (أو **Internal testing** للتجربة).
4. اضغط **Create new release**.
5. اسحب ملف الـ `.aab` الذي حمّلته من تبويب Artifacts في GitHub.
6. أكمل بيانات وصف اللعبة والصور وسياسة الخصوصية واضغط **Review release** ثم **Start rollout**!
