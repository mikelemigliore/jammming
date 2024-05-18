import React, { useState } from "react";
import "./Playlist";
import { FiPlus } from "react-icons/fi";
import Playlist from "./Playlist";

function Results({data, addToPlayList, playList, uri}) {

  const time = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };



//----------------------------------------------------------------------------------------------------------------------------------


  return (
    <>
        <div className="results-wrapper">
          <h1>Results</h1>
          <div className="line"></div>
          {/* {<h2 className="empty">Empty</h2>} */}
          {data.length === 0 && (
            <h2 className="empty">Empty</h2>
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
    </>
  );
}

export default Results;