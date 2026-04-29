import { useState } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar({ onSearch, text }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) onSearch(query);
  };

  return (
    <Paper
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
      onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
    >
      <InputBase
        sx={{
             ml: 1, flex: 1,
            fontFamily: "'Instrument Serif', serif",

            "& input": {
              fontFamily: "'Instrument Serif', serif",
            },

            "& input::placeholder": {
              fontFamily: "'Instrument Serif', serif",
            },
          }}
        placeholder={text}
        inputProps={{ 'aria-label': 'Search' }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch}>
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

export default SearchBar;