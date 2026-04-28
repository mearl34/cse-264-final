import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import BookInfo from "./BookInfo";
import { getEntries, createEntry, editEntry, checkEntryExists } from "../api/listApi";

export default function UserInfo({ user, open, onClose, currentUserUid }) {
  const [entries, setEntries] = useState([]);
  const [books, setBooks] = useState({});
  const [selectedBook, setSelectedBook] = useState(null);
  const [loadingBook, setLoadingBook] = useState(false);

  useEffect(() => {
    if (!user) return;
    const loadEntries = async () => {
      const data = await getEntries(user.uid);
      setEntries(data);

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



  //When fetching book in this way, authors are stored differently when when accesed with our backend call, 
  //this means authors cannot be obtained without extra calls, which wont be done to save on API use (faster access)
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
        authors: book.authors || ["api Issue prevents authors here"],
        first_publish_year: data.first_publish_date || null,
      });
    } catch {
      setSelectedBook({ ...book, key: entry.book_id, authors: [], subjects: [] });
    } finally {
      setLoadingBook(false);
    }
  };

  const handleAddToList = async ({ book, rating, status }) => {
    try {
      const book_id = book.key;
      const check = await checkEntryExists(currentUserUid, book_id);
      const entry = { user_id: currentUserUid, book_id, status, rating };
      if (check.exists) {
        await editEntry(entry);
      } else {
        await createEntry(entry);
      }
    } catch (err) {
      console.error("Failed to add/update entry:", err);
    }
  };

  return (
    <>
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="sm"
          fullWidth
          slotProps={{
            paper: {
              sx: {
                borderRadius: "32px !important",
                overflow: "hidden",
                backgroundColor: "#E2FEFF",
              },
            },
          }}
        > {/**dialog is actually paper, so needs to be passed */}
        <DialogContent sx={{p:0, backgroundColor: "#E2FEFF",borderRadius: 8}}>
            <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8 }}>
            <CloseIcon />
            </IconButton>

            {user && (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 0 ,maxWidth: "100%", overflowX: "hidden" }}>
              <Box sx={{ width: "100%",display: "flex", flexDirection: "column", alignItems: "center", m: "0px", pt: 2, pb: 2, backgroundImage: "url('/assets/flowers.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center -50px",
                    width: "100%",}}>
                  <Avatar
                  src={user.pfp || undefined}
                  sx={{ width: 96, height: 96 }}
                  onError={e => e.target.src = "https://www.gravatar.com/avatar/?d=mp"}
                  >
                  {!user.pfp && user.username?.[0]?.toUpperCase()}
                  </Avatar>
                  <Box sx ={{backgroundColor: "#e6fde4", color: "#243a2b", width: "70%", display: "flex", flexDirection: "column", alignItems: "center", borderRadius: 8, mt: 2, p:1}}>
                    <Typography sx={{fontFamily: "Instrument Serif"}} variant="h5" >{user.username}</Typography>
                    <Typography sx={{fontFamily: "Instrument Serif"}} variant="body2" color="text.secondary">{user.gmail}</Typography>

                    {user.pronouns && (
                    <Typography sx={{fontFamily: "Instrument Serif"}} variant="body2" color="text.secondary">{user.pronouns}</Typography>
                    )}
                    {user.bio && (
                    <Typography  variant="body1" sx={{ mt: 1, textAlign: "center", fontFamily: "Instrument Serif" }}>{user.bio}</Typography>
                    )}
                  </Box>
              </Box>
             <Box sx={{ width: "100%", px: 2, py: 2 }}>
  
              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  mb: 1,
                  textAlign: "left",
                  fontWeight: 600,
                  ml: 3,
                  fontFamily: "Instrument Serif",
                   color: "#243a2b"
                }}
              >
                Book List
              </Typography>

              {entries.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "left", ml: 3}}>
                  No books added yet.
                </Typography>
              ) : (
                <Box sx={{ width: "100%", mt: 1, ml: 2 }}>
                  {entries.map((entry) => {
                    const book = books[entry.book_id];

                    return (
                      <Box
                        key={entry.id}
                        onClick={() => handleBookClick(entry, book)}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                          mb: 2,
                          cursor: "pointer",
                          p: 1,
                          borderRadius: 1,
                          "&:hover": {
                            backgroundColor: "action.hover",
                          },
                        }}
                      >
                        {/* Cover */}
                        {book?.thumbnail ? (
                          <img
                            src={book.thumbnail}
                            alt={book.title}
                            style={{ width: 48, height: 64, objectFit: "cover" }}
                          />
                        ) : (
                          <Box sx={{ width: 48, height: 64, bgcolor: "grey.200" }} />
                        )}

                        {/* Text */}
                        <Box sx={{ textAlign: "left" }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 , fontFamily: "Instrument Serif", color: "#243a2b"}}>
                            {book?.title || entry.book_id}
                          </Typography>

                          <Typography variant="body2" color="text.secondary" sx={{fontFamily: "Instrument Serif", color: "#243a2b"}}>
                            Status: {entry.status}
                          </Typography>

                          {entry.rating && (
                            <Typography variant="body2" color="text.secondary" sx={{fontFamily: "Instrument Serif", color: "#243a2b"}}>
                              Rating: {entry.rating}/10
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
            </Box>
            )}
        </DialogContent>
        </Dialog>
        <BookInfo
            book={selectedBook}
            open={!!selectedBook || loadingBook}
            loading={loadingBook}
            onClose={() => setSelectedBook(null)}
            onAddToList={currentUserUid ? handleAddToList : null}
        />
    </>
  );
}