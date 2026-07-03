import { useEffect, useState } from 'react'
import { api, getUser, setToken, clearToken } from './api'
import './App.css'

function Nav({ user, page, setPage, onLogout }) {
  return (
    <nav className="nav">
      <button onClick={() => setPage('menu')} className={page === 'menu' ? 'active' : ''}>Menu</button>
      {user && (
        <>
          <button onClick={() => setPage('my-reservations')} className={page === 'my-reservations' ? 'active' : ''}>Mes réservations</button>
          <button onClick={() => setPage('new-reservation')} className={page === 'new-reservation' ? 'active' : ''}>Nouvelle réservation</button>
        </>
      )}
      {user?.isAdmin && (
        <button onClick={() => setPage('admin')} className={page === 'admin' ? 'active' : ''}>Admin</button>
      )}
      <span className="spacer" />
      {user ? (
        <>
          <span className="user-email">{user.email}</span>
          <button onClick={onLogout}>Déconnexion</button>
        </>
      ) : (
        <>
          <button onClick={() => setPage('login')} className={page === 'login' ? 'active' : ''}>Connexion</button>
          <button onClick={() => setPage('signup')} className={page === 'signup' ? 'active' : ''}>Inscription</button>
        </>
      )}
    </nav>
  )
}

function MenuPage() {
  const [plats, setPlats] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.getMenu().then(setPlats).catch((e) => setError(e.message))
  }, [])

  const categories = [...new Set(plats.map((p) => p.categorie || 'Autre'))]

  return (
    <div>
      <h2>Menu</h2>
      {error && <p className="error">{error}</p>}
      {categories.map((cat) => (
        <div key={cat}>
          <h3>{cat}</h3>
          <ul>
            {plats.filter((p) => (p.categorie || 'Autre') === cat).map((p) => (
              <li key={p.id}>
                <strong>{p.nom}</strong> — {p.prix} €
                {p.description && <span> · {p.description}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function LoginPage({ onLoggedIn, setPage }) {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const { token } = await api.login(email, motDePasse)
      setToken(token)
      onLoggedIn()
      setPage('menu')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Connexion</h2>
      <form onSubmit={submit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
        <button type="submit">Se connecter</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  )
}

function SignupPage({ setPage }) {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      await api.signup(email, motDePasse)
      setDone(true)
    } catch (err) {
      setError(err.message)
    }
  }

  if (done) {
    return (
      <div>
        <h2>Inscription</h2>
        <p>Compte créé. Vous pouvez vous connecter.</p>
        <button onClick={() => setPage('login')}>Aller à la connexion</button>
      </div>
    )
  }

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={submit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} required />
        <button type="submit">S'inscrire</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  )
}

function MyReservationsPage() {
  const [reservations, setReservations] = useState([])
  const [error, setError] = useState('')

  function load() {
    api.getMyReservations().then(setReservations).catch((e) => setError(e.message))
  }

  useEffect(load, [])

  async function cancel(id) {
    setError('')
    try {
      await api.cancelReservation(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Mes réservations</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {reservations.map((r) => (
          <li key={r.id}>
            {r.date} à {r.time} — {r.number_of_people} pers. — statut: {r.statut}
            {r.statut !== 'cancelled' && (
              <button onClick={() => cancel(r.id)}>Supprimer</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function NewReservationPage({ setPage }) {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({ name: '', phone: '', number_of_people: '', date: today, time: '', note: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value })
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.date < today) {
      setError('La date doit être aujourd\'hui ou plus tard')
      return
    }

    try {
      await api.createReservation({ ...form, number_of_people: Number(form.number_of_people) })
      setSuccess('Réservation créée')
      setTimeout(() => setPage('my-reservations'), 1000)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Nouvelle réservation</h2>
      <form onSubmit={submit}>
        <input placeholder="Nom" value={form.name} onChange={update('name')} required />
        <input placeholder="Téléphone" value={form.phone} onChange={update('phone')} />
        <input type="number" min="1" placeholder="Nombre de personnes" value={form.number_of_people} onChange={update('number_of_people')} required />
        <input type="date" min={today} value={form.date} onChange={update('date')} required />
        <input type="time" value={form.time} onChange={update('time')} required />
        <textarea placeholder="Note" value={form.note} onChange={update('note')} />
        <button type="submit">Réserver</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  )
}

function AdminPage() {
  const [reservations, setReservations] = useState([])
  const [error, setError] = useState('')

  function load() {
    api.getAllReservations().then(setReservations).catch((e) => setError(e.message))
  }

  useEffect(load, [])

  async function validate(id) {
    setError('')
    try {
      await api.validateReservation(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function cancel(id) {
    setError('')
    try {
      await api.cancelReservation(id)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <h2>Réservations (admin)</h2>
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Nom</th><th>Date</th><th>Heure</th><th>Pers.</th><th>Statut</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.date}</td>
              <td>{r.time}</td>
              <td>{r.number_of_people}</td>
              <td>{r.statut}</td>
              <td>
                {r.statut === 'pending' && <button onClick={() => validate(r.id)}>Valider</button>}
                {r.statut !== 'cancelled' && <button onClick={() => cancel(r.id)}>Annuler</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(getUser())
  const [page, setPage] = useState('menu')

  function handleLogout() {
    clearToken()
    setUser(null)
    setPage('menu')
  }

  return (
    <div className="app">
      <Nav user={user} page={page} setPage={setPage} onLogout={handleLogout} />
      <main>
        {page === 'menu' && <MenuPage />}
        {page === 'login' && <LoginPage setPage={setPage} onLoggedIn={() => setUser(getUser())} />}
        {page === 'signup' && <SignupPage setPage={setPage} />}
        {page === 'my-reservations' && user && <MyReservationsPage />}
        {page === 'new-reservation' && user && <NewReservationPage setPage={setPage} />}
        {page === 'admin' && user?.isAdmin && <AdminPage />}
      </main>
    </div>
  )
}

export default App
