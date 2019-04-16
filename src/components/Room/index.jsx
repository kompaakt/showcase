import React from "react";
import SimpleWebRTC from "simplewebrtc";
import VideoFrame from "../Main/VideoFrame/Player";
import Playlist from "../Main/Playlist/index";
import useEventListener from "../../utils/hooks/useEventListener";
import "./index.css";

const webrtc = new SimpleWebRTC({
  // debug: true,
  enableDataChannels: true
});

// function throttle(func, ms) {

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

  const setCurrentPlayingVideo = id => {
    setCurrentPlayingVideoId(id);
    webrtc.sendDirectlyToAll("PlayerChannel", "VideoId", {
      id
    });
  };

  if (player) {
    webrtc.on("channelMessage", (peer, channelLabel, messageType) => {
      console.log(
        "new message",
        channelLabel,
        messageType,
        messageType.payload
      );
      switch (channelLabel) {
        case "PlayerChannel": {
          switch (messageType.type) {
            case "VideoId": {
              setCurrentPlayingVideoId(messageType.payload.id);
              player.playVideo();
              break;
            }
            case "PlayingStatus": {
              setStatus(messageType.payload);
              break;
            }
            default:
              break;
          }
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  const handleSetPlayingStatus = status => {
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
          if (Math.abs(player.getCurrentTime() - status.time) > 60) {
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

  const [playerDimensions, setPlayerDimesions] = React.useState({
    width: 450,
    height: 600
  }); // ToDo: figure out how to set dimensions on first render

  useEventListener("resize", () =>
    setPlayerDimesions({
      width: document.getElementsByClassName("playerPlaceholder")[0]
        .clientWidth,
      height: document.getElementsByClassName("playerPlaceholder")[0]
        .clientHeight
    })
  );

  return (
    <div className="roomWrapper">
      <div className="roomRoot">
        <div className="playerPlaceholder">
          <VideoFrame
            videoId={currentPlayingVideoId}
            handleSetPlayingStatus={handleSetPlayingStatus}
            state={playingState}
            setPlayer={settPlayer}
            size={playerDimensions}
          />
        </div>
        <div
          classname="playlistPlaceholder"
          style={{ gridColumn: "3 / 4", gridRow: "1 / 5" }}
        >
          <Playlist handlePlayVideo={setCurrentPlayingVideo} />
        </div>
        <div
          classname="chatPlaceholder"
          style={{ gridColumn: "1 / 3", gridRow: "4 / 5" }}
        />
      </div>
    </div>
  );
};

export default Room;