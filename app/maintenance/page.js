import { ctx, STATUS_STYLE, fmt } from '@/lib/auth'
import { addMaintenance, updateMaintenance } from '../actions'
const ST = ['Open', 'In Progress', 'Done']
export default async function Maintenance({ searchParams }) {
  const { machine = '', status = '', error } = await searchParams
  const { s, role } = await ctx()
  let q = s.from('maintenance_records').select('*').order('created_at', { ascending: false })
  if (machine) q = q.eq('machine_id', machine)
  if (status) q = q.eq('status', status)
  const [{ data = [] }, { data: ms = [] }] = await Promise.all([q, s.from('machines').select('machine_id,name').order('machine_id')])
  const write = role !== 'viewer'
  const sel = (d) => <><option value="">{d}</option>{ms.map((m) => <option key={m.machine_id} value={m.machine_id}>{m.machine_id} - {m.name}</option>)}</>
  return (<>
    <h1 className="text-2xl font-bold">Maintenance</h1>
    {error && <p role="alert" className="panel text-red-700 text-sm">{error}</p>}
    <form className="flex gap-2"><select name="machine" defaultValue={machine} className="inp">{sel('ทุกเครื่อง')}</select>
      <select name="status" defaultValue={status} className="inp"><option value="">ทุกสถานะ</option>{ST.map((x) => <option key={x}>{x}</option>)}</select><button className="btn">กรอง</button></form>
    {write && <form action={addMaintenance} className="panel grid md:grid-cols-4 gap-2">
      <select name="machine_id" required className="inp">{sel('เลือกเครื่อง')}</select><input name="problem" placeholder="Problem" required className="inp" />
      <input name="action_taken" placeholder="Action Taken" className="inp" /><button className="btn">บันทึกงานซ่อม</button></form>}
    <div className="panel overflow-x-auto"><table className="w-full">
      <thead><tr>{['วันที่', 'เครื่อง', 'Problem', 'สถานะ / Action Taken'].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
      <tbody>{data.length === 0 && <tr><td className="td" colSpan={4}>ยังไม่มีงานซ่อม</td></tr>}
        {data.map((r) => (<tr key={r.id}><td className="td whitespace-nowrap">{fmt(r.created_at)}</td><td className="td font-mono">{r.machine_id}</td><td className="td">{r.problem}</td>
          <td className="td">{write ? <form action={updateMaintenance} className="flex flex-wrap gap-2"><input type="hidden" name="id" value={r.id} />
            <select name="status" defaultValue={r.status} className="inp">{ST.map((x) => <option key={x}>{x}</option>)}</select>
            <input name="action_taken" defaultValue={r.action_taken ?? ''} placeholder="Action Taken" className="inp" /><button className="btn">อัปเดต</button></form>
            : <span className={`px-2 rounded text-xs ${STATUS_STYLE[r.status]}`}>{r.status}</span>}</td></tr>))}</tbody></table></div>
  </>)
}
