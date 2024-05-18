import React, { useEffect, useState } from "react";
import "./Save_button";
import { AiOutlineClose } from "react-icons/ai";
import Save_button from "./Save_button";
import { PiEmpty } from "react-icons/pi";

function Playlist({ uri, playList, removeFromPlaylist }) {
  const [playListTitle, setPlayListTitle] = useState("");

  const time = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <div className="playlist-wrapper">
        <input
          className="playlist-title"
          id="text"
          placeholder="Type Playlist Title..."
          onChange={(e) => setPlayListTitle(e.target.value.toLocaleLowerCase())}
        />
        <div className="line"></div>
        {playList.length === 0 && (
          <h2 className="empty-icon">
            <PiEmpty />
          </h2>
        )}
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
                Artist: {track.artists.map((artist) => artist.name).join(", ")}
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

        <Save_button
          playListTitle={playListTitle}
          playList={playList}
          uris={uri}
        />
      </div>
    </>
  );
}

export default Playlist;
