import React, { Component } from "react";
import { usePeerState, useReceivePeerState } from "react-peer";
import VideoFrame from "./VideoFrame/Player";
import Playlist from "./Playlist/index";
import Chat from "./Chat";
import { stat } from "fs";

const MAGIC_CONSTANT = 2; // DEPENDS ON BUFFERING TIME

const MainScreen = () => {
  const [currentPlayingVideoId, setCurrentPlayingVideoId] = React.useState(
    "dQw4w9WgXcQ"
  );
  const [player, setPlayer] = React.useState(null);
  const [peerBrokerId, setPeerBrokerId] = React.useState("");
  const [state, setState, brokerId, connections, stateErr] = usePeerState(
    "hello"
  );
  const [peerState, isConnected, recErr] = useReceivePeerState(peerBrokerId);

  const handlePlayVideo = id => {
    setCurrentPlayingVideoId(id);
  };

  const handleSendPlayingStatus = status => {
    setState({ status: status.data, time: player.getCurrentTime() });
  };

  const handleConnect = brokerId => {
    setPeerBrokerId(brokerId);
  };

  // if (player && peerState) {
  //   console.log(
  //     `own state at ${new Date()}`,
  //     player.getCurrentTime(),
  //     peerState.time,
  //     state,
  //     peerState
  //   );
  //   if (peerState.status === 2 && state.status === 1) {
  //     setState({ status: 2 });
  //     player.pauseVideo();
  // }
  // } else if (peerState.status === 1 && state.status === 2) {
  //   setState({ status: 1 });
  //   player.playVideo();
  // }
  // }

  // if (player && peerState && peerState.status === 1 && state.status !== 1) {
  //   player.playVideo();
  // }

  if (
    player &&
    peerState &&
    Math.abs(player.getCurrentTime() - peerState.time) > MAGIC_CONSTANT &&
    state.status !== 3
  ) {
    console.log("timeline diverges");
    player.seekTo(peerState.time, true);
    player.playVideo();
  }

  if (player && peerState && peerState.status === 3) {
    //Wait if another peer is buffering
    player.pauseVideo();
  }
  if (player && peerState && peerState.status === 1 && state.status !== 3) {
    player.playVideo();
  }

  // if (player && peerState && peerState.status === 2) {
  //   player.pauseVideo();
  // }

  return (
    <>
      <b>your id is: {brokerId}</b>
      <br />
      <b>peerState: {peerState ? peerState.status : null}</b>
      <br />
      <input onChange={e => handleConnect(e.target.value)} />
      <VideoFrame
        videoId={currentPlayingVideoId}
        handleSendPlayingStatus={handleSendPlayingStatus}
        state={peerState}
        setPlayer={setPlayer}
      />
      {/* <Playlist handlePlayVideo={handlePlayVideo} />
      <Chat /> */}
    </>
  );
};

export default MainScreen;
