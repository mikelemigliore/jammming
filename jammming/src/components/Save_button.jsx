import React, { useState } from "react";
import "./Save_button.css";
import { IoIosCheckmarkCircle } from "react-icons/io";

function Save_button({ uris, playList, playListTitle }) {
  const [saveButton, setSaveButton] = useState(false);

  const createNewPlaylist = async () => {
    if (!playListTitle) {
      alert("You can't save without a title, please insert one to continue");
    } else {
      try {
        //Post to send a request of permission in the form of an access_token to access API data
        const userId = localStorage.getItem("user_id");
        const accessToken = localStorage.getItem("spotify_access_token");

        const playlistDetails = JSON.stringify({
          name: playListTitle,
          description: "New playlist description",
          public: false,
        });

        const response = await fetch(
          `https://api.spotify.com/v1/users/${userId}/playlists`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: playlistDetails,
          }
        );

        const playlist = await response.json();

        const trackDetails = JSON.stringify({ uris });

        await fetch(
          `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: trackDetails,
          }
        );

        setSaveButton(true);

        console.error("Success");
      } catch (error) {
        console.error(error);
      }
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  if (playList.length > 0 && !saveButton) {
    return (
      <button className="save-button" onClick={createNewPlaylist}>
        Save on Spotify
      </button>
    );
  } else if (playList.length >= 0 && saveButton) {
    return (
      <div>
        <h1 className="saved-button">
          Saved <IoIosCheckmarkCircle id="checkmark-icon" />
        </h1>
        <button className="create-new" onClick={refreshPage}>
          Create a new playlist
        </button>
      </div>
    );
  }
}

export default Save_button;
