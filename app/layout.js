import './globals.css'
import Link from 'next/link'
import { ctx } from '@/lib/auth'
import { logout } from './actions'
export const metadata = { title: 'Alarm & Maintenance' }
export const dynamic = 'force-dynamic'
export default async function RootLayout({ children }) {
  const { user, role, name } = await ctx()
  return (
    <html lang="th"><body>
      {user && (
        <header className="bg-ink text-white">
          <nav className="max-w-6xl mx-auto flex items-center gap-5 px-4 py-3 text-sm">
            <b className="text-base">Alarm &amp; Maintenance</b>
            {[['/', 'Dashboard'], ['/machines', 'Machines'], ['/alarms', 'Alarms'], ['/maintenance', 'Maintenance']].map(([h, t]) => <Link key={h} href={h} className="hover:underline">{t}</Link>)}
            <span className="ml-auto text-slate-300">{name} ({role})</span>
            <form action={logout}><button className="underline">ออกจากระบบ</button></form>
          </nav>
        </header>)}
      <main className="max-w-6xl mx-auto p-4 space-y-4">{children}</main>
    </body></html>)
}
