import {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import Profile from './components/Profile'

function App() {
  const [apiStatus, setAPIStatus] = useState()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // checking if the user is already logged in when the app loads
    fetch('http://localhost:5000/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null))
  }, [])

  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/google'
  }

  return (
    <BrowserRouter>
      <div>
        {user ? (
          <>
            <nav style={{ padding: 16, borderBottom: '1px solid #ccc', display: 'flex', gap: 16 }}>
              <Link to="/">Home</Link>
              <Link to="/profile">Profile</Link>
            </nav>
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/profile" element={
                <Profile
                  uid={user.gid}
                  onLogout={() => window.location.href = 'http://localhost:5000/auth/logout'}
                />}
              />
            </Routes>
          </>
        ) : (
          <div>
            <h1>Bookworm📖🪱</h1>
            <button onClick={handleLogin}>Sign in with Google</button>
          </div>
        )}
      </div>
    </BrowserRouter>
  )
   
}

export default App;
