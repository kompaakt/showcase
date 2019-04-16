import React, { Component } from "react";
import VideoEntry from "./VideoEntry/index";
// import MD5 from "object-hash";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import "./index.css";

const SortableItem = SortableElement(
  ({ value, handlePlayVideo, handleRemoveVideo }) => (
    <div key={value}>
      <VideoEntry
        id={value}
        key={value}
        handleRemove={handleRemoveVideo}
        handlePlay={handlePlayVideo}
      />
    </div>
  )
);

const SortableList = SortableContainer(
  ({ items, handlePlayVideo, handleRemoveVideo }) => {
    return (
      <div>
        {items.map((value, index) => {
          return (
            <SortableItem
              key={`item-${index}`}
              index={index}
              value={value}
              handlePlayVideo={handlePlayVideo}
              handleRemoveVideo={handleRemoveVideo}
            />
          );
        })}
      </div>
    );
  }
);

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: ["2g811Eo7K8U", "dQw4w9WgXcQ"],
      newVideoFromInput: null
    };
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      videos: arrayMove(this.state.videos, oldIndex, newIndex)
    });
  };

  handleClick = () => {
    const inputValue = this.state.newVideoFromInput;
    let sanitizedVideoId = null;
    const match = inputValue.match(
      /^.*(youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|vi?=)([^#]*).*/
    );
    if (match && match[2].length === 11) {
      sanitizedVideoId = match[2];
      const newVideos = this.state.videos;
      newVideos.push(sanitizedVideoId);
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
        <div className="urlInput">
          <input type="text" onChange={this.handleChange} />
          <button onClick={this.handleClick}>➕</button>
        </div>
        <div className="videoEntries">
          <SortableList
            items={this.state.videos}
            onSortEnd={this.onSortEnd}
            lockAxis="y"
            handlePlayVideo={this.handlePlayVideo}
            handleRemoveVideo={this.handleRemoveVideo}
            useDragHandle
            pressDelay={50}
          />
        </div>
      </div>
    );
  }
}

export default Playlist;
