import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import SimpleWebRTC from "simplewebrtc";
import "react-toastify/dist/ReactToastify.css";
import NicknamePrompt from "../Main/NicknamePrompt";
import {
  RoomRoot,
  PlayerPlaceholder,
  PlaylistPlaceholder,
  CommunicationDashboardPlaceholder,
  MembersAndMic
} from "./StyledComponents.js";
import Chat from "../Main/VendorChat";
import Playlist from "../Main/Playlist/index";
import AudioControls from "../AudioControls";
import MembersList from "../MembersList";
import "./Notification.css";

const webrtc = new SimpleWebRTC({
  // debug: true,
  // localVideoEl: "localVideo",
  // remoteVideosEl: "remoteVideos",
  enableDataChannels: true
  // autoRequestMedia: true,
  // media: { audio: true, video: true }
});

class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: localStorage.getItem("username") || null,
      members: [],
      playlist: []
    };
  }

  roomId = this.props.match.params.roomId;
  isHost = this.props.location.isHost;

  initChannels() {
    webrtc.sendDirectlyToAll("Playlist", "", ""); //
    webrtc.sendDirectlyToAll("Chat", "", ""); //
    webrtc.sendDirectlyToAll("Player", "", ""); //
  }

  componentDidMount() {
    // Create or join the room
    if (this.roomId && this.isHost) {
      webrtc.createRoom(this.roomId, () => {
        this.initChannels();
      });
    } else if (this.roomId) {
      webrtc.joinRoom(this.roomId, () => {
        this.initChannels();
        const username = localStorage.getItem("username");
        if (username) {
          webrtc.sendDirectlyToAll("MembersList", "NewMember", username);
          setTimeout(
            () =>
              webrtc.sendDirectlyToAll("MembersList", "NewMember", username),
            1500
          );
        }
      });
    }

    // Set callbacks on recieved channel messages
    webrtc.on("channelMessage", (peer, channelLabel, data) => {
      const channel = channelLabel;
      const type = data.type;
      const payload = data.payload;
      switch (channel) {
        case "Playlist": {
          switch (type) {
            case "NewVideo": {
              const newVideo = payload;
              this.setState({ playlist: [...this.state.playlist, newVideo] });
              break;
            }
            case "RemoveVideo": {
              const removeVideoId = payload;
              this.setState({
                playlist: [...this.state.playlist, removeVideoId]
              });
              const newPlaylist = this.state.playlist.filter(
                id => id !== removeVideoId
              );
              this.setState({ playlist: [...newPlaylist] });
              break;
            }
            case "AddPlaylist": {
              const playlist = payload;
              this.setState({ playlist });
              break;
            }
            default:
              break;
          }
          break;
        }
        case "MembersList": {
          switch (type) {
            case "NewMember": {
              const newMember = payload;
              this.addMemberToList(newMember);
              // send your name to novice
              webrtc.sendDirectlyToAll(
                "MembersList",
                "AddOldMember",
                localStorage.getItem("username")
              );
              // send existing playlist to novice
              webrtc.sendDirectlyToAll(
                "Playlist",
                "AddPlaylist",
                this.state.playlist
              );
              toast(`${newMember} has joined the room!`, {
                position: "top-left",
                autoClose: 2500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                className: "Notification"
              });
              break;
            }
            case "MemberLeft": {
              const leftMember = payload;
              this.deleteLeftMemberFromList(leftMember);
              toast(`${leftMember} has left the room!`, {
                position: "top-left",
                autoClose: 2500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                className: "Notification"
              });
              break;
            }
            case "AddOldMember": {
              const oldMember = payload;
              this.addMemberToList(oldMember);
              break;
            }
            default:
              break;
          }
          break;
        }
        default:
          break;
      }
    });

    // Notify the room on exit
    window.addEventListener("beforeunload", ev => {
      webrtc.sendDirectlyToAll(
        "MembersList",
        "MemberLeft",
        localStorage.getItem("username")
      );
    });
  }

  addMemberToList = member => {
    if (this.state.members.indexOf(member) === -1) {
      this.setState({ members: [...this.state.members, member] });
    }
  };

  deleteLeftMemberFromList = leftMember => {
    if (this.state.members.indexOf(leftMember) !== -1) {
      const newMembers = this.state.members.filter(
        member => member !== leftMember
      );
      this.setState({ members: newMembers });
    }
  };

  _onUsernameSet = username => {
    localStorage.setItem("username", username);
    webrtc.sendDirectlyToAll("MembersList", "NewMember", username);
  };

  _onUpdatePlaylist = ({ action, item }) => {
    console.log("_onUpdatePlaylist", item);
    if (item.type === "video") {
      if (action === "add") {
        this.setState({ playlist: [...this.state.playlist, item.id] });
        webrtc.sendDirectlyToAll("Playlist", "NewVideo", item.id);
      }
      if (action === "remove") {
        const newPlaylist = this.state.playlist.filter(id => id !== item.id);
        this.setState({ playlist: [...newPlaylist] });
        webrtc.sendDirectlyToAll("Playlist", "RemoveVideo", item.id);
      }
    }
    if (item.type === "playlist") {
      // this.setState({playlist: [...this.state.playlist, item.id]})
      // webrtc.sendDirectlyToAll("Playlist", "NewVideo", item.id);
    }
  };

  render() {
    return (
      <>
        <RoomRoot>
          <PlayerPlaceholder />
          <PlaylistPlaceholder>
            <Playlist
              playlist={this.state.playlist}
              onUpdatePlaylist={this._onUpdatePlaylist}
            />
          </PlaylistPlaceholder>
          <CommunicationDashboardPlaceholder>
            <MembersAndMic>
              <MembersList
                membersList={[...this.state.members, this.state.username]}
              />
              <AudioControls />
            </MembersAndMic>
            <Chat />
          </CommunicationDashboardPlaceholder>
        </RoomRoot>
        <NicknamePrompt onUsernameSet={this._onUsernameSet} />
        <ToastContainer />
      </>
    );
  }
}
export default Room;
