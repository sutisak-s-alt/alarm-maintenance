# รายงานการใช้ AI ในการพัฒนาระบบ Alarm & Maintenance Management System

**รายวิชา:** การใช้คอมพิวเตอร์ควบคุมระบบการผลิตอัตโนมัติ (Programming in Automation Systems)

## 1. ชื่อ-สกุล

- สุทธิศักดิ์ สีเสนา — รหัสนักศึกษา: 056860405626-3
- สุทธิศักดิ์ สีเสนา — รหัสนักศึกษา: 056860405617-2

**GitHub:** https://github.com/sutisak-s-alt/alarm-maintenance  
**Vercel:** https://alarm-maintenance.vercel.app

## 2. เครื่องมือ AI ที่ใช้

Claude (Anthropic) ผ่านหน้าแชต ใช้ช่วยตั้งแต่วิเคราะห์ requirement จนถึง deploy โดยผู้พัฒนาเป็นผู้ตัดสินใจและลงมือตั้งค่าระบบจริงเอง

## 3. ส่วนที่ AI ช่วย

| ขั้นตอน | สิ่งที่ AI ช่วย |
|---|---|
| ออกแบบฐานข้อมูล | ออกแบบ 4 ตาราง ความสัมพันธ์ CHECK constraint trigger สร้าง profile และ RLS policy ตาม Role |
| เขียนโค้ด | Next.js (Server Actions, middleware, หน้า Dashboard/Machines/Alarms/Maintenance) และ Tailwind |
| CI และเอกสาร | GitHub Actions workflow (install, lint, build) และร่าง README |
| แก้ปัญหา | วิเคราะห์ error ของ SQL, Git และ Vercel จากข้อความที่ผู้พัฒนาส่งให้ |

## 4. ส่วนที่ผู้พัฒนาทำและตรวจสอบเอง

- สร้าง Supabase project รัน schema สร้างผู้ใช้ และกำหนด Role (admin / technician)- ตั้งค่า `.env.local` และ Environment Variables บน Vercel แล้ว Deploy ได้จริง- สร้าง GitHub repository, commit เป็นช่วง ๆ และ push ตรวจผล GitHub Actions- ทดสอบระบบ: Login, Machine ID ซ้ำ, ปิด Alarm ต้องมี Cause, ปิดงานซ่อมต้องมี Action Taken, สิทธิ์ตาม Role, Search/Filter และ Dashboard- ตรวจความปลอดภัย: ใช้เฉพาะ anon key ไม่มี service role key ใน client หรือ GitHub และ `.env.local` ถูกกันด้วย `.gitignore`

## 5. Screenshot หน้าจอระบบ

1. หน้า Login
2. Dashboard
3. Machines (มุมมอง admin)
4. Machines ค้นหา/กรอง
5. Validation: Machine ID ซ้ำ
6. Alarms
7. Alarms กรอง
8. Validation: ปิด Alarm โดยไม่ใส่ Cause
9. Maintenance
10. Validation: ปิดงานซ่อมโดยไม่ใส่ Action Taken
11. สิทธิ์ Role: technician — Login ด้วยบัญชี technician เปิดหน้า Machines ต้องไม่มีฟอร์มเพิ่ม/ลบ และเห็น Role ที่มุมขวาบน
12. สิทธิ์ Role: viewer (ถ้ามี)
13. Supabase Table Editor
14. GitHub Repository
15. GitHub Actions (CI) — แท็บ Actions ที่ workflow ขึ้น ✅ Passed
16. Vercel Deployment — หน้า Deployment สถานะ Ready พร้อม URL

## 6. ปัญหาที่พบและวิธีแก้

| ปัญหา | สาเหตุ / วิธีแก้ |
|---|---|
| SQL error 42P07 และ 42723 (already exists) | รัน schema ซ้ำหลังรอบแรกค้างครึ่งทาง แก้โดย drop ตาราง/ฟังก์ชันเดิมแล้วรัน schema ใหม่ตามลำดับ |
| Git remote ยังเป็น `<username>` | ใส่ชื่อบัญชีจริงด้วย `git remote set-url` และ cd เข้าโฟลเดอร์โปรเจกต์ก่อนรันคำสั่ง |
| Vercel 500 MIDDLEWARE_INVOCATION_FAILED | ยังไม่ได้ตั้ง Environment Variables ของ Supabase เพิ่มค่า 2 ตัวแล้ว Redeploy |

## 7. ข้อจำกัดและแนวทางปรับปรุง

ยังไม่มี automated test (CI ตรวจ lint และ build), ยังไม่มีฟีเจอร์คะแนนพิเศษ เช่น Audit Log, Machine History, Export CSV และ Supabase แผนฟรีจะ pause เมื่อไม่มีการใช้งานเกิน 1 สัปดาห์

## สรุป

AI ช่วยเร่งการออกแบบและเขียนโค้ด แต่ความถูกต้อง ความปลอดภัย และการทำงานจริงของระบบผู้พัฒนาเป็นผู้ตรวจสอบและรับผิดชอบ
