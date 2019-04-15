import React from "react";
import SimpleWebRTC from "simplewebrtc";
import VideoFrame from "../Main/VideoFrame/Player";

function throttle(func, ms) {
  var isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {
    if (isThrottled) {
      // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    func.apply(this, arguments); // (1)

    isThrottled = true;

    setTimeout(function() {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}

const Room = props => {
  const roomId = props.match.params.roomId;
  const isHost = props.location.isHost;

  const [playingState, setPlayingState] = React.useState({});

  const [currentPlayingVideoId, setCurrentPlayingVideoId] = React.useState(
    "dQw4w9WgXcQ"
  );
  const [player, setPlayer] = React.useState(null);

  const settPlayer = player => {
    setPlayer(player);
  };

  const [webrtc, setWebrtc] = React.useState(
    new SimpleWebRTC({
      // debug: true,
      enableDataChannels: true
    })
  );
  if (player) {
    webrtc.on(
      "channelMessage",
      (peer, channelLabel, { messageType, payload }) => {
        // console.log("new message", channelLabel, messageType, payload);
        switch (channelLabel) {
          case "PlayerChannel": {
            setStatus(payload);
            break;
          }
          default: {
            break;
          }
        }
      }
    );
  }
  const handleSetPlayingStatus = status => {
    console.log("handleSetPlayingStatus");
    if (status) {
      setPlayingState(status.data);

      webrtc.sendDirectlyToAll("PlayerChannel", "PlayingStatus", {
        state: status.data,
        time: player.getCurrentTime()
      });
    }
  };

  const play = () => player.playVideo();
  const pause = () => player.pauseVideo();

  const setStatus = status => {
    switch (status.state) {
      case 1: {
        if (playingState !== 2) {
          console.log("throttle a func");
          if (Math.abs(player.getCurrentTime() - status.time) > 60) {
            console.log("time: ", player.getCurrentTime() - status.time);
            player.seekTo(status.time, true);
          }
          play();
        }
        break;
      }
      case 2: {
        if (playingState !== 1) {
          if (Math.abs(player.getCurrentTime() - status.time) > 1) {
            player.seekTo(status.time, true);
          }
          pause();
        }
        break;
      }
      default: {
        break;
      }
    }
  };

  React.useEffect(() => {
    if (roomId && isHost) {
      webrtc.createRoom(roomId, () => {
        console.log("created room");
      });
    } else if (roomId) {
      webrtc.joinRoom(roomId, () => {
        console.log("joined");
        webrtc.sendDirectlyToAll(
          "hello chanel",
          "message",
          `hello from ${isHost ? "host" : "guest"}`
        );
      });
    }

    return function cleanup() {
      console.log("cleanup");
      webrtc.leaveRoom();
      // webrtc.disconnect();
    };
  }, []);

  return (
    <>
      <VideoFrame
        videoId={currentPlayingVideoId}
        handleSetPlayingStatus={handleSetPlayingStatus}
        state={playingState}
        setPlayer={settPlayer}
      />
    </>
  );
};

export default Room;
