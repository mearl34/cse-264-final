import pg from 'pg'
import dotenv from "dotenv"

dotenv.config()


const { Client } = pg

const client = new Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }
})

await client.connect()

export const query = (text, values) => client.query(text, values)

/* 
HOW TO USE
    query(qs).then(data) => {res.json(data.rows)}
*/

//Add a new user to the database 
export const addUser = async (gmail, gid, username,pronouns, is_private) => {
  const text = `
    INSERT INTO users (gmail, gid, username, pronouns, is_private)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING uid, gmail, gid, username, pronouns, is_private;
  `

  const values = [gmail, gid, username, pronouns, is_private]

  const res = await query(text, values)
  return res.rows[0]
}

//delete a user by uid
export const deleteUser = async (uid) => {
  const text = `
    DELETE FROM users
    WHERE uid = $1
    RETURNING *;
  `
  const res = await query(text, [uid])
  return res.rows[0]
}


//return users when searched for 
export const searchUsers = async (username) => {
  const text = `
    SELECT *
    FROM users
    WHERE username ILIKE $1;
  `
  const values = [`%${username}%`]

  const res = await query(text, values)
  return res.rows
}

//returns user based on gid
export const getUser = async (gid) => {
  const text = `
    SELECT *
    FROM users
    WHERE gid = $1;
  `
  const values = [gid]

  const res = await query(text, values)
  return res.rows[0]
}

//edit a user, replacing all fields with input data
export const editUser = async (uid, gmail, gid, username, pronouns, is_private) => {
  const text = `
    UPDATE users
    SET 
      gmail = $1,
      gid = $2,
      username = $3,
      pronouns = $4
      is_private = $6
    WHERE uid = $5
    RETURNING *;
  `

  const values = [gmail, gid, username, pronouns, uid, is_private]

  const res = await query(text, values)
  return res.rows[0]
}


//////////////////////////////////////List entry//////////////////////////////

export const createEntry = async (uid, book_id, status, rating) => {
  const text = `
    INSERT INTO list_entries (uid, book_id, status, rating)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `

  const values = [uid, book_id, status, rating]

  const res = await query(text, values)
  return res.rows[0]
}


export const editEntry = async (uid, book_id, status, rating) => {
  const text = `
    UPDATE list_entries
    SET 
      status = $1,
      rating = $2
    WHERE uid = $3 AND book_id = $4
    RETURNING *;
  `

  const values = [status, rating, uid, book_id]

  const res = await query(text, values)
  return res.rows[0]
}


export const deleteEntry = async (id) => {
  const text = `
    DELETE FROM list_entries
    WHERE id = $1
    RETURNING *;
  `

  const res = await query(text, [uid, book_id])
  return res.rows[0]
}


export const getEntries = async (uid) => {
  const text = `
    SELECT *
    FROM list_entries
    WHERE uid = $1;
  `

  const res = await query(text, [uid])
  return res.rows
}