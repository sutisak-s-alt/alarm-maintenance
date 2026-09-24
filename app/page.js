import { ctx, STATUS_STYLE } from '@/lib/auth'
const count = (rows, k, v) => rows.filter((r) => r[k] === v).length
export default async function Dashboard() {
  const { s } = await ctx()
  const [m, a, t] = await Promise.all([s.from('machines').select('status'), s.from('alarms').select('status'), s.from('maintenance_records').select('status')])
  const M = m.data ?? [], A = a.data ?? [], T = t.data ?? []
  const Card = ({ label, n, st }) => <div className="panel"><div className="text-3xl font-bold">{n}</div><div className={`inline-block mt-1 px-2 rounded text-xs ${STATUS_STYLE[st] ?? 'bg-slate-100'}`}>{label}</div></div>
  return (<>
    <h1 className="text-2xl font-bold">Dashboard</h1>
    <section aria-label="Machines" className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Card label="Machine ทั้งหมด" n={M.length} />
      {['Running', 'Stop', 'Alarm', 'Maintenance'].map((x) => <Card key={x} label={x} n={count(M, 'status', x)} st={x} />)}
    </section>
    <section aria-label="Alarms and maintenance" className="grid grid-cols-2 md:grid-cols-5 gap-3">
      <Card label="Alarm ทั้งหมด" n={A.length} />
      <Card label="Alarm Open" n={count(A, 'status', 'Open')} st="Open" />
      <Card label="Alarm In Progress" n={count(A, 'status', 'In Progress')} st="In Progress" />
      <Card label="งานซ่อมทั้งหมด" n={T.length} />
      <Card label="งานซ่อมที่ยังไม่เสร็จ" n={T.length - count(T, 'status', 'Done')} st="In Progress" />
    </section>
  </>)
}
