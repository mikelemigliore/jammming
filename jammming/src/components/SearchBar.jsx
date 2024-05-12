import React, { useEffect, useState } from "react";
import "./SearchBar.css";
import { IoSearchCircleSharp } from "react-icons/io5";

function SearchBar() {
  const spotifyUrl = "https://api.spotify.com/v1/search";
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState("");
  const [hasSearch, setHasSearch] = useState(false);

  const fetchData = async () => {
    setHasSearch(true);
    try {


      //Post to send a request of permission in the form of an access_token to access API data
      const authRepsonse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials&client_id=fea0709279ed4657b71b9303bd4205f2&client_secret=1d6f9baca00448d4a06e895c2609aadc",
        }
      );
      const res = await authRepsonse.json();



      //GET  to receive the specific data indicated ion the input and using the access_token as credentials
      const urlToFetch = `${spotifyUrl}?q=remaster%2520track%3ADoxy%2520artist%3A${input}&type=track`;
      const response = await fetch(urlToFetch, {
        headers: {
          Authorization: "Bearer " + res.access_token,
        },
      });

      const data = await response.json();

      console.log(data);
      setUsers(data.tracks.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchData();
    }
  };


  const time = (ms) =>{
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }


  const handleSearch = () => {
    if(!hasSearch){ setHasSearch(true)};
  }



  return (
    <>
      <div className="input-wrapper">
        <input
          id="search"
          placeholder="Type Song,Artist, or Album"                    
          onChange={(e) => setInput(e.target.value.toLocaleLowerCase()) && handleSearch()}
          onKeyDown={handleKeyDown}
        />
        <IoSearchCircleSharp id="icon" onClick={fetchData}/>
      </div>
      {/* <IoSearchCircleSharp id="icon" onClick={fetchData}/> */}
      <div className ="container">
      <div className="results-wrapper">
        <h1>Results</h1>
        <div className='line'></div>
        {!hasSearch && <h2 className="empty" >Empty</h2>}
        {hasSearch && users.length === 0 && <h2 className="empty" >No data found</h2>}
        {users.map((track) => (
          <div key={track.id} className="result-text">
            <div className='album-img'><img src={track.album.images[1].url} alt={`Cover of ${track.album.name}`}/></div>
            <div className='track-info'><h3>{track.name}</h3>
            <h3>{time(track.duration_ms)}</h3>
           <h3>Album: {track.album.name}</h3></div>
          </div>
        ))}
      </div>
      <div className="playlist-wrapper">
        <h1>Playlist</h1>
        <div className='line'></div>
        <h2 className="empty" >Empty Playlist</h2>
      </div>
    </div>
    </>
  );
}

export default SearchBar;

