import React, { useState, useEffect } from "react";
import { sortableHandle } from "react-sortable-hoc";
import fetchVideoInfo from "../../../../sideEffects/youtubeAPI";
import "./index.css";

const DragHandle = sortableHandle(({ src, alt }) => {
  return (
    <>
      <span style={{ userSelect: "none" }}>::</span>
      <img draggable="false" src={src} alt={alt} />
    </>
  );
});

const VideoEntry = props => {
  const [id, setId] = useState(props.id);
  const [icon, setIcon] = useState(null);
  const [info, setInfo] = useState(null);
  const [name, setName] = useState(null);

  fetchVideoInfo({ id, setInfo });

  const handleClickRemove = () => {
    props.handleRemove(id);
  };

  const handleClickPlay = () => {
    props.handlePlay(id);
  };

  return (
    <React.Fragment>
      {info ? (
        <div className="VideoEntryRoot">
          <DragHandle
            src={info.snippet.thumbnails.default.url}
            alt={info.snippet.title}
          />
          <p>{info.snippet.title}</p>
          <div className="controlButtons">
            <button className="playVideoButton" onClick={handleClickPlay}>
              <span role="img" aria-label={"play video from playlist"}>
                ▶️
              </span>
            </button>
            <button className="removeVideoButton" onClick={handleClickRemove}>
              <span role="img" aria-label={"Remove video from playlist"}>
                ❌
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};
export default VideoEntry;
