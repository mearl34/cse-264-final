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

export default function BookInfo({ book, open, onClose, loading, onAddToList }) {
  if (!book) return null;

    //states for dropdowns
    const [rating, setRating] = useState("");
    const [status, setStatus] = useState("");



  console.log(book);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{book.title}</DialogTitle>

      <DialogContent dividers>
        {loading ? (
            <CircularProgress />
            ) : (
            <>
                <Box display="flex" gap={2}>
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                     {book.thumbnail && (
                        <img src={book.thumbnail} alt={book.title} width={100} />
                    )}
                <Box sx={{display: 'flex', flexDirection: 'column'}}>

                
                   


                    <Box mt={3} display="flex" gap={2} flexwrap="wrap" >
                        {/* Rating dropdown */}
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Rating</InputLabel>
                            <Select
                            value={rating}
                            label="Rating"
                            onChange={(e) => setRating(e.target.value)}
                            >
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                <MenuItem key={num} value={num}>
                                {num}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>

                        {/* Status dropdown */}
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                            value={status}
                            label="Status"
                            onChange={(e) => setStatus(e.target.value)}
                            >
                            <MenuItem value="want_to_read">Want to read</MenuItem>
                            <MenuItem value="reading">Reading</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                            <MenuItem value="dropped">Dropped</MenuItem>
                            </Select>
                        </FormControl>
                        </Box>

                        <Button
                            variant="contained"
                            disabled={!rating || !status}
                            onClick={() => {
                                onAddToList({
                                book,
                                rating,
                                status,
                                });
                                onClose();
                            }}
                            >
                            Add to List
                            </Button>
                
                </Box>
                </Box>
                {/**Display the top 5 subjects */}
                {book.subjects && book.subjects.length > 0 && (
                     <Box
                        sx={{
                        display: "flex",
                        flexwrap: "wrap",
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
                        />
                        ))}
                    </Box>
                    )}


                <Box>
                    <Typography variant="body1">
                    <strong>Authors:</strong> {book.authors.join(", ")}
                    </Typography>

                    {book.first_publish_year && (
                    <Typography variant="body2">
                        <strong>First Published:</strong> {book.first_publish_year}
                    </Typography>
                    )}
                </Box>
                </Box>

                {book.description && (
                <Box mt={2}>
                    <Typography variant="body2">
                    <strong>Description:</strong> {book.description}
                    </Typography>
                </Box>
                )}
            </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}