import { useState, useEffect } from 'react';
import BookSearch from '../components/BookSearch';
import BookInfo from './BookInfo';
import { createEntry, editEntry, checkEntryExists } from '../api/listApi';
import UserSearch from './UserSearch';
import { ToggleButton, 
  ToggleButtonGroup, 
  Box, 
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Paper,
  CircularProgress } from "@mui/material";

function Home({ user }) {
  const [books, setBooks] = useState([]);
  //state for book popup dialog
  const [selectedBook, setSelectedBook] = useState(null);
  const [loadingBook, setLoadingBook] = useState(false);

  //state for search type
  const [searchType, setSearchType] = useState("books");
  //loading for search
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  //State for if user is admin
  const [isAdmin,setIsAdmin] = useState(false);


  //if user is an admin, set state at app start to render new actions
  useEffect(() => {
      if (user?.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }, []);



  useEffect(() => {
  if (searchType !== "books") {
    setBooks([]);
    setHasSearched(false);
  }
  }, [searchType]);


  console.log(user);


 const handleSearch = async (value) => {

    if (!value.trim()) {
      setBooks([]);
      setHasSearched(false);
      return;
    }

    setLoadingBooks(true);
    setHasSearched(true);
    try {
      const res = await fetch(
        `http://localhost:5000/books/search?q=${encodeURIComponent(value)}`
      );

      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
      setBooks([]);
    } finally {
      setLoadingBooks(false);
    }
  };

  
  //function to handle request for additional book info
  //Open Library's search returns little info, so further info needs to be requested
  const handleBookClick = async (book) => {
    setLoadingBook(true);

    try {
        if (!book.key) {
          console.error("Missing book.key", book);
          setSelectedBook(book);
          return;
        }

        const url = `https://openlibrary.org${book.key}.json`;

        const res = await fetch(url);
        const data = await res.json();

        setSelectedBook({
          ...book,
          description:
            typeof data.description === "string"
              ? data.description
              : data.description?.value || "No description available",
          subjects: data.subjects || [],
          firstPublishDate: data.first_publish_date
        });
      } catch (err) {
        console.error("Failed to fetch book details:", err);
        setSelectedBook(book);
      } finally {
        setLoadingBook(false);
      }
  };


  //helper function for book info
 const handleAddToList = async ({ book, rating, status }) => {
  try {
    const user_id = user.uid;
    const book_id = book.key;

    //check if entry exists
    const check = await checkEntryExists(user_id, book_id);

    const entry = {
      user_id,
      book_id,
      status,
      rating,
    };
    //if it exists update
    if (check.exists) {
      const updated = await editEntry(entry);
      console.log("Entry updated:", updated);
    } else {
       //if not add it
      const created = await createEntry(entry);
      console.log("Entry created:", created);
    }
  } catch (err) {
    console.error("Failed to add/update entry:", err);
  }
};

  return (
    <Box
  sx={{
    minHeight: "100vh",
    minWidth: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    
    pt: 8, // pushes content down from top a bit
  }}
>
  <Paper
    elevation={3}
    sx={{
      width: "90%",
      p: 0,
      borderRadius: 3,
      display: 'flex',
      flexDirection: 'column',
      alignItems: "center",
      overflow: "hidden",
      mb: 20,
      backgroundColor: "#d9bbad",
      minHeight: 350
    }}
  >
    <Box
      sx={{
        backgroundImage: "url('/assets/flowers.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center -50px",
        width: "100%",
        py: 2,
        mx: 0,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
    >
    <Typography
      variant="h4"
      sx={{
        textAlign: "center",
        fontWeight: 600,
        color: "white",
        
        fontFamily: "Instrument Serif"
      }}
    >
      Welcome to Bookworm!
    </Typography>
    <Typography
      sx={{
        textAlign: "center",
        fontWeight: 300,
        color: "white",
        
        fontFamily: "Instrument Serif"
      }}>
      
      Search for a book or user to expand your reading list.
    </Typography>
    
    </Box>
      <Box
        sx={{display: "flex", alignItems: "center", justifyContent: "center",gap: 2,}}
      >
        <img src="/assets/ladybug.png" alt="ladybug" style={{transform: "scaleX(-1)", height: "50px"}}/>
      
        {/**toggle to switch between search bars */}
        <ToggleButtonGroup
          value={searchType}
          exclusive
          onChange={(e, newValue) => {
            if (newValue !== null) setSearchType(newValue);
          }}
          sx={{ mb: 2,mt: 2, backgroundColor: '#8bad92'}}
        >
          <ToggleButton sx={{fontFamily: "Instrument Serif",fontWeight: 600,}} value="books">Books</ToggleButton>
          <ToggleButton sx={{fontFamily: "Instrument Serif",fontWeight: 600,}} value="users">Users</ToggleButton>
        </ToggleButtonGroup>
           <img src="/assets/ladybug.png" alt="ladybug"   style={{ height: "50px",}}/>
      </Box>
      {searchType === "books" ? (
    <>
      <BookSearch onSearch={handleSearch} text="Search Books" />

          <List sx={{ mt: 3, mb: 5, width: "100%" }}>
            
            {/* Loading state */}
            {loadingBooks && (
              <ListItem>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              </ListItem>
            )}

            {/* Book results */}
            {!loadingBooks &&
              Array.isArray(books) &&
              books.map((book) => (
                <div key={book.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleBookClick(book)}
                      sx={{
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                        alignItems: "flex-start",
                        minWidth: 0,
                      }}
                    >

                      {/* Cover */}
                      <ListItemAvatar>
                        {book.thumbnail ? (
                          <Avatar
                            variant="square"
                            src={book.thumbnail}
                            sx={{ width: 60, height: 90 }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 60,
                              height: 90,
                              bgcolor: "grey.300",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 1,
                            }}
                          >
                            <Typography variant="caption">
                              No Cover
                            </Typography>
                          </Box>
                        )}
                      </ListItemAvatar>

                      {/* Text */}
                      <ListItemText
                        sx={{
                          minWidth: 0,
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
                        primary={book.title}
                        secondary={book.authors?.join(", ") || "Unknown author"}

                      />

                    </ListItemButton>
                  </ListItem>

                  <Divider />
                </div>
              ))}

            {/* Empty state */}
            {!loadingBooks && hasSearched && (!books || books.length === 0) && (
              <ListItem>
                <ListItemText
                  primary="No books found"
                  secondary="Try a different search term"
                  primaryTypographyProps={{
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                  secondaryTypographyProps={{
                    textAlign: "center",
                    color: "text.disabled",
                  }}
                />
              </ListItem>
            )}

          </List>
          
          <BookInfo
            book={selectedBook}
            open={!!selectedBook || loadingBook}
            loading={loadingBook}
            onClose={() => setSelectedBook(null)}
            onAddToList={handleAddToList}
          />

          {hasSearched && books.length > 0 && (
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src="/assets/endWorm.png"
                alt="Search successful"
                style={{
                  width: "100%",
                  maxWidth: 300,
                  borderRadius: 12,
                }}
              />
            </Box>
          )}
        </>
    ) : (
      // pass current user object
      <UserSearch user={user} isAdmin={isAdmin} />
    )}
    </Paper>
    </Box>
  )
}

export default Home;