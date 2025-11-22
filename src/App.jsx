import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { LogIn, LogOut, User, Hotel, BedDouble, CreditCard, Wrench } from 'lucide-react'
import Spline from '@splinetool/react-spline'
import api from './services/api'

function Navbar() {
  const navigate = useNavigate()
  const [me, setMe] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    api.get('/api/auth/me')
      .then(r => setMe(r.data))
      .catch(() => setMe(null))
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="fixed top-0 inset-x-0 z-30 backdrop-blur bg-slate-900/60 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white font-semibold">
          <Hotel className="w-5 h-5 text-orange-400"/>
          <span>HMS</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-slate-200">
          <Link to="/rooms" className="hover:text-white">Rooms</Link>
          {me && <Link to="/bookings" className="hover:text-white">My Bookings</Link>}
          {me && <Link to="/services" className="hover:text-white">My Requests</Link>}
          {me?.role === 'Receptionist' && <Link to="/reception" className="hover:text-white">Reception</Link>}
          {me?.role === 'Admin' && <Link to="/admin" className="hover:text-white">Admin</Link>}
        </nav>
        <div className="flex items-center gap-3">
          {me ? (
            <>
              <span className="text-slate-200 text-sm hidden sm:block">Hi, {me.name}</span>
              <button onClick={logout} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition">
                <LogOut className="w-4 h-4"/> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition">
              <LogIn className="w-4 h-4"/> Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative min-h-[80vh] w-full overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/O-AdlP9lTPNz-i8a/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"/>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-36 pb-24">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">Modern Hotel Management</h1>
        <p className="mt-4 text-slate-300 max-w-2xl">Book rooms, manage stays, and handle requests seamlessly for Guests, Receptionists, and Admins.</p>
        <div className="mt-8 flex gap-3">
          <Link to="/rooms" className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600">Explore Rooms</Link>
          <Link to="/register" className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20">Create Account</Link>
        </div>
      </div>
    </section>
  )
}

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', data.access_token)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white/5 p-6 rounded-2xl border border-white/10">
        <h2 className="text-2xl font-semibold">Welcome back</h2>
        <p className="text-slate-400 text-sm">Sign in to continue</p>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <div className="mt-6 space-y-4">
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="w-full bg-orange-500 hover:bg-orange-600 rounded-lg py-2.5">Login</button>
        </div>
      </form>
    </div>
  )
}

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', role:'Guest' })
  const [error, setError] = useState('')
  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/api/auth/register', form)
      const { data } = await api.post('/api/auth/login', { email: form.email, password: form.password })
      localStorage.setItem('token', data.access_token)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Registration failed')
    }
  }
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-xl bg-white/5 p-6 rounded-2xl border border.white/10">
        <h2 className="text-2xl font-semibold">Create your account</h2>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <input className="bg-white/5 border border-white/10 rounded-lg px-3 py-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <input className="bg-white/5 border border-white/10 rounded-lg px-3 py-2" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
          <input className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 sm:col-span-2" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 sm:col-span-2" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
          <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 sm:col-span-2" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
            <option>Guest</option>
            <option>Receptionist</option>
            <option>Admin</option>
          </select>
          <button className="sm:col-span-2 bg-orange-500 hover:bg-orange-600 rounded-lg py-2.5">Create account</button>
        </div>
      </form>
    </div>
  )
}

function Rooms() {
  const [rooms, setRooms] = useState([])
  useEffect(() => {
    api.get('/api/rooms').then(r => setRooms(r.data))
  }, [])
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <h2 className="text-2xl font-semibold mb-6">Available Rooms</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(r => (
          <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="aspect-video rounded-lg bg-white/5 flex items-center justify-center mb-3">
              <BedDouble className="w-10 h-10 text-orange-400"/>
            </div>
            <div className="font-semibold">Room {r.roomNumber} • {r.type}</div>
            <div className="text-slate-400 text-sm">${r.price.toFixed(2)} / night</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Bookings() {
  const [me, setMe] = useState(null)
  const [list, setList] = useState([])
  useEffect(() => {
    api.get('/api/auth/me').then(r => {
      setMe(r.data)
      return api.get(`/api/bookings/user/${r.data.id}`)
    }).then(r => setList(r.data)).catch(()=>{})
  }, [])
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <h2 className="text-2xl font-semibold mb-6">My Bookings</h2>
      <div className="space-y-3">
        {list.map(b => (
          <div key={b.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">Room {b.roomId}</div>
              <div className="text-slate-400 text-sm">{new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">${b.totalAmount.toFixed(2)}</div>
              <div className="text-xs text-slate-400">{b.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Services() {
  const [me, setMe] = useState(null)
  const [list, setList] = useState([])
  const [type, setType] = useState('Cleaning')
  const [description, setDescription] = useState('')
  useEffect(() => {
    api.get('/api/auth/me').then(r => {
      setMe(r.data)
      return api.get(`/api/services/user/${r.data.id}`)
    }).then(r => setList(r.data)).catch(()=>{})
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const res = await api.post('/api/services', { guestId: me.id, type, description })
    setList([res.data, ...list])
    setDescription('')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <h2 className="text-2xl font-semibold mb-6">Service Requests</h2>
      <form onSubmit={submit} className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2" value={type} onChange={e=>setType(e.target.value)}>
            <option>Cleaning</option>
            <option>Laundry</option>
            <option>Food</option>
            <option>Maintenance</option>
          </select>
          <input className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 sm:col-span-2" placeholder="Describe your request" value={description} onChange={e=>setDescription(e.target.value)} />
        </div>
        <button className="mt-3 bg-orange-500 hover:bg-orange-600 rounded-lg px-4 py-2">Submit</button>
      </form>
      <div className="space-y-3">
        {list.map(s => (
          <div key={s.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{s.type}</div>
              <div className="text-slate-400 text-sm">{s.description}</div>
            </div>
            <div className="text-xs text-slate-400">{s.status}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Reception() {
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  useEffect(() => {
    api.get('/api/bookings').then(r => setBookings(r.data)).catch(()=>{})
    // simple: fetch all service requests by listing user would require role; skip for demo
  }, [])
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <h2 className="text-2xl font-semibold mb-6">Reception Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="font-semibold mb-3">Bookings</div>
          <div className="space-y-2">
            {bookings.map(b => (
              <div key={b.id} className="p-3 rounded-lg bg-white/5 flex items-center justify-between">
                <div>
                  <div className="text-sm">Guest {b.guestId}</div>
                  <div className="text-xs text-slate-400">Room {b.roomId}</div>
                </div>
                <div className="text-xs text-slate-400">{b.status}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="font-semibold mb-3">Quick Actions</div>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white/10 rounded-lg py-2">Check-in</button>
            <button className="bg-white/10 rounded-lg py-2">Check-out</button>
            <button className="bg-white/10 rounded-lg py-2">Update Room</button>
            <button className="bg-white/10 rounded-lg py-2">Resolve Request</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Admin() {
  const [rooms, setRooms] = useState([])
  const [form, setForm] = useState({ roomNumber:'', type:'Single', price:100, images:[], features:[], status:'Available' })
  useEffect(() => { api.get('/api/rooms').then(r => setRooms(r.data)) }, [])
  const addRoom = async (e) => {
    e.preventDefault()
    const res = await api.post('/api/rooms', form)
    setRooms([res.data, ...rooms])
    setForm({ roomNumber:'', type:'Single', price:100, images:[], features:[], status:'Available' })
  }
  const removeRoom = async (id) => {
    await api.delete(`/api/rooms/${id}`)
    setRooms(rooms.filter(r => r.id !== id))
  }
  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 px-6">
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="font-semibold mb-3">Rooms</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rooms.map(r => (
              <div key={r.id} className="p-3 bg-white/5 rounded-lg">
                <div className="font-semibold">Room {r.roomNumber} • {r.type}</div>
                <div className="text-xs text-slate-400 mb-2">${r.price.toFixed(2)} • {r.status}</div>
                <button onClick={()=>removeRoom(r.id)} className="text-red-400 text-sm">Delete</button>
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={addRoom} className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="font-semibold mb-3">Add Room</div>
          <div className="space-y-3">
            <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" placeholder="Room Number" value={form.roomNumber} onChange={e=>setForm({...form, roomNumber:e.target.value})} />
            <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
              <option>Single</option>
              <option>Double</option>
              <option>Deluxe</option>
              <option>Suite</option>
            </select>
            <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" type="number" step="0.01" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price:parseFloat(e.target.value)})} />
            <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
              <option>Available</option>
              <option>Booked</option>
              <option>Cleaning</option>
              <option>Maintenance</option>
            </select>
            <button className="w-full bg-orange-500 hover:bg-orange-600 rounded-lg py-2">Create</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Home() { return (<>
  <Hero/>
  <div className="bg-slate-950 text-white">
    <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <User className="w-6 h-6 text-orange-400"/>
        <div className="mt-2 font-semibold">For Guests</div>
        <p className="text-slate-400 text-sm">Browse and book stays, manage your bookings, and request services.</p>
      </div>
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <Wrench className="w-6 h-6 text-orange-400"/>
        <div className="mt-2 font-semibold">For Receptionists</div>
        <p className="text-slate-400 text-sm">Handle check-ins, manage requests, and keep rooms up to date.</p>
      </div>
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <CreditCard className="w-6 h-6 text-orange-400"/>
        <div className="mt-2 font-semibold">For Admins</div>
        <p className="text-slate-400 text-sm">Oversee rooms, users, bookings, service requests, and payments.</p>
      </div>
    </div>
  </div>
</>) }

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/rooms" element={<Rooms/>} />
        <Route path="/bookings" element={<Bookings/>} />
        <Route path="/services" element={<Services/>} />
        <Route path="/reception" element={<Reception/>} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
