'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { sb } from '@/lib/supabase/server'
import { ctx } from '@/lib/auth'

const back = (p, m) => redirect(`${p}?error=${encodeURIComponent(m)}`)
const val = (f, k) => (f.get(k) ?? '').toString().trim()
async function guard(path, roles) {
  const c = await ctx()
  if (!c.user || !roles.includes(c.role)) back(path, 'คุณไม่มีสิทธิ์ทำรายการนี้')
  return c
}
function done(path, error, msg = 'Machine ID already exists') {
  if (error) back(path, error.code === '23505' ? msg : error.message)
  revalidatePath(path); redirect(path)
}

export async function login(f) {
  const s = await sb()
  const { error } = await s.auth.signInWithPassword({ email: val(f, 'email'), password: val(f, 'password') })
  if (error) back('/login', 'อีเมลหรือรหัสผ่านไม่ถูกต้อง')
  redirect('/')
}
export async function logout() { const s = await sb(); await s.auth.signOut(); redirect('/login') }

export async function addMachine(f) {
  const { s } = await guard('/machines', ['admin'])
  const row = { machine_id: val(f, 'machine_id'), name: val(f, 'name'), type: val(f, 'type'), location: val(f, 'location'), status: val(f, 'status') }
  if (!row.machine_id || !row.name) back('/machines', 'Machine ID และชื่อเครื่องห้ามว่าง')
  done('/machines', (await s.from('machines').insert(row)).error)
}
export async function updateMachine(f) {
  const { s } = await guard('/machines', ['admin'])
  if (!val(f, 'name')) back('/machines', 'ชื่อเครื่องห้ามว่าง')
  done('/machines', (await s.from('machines').update({ name: val(f, 'name'), location: val(f, 'location'), status: val(f, 'status') }).eq('machine_id', val(f, 'machine_id'))).error)
}
export async function deleteMachine(f) {
  const { s } = await guard('/machines', ['admin'])
  done('/machines', (await s.from('machines').delete().eq('machine_id', val(f, 'machine_id'))).error)
}

export async function addAlarm(f) {
  const { s } = await guard('/alarms', ['admin', 'technician'])
  const row = { machine_id: val(f, 'machine_id'), alarm_code: val(f, 'alarm_code'), description: val(f, 'description'), cause: val(f, 'cause') || null }
  if (!row.machine_id || !row.alarm_code || !row.description) back('/alarms', 'กรอก Machine, Alarm Code และ Description ให้ครบ')
  done('/alarms', (await s.from('alarms').insert(row)).error)
}
export async function updateAlarm(f) {
  const { s } = await guard('/alarms', ['admin', 'technician'])
  const status = val(f, 'status'), cause = val(f, 'cause')
  if (status === 'Closed' && !cause) back('/alarms', 'ต้องระบุ Cause ก่อนปิด Alarm')
  done('/alarms', (await s.from('alarms').update({ status, cause: cause || null, updated_at: new Date().toISOString() }).eq('id', val(f, 'id'))).error)
}

export async function addMaintenance(f) {
  const { s } = await guard('/maintenance', ['admin', 'technician'])
  const row = { machine_id: val(f, 'machine_id'), problem: val(f, 'problem'), action_taken: val(f, 'action_taken') || null }
  if (!row.machine_id || !row.problem) back('/maintenance', 'เลือกเครื่องและระบุ Problem')
  done('/maintenance', (await s.from('maintenance_records').insert(row)).error)
}
export async function updateMaintenance(f) {
  const { s } = await guard('/maintenance', ['admin', 'technician'])
  const status = val(f, 'status'), action = val(f, 'action_taken')
  if (status === 'Done' && !action) back('/maintenance', 'ต้องระบุ Action Taken ก่อนปิดงาน')
  done('/maintenance', (await s.from('maintenance_records').update({ status, action_taken: action || null }).eq('id', val(f, 'id'))).error)
}
