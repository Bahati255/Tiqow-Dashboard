import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/dashboard')
  }

  return (
    <div className="container">
      <h1>Tiqow - Welcome</h1>
      <button className="btn" onClick={handleLogin}>Go to Dashboard</button>
    </div>
  )
}
