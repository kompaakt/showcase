import React, { Component } from "react";
import VideoEntry from "./VideoEntry/index";
// import MD5 from "object-hash";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import styled from "styled-components/macro";
import { fetchPlaylistInfo } from "../../../sideEffects/youtubeAPI";

const PlaylistRoot = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  height: 100%;
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
    margin-left: 2px;
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
  max-height: 100%;
  overflow-y: scroll;
  border-radius: 10px;
`;

const SortableItem = SortableElement(
  ({ value, handlePlayVideo, handleRemoveVideo }) => (
    <div key={value}>
      <VideoEntry
        id={value}
        key={value}
        handleRemoveVideo={handleRemoveVideo}
        handlePlayVideo={handlePlayVideo}
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
    const matchVideo = inputValue.match(
      /^.*(youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|vi?=)([^#]*).*/
    );
    const matchPlaylist = inputValue.match(
      /^.*(youtu.be\/|list=)([^#\&\?]*).*/
    );
    if (matchVideo && matchVideo[2].length === 11) {
      sanitizedVideoId = matchVideo[2];
      const newVideos = this.state.videos;
      newVideos.push(sanitizedVideoId);
      this.setState({ videos: newVideos });
    } else if (matchPlaylist && matchPlaylist[2]) {
      fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${
          matchPlaylist[2]
        }&key=${"AIzaSyB8PbKRvL7sAoTdhklSKZ1toHd2Pi4l5vE"}`
      )
        .then(resp => resp.json())
        .then(data => {
          const oldVideos = this.state.videos;
          const newVideos = data.items.map(video => {
            return video.snippet.resourceId.videoId;
          });
          this.setState({ videos: oldVideos.concat(newVideos) });
        });
    } else {
      alert("not a valid video id");
    }
  };

  handleChange = event => {
    this.setState({ newVideoFromInput: event.target.value });
  };

  handleRemoveVideo = id => {
    console.log("handleRemoveVideo", id);
    const newVideos = this.state.videos.filter(vid => vid !== id);
    console.log(this.state.videos, newVideos);
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
