import React from "react";
import "./index.css";

const Message = props => {
  const { text, author } = props.message;
  return (
    <>
      <span className={author === "self" ? "chatMessageSelf" : "chatMessage"}>
        {text}
      </span>
      <br />
    </>
  );
};

export default Message;
