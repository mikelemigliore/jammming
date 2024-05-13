import React, { useEffect, useState } from "react";
import "./SearchBar.css";
import { IoSearchCircleSharp } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";

function SearchBar() {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [hasSearch, setHasSearch] = useState(false);
  const [playList, setPlayList] = useState([]);
  const [playListTitle, setPlayListTitle] = useState("");
  const [token, setToken] = useState("");
  const [uri, setUri] = useState([]);
  const [userId, setUserId] = useState("");

  const client_id = "fea0709279ed4657b71b9303bd4205f2";
  const client_secret = "1d6f9baca00448d4a06e895c2609aadc";
  const spotifyUrl = "https://api.spotify.com/v1/search";



  //Fetching data for the tracks, album and artist
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
          body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`,
        }
      );
      const res = await authRepsonse.json();
      setToken(res.access_token);

      //GET  to receive the specific data indicated ion the input and using the access_token as credentials
      const urlToFetch = `${spotifyUrl}?q=remaster%2520track%2520artist%3A${input}&type=track`;
      const response = await fetch(urlToFetch, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await response.json();
      setData(data.tracks.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };




  //Utility Functions
  //------------------------------------------------------------------------------------------------------------
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchData();
    }
  };

  const time = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSearch = () => {
    if (!hasSearch) {
      setHasSearch(true);
    }
  };

  const addToPlayList = (track) => {
    const isTrackInPlaylist = playList.some(
      (playlistTrack) => playlistTrack.id === track.id
    );

    if (!isTrackInPlaylist) {
      setPlayList((currentPlaylist) => [...currentPlaylist, track]);
      setUri((currentUris) => [...currentUris, track.uri]); // Assuming each track object has a 'uri' property
    } else {
      alert("Track already in your playlist");
    }
  };

  // useEffect(() => {
  //     console.log("Current URIs in Playlist:", uri);
  // }, [uri]);

  const removeFromPlaylist = (trackId) => {
    setPlayList((currentPlaylist) => {
      const newPlaylist = currentPlaylist.filter(
        (track) => track.id !== trackId
      );
      setUri(newPlaylist.map((track) => track.uri)); // Update URI state based on remaining tracks
      return newPlaylist;
    });
  };

  //-------------------------------------------------------------------------------------------------------------------

  //Get User authorization with login to spotify, the url that return will include the user access_token
  const getUserId = () => {
    var client_id = 'fea0709279ed4657b71b9303bd4205f2';
    var redirect_uri = 'http://localhost:3000/callback';
    
    
    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

    window.location.href = url.toString();
    console.log(url);
};



  const saveOnSpotify = () => {
    console.log(playList);
    getUserId();
  };

  return (
    <>
      <div className="input-wrapper">
        <input
          id="search"
          placeholder="Type Song,Artist, or Album"
          onChange={(e) =>
            setInput(e.target.value.toLocaleLowerCase()) && handleSearch()
          }
          onKeyDown={handleKeyDown}
        />
        <IoSearchCircleSharp id="icon" onClick={fetchData} />
      </div>
      <div className="container">
        <div className="results-wrapper">
          <h1>Results</h1>
          <div className="line"></div>
          {!hasSearch && <h2 className="empty">Empty</h2>}
          {hasSearch && data.length === 0 && (
            <h2 className="empty">No data found</h2>
          )}
          {data.map((track) => (
            <div key={track.id} className="result-text">
              <div className="album-img">
                <img
                  src={track.album.images[1].url}
                  alt={`Cover of ${track.album.name}`}
                />
              </div>
              <div className="track-info">
                <h3>{track.name}</h3>
                <h3>{time(track.duration_ms)}</h3>
                <h3>
                  Artist:{" "}
                  {track.artists.map((artist) => artist.name).join(", ")}
                </h3>
                <h3>Album: {track.album.name}</h3>
                <button
                  className="add-buttom"
                  onClick={() => {
                    addToPlayList(track);
                  }}
                >
                  <FiPlus id="plus-icon" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="playlist-wrapper">
          <input
            className="playlist-title"
            id="text"
            placeholder="Type Playlist Title..."
            onChange={(e) =>
              setPlayListTitle(e.target.value.toLocaleLowerCase())
            }
          />
          <div className="line"></div>
          {playList.length === 0 && <h2 className="empty">Empty Playlist</h2>}
          {playList.map((track) => (
            <div key={track.id} className="result-text">
              <div className="album-img">
                <img
                  src={track.album.images[1].url}
                  alt={`Cover of ${track.album.name}`}
                />
              </div>
              <div className="track-info">
                <h3>{track.name}</h3>
                <h3>{time(track.duration_ms)}</h3>
                <h3>
                  Artist:{" "}
                  {track.artists.map((artist) => artist.name).join(", ")}
                </h3>
                <h3>Album: {track.album.name}</h3>
                <button
                  className="remove-buttom"
                  onClick={() => {
                    removeFromPlaylist(track.id);
                  }}
                >
                  <AiOutlineClose id="x-icon" />
                </button>
              </div>
            </div>
          ))}
          {playList.length > 0 && (
            <button
              className="save-button"
              onClick={() => {
                saveOnSpotify(playList);
              }}
            >
              Save on Spotify
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchBar;
