import React, { Component } from "react";
import VideoEntry from "./VideoEntry/index";
import MD5 from "object-hash";
import "./index.css";

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: [{ id: "2g811Eo7K8U", timeAdded: new Date() }],
      newVideoFromInput: null
    };
  }

  handleClick = () => {
    if (!this.state.newVideoFromInput) {
      return;
    }
    const inputValue = this.state.newVideoFromInput;
    let sanitizedVideoId = null;
    const match = inputValue.match(
      /^.*(youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|vi?=)([^#]*).*/
    );
    if (match && match[2].length === 11) {
      sanitizedVideoId = match[2];
      const newVideos = this.state.videos;
      newVideos.push({ id: sanitizedVideoId, timeAdded: new Date() });
      this.setState({ videos: newVideos });
    } else {
      alert("not a valid video id");
    }
  };

  handleChange = event => {
    this.setState({ newVideoFromInput: event.target.value });
  };

  handleRemoveVideo = id => {
    const newVideos = this.state.videos.filter(video => video.id !== id);
    this.setState({ videos: newVideos });
  };

  handlePlayVideo = id => {
    this.props.handlePlayVideo(id);
  };

  render() {
    return (
      <div className="playlistRoot">
        <div className="playlistInput">
          <input type="text" onChange={this.handleChange} />
          <button onClick={this.handleClick}>+</button>
        </div>
        <ol className="playlistEntries">
          {this.state.videos.map(video => (
            <li key={MD5(video)} className="playlistEntry">
              <VideoEntry
                id={video.id}
                handleRemove={this.handleRemoveVideo}
                handlePlay={this.handlePlayVideo}
              />
            </li>
          ))}
        </ol>
      </div>
    );
  }
}

export default Playlist;
