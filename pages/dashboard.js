import { useEffect, useState } from 'react'
import QRious from 'qrious'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()

  const [profile, setProfile] = useState({ name: '', email: '', phone: '', img: '/img/default-profile.png' })
  const [ticketCount, setTicketCount] = useState(0)
  const [purchases, setPurchases] = useState([])

  useEffect(() => {
    setTicketCount(parseInt(localStorage.getItem('ticketCount') || '0'))
  }, [])

  const handlePurchase = (eventName, price) => {
    const count = ticketCount + 1
    setTicketCount(count)
    localStorage.setItem('ticketCount', count)

    const newTicket = { event: eventName, price, date: new Date().toLocaleDateString() }
    setPurchases([newTicket, ...purchases])
  }

  const generateQR = (text) => {
    const qr = new QRious({ value: text, size: 100 })
    return qr.toDataURL()
  }

  const downloadTicket = (ticket) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 400
    canvas.height = 200

    ctx.fillStyle = '#e7efe0'
    ctx.fillRect(0, 0, 400, 200)
    ctx.fillStyle = '#28a745'
    ctx.font = '20px Segoe UI'
    ctx.fillText('Tiqow Ticket', 20, 40)
    ctx.fillStyle = '#333'
    ctx.fillText(`Event: ${ticket.event}`, 20, 80)
    ctx.fillText(`Price: ${ticket.price}`, 20, 110)
    ctx.fillText(`Date: ${ticket.date}`, 20, 140)

    const qrImg = new Image()
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 280, 60, 100, 100)
      const link = document.createElement('a')
      link.download = `${ticket.event}-ticket.png`
      link.href = canvas.toDataURL()
      link.click()
    }
    qrImg.src = generateQR(`${ticket.event} | ${ticket.date}`)
  }

  const handleLogout = () => {
    alert('👋 You have been logged out.')
    router.push('/')
  }

  return (
    <div>
      <header className="navbar">
        <strong>Tiqow Dashboard</strong>
        <nav>
          <button className="btn" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      <div className="dashboard">
        <section className="card">
          <h3>Edit Profile</h3>
          <img className="profile-img" src={profile.img} alt="Profile" />
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.onload = () => setProfile({ ...profile, img: reader.result })
            reader.readAsDataURL(file)
          }} />
          <input placeholder="Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
          <input placeholder="Email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
          <input placeholder="Phone" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
        </section>

        <section className="card">
          <h3>Tickets Purchased</h3>
          <div className="count">{ticketCount}</div>
        </section>

        <section className="card">
          <h3>Available Events</h3>
          {['Afro Night', 'Beach Fest', 'Sundowner'].map((event, i) => (
            <div key={i}>
              <p>{event} - KES {1500 + i * 500}</p>
              <button className="btn" onClick={() => handlePurchase(event, 1500 + i * 500)}>Buy</button>
            </div>
          ))}
        </section>

        <section className="card">
          <h3>Recent Purchases</h3>
          {purchases.map((t, i) => (
            <div className="ticket" key={i}>
              <p>{t.event} - KES {t.price}</p>
              <img src={generateQR(`${t.event} | ${t.date}`)} alt="QR" />
              <button className="btn" onClick={() => downloadTicket(t)}>Download Ticket</button>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
