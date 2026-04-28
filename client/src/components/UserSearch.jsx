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
import UserInfo from "./UserInfo";


export default function UserSearch({ user, isAdmin }) {
    //states for search bar
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

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
    
    <Box sx={{ width: "100%"}}>
      
      {/* surrounding box for the search */}
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", flexDirection: 'column' }}>
        
        {/* Main search box for users*/}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <SearchBar onSearch={handleSearch} text="Search Users" />
        </Box>

        {/* When Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Results list*/}
        <List sx={{ mt: 3, mb: 5, width: "100%" }}>
          {results.map((user) => (
            <div key={user.uid}>
              <ListItem disablePadding>
                {/* Pass the selected user for profile pop up */}
                <ListItemButton onClick={() => setSelectedUser(user)}>
                  
                  <ListItemAvatar>
                    <Avatar
                      src={user.pfp || undefined}
                      sx={{ width: 60, height: 60 }}
                    >
                      {!user.pfp && user.username?.[0]?.toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    sx={{
                      
                          ml: 3,
                          "& .MuiListItemText-primary": {
                            fontSize: "24px",
                            fontFamily: "Instrument Serif",
                            fontWeight: 550,
                          },
                          "& .MuiListItemText-secondary": {
                            fontSize: "0.9rem",
                            fontFamily: "Instrument Serif",
                          },
                        }}
                    primary={user.username}
                    secondary={user.gmail}
                  />

                </ListItemButton>

                {/* ADMIN DELETE BUTTON */}
                {isAdmin && (
                  <Button
                    color="error"
                    onClick={() => handleDelete(user.uid)}
                    
                    sx={{mr: 3, backgroundColor: "#b63d3d", color: "#f4cccc", fontFamily: "Instrument Serif"}}
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
      { /* adding the pop up with the other user's profiles */ }
      <UserInfo
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        currentUserUid={user?.uid}
      />
    </Box>
  )
}