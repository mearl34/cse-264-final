import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { getUserByGid } from "../api/userApi";

export default function Profile({uid}) {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const data = await getUserByGid(uid);
      setUser(data);
    };

    loadUser();
  }, []);

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
      { /* user profile picture */ }
      <img
        src={user.pfp}
        alt={user.username}
        onError={e => e.target.src = "https://www.gravatar.com/avatar/?d=mp"}
        style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }}
      />

      <Typography variant="h5" style={{ marginTop: 12 }}>
        {user.username}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {user.gmail}
      </Typography>

      { /* only renders profile and bio if they're not null */ }
      {user.pronouns && (
        <Typography variant="body2" color="text.secondary">
          {user.pronouns}
        </Typography>
      )}

      {user.bio && (
        <Typography variant="body1" style={{ marginTop: 8 }}>
          {user.bio}
        </Typography>
      )}

      { /* added button to update profile info (pronouns and bio) */ } 
      <button onClick={() => setEditing(!editing)} style={{ marginTop: 12 }}>
        Edit Profile
      </button>
      
      { /* while editing you can update the prounouns and bio with a text box */ }
      {editing && (
        <div style={{ marginTop: 16 }}>
          <div>
            <label>Pronouns</label>
            <input
              value={pronouns}
              onChange={e => setPronouns(e.target.value)}
              placeholder="e.g. she/her"
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Write a short bio..."
              rows={3}
            />
          </div>

          {/* new info is saved on the save button and it leaves the editing state */ }
          <button onClick={handleSave} style={{ marginTop: 8 }}>Save</button>
          <button onClick={() => setEditing(false)} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      )}
    </div>
  );
}