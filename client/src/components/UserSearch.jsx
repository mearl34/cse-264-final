//Component Featuring a search bar which allows the user to view a list users matching thier search criteria

import { useState } from "react"
import {
  Box,
  Avatar,
  CircularProgress,
   List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button
} from "@mui/material"

import { searchUsers, deleteUser} from "../api/userApi"
import SearchBar from "./BookSearch";



export default function UserSearch({isAdmin}) {
    //states for search bar
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (value) => {
  setQuery(value);

  if (value.trim() === "") {
    setResults([]);
    setLoading(false);
    return;
  }

  setLoading(true);
  try {
    const users = await searchUsers(value);
    if(isAdmin){
      setResults(users); // ignore privacy for admins
    }
    else{
      const publicUsers = users.filter(user => user.is_private !== true);
      setResults(publicUsers);
    }
    
    
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  //allows admin to delete users if nessisary
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);

      // remove from UI instantly
      setResults((prev) => prev.filter((u) => u.uid !== id));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };
  return (
    // center box for now
    <Box
    >
      
      {/* surrounding box for the search */}
      <Box
      
      >
        
        {/* Main search box for users*/}
        <SearchBar onSearch={handleSearch} text="Search Users" />

        {/* When Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Results list*/}
        <List sx={{ mt: 3 }}>
          {results.map((user) => (
            <div key={user.uid}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => console.log(user)}>

                  <ListItemAvatar>
                    <Avatar
                      src={user.pfp || undefined}
                      sx={{ width: 40, height: 40 }}
                    >
                      {!user.pfp && user.username?.[0]?.toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={user.username}
                    secondary={user.gmail}
                  />

                </ListItemButton>

                {/* ADMIN DELETE BUTTON */}
                {isAdmin && (
                  <Button
                    color="error"
                    onClick={() => handleDelete(user.uid)}
                  >
                    Delete
                  </Button>
                )}
              </ListItem>

              <Divider />
            </div>
          ))}

          {!loading && query && results.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No users found"
                primaryTypographyProps={{
                  color: "text.secondary",
                  textAlign: "center",
                }}
              />
            </ListItem>
          )}
        </List>

      </Box>
    </Box>
  )
}