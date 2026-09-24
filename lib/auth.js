import { sb } from './supabase/server'
export async function ctx() {
  const s = await sb()
  const { data: { user } } = await s.auth.getUser()
  if (!user) return { s, user: null, role: null }
  const { data: p } = await s.from('profiles').select('role,full_name').eq('id', user.id).single()
  return { s, user, role: p?.role ?? 'viewer', name: p?.full_name || user.email }
}
export const STATUS_STYLE = { Running: 'bg-green-100 text-green-800', Stop: 'bg-slate-200 text-slate-700', Alarm: 'bg-red-100 text-red-800', Maintenance: 'bg-amber-100 text-amber-800', Open: 'bg-red-100 text-red-800', 'In Progress': 'bg-amber-100 text-amber-800', Closed: 'bg-green-100 text-green-800', Done: 'bg-green-100 text-green-800' }
export const fmt = (d) => new Date(d).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })
