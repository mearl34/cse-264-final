//put all api calls to user routes in here
const API_BASE_URL = 'http://localhost:5000'; 


export const createUser = async (user) => {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })

  if (!res.ok) throw new Error("Failed to create user")
  return await res.json()
}


export const searchUsers = async (username) => {
  const res = await fetch(
    `${API_BASE_URL}/users/search?username=${encodeURIComponent(username)}`
  )

  if (!res.ok) throw new Error("Search failed")
  return await res.json()
}

export const editUser = async (uid, userData) => {
  const res = await fetch(`${API_BASE_URL}/users/${uid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  })

  if (!res.ok) throw new Error("Failed to update user")
  return await res.json()
}

export const deleteUser = async (uid) => {
  const res = await fetch(`${API_BASE_URL}/users/${uid}`, {
    method: "DELETE"
  })

  if (!res.ok) throw new Error("Failed to delete user")
  return await res.json()
}