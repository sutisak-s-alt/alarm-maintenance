# Alarm & Maintenance Management System
ระบบจัดการ Machine, Alarm และงานซ่อมบำรุง สำหรับงาน Automation/โรงงาน

**Tech:** Next.js 15 (App Router) • Tailwind CSS • Supabase (Postgres, Auth, RLS) • GitHub Actions • Vercel
**Vercel URL:** _ใส่ลิงก์หลัง deploy_

## Functions
Login/Logout (Supabase Auth) • Role: admin / technician / viewer • Machine CRUD (admin) • Alarm create/read/update •
Maintenance create/read/update • Search/Filter (machine, status) • Dashboard summary • Validation (ห้าม Machine ID ซ้ำ, ต้องมี Cause ก่อนปิด Alarm, ต้องมี Action Taken ก่อนปิดงานซ่อม)

## Database
`profiles(id→auth.users, role)` • `machines(machine_id PK)` • `alarms(machine_id→machines)` • `maintenance_records(machine_id→machines, technician_id→profiles)`
สิทธิ์ควบคุมด้วย RLS + Server Actions; ใช้เฉพาะ anon key **ไม่ใช้ service role key**  (schema: `supabase/schema.sql`)

## Setup
1. สร้างโปรเจกต์ Supabase → SQL Editor → รัน `supabase/schema.sql`
2. Authentication → Users → Add user (สร้างบัญชีทดสอบ) แล้วรัน SQL ท้ายไฟล์ schema เพื่อตั้งเป็น admin
3. `cp .env.example .env.local` แล้วใส่ URL + anon key (Project Settings → API)
4. `npm install && npm run dev`
5. Push ขึ้น GitHub (commit เป็นระยะ) → Vercel → Import repo → ตั้ง env 2 ตัวข้างต้น → Deploy
6. CI: `.github/workflows/ci.yml` (install → lint → build) ทำงานอัตโนมัติเมื่อ push

## การใช้ AI
_ระบุ: ใช้ AI ช่วยออกแบบ schema/RLS, เขียนโค้ด และ workflow CI; ผู้พัฒนาตรวจสอบ RLS, secret และทดสอบการทำงานเอง_
