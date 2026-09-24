import { login } from '../actions'
export default async function Login({ searchParams }) {
  const { error } = await searchParams
  return (
    <form action={login} className="panel max-w-sm mx-auto mt-24 space-y-3">
      <h1 className="text-xl font-bold">เข้าสู่ระบบ</h1>
      {error && <p role="alert" className="text-red-700 text-sm">{error}</p>}
      <input name="email" type="email" required placeholder="อีเมล" className="inp w-full" />
      <input name="password" type="password" required placeholder="รหัสผ่าน" className="inp w-full" />
      <button className="btn w-full">เข้าสู่ระบบ</button>
    </form>)
}
