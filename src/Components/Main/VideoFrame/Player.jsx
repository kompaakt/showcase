import React from "react";
import YouTube from "react-youtube";

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      player: null
    };
  }

  _onReady = event => {
    this.props.setPlayer(event.target);
    event.target.pauseVideo();
  };

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
        onStateChange={this.props.handleSendPlayingStatus}
      />
    );
  }
}

export default Player;
