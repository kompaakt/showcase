import React from "react";
import YouTube from "react-youtube";
import "./index.css";

class Player extends React.Component {
  _onReady = event => {
    this.props.setPlayer(event.target);
    event.target.pauseVideo();
  };

  render() {
    const size = this.props.size;
    const opts = {
      height: size.height,
      width: size.width,
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };
    return (
      <>
        <YouTube
          videoId={this.props.videoId ? this.props.videoId : "2g811Eo7K8U"}
          opts={opts}
          onReady={this._onReady}
          className={"YouTubeIFrame"}
          onStateChange={this.props.handleSetPlayingStatus}
        />
      </>
    );
  }
}

export default Player;
