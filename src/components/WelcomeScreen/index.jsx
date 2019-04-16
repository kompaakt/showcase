import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components/macro";

const Container = styled.div`
  background: ${props => props.theme.gradient};
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
`;

const Actions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const JoinButton = styled.input`
  border: 0px;
  background: ${props => props.theme.button.color};
  background-size: 400% 400%;
  border-radius: 20px;
  margin: 1%;
  font-size: ${props => props.theme.font.size.main};
  width: 50%;
  height: 20%;
  font-family: ${props => props.theme.font.name};
  text-align: center;
`;

const CreateButton = styled.button`
  border: 0px;
  background: ${props => props.theme.button.color};
  background-size: 400% 400%;
  color: black;
  border-radius: 20px;
  margin: 1%;
  font-size: ${props => props.theme.font.size.main};
  width: 50%;
  height: 20%;
  font-family: ${props => props.theme.font.name};
  &:focus {
    outline-width: 0;
  }
`;

const WelcomeScreen = props => {
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
    <Container>
      <Actions>
        <JoinButton
          type="text"
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
        <CreateButton onClick={setRoom}>create</CreateButton>
      </Actions>
    </Container>
  );
};

export default WelcomeScreen;
