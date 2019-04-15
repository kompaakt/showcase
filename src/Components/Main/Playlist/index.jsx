import React, { Component } from "react";
import VideoEntry from "./VideoEntry/index";
import MD5 from "object-hash";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import "./index.css";

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: ["2g811Eo7K8U", "dQw4w9WgXcQ"],
      newVideoFromInput: null
    };
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    console.log(`old: ${oldIndex}, new: ${newIndex}}`);
    this.setState(({ videos }) => ({
      videos: arrayMove(videos, oldIndex, newIndex)
    }));
  };

  handleClick = () => {
    const inputValue = this.state.newVideoFromInput;
    let sanitizedVideoId = null;
    const match = inputValue.match(
      /^.*(youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|\&vi?=)([^#\&\?]*).*/
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

  SortableItem = SortableElement(({ value }) => (
    <div>
      <VideoEntry
        id={value}
        handleRemove={this.handleRemoveVideo}
        handlePlay={this.handlePlayVideo}
      />
    </div>
  ));

  SortableList = SortableContainer(({ items }) => {
    return (
      <div>
        {items.map((value, index) => (
          <this.SortableItem
            key={`item-${index}`}
            index={index}
            value={value}
          />
        ))}
      </div>
    );
  });

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
    console.log(this.state.videos);
    return (
      <div className="playlistRoot">
        <div className="urlInput">
          <input type="text" onChange={this.handleChange} />
          <button onClick={this.handleClick}>➕</button>
        </div>
        <div className="videoEntries">
          <this.SortableList
            items={this.state.videos}
            onSortEnd={this.onSortEnd}
            lockAxis="y"
          />
        </div>
      </div>
    );
  }
}

export default Playlist;
