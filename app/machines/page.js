import { ctx, STATUS_STYLE } from '@/lib/auth'
import { addMachine, updateMachine, deleteMachine } from '../actions'
const ST = ['Running', 'Stop', 'Alarm', 'Maintenance']
export default async function Machines({ searchParams }) {
  const { q = '', status = '', error } = await searchParams
  const { s, role } = await ctx()
  let query = s.from('machines').select('*').order('machine_id')
  if (status) query = query.eq('status', status)
  if (q) query = query.or(`machine_id.ilike.%${q.replace(/[,()%]/g, '')}%,name.ilike.%${q.replace(/[,()%]/g, '')}%`)
  const { data = [] } = await query
  const admin = role === 'admin'
  return (<>
    <h1 className="text-2xl font-bold">Machines</h1>
    {error && <p role="alert" className="panel text-red-700 text-sm">{error}</p>}
    <form className="flex gap-2"><input name="q" defaultValue={q} placeholder="ค้นหา ID / ชื่อ" className="inp" />
      <select name="status" defaultValue={status} className="inp"><option value="">ทุกสถานะ</option>{ST.map((x) => <option key={x}>{x}</option>)}</select><button className="btn">ค้นหา</button></form>
    {admin && <form action={addMachine} className="panel grid md:grid-cols-6 gap-2">
      <input name="machine_id" placeholder="Machine ID" required className="inp" /><input name="name" placeholder="ชื่อเครื่อง" required className="inp" />
      <input name="type" placeholder="Type" className="inp" /><input name="location" placeholder="Location" className="inp" />
      <select name="status" className="inp">{ST.map((x) => <option key={x}>{x}</option>)}</select><button className="btn">เพิ่มเครื่อง</button></form>}
    <div className="panel overflow-x-auto"><table className="w-full">
      <thead><tr>{['ID', 'ชื่อ', 'Type', 'Location', 'สถานะ', ''].map((h) => <th key={h} className="th">{h}</th>)}</tr></thead>
      <tbody>{data.length === 0 && <tr><td className="td" colSpan={6}>ยังไม่มีข้อมูล{admin ? ' เพิ่มเครื่องจากฟอร์มด้านบน' : ''}</td></tr>}
        {data.map((m) => admin ? (<tr key={m.machine_id}><td className="td font-mono">{m.machine_id}</td>
          <td className="td" colSpan={5}><form action={updateMachine} className="flex flex-wrap gap-2">
            <input type="hidden" name="machine_id" value={m.machine_id} /><input name="name" defaultValue={m.name} required className="inp" />
            <span className="self-center text-slate-500">{m.type}</span><input name="location" defaultValue={m.location ?? ''} className="inp" />
            <select name="status" defaultValue={m.status} className="inp">{ST.map((x) => <option key={x}>{x}</option>)}</select>
            <button className="btn">บันทึก</button><button formAction={deleteMachine} className="btn-x">ลบ</button></form></td></tr>)
          : (<tr key={m.machine_id}><td className="td font-mono">{m.machine_id}</td><td className="td">{m.name}</td><td className="td">{m.type}</td><td className="td">{m.location}</td>
            <td className="td"><span className={`px-2 rounded text-xs ${STATUS_STYLE[m.status]}`}>{m.status}</span></td><td className="td" /></tr>))}</tbody></table></div>
  </>)
}
