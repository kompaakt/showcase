import React, { Component } from "react";
import VideoEntry from "./VideoEntry/index";
// import MD5 from "object-hash";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import styled from "styled-components/macro";

const PlaylistRoot = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  height: auto;
`;

const UrlInput = styled.div`
  display: flex;
  padding: 2px;
  & > button {
    margin-left: 5px;
    background: ${props => props.theme.button.color};
    background-size: ${props => props.theme.button.gradientSize};
    border-radius: 5px;
    border-color: #0042b0;
  }
  & > input {
    width: 100%;
    text-align: center;
    background: ${props => props.theme.button.color};
    background-size: ${props => props.theme.button.gradientSize};
    background-size: 400% 400%;
    font-family: "Fredoka One";
    border-radius: 5px;
    border-color: #0042b0;
  }
`;

const VideoEntries = styled.div`
  overflow-y: auto;
`;

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
      <PlaylistRoot>
        <UrlInput>
          <input type="text" onChange={this.handleChange} />
          <button onClick={this.handleClick}>
            <span role="img" aria-label={"Add video to playlist"}>
              ➕
            </span>
          </button>
        </UrlInput>
        <VideoEntries>
          <SortableList
            items={this.state.videos}
            onSortEnd={this.onSortEnd}
            lockAxis="y"
            handlePlayVideo={this.handlePlayVideo}
            handleRemoveVideo={this.handleRemoveVideo}
            useDragHandle
            pressDelay={50}
          />
        </VideoEntries>
      </PlaylistRoot>
    );
  }
}

export default Playlist;
