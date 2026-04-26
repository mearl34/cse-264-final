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
    <div>
      <h1>Welcome to bookworm yay!</h1>


      {/**toggle to switch between search bars */}
      <ToggleButtonGroup
        value={searchType}
        exclusive
        onChange={(e, newValue) => {
          if (newValue !== null) setSearchType(newValue);
        }}
        sx={{ mb: 2 }}
      >
        <ToggleButton value="books">Books</ToggleButton>
        <ToggleButton value="users">Users</ToggleButton>
    </ToggleButtonGroup>
      {searchType === "books" ? (
    <>
      <BookSearch onSearch={handleSearch} text="Search Books" />

          <List sx={{ mt: 2 }}>
            
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
              books.map((book) => (
                <div key={book.id}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleBookClick(book)}>

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
                        primary={book.title}
                        secondary={book.authors?.join(", ") || "Unknown author"}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />

                    </ListItemButton>
                  </ListItem>

                  <Divider />
                </div>
              ))}

            {/* Empty state */}
            {!loadingBooks && hasSearched && books.length === 0 && (
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
        </>
    ) : (
      <UserSearch />
    )}
    </div>
  )
}

export default Home;