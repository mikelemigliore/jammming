
//To make it accessible online i need a domain

import React, { useEffect, useState } from "react";
import "./App.css";
import logo from "./logo.png";
import SearchBar from "./components/SearchBar";
import Results from "./components/Results";
import Playlist from "./components/Playlist";

const client_id = "fea0709279ed4657b71b9303bd4205f2";
const client_secret = "1d6f9baca00448d4a06e895c2609aadc";
//const redirect_uri = "https://mikelemigliore.github.io/jammming/callback";
const redirect_uri = "http://localhost:3000/callback";
const scope = "playlist-modify-private";

const emptyAccessToken =
  !localStorage.getItem("spotify_access_token") ||
  localStorage.getItem("spotify_access_token") == "null" ||
  localStorage.getItem("spotify_access_token") == "undefined";

const emptyUserId =
  !localStorage.getItem("user_id") ||
  localStorage.getItem("user_id") == "null" ||
  localStorage.getItem("user_id") == "undefined";

function App() {
  const [data, setData] = useState([]);
  const [playList, setPlayList] = useState([]);
  const [uri, setUri] = useState([]);
  const [login, setLogIn] = useState(
    localStorage.getItem("spotify_access_token") &&
      localStorage.getItem("user_id")
  );

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");

    if (accessToken) {
      localStorage.setItem("spotify_access_token", accessToken);
      window.location.hash = ""; // Clean up the URL
      //setLogIn(true); // Update login state immediately
      if (!localStorage.getItem("user_id")) {
        getUser(accessToken); // Fetch user details
      }
    }
  }, []);

  const getAccessToken = () => {
    try {
      var url = "https://accounts.spotify.com/authorize";
      url += "?response_type=token";
      url += "&client_id=" + encodeURIComponent(client_id);
      url += "&scope=" + encodeURIComponent(scope);
      url += "&redirect_uri=" + encodeURIComponent(redirect_uri);

      window.location.href = url;
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization:
            "Bearer " + localStorage.getItem("spotify_access_token"),
        },
      });

      const user = await res.json();

      localStorage.setItem("user_id", user.id);
    } catch (error) {
      console.log(error);
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

  const removeFromPlaylist = (trackId) => {
    setPlayList((currentPlaylist) => {
      const newPlaylist = currentPlaylist.filter(
        (track) => track.id !== trackId
      );
      setUri(newPlaylist.map((track) => track.uri)); // Update URI state based on remaining tracks
      return newPlaylist;
    });
  };

  if (!login) {
    return (
      <div className="Log">
        <p className="login_statement">
          This web application requires users to log in to their Spotify account
          to create and save personalized playlists. Please log in to continue.
        </p>
        <div>
          <button className="login-button" onClick={getAccessToken}>
            Log In or Sign Up
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="App">
        <nav>
          <img src={logo} alt="logo" />
        </nav>
        <SearchBar onSearched={(items) => setData(items)} />
        <div className="container">
          <Results
            data={data}
            addToPlayList={addToPlayList}
            playList={playList}
            uri={uri}
          />
          <Playlist
            playList={playList}
            uri={uri}
            removeFromPlaylist={removeFromPlaylist}
          />
        </div>
      </div>
    );
  }
}

export default App;
