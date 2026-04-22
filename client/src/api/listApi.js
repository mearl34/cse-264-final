//put all api calls to list routes in here
const API_BASE_URL = 'http://localhost:5000'; 


export const createEntry = async (entry) => {
  const res = await fetch(`${API_BASE_URL}/entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(entry)
  })

  if (!res.ok) throw new Error("Failed to create entry")
  return await res.json()
}

//get all entries for a user
export const getEntries = async (uid) => {
  const res = await fetch(`${API_BASE_URL}/entries/${uid}`)

  if (!res.ok) throw new Error("Failed to fetch entries")
  return await res.json()
}

export const editEntry = async (entry) => {
  const res = await fetch(`${API_BASE_URL}/entries`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(entry)
  })

  if (!res.ok) throw new Error("Failed to update entry")
  return await res.json()
}

export const deleteEntry = async (id) => {
  const res = await fetch(`${API_BASE_URL}/entries/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({id})
  })

  if (!res.ok) throw new Error("Failed to delete entry")
  return await res.json()
}