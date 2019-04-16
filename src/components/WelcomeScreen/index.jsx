import React, { useState } from "react";
import "./index.css";
import { Redirect } from "react-router-dom";

export default () => {
  const [isHost, setIsHost] = useState(false);

  const [roomId, setRoomId] = useState("");

  // const [isFocusedCreateBtn, setIsFocusedCreateBtn] = React.useState(false);

  const handleSetRoomId = e => {
    if (e.keyCode === 13) {
      setRoomId(e.target.value);
    }
  };

  const generateRoomId = idLentgh => {
    const dec2hex = dec => ("0" + dec.toString(16)).substr(-2);
    var arr = new Uint8Array((idLentgh || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join("");
  };

  const setRoom = () => {
    setIsHost(true);
    setRoomId(generateRoomId(20));
  };

  return (
    <div className="container">
      <div className="actions">
        <input
          type="text"
          className="btn join"
          placeholder="join"
          onKeyDown={handleSetRoomId}
        />
        {roomId ? (
          <Redirect to={{ pathname: `/room/${roomId}`, isHost }} />
        ) : null}
        {/* <input
          type="text"
          className="btn create"
          placeholder={isFocusedCreateBtn ? "enter room id" : "create"}
          onFocus={e => setIsFocusedCreateBtn(true)}
          onBlur={e => setIsFocusedCreateBtn(false)}
          onKeyDown={handleSetRoomId}
        /> */}
        <button className="btn create" onClick={setRoom}>
          create
        </button>
      </div>
    </div>
  );
};
