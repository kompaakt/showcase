import React from "react";
import YouTube from "react-youtube";
import styled from "styled-components/macro";

const YouTubeStyled = styled.div`
  border-radius: 5px;
`;

const Player = props => {
  const _onReady = event => {
    props.setPlayer(event.target);
    event.target.pauseVideo();
  };

  const size = props.size;
  const opts = {
    height: size.height,
    width: size.width,
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1
    }
  };

  return (
    <YouTubeStyled>
      <YouTube
        videoId={props.videoId ? props.videoId : null}
        opts={opts}
        onReady={_onReady}
        onStateChange={props.handleSetPlayingStatus}
      />
    </YouTubeStyled>
  );
};

export default Player;
