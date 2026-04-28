import {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './components/Home'
import Profile from './components/Profile'
import './App.css'
import { motion } from 'framer-motion'
import { Typography, Box } from '@mui/material'

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
            <Box sx={{ display: 'flex', backgroundColor: "#43797B", marginTop: "0px", height: "120px", flexDirection: "row", alignItems: "center", justifyContent: "top" }}>
              <Typography sx={{ fontFamily: "Instrument Serif", fontSize: '96px', fontWeight: "300", letterSpacing: '5%', color: "#E2FEFF"}}>
                Bookworm
              </Typography>
            </Box>
            <nav
              style={{
                padding: 16,
                display: "flex",
                gap: 16,
                backgroundColor: "#3e6a6b",
              }}
            >
              <NavLink
                to="/"
                style={({ isActive }) => ({
                  color: "#E2FEFF",
                  textDecoration: "none",
                  fontWeight: isActive ? "700" : "400",
                  borderBottom: isActive ? "2px solid #E2FEFF" : "none",
                })}
              >
                Home
              </NavLink>

              <NavLink
                to="/profile"
                style={({ isActive }) => ({
                  color: "#E2FEFF",
                  textDecoration: "none",
                  fontWeight: isActive ? "700" : "400",
                  borderBottom: isActive ? "2px solid #E2FEFF" : "none",
                })}
              >
                Profile
              </NavLink>
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
            <motion.img
              src="/assets/Login.png"
              alt="Sign in with Google"
              onClick={handleLogin}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{ cursor: 'pointer', width: '70%', display: 'block', margin: '0 auto' }}
            />
          </div>
        )}
      </div>
    </BrowserRouter>
  )
   
}

export default App;
