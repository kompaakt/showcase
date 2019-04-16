import React from "react";
import SimpleWebRTC from "simplewebrtc";
import VideoFrame from "../Main/VideoFrame/Player";
import Playlist from "../Main/Playlist/index";
import useEventListener from "../../utils/hooks/useEventListener";
import styled from "styled-components/macro";

const webrtc = new SimpleWebRTC({
  // debug: true,
  enableDataChannels: true
});

const Root = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${props => props.theme.gradient};
  background-size: 100% 100%;
`;

const RoomRoot = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
  /* & > div {
    z-index: 0;
    grid-column: 1 / 3;
    grid-row: 1 / 4;

    position: relative;
    padding: 1px;

    background-clip: padding-box; /* !importanté */
    border: solid 5px transparent; /* !importanté */
    border-radius: 5px;
  } */
`;

const PlayerPlaceholder = styled.div`
  z-index: 0;
  grid-column: 1 / 3;
  grid-row: 1 / 4;

  position: relative;
  padding: 1px;

  background-clip: padding-box; /* !importanté */
  border: solid 5px transparent; /* !importanté */
  border-radius: 5px;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: -5px; /* !importanté */
    border-radius: inherit; /* !importanté */
    background: linear-gradient(190deg, #ffeb3b, #0298e2);
    background-size: 400% 400%;
  }
`;

const PlaylistPlaceholder = styled.div`
  z-index: 0;
  grid-column: 1 / 3;
  grid-row: 1 / 4;

  position: relative;
  padding: 1px;

  background-clip: padding-box; /* !importanté */
  border: solid 5px transparent; /* !importanté */
  border-radius: 5px;
  grid-column: 3 / 4;
  grid-row: 1 / 5;
`;

const ChatPlaceholder = styled.div`
  grid-column: 1 / 3;
  grid-row: 4 / 5;
  z-index: 0;
  grid-column: 1 / 3;
  grid-row: 1 / 4;

  position: relative;
  padding: 1px;

  background-clip: padding-box; /* !importanté */
  border: solid 5px transparent; /* !importanté */
  border-radius: 5px;
`;

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
      width: document.getElementById("playerPlaceholder").clientWidth,
      height: document.getElementById("playerPlaceholder").clientHeight
    })
  );

  return (
    <Root>
      <RoomRoot>
        <PlayerPlaceholder id="playerPlaceholder">
          <VideoFrame
            videoId={currentPlayingVideoId}
            handleSetPlayingStatus={handleSetPlayingStatus}
            state={playingState}
            setPlayer={settPlayer}
            size={playerDimensions}
          />
        </PlayerPlaceholder>
        <PlaylistPlaceholder>
          <Playlist handlePlayVideo={setCurrentPlayingVideo} />
        </PlaylistPlaceholder>
        <ChatPlaceholder />
      </RoomRoot>
    </Root>
  );
};

export default Room;
