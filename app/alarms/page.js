import { ctx, STATUS_STYLE, fmt } from '@/lib/auth'
import { addAlarm, updateAlarm } from '../actions'
const ST = ['Open', 'In Progress', 'Closed']
export default async function Alarms({ searchParams }) {
  const { machine = '', status = '', error } = await searchParams
  const { s, role } = await ctx()
  let q = s.from('alarms').select('*').order('occurred_at', { ascending: false })
  if (machine) q = q.eq('machine_id', machine)
  if (status) q = q.eq('status', status)
  const [{ data = [] }, { data: ms = [] }] = await Promise.all([q, s.from('machines').select('machine_id,name').order('machine_id')])
  const write = role !== 'viewer'
  const sel = (d) => <><option value="">{d}</option>{ms.map((m) => <option key={m.machine_id} value={m.machine_id}>{m.machine_id} - {m.name}</option>)}</>
  return (<>
    <h1 className="text-2xl font-bold">Alarms</h1>
    {error && <p role="alert" className="panel text-red-700 text-sm">{error}</p>}
    <form className="flex gap-2"><select name="machine" defaultValue={machine} className="inp">{sel('ทุกเครื่อง')}</select>
      <select name="status" defaultValue={status} className="inp"><option value="">ทุกสถานะ</option>{ST.map((x) => <option key={x}>{x}</option>)}</select><button className="btn">กรอง</button></form>
    {write && <form action={addAlarm} className="panel grid md:grid-cols-5 gap-2">
      <select name="machine_id" required className="inp">{sel('เลือกเครื่อง')}</select><input name="alarm_code" placeholder="Alarm Code" required className="inp" />
      <input name="description" placeholder="Description" required className="inp" /><input name="cause" placeholder="Cause (ถ้ามี)" className="inp" /><button className="btn">บันทึก Alarm</button></form>}
    <div className="panel overflow-x-auto"><table className="w-full">
      <thead><tr>{['เวลา', 'เครื่อง', 'Code', 'Description', 'สถานะ / Cause'].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
      <tbody>{data.length === 0 && <tr><td className="td" colSpan={5}>ยังไม่มี Alarm</td></tr>}
        {data.map((a) => (<tr key={a.id}><td className="td whitespace-nowrap">{fmt(a.occurred_at)}</td><td className="td font-mono">{a.machine_id}</td><td className="td">{a.alarm_code}</td><td className="td">{a.description}</td>
          <td className="td">{write ? <form action={updateAlarm} className="flex flex-wrap gap-2"><input type="hidden" name="id" value={a.id} />
            <select name="status" defaultValue={a.status} className="inp">{ST.map((x) => <option key={x}>{x}</option>)}</select>
            <input name="cause" defaultValue={a.cause ?? ''} placeholder="Cause" className="inp" /><button className="btn">อัปเดต</button></form>
            : <span className={`px-2 rounded text-xs ${STATUS_STYLE[a.status]}`}>{a.status}</span>}</td></tr>))}</tbody></table></div>
  </>)
}
