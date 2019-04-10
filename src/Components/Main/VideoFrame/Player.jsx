import React from "react";
import YouTube from "react-youtube";

class Player extends React.Component {
  render() {
    const opts = {
      height: "360",
      width: "720",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

    return (
      <YouTube
        videoId={this.props.videoId ? this.props.videoId : "2g811Eo7K8U"}
        opts={opts}
        onReady={this._onReady}
        onStateChange={event => console.log(event)}
      />
    );
  }

  _onReady(event) {
    event.target.stopVideo();
  }
}

export default Player;
