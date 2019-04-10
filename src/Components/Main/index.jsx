import React, { Component } from "react";
import VideoFrame from "./VideoFrame/Player";
import Playlist from "./Playlist/index";

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPlayingVideoId: null
    };
  }

  handlePlayVideo = id => {
    this.setState({ currentPlayingVideoId: id });
  };
  render() {
    return (
      <div>
        <VideoFrame videoId={this.state.currentPlayingVideoId} />
        <Playlist handlePlayVideo={this.handlePlayVideo} />
      </div>
    );
  }
}

export default MainScreen;
