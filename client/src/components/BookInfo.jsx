import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";




//Popup for when a book is clicked. Displays additional data aswell as allowing user to add book to list
export default function BookInfo({ book, open, onClose, loading, onAddToList }) {
  if (!book) return null;

    //states for dropdowns
    const [rating, setRating] = useState(null);
    const [status, setStatus] = useState("");
   



  console.log(book);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{fontFamily: "'Instrument Serif', serif", fontSize: "28px", backgroundColor: "#43797B",color: "#E2FEFF"}}>{book.title}</DialogTitle>

      <DialogContent dividers sx={{backgroundColor: "#E2FEFF"}}>
        {/**load while data is fetched ... fetch was moved to home, so not really needed now, but here for safety */}
        {loading ? (
            <CircularProgress />
            ) : (
            <>
                <Box sx={{ display: "flex", gap: 3 }}>

                    {/* IMAGE */}
                    {book.thumbnail ? (
                    <img src={book.thumbnail} alt={book.title} width={100} />
                    ) : (
                    <Box
                        sx={{
                        width: 100,
                        height: 150,
                        bgcolor: "grey.300",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 1,
                        }}
                    >
                        <Typography variant="caption">No Cover</Typography>
                    </Box>
                    )}

                    {/* RIGHT SIDE */}
                    <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        flex: 1,
                        minWidth: 0,
                        
                        justifyContent: "center",
                        alignContent: "center"
                    }}
                    >

                    {/* SELECTS ROW */}
                    <Box sx={{display: "flex", justifyContent: "center"}}>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel sx={{
                            fontFamily: "'Instrument Serif', serif",

                            color: "#3e7051", // default label color

                            "&.Mui-focused": {
                            color: "#2f5540", // when clicked / active
                            },

                            "&.MuiInputLabel-shrink": {
                            color: "#2f5540", // when value is selected (stays floated)
                            },
                        }}>Rating</InputLabel>
                        <Select
                            value={rating ?? ""}
                            label="Rating"
                            onChange={(e) => {
                            const val = e.target.value;
                            setRating(val === "" ? null : val);
                            }}
                            sx={{ fontFamily: "'Instrument Serif', serif",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#3e7051", // default border
                                },

                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#2f5540", // hover
                                },

                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#2f5540", // focused
                                    borderWidth: "2px",
                                },



                            }}
                        >
                            <MenuItem value="">
                            <em>None</em>
                            </MenuItem>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                            <MenuItem key={num} value={num}>
                                {num}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel sx={{
                            fontFamily: "'Instrument Serif', serif",

                            color: "#3e7051", // default label color

                            "&.Mui-focused": {
                            color: "#2f5540", // when clicked / active
                            },

                            "&.MuiInputLabel-shrink": {
                            color: "#2f5540", // when value is selected 
                            },
                        }}>Status</InputLabel>
                        <Select 
                            value={status}
                            label="Status"
                            onChange={(e) => setStatus(e.target.value)}
                            sx={{ fontFamily: "'Instrument Serif', serif",
                                "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#3e7051", // default border
                            },

                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#2f5540", // hover
                            },

                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#2f5540", // focused
                                borderWidth: "2px",
                            },






                             }}
                        >
                            <MenuItem value="want to read">Want to read</MenuItem>
                            <MenuItem value="reading">Reading</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="dropped">Dropped</MenuItem>
                        </Select>
                        </FormControl>
                    </Box>

                    {/* BUTTON */}
                    <Box
                        
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            
                            width: "100%",
                            mt: 0
                        }}
                        >
                        <Button
                            variant="contained"
                            sx={{ fontFamily: "'Instrument Serif', serif", backgroundColor: "#3e6a6b",color: "#E2FEFF" }}
                            disabled={!status}
                           
                            onClick={() => {
                            onAddToList({ book, rating, status });
                            onClose();
                            }}
                        >
                            Add to List
                        </Button>
                        </Box>

                    </Box>
                </Box>

                {/**Display the top 5 subjects, can display more, but 5 is nice*/}
                {book.subjects && book.subjects.length > 0 && (
                     <Box
                        sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 2,
                        
                        }}
                    >
                        {book.subjects.slice(0, 5).map((subject, idx) => (
                        <Chip
                            key={idx}
                            label={subject}
                            size="small"
                            variant="outlined"
                            sx={{fontFamily: "'Instrument Serif', serif", backgroundColor: "#43797B",color: "#E2FEFF"}}
                        />
                        ))}
                    </Box>
                    )}

                {/** display info if available */}
                <Box>
                    <Typography variant="body1" sx={{fontFamily:  "'Instrument Serif', serif", fontSize: "20px", color: "#243a2b"}}>
                    <strong>Authors:</strong> {book.authors.join(", ")}
                    </Typography>

                    {book.first_publish_year && (
                    <Typography variant="body2"  sx={{fontFamily:  "'Instrument Serif', serif", fontSize: "18px", color: "#243a2b"}}>
                        <strong>First Published:</strong> {book.first_publish_year}
                    </Typography>
                    )}
                </Box>

                {book.description && (
                <Box mt={2} >
                    <Typography variant="body2"  sx={{fontFamily:  "'Instrument Serif', serif", color: "#243a2b"}}>
                    <strong>Description:</strong> {book.description}
                    </Typography>
                </Box>
                )}
            </>
        )}
      </DialogContent>

      <DialogActions sx={{backgroundColor: "#8bad92",  backgroundImage: "url('/assets/flowers.jpg')",backgroundSize: "100% auto",}}>
        <Button onClick={onClose} variant="contained"  sx={{fontFamily:  "'Instrument Serif', serif",  backgroundColor: "#3e6a6b",color: "#E2FEFF"}}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}