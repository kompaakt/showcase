import React from "react";

import Message from "./Message";
import "./index.css";

const messages = [
  { text: "dasdsadas", author: "self" },
  { text: "dasdsadas", author: "another" },
  { text: "dasdsadas", author: "another" },
  { text: "dasdsadas", author: "another" },
  { text: "dasdsadas", author: "another" }
];

const Chat = props => {
  return (
    <div className="chatRoot">
      {messages.map(message => (
        <Message message={message} />
      ))}
    </div>
  );
};

export default Chat;
