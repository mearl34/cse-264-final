import { useEffect, useState } from "react";
import {Typography, FormControl, Select, InputLabel, MenuItem, Avatar} from "@mui/material";
import { getUserByGid } from "../api/userApi";
import { getEntries } from "../api/listApi";
import BookInfo from "./BookInfo";
import { createEntry, editEntry, checkEntryExists } from "../api/listApi";
import './Profile.css'

export default function Profile({uid, onLogout}) {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");
  const [isPrivate, setIsPrivate] = useState("");
  const [entries, setEntries] = useState([]);
  const [books, setBooks] = useState({});
  const [selectedBook, setSelectedBook] = useState(null);
  const [loadingBook, setLoadingBook] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const data = await getUserByGid(uid);
      setUser(data);
    };

    loadUser();
  }, []);

  // creating the book list of all books saved on the profile
  useEffect(() => {
    const loadEntries = async () => {
      if (!user) return;
      const data = await getEntries(user.uid);
      setEntries(data);

      // fetch book details for each entry
      const bookDetails = {};
      await Promise.all(data.map(async (entry) => {
        try {
          const res = await fetch(`https://openlibrary.org${entry.book_id}.json`);
          const book = await res.json();
          bookDetails[entry.book_id] = {
            title: book.title,
            thumbnail: book.covers?.[0]
              ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`
              : null,
          };
        } catch {
          bookDetails[entry.book_id] = { title: entry.book_id, thumbnail: null };
        }
      }));
      setBooks(bookDetails);
    };
    loadEntries();
  }, [user]);

  // by readding to list you can update rating and/or status
  const handleAddToList = async ({ book, rating, status }) => {
    try {
      const book_id = book.key;
      const check = await checkEntryExists(user.uid, book_id);
      console.log("check:", check);
      const entry = { user_id: user.uid, book_id, status, rating };

      if (check.exists) {
        await editEntry(entry);
      } else {
        await createEntry(entry);
      }
    } catch (err) {
      console.error("Failed to add/update entry:", err);
    }
  };


  // ensures that it waits until after the user is loaded before rendering
  if (!user) return <p>Loading...</p>;

  const handleSave = async () => {
    await fetch(`http://localhost:5000/users/${user.uid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        gmail: user.gmail,
        gid: user.gid,
        username: user.username,
        pronouns,
        bio,
        pfp: user.pfp,
        is_private: isPrivate,
      }),
    });
    setUser({ ...user, pronouns, bio });
    setEditing(false);
  };

  // allow for the book pop up coming from the profile page
  const handleBookClick = async (entry, book) => {
    setLoadingBook(true);
    try {
      const res = await fetch(`https://openlibrary.org${entry.book_id}.json`);
      const data = await res.json();
      setSelectedBook({
        ...book,
        key: entry.book_id,
        description: typeof data.description === "string"
          ? data.description
          : data.description?.value || "No description available",
        subjects: data.subjects || [],
        authors: book.authors || [],
        first_publish_year: data.first_publish_date || null,
      });
    } catch {
      setSelectedBook({ ...book, key: entry.book_id, authors: [], subjects: [] });
    } finally {
      setLoadingBook(false);
    }
  };

  return (
    <div className="profile-container">
      <Avatar
        src={user.pfp || undefined}
        sx={{ width: 96, height: 96 }}
        onError={e => e.target.src = "https://www.gravatar.com/avatar/?d=mp"}
      >
        {!user.pfp && user.username?.[0]?.toUpperCase()}
      </Avatar>

      <Typography variant="h5" style={{ marginTop: 12 }}>{user.username}</Typography>
      <Typography variant="body2" color="text.secondary">{user.gmail}</Typography>

      {user.pronouns && (
        <Typography variant="body2" color="text.secondary">{user.pronouns}</Typography>
      )}
      {user.bio && (
        <Typography variant="body1" style={{ marginTop: 8 }}>{user.bio}</Typography>
      )}

      <Typography variant="h6" style={{ marginTop: 24 }}>Book List</Typography>
      {entries.length === 0 ? (
        <Typography variant="body2" color="text.secondary">No books added yet.</Typography>
      ) : (
        <div style={{ marginTop: 8 }}>
          {entries.map(entry => {
            const book = books[entry.book_id];
            return (
              // submitting the book to the list on the button click
              <div
                key={entry.id}
                onClick={() => handleBookClick(entry, book)}
                style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, cursor: "pointer" }}
              >
                {book?.thumbnail ? (
                  <img src={book.thumbnail} alt={book.title} style={{ width: 48, height: 64, objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 48, height: 64, background: "#eee" }} />
                )}
                <div>
                  <Typography variant="body1">{book?.title || entry.book_id}</Typography>
                  <Typography variant="body2" color="text.secondary">Status: {entry.status}</Typography>
                  {entry.rating && (
                    <Typography variant="body2" color="text.secondary">Rating: {entry.rating}/10</Typography>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button onClick={() => setEditing(!editing)} style={{ marginTop: 12 }}>
        Edit Profile
      </button>
      <button onClick={onLogout} style={{ marginTop: 8, display: "block" }}>
        Logout
      </button>

            
      { /* while editing you can update the prounouns and bio with a text box , aswell as change privacy*/ }
      {editing && (
        <div style={{ marginTop: 16 }}>
          <div>
            <label>Pronouns</label>
            <input value={pronouns} onChange={e => setPronouns(e.target.value)} placeholder="e.g. she/her" />
          </div>
          <div style={{ marginTop: 8 }}>
            <label>Bio</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Write a short bio..." rows={3} />
          </div>

          <div>
           <FormControl size="small">
              <InputLabel>Privacy</InputLabel>

              <Select
                value={isPrivate ? "true" : "false"}
                label="Privacy"
                onChange={(e) =>
                  //get boolean value rather than text
                  setIsPrivate(e.target.value === "true")
                }
              >
                <MenuItem value="true">Private</MenuItem>
                <MenuItem value="false">Public</MenuItem>
              </Select>
            </FormControl>
          </div>
          <button onClick={handleSave} style={{ marginTop: 8 }}>Save</button>
          <button onClick={() => setEditing(false)} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      )}

      <BookInfo
        book={selectedBook}
        open={!!selectedBook || loadingBook}
        loading={loadingBook}
        onClose={() => setSelectedBook(null)}
        onAddToList={handleAddToList} 
      />
    </div>
  );
}