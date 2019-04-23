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
      members: []
    };
  }

  roomId = this.props.match.params.roomId;
  isHost = this.props.location.isHost;

  componentDidMount() {
    // Create or join the room
    if (this.roomId && this.isHost) {
      webrtc.createRoom(this.roomId, () => {});
    } else if (this.roomId) {
      webrtc.joinRoom(this.roomId, () => {
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

  render() {
    return (
      <>
        <RoomRoot>
          <PlayerPlaceholder />
          <PlaylistPlaceholder />
          <CommunicationDashboardPlaceholder>
            {this.state.username ? <div>{this.state.username}</div> : null}
            {this.state.members && this.state.members.length > 0
              ? this.state.members.map(member => <div>{member}</div>)
              : null}
          </CommunicationDashboardPlaceholder>
        </RoomRoot>
        <NicknamePrompt onUsernameSet={this._onUsernameSet} />
        <ToastContainer />
      </>
    );
  }
}
export default Room;
