import React, { useState } from "react";
import "./SearchBar.css";
import { IoSearchCircleSharp } from "react-icons/io5";

const spotifyUrl = "https://api.spotify.com/v1/search";

function SearchBar({ onSearched }) {
  const [input, setInput] = useState("");

  //Fetching data for the tracks, album and artist
  const searchAlbum = async () => {
    try {
      //GET  to receive the specific data indicated ion the input and using the access_token as credentials
      const urlToFetch = `${spotifyUrl}?q=remaster%2520track%2520artist%3A${input}&type=track`;
      //const urlToFetch = `${spotifyUrl}?q=remaster track artist:${input}&type=track`;
      const response = await fetch(urlToFetch, {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("spotify_access_token"),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      onSearched(data.tracks.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchAlbum();
    }
  };

  return (
    <div className="input-wrapper">
      <input
        id="search"
        placeholder="Type Song,Artist, or Album"
        onChange={(e) => setInput(e.target.value.toLocaleLowerCase())}
        onKeyDown={handleKeyDown}
      />
      <IoSearchCircleSharp id="icon" onClick={searchAlbum} />
    </div>
  );
}

export default SearchBar;
