import React, { useState } from "react";
import { sortableHandle } from "react-sortable-hoc";
import fetchVideoInfo from "../../../../sideEffects/youtubeAPI";
import styled from "styled-components/macro";

const VideoEntryRoot = styled.div`
  max-width: auto;
  margin: 2px;
  padding: 2px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: linear-gradient(190deg, #0298e2, #ffeb3b);
  background-size: 400% 400%;
  border-radius: 5px;
  & > p {
    margin-left: 10px;
    font-family: "Fredoka One";
    width: 100%;
  }
`;

const ControlledButtons = styled.div`
  margin-left: auto;
  height: 100%;
  width: 25%;
  & > button {
    margin-left: auto;
    height: 100%;
    margin-right: 5px;
    background: linear-gradient(200deg, #0298e2, #ffeb3b);
    background-size: 400% 400%;
    border-color: #000000;
    border-radius: 5px;
  }
`;

const StyledImg = styled.img`
  margin-left: 4px;
  width: 50px;
  height: 50%;
  border-radius: 5px;
  user-select: none;
`;

const DragHandle = sortableHandle(({ src, alt }) => {
  return (
    <>
      <span style={{ userSelect: "none" }}>::</span>
      <StyledImg draggable="false" src={src} alt={alt} />
    </>
  );
});

const VideoEntry = props => {
  const id = props.id;
  // const [icon, setIcon] = useState(null);
  const [info, setInfo] = useState(null);
  // const [name, setName] = useState(null);

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
        <VideoEntryRoot>
          <DragHandle
            src={info.snippet.thumbnails.default.url}
            alt={info.snippet.title}
          />
          <p>{info.snippet.title}</p>
          <ControlledButtons>
            <button onClick={handleClickPlay}>
              <span role="img" aria-label={"play video from playlist"}>
                ▶️
              </span>
            </button>
            <button onClick={handleClickRemove}>
              <span role="img" aria-label={"Remove video from playlist"}>
                ❌
              </span>
            </button>
          </ControlledButtons>
        </VideoEntryRoot>
      ) : null}
    </React.Fragment>
  );
};
export default VideoEntry;
