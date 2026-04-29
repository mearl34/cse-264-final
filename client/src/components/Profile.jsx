import { useEffect, useState } from "react";
import {Typography, FormControl, Select, InputLabel, MenuItem, Avatar} from "@mui/material";
import { getUserByGid } from "../api/userApi";
import { getEntries } from "../api/listApi";
import BookInfo from "./BookInfo";
import { createEntry, editEntry, checkEntryExists } from "../api/listApi";
import './Profile.css'
import { deleteEntry } from "../api/listApi";

export default function Profile({uid, onLogout}) {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [entries, setEntries] = useState([]);
  const [books, setBooks] = useState({});
  const [selectedBook, setSelectedBook] = useState(null);
  const [loadingBook, setLoadingBook] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const data = await getUserByGid(uid);
      setUser(data);
      setPronouns(data.pronouns || "");
      setBio(data.bio || "");
      setIsPrivate(data.is_private || false);  // add this
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

  const handleDeleteEntry = async (id) => {
    try {
      await deleteEntry(id);
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  return (
    <div className="profile-container">
      <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 0",
        backgroundImage: "url('/assets/flowers.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "16px"
      }}>
        <Avatar
          src={user.pfp || undefined}
          sx={{ width: 96, height: 96 }}
          onError={e => e.target.src = "https://www.gravatar.com/avatar/?d=mp"}
        >
          {!user.pfp && user.username?.[0]?.toUpperCase()}
        </Avatar>

        <div style={{ backgroundColor: "#e6fde4", borderRadius: 16, marginTop: 16, padding: "12px 24px", textAlign: "center", width: "70%" }}>
          <Typography variant="h5" style={{ marginTop: 12 }}>{user.username}</Typography>
          <Typography variant="body2" color="text.secondary">{user.gmail}</Typography>

          {user.pronouns && (
            <Typography variant="body2" color="text.secondary">{user.pronouns}</Typography>
          )}
          {user.bio && (
            <Typography variant="body1" style={{ marginTop: 8 }}>{user.bio}</Typography>
          )}
        </div>
      </div>
      <div style={{ padding: "24px" }}>
        <Typography variant="h6" style={{ marginTop: 24 }}>Book List</Typography>
        {entries.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No books added yet.</Typography>
        ) : (
          <div className="book-list" style={{ marginTop: 8, width: '100%' }}>
            {entries.map(entry => {
              const book = books[entry.book_id];
              return (
                <div
                  key={entry.id}
                  style={{ display: "flex", gap: 12, marginBottom: 12 }}
                >
                  <div onClick={() => handleBookClick(entry, book)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                    {book?.thumbnail ? (
                      <img src={book.thumbnail} alt={book.title} style={{ width: 48, height: 64, objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 48, height: 64, background: "#eee" }} />
                    )}
                    <div style={{ textAlign: "left" }}>
                      <Typography variant="body1">{book?.title || entry.book_id}</Typography>
                      <Typography variant="body2" color="text.secondary">Status: {entry.status}</Typography>
                      {entry.rating && (
                        <Typography variant="body2" color="text.secondary">Rating: {entry.rating}/10</Typography>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    style={{ marginLeft: 'auto', backgroundColor: '#b63d3d', color: "#f4cccc" }}
                  >
                    Delete
                  </button>
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
      </div>

            
      { /* while editing you can update the prounouns and bio with a text box , aswell as change privacy*/ }
      {editing && (
        <div style={{ marginTop: 16 }}>
          <div>
            <label>Pronouns</label>
            <input value={pronouns} onChange={e => setPronouns(e.target.value)} placeholder="e.g. she/her" />
          </div>
          <div style={{ marginTop: 8, marginBottom: 16 }}>
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
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
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