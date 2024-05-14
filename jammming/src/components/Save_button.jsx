import React from "react";
import "./Save_button.css";

function Save_button({ uris, playList, playListTitle }) {
  const createNewPlaylist = async () => {
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

      console.error("Success");
    } catch (error) {
      console.error(error);
    }
  };

  if (playList.length > 0)
    return (
      <button className="save-button" onClick={createNewPlaylist}>
        Save on Spotify
      </button>
    );
}

export default Save_button;
