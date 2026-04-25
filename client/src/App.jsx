import {useState, useEffect} from 'react'
import Home from './components/Home'


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
    <div>
      {user ? (
        <Home user={user} />
      ) : (
        <div>
          <h1>Bookworm📖🪱</h1>
          <button onClick={handleLogin}>Sign in with Google</button>
        </div>
      )}
    </div>
  )
   
}

export default App;
