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
  height: 98%;
  padding: 4px;
  /* box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5); */
`;

const UrlInput = styled.div`
  display: flex;
  padding: 2px;
  & > button {
    width: 50px;
    border: 2px solid;
    background: #cff27e;
    border-color: #044389;

    background-size: 400% 400%;
    border-radius: 5px;
    margin-left: 5px;
  }
  & > input {
    width: 100%;
    text-align: center;
    font-family: "Fredoka One";
    border-radius: 5px;

    border: 2px solid;
    border-color: #044389;
    background: #cff27e;
    background-size: 400% 400%;
    border-radius: 5px;
  }
`;

const VideoEntries = styled.div`
  height: 350px;
  max-height: 94%;
  overflow-y: auto;
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
              key={`item-${value}`}
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
      playlist: props.playlist,
      newVideoFromInput: null
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.playlist !== this.props.playlist) {
      this.setState({ playlist: this.props.playlist });
    }
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      videos: arrayMove(this.state.playlist, oldIndex, newIndex)
    });
    console.log("new state onSortEnd", this.state.playlist);
  };

  addPlaylistToPlaylist = playlist => {
    const oldVideos = this.state.playlist;
    const newVideos = playlist.map(video => {
      return video.snippet.resourceId.videoId;
    });
    this.setState({ playlist: oldVideos.concat(newVideos) });
  };

  addVideoToPlaylist = videoId => {
    this.props.onUpdatePlaylist({
      action: "add",
      item: { id: videoId, type: "video" }
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
      this.addVideoToPlaylist(sanitizedVideoId);
    } else if (matchPlaylist && matchPlaylist[2]) {
      fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${
          matchPlaylist[2]
        }&key=${"AIzaSyB8PbKRvL7sAoTdhklSKZ1toHd2Pi4l5vE"}`
      )
        .then(resp => resp.json())
        .then(data => {
          this.addPlaylistToPlaylist(data.items);
        });
    } else {
      alert("not a valid video id");
    }
  };

  handleChange = event => {
    this.setState({ newVideoFromInput: event.target.value });
  };

  handleRemoveVideo = id => {
    this.props.onUpdatePlaylist({
      action: "remove",
      item: { id: id, type: "video" }
    });
  };

  handlePlayVideo = id => {
    this.props.handlePlayVideo(id);
  };

  render() {
    return (
      <PlaylistRoot>
        <UrlInput>
          <input
            type="text"
            placeholder="past url here"
            onChange={this.handleChange}
          />
          <button onClick={this.handleClick}>
            <span role="img" aria-label={"Add video to playlist"}>
              ➕
            </span>
          </button>
        </UrlInput>
        <VideoEntries>
          <SortableList
            items={this.state.playlist}
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
