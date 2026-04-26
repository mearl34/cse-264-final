import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { getUserByGid } from "../api/userApi";
import { getEntries } from "../api/listApi";

export default function Profile({uid, onLogout}) {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");
  const [entries, setEntries] = useState([]);
  const [books, setBooks] = useState({});

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
        is_private: user.is_private,
      }),
    });
    setUser({ ...user, pronouns, bio });
    setEditing(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <img
        src={user.pfp}
        alt={user.username}
        onError={e => e.target.src = "https://www.gravatar.com/avatar/?d=mp"}
        style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }}
      />

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
              <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                {book?.thumbnail ? (
                  <img src={book.thumbnail} alt={book.title} style={{ width: 48, height: 64, objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 48, height: 64, background: "#eee" }} />
                )}
                <div>
                  <Typography variant="body1">{book?.title || entry.book_id}</Typography>
                  <Typography variant="body2" color="text.secondary">Status: {entry.status}</Typography>
                  {entry.rating && (
                    <Typography variant="body2" color="text.secondary">Rating: {entry.rating}/5</Typography>
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

            
      { /* while editing you can update the prounouns and bio with a text box */ }
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
          <button onClick={handleSave} style={{ marginTop: 8 }}>Save</button>
          <button onClick={() => setEditing(false)} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      )}
    </div>
  );
}