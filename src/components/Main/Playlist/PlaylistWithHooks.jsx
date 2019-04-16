import React, { Component } from "react";
import VideoEntry from "./VideoEntry/index";
import MD5 from "object-hash";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import "./index.css";

const Playlist = props => {
  const [videosList, setVideosList] = React.useState([
    "2g811Eo7K8U",
    "dQw4w9WgXcQ"
  ]);
  const [newVideoFromInput, setNewVideoFromInput] = React.useState(null);

  const handleClick = () => {
    const inputValue = newVideoFromInput;
    let sanitizedVideoId = null;
    const match = inputValue.match(
      /^.*(youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|\&vi?=)([^#\&\?]*).*/
    );
    if (match && match[2].length === 11) {
      sanitizedVideoId = match[2];
      const newVideos = videosList;
      newVideos.push(sanitizedVideoId);
      setVideosList(newVideos);
    } else {
      alert("not a valid video id");
    }
  };

  const SortableItem = SortableElement(({ value }) => (
    <div>
      <VideoEntry
        id={value}
        handleRemove={handleRemoveVideo}
        handlePlay={handlePlayVideo}
      />
    </div>
  ));

  const SortableList = SortableContainer(({ items }) => {
    return (
      <div>
        {items.map((value, index) => (
          <SortableItem key={`item-${index}`} index={index} value={value} />
        ))}
      </div>
    );
  });

  const handleChange = event => {
    setNewVideoFromInput(event.target.value);
  };

  const handleRemoveVideo = id => {
    const newVideos = videosList.filter(video => video.id !== id);
    setVideosList(newVideos);
  };

  const handlePlayVideo = id => {
    props.handlePlayVideo(id);
  };

  return (
    <div className="playlistRoot">
      <div className="urlInput">
        <input type="text" onChange={handleChange} />
        <button onClick={handleClick}>➕</button>
      </div>
      <div className="videoEntries">
        <SortableList
          items={videosList}
          onSortEnd={({ oldIndex, newIndex }) => {}}
          lockAxis="y"
          useDragHandle
        />
      </div>
    </div>
  );
};

export default Playlist;
