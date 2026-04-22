//Component Featuring a search bar which allows the user to view a list users matching thier search criteria

import { useState } from "react"
import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  CircularProgress
} from "@mui/material"

import { searchUsers } from "../api/userApi"

export default function UserSearch() {
    //states for search bar
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (value) => {
    setQuery(value)

    //trim input to be safe
    if (value.trim() === "") {
        setResults([])
        setLoading(false)
        return
    }

    setLoading(true)
    try {
      const users = await searchUsers(value)
      setResults(users)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    // center box for now
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center", 
        alignItems: "center",
        
      }}
    >
      
      {/* surrounding box for the search */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 700,
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: 3,
          p: 4
        }}
      >
        
        {/* Main search box for users*/}
        <TextField
          fullWidth
          label="Search users"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* When Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Results list*/}
        <Stack spacing={2} mt={3}>
          {results.map((user) => (
            <Card key={user.uid} variant="outlined">
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Avatar
                  src={user.pfp || undefined}
                  sx={{ width: 40, height: 40 }}
                >
                  {!user.pfp && user.username?.[0]?.toUpperCase()}
                </Avatar>

                <Typography fontWeight={600}>
                  {user.username}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* If no users found */}
        {!loading && query && results.length === 0 && (
          <Typography sx={{ mt: 2, textAlign: "center", color: "gray" }}>
            No users found
          </Typography>
        )}
      </Box>
    </Box>
  )
}