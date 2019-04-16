import React from "react";
import { ChatFeed, Message } from "react-chat-ui";

import { usePeerState, useReceivePeerState } from "react-peer";

import "./index.css";

const Chat = props => {
  const [typingMessage, setTypingMessage] = React.useState({
    message: "",
    isTyping: false
  });

  //chat logic
  const [state, setState, brokerId, connections, stateErr] = usePeerState(
    "hello",
    { brokerId: "sadsadsa" }
  );
  const [peerBrokerId, setPeerBrokerId] = React.useState("");
  const [peerState, isConnected, recErr] = useReceivePeerState("sadsadsa", {
    brokerId: "sadsadsa"
  });

  const [messages, setMessages] = React.useState([
    new Message({
      id: 1,
      message: "I'm the recipient! (The person you're talking to)"
    }), // Gray bubble
    new Message({ id: 0, message: "I'm you -- the blue bubble!" }),
    new Message({ id: 0, message: "I'm you -- the blue bubble!" }),
    new Message({ id: 0, message: "I'm you -- the blue bubble!" })
  ]);

  const sendMessage = message => {
    console.log(message);
  };

  const isTyping = e => {
    setTypingMessage({ message: e.target.value, isTyping: true });
    props.setIsThemTyping(true);
  };

  return (
    <>
      <div className="chatRoot">
        <ChatFeed
          messages={messages} // Boolean: list of message objects
          isTyping={props.isThemTyping} // Boolean: is the recipient typing
          hasInputField={false} // Boolean: use our input, or use your own
          showSenderName // show the name of the user who sent the message
          bubblesCentered={true} //Boolean should the bubbles be centered in the feed?
          // JSON: Custom bubble styles
          bubbleStyles={{
            text: {
              fontSize: 15
            },
            chatbubble: {
              borderRadius: 70,
              padding: 20
            }
          }}
        />
      </div>
      <div>
        <input type="text" onChange={isTyping} />
        <button onClick={e => sendMessage(typingMessage)}>send</button>
      </div>
    </>
  );
};

export default Chat;
