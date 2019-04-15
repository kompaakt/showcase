import React, { Component } from "react";
import YOUTUBE_API from "../../../../config";
import "./index.css";

export default class VideoEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: null,
      icon: null,
      info: null
    };
  }

  componentDidMount() {
    fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${
        this.state.id
      }&part=snippet&key=${YOUTUBE_API}`
    )
      .then(resp => resp.json())
      .then(data => {
        this.setState({ info: data.items[0] });
      });
  }

  handleClickRemove = () => {
    this.props.handleRemove(this.state.id);
  };

  handleClickPlay = () => {
    this.props.handlePlay(this.state.id);
  };

  render() {
    return (
      <React.Fragment>
        {this.state.info ? (
          <div className="videoEntryRoot">
            <img
              src={this.state.info.snippet.thumbnails.default.url}
              alt={this.state.info.snippet.title}
            />
            <b>{this.state.info.snippet.title}</b>
            <div className="controlButtons">
              <button
                className="playVideoButton"
                onClick={this.handleClickPlay}
              >
                <span role="img">Play</span>
              </button>
              <button
                className="removeVideoButton"
                onClick={this.handleClickRemove}
              >
                <span role="img">X</span>
              </button>
            </div>
          </div>
        ) : (
          this.state.id
        )}
      </React.Fragment>
    );
  }
}
