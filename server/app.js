import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import session from "express-session";
import passport from "passport";
import authRoutes from "./auth.js";

import { query, searchUsers,getUser, addUser, editUser, deleteUser ,createEntry , editEntry , deleteEntry } from './db/postgres.js';

// create the app
const app = express()
// it's nice to set the port number so it's always the same
app.set('port', process.env.PORT || 5000);
// set up some middleware to handle processing body requests
app.use(express.json())
// set up some midlleware to handle cors
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
//allow sessions for auth   
app.use(passport.initialize());
app.use(passport.session());


//auth routes
app.use("/auth", authRoutes);


// base route
app.get('/', (req, res) => {
    res.send("Welcome to the Job Application Tracker API!!!")
})


app.get('/up', (req, res) => {
  res.json({status: 'up'})
})
//create a user with suplied json
app.post("/users", async (req, res) => {
  try {
    const { gmail, gid, username,pronouns } = req.body

    const user = await addUser(gmail, gid, username,pronouns)
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to create user" })
  }
})

//update a user with supplied json
app.put("/users/:uid", async (req, res) => {
  try {
    const { uid } = req.params
    const { gmail, gid, username,pronouns,is_private } = req.body

    const updated = await editUser(uid, gmail, gid, username,pronouns,is_private)
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Update failed" })
  }
})

//delte user by uid
app.delete("/users/:uid", async (req, res) => {
  try {
    const { uid } = req.params

    const deleted = await deleteUser(uid)
    res.json(deleted)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Delete failed" })
  }
})



//Search for user by username, like:
//GET /users/search?username=anthony
//When no argument is given will return all users
app.get("/users/search", async (req, res) => {
  try {
    const { username } = req.query

    const users = await searchUsers(username || "")
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Search failed" })
  }
})

app.get("/users/:gid", async (req, res) => {
  try {
    const { gid } = req.params

    const user = await getUser(gid)
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Search failed" })
  }
})
/////////////////////////ListEntry Routes///////////////////////////

//create an entry for a user
app.post("/entries", async (req, res) => {
  try {
    const { user_id, book_id, status, rating } = req.body

    const entry = await createEntry(user_id, book_id, status, rating)
    res.json(entry)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to create entry" })
  }
})

//get entries by user
app.get("/entries/:uid", async (req, res) => {
  try {
    const { uid } = req.params

    const entries = await getEntries(uid)
    res.json(entries)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to fetch entries" })
  }
})


//update an entry
app.put("/entries", async (req, res) => {
  try {
    const { uid, book_id, status, rating } = req.body

    const updated = await editEntry(uid, book_id, status, rating)
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to update entry" })
  }
})
//delete an entry
app.delete("/entries/:id", async (req, res) => {
  try {
    const {id} = req.params

    const deleted = await deleteEntry(id)
    res.json(deleted)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Failed to delete entry" })
  }
})



app.use("/auth", authRoutes);

app.listen(app.get('port'), () => {
    console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
    console.log('  Press CTRL-C to stop\n');
  });
  