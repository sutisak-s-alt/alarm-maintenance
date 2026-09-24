# Alarm & Maintenance Management System

ระบบจัดการเครื่องจักร (Machine), การแจ้งเตือน (Alarm) และงานซ่อมบำรุง (Maintenance) สำหรับงาน Automation/โรงงาน
พัฒนาเป็นงานในรายวิชา *Programming in Automation Systems*

- **Vercel URL:** https://alarm-maintenance.vercel.app
- **GitHub:** https://github.com/sutisak-s-alt/alarm-maintenance
- **บัญชีทดสอบ (admin / technician):** แจ้งแยกในเอกสารส่งงาน (ไม่เปิดเผยรหัสผ่านใน repo)

## วัตถุประสงค์
ให้ผู้เกี่ยวข้องบันทึกและติดตาม Alarm กับงานซ่อมของเครื่องจักรในที่เดียว ค้นหาประวัติได้ง่าย และเห็นสถานะรวมผ่าน Dashboard

## Technology
Next.js 15 (App Router) • React 19 • Tailwind CSS • Supabase (PostgreSQL, Auth, RLS) • GitHub Actions • Vercel

## Function หลัก
| ส่วน | รายละเอียด |
|---|---|
| Authentication | Login/Logout ด้วย Supabase Auth, ป้องกันทุกหน้าด้วย middleware |
| Role | `admin`, `technician`, `viewer` (ควบคุมสิทธิ์ด้วย RLS และตรวจซ้ำใน Server Actions) |
| Machine Master | Admin เพิ่ม/แก้ไข/ลบ/ดู Machine (ID, Name, Type, Location, Status: Running/Stop/Alarm/Maintenance) |
| Alarm Record | บันทึก, ดู, อัปเดตสถานะ (Open/In Progress/Closed) และ Cause |
| Maintenance Record | บันทึก, ดู, อัปเดตงานซ่อม (Problem, Action Taken, Status) |
| Search / Filter | ค้นหา Machine ด้วย ID/ชื่อ + สถานะ, กรอง Alarm/Maintenance ด้วยเครื่อง + สถานะ |
| Dashboard | จำนวนเครื่องทั้งหมดและแยกตามสถานะ, จำนวน Alarm, จำนวนงานซ่อม |
| Validation | ช่องสำคัญห้ามว่าง, Machine ID ห้ามซ้ำ, ต้องมี Cause ก่อนปิด Alarm, ต้องมี Action Taken ก่อนปิดงานซ่อม |

## สิทธิ์ตาม Role
| Role | Machines | Alarms / Maintenance |
|---|---|---|
| admin | ดู เพิ่ม แก้ไข ลบ | ดู เพิ่ม แก้ไข ลบ |
| technician | ดูเท่านั้น | ดู เพิ่ม แก้ไข |
| viewer | ดูเท่านั้น | ดูเท่านั้น |

## Database Structure
ไฟล์ SQL: [`supabase/schema.sql`](supabase/schema.sql)

- `profiles` (id → auth.users, full_name, role)
- `machines` (machine_id PK, name, type, location, status)
- `alarms` (id PK, machine_id → machines, alarm_code, description, cause, status, occurred_at, updated_by → profiles, updated_at)
- `maintenance_records` (id PK, machine_id → machines, technician_id → profiles, problem, action_taken, status, created_at)

ความสัมพันธ์: `machines` 1 — N `alarms` และ `maintenance_records`; `profiles` 1 — N `maintenance_records`
ค่าสถานะจำกัดด้วย CHECK constraint และเปิด Row Level Security ทุกตาราง

## Security
- ใช้เฉพาะ anon (publishable) key ของ Supabase ทั้งฝั่ง server และ browser **ไม่มี service role key ในโค้ดหรือ GitHub**
- การเขียนข้อมูลทำผ่าน Server Actions และถูกบังคับสิทธิ์อีกชั้นด้วย RLS ในฐานข้อมูล
- `.env.local` ถูกกันไว้ใน `.gitignore` (มีเฉพาะ `.env.example` เป็นตัวอย่าง)

## วิธีติดตั้งและใช้งาน
1. สร้างโปรเจกต์ Supabase แล้วรัน `supabase/schema.sql` ใน SQL Editor
2. สร้างผู้ใช้ที่ Authentication → Users (ติ๊ก Auto Confirm User) แล้วตั้ง admin:
   ```sql
   update profiles set role='admin'
   where id=(select id from auth.users where email='you@example.com');
   ```
3. คัดลอก `.env.example` เป็น `.env.local` แล้วใส่ค่า `NEXT_PUBLIC_SUPABASE_URL` และ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. `npm install` แล้ว `npm run dev` เปิด http://localhost:3000
5. Deploy: Import repo ใน Vercel และตั้ง Environment Variables 2 ตัวข้างต้น จากนั้น Redeploy

## CI (GitHub Actions)
`.github/workflows/ci.yml` ทำงานอัตโนมัติเมื่อ push: Install Dependencies → Lint → Build

## การใช้ AI ในการพัฒนา
ใช้ Claude (Anthropic) เป็นผู้ช่วยตลอดกระบวนการ

**ส่วนที่ AI ช่วย**
- สรุปเอกสารประกอบการสอนและโจทย์ แล้วแปลงเป็น requirement
- ออกแบบ database schema, ความสัมพันธ์ และ RLS policy
- เขียนโค้ด Next.js (หน้าเว็บ, Server Actions, middleware) และ Tailwind styles
- เขียน GitHub Actions workflow และร่าง README
- ช่วยวิเคราะห์ error ระหว่างติดตั้งและ deploy

**ส่วนที่ผู้พัฒนาทำและตรวจสอบเอง**
- สร้างและตั้งค่า Supabase, รัน SQL, สร้างผู้ใช้และกำหนด Role
- ตั้งค่า Environment Variables และ Deploy บน Vercel
- push โค้ดขึ้น GitHub และตรวจผล CI
- ทดสอบระบบตามเงื่อนไข เช่น Machine ID ซ้ำ, ปิด Alarm โดยไม่มี Cause และสิทธิ์ตาม Role
- ตรวจว่าไม่มี secret ใน client หรือใน repository

## ข้อจำกัด
ยังไม่มี automated test (CI ตรวจ lint และ build), ไม่มีฟีเจอร์คะแนนพิเศษ, และ Supabase แผนฟรีจะ pause โปรเจกต์เมื่อไม่มีการใช้งานเกิน 1 สัปดาห์
