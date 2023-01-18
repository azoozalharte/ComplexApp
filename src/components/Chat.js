import React, { useContext, useEffect, useRef } from "react";
import { useImmer } from "use-immer";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import io from "socket.io-client";
import { Link } from "react-router-dom";
const socket = io("http://localhost:8080");
export default function Chat() {
  const chatRef = useRef(null);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    chatFild: "",
    chatMessages: [],
    isConnected: socket.connected,
  });
  useEffect(() => {
    if (appState.isChatOpen) {
      chatRef.current.focus();
    }
  }, [appState.isChatOpen]);

  useEffect(() => {
    socket.on("chatFromServer", (message) => {
      setState((draft) => {
        draft.chatMessages.push(message);
      });
    });

    return () => {
      socket.off("chatFromServer");
    };
  }, []);

  function handleFildChange(e) {
    const value = e.target.value;
    setState((draft) => {
      draft.chatFild = value;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    socket.emit("chatFromBrowser", {
      message: state.chatFild,
      token: appState.user.token,
    });
    setState((draft) => {
      draft.chatMessages.push({
        message: draft.chatFild,
        username: appState.user.username,
        avatar: appState.user.avatar,
      });
      draft.chatFild = "";
    });
  }
  return (
    <div
      id="chat-wrapper"
      className={`chat-wrapper ${
        appState.isChatOpen ? "chat-wrapper--is-visible" : ""
      } shadow border-top border-left border-right`}
    >
      <div className="chat-title-bar bg-primary">
        Chat
        <span
          onClick={() => {
            appDispatch({ type: "closeChat" });
          }}
          className="chat-title-bar-close"
        >
          <i className="fas fa-times-circle"></i>
        </span>
      </div>
      <div id="chat" className="chat-log">
        {state.chatMessages.map((message, index) => {
          if (message.username === appState.user.username) {
            return (
              <div className="chat-self" key={index}>
                <div className="chat-message">
                  <div className="chat-message-inner">{message.message}</div>
                </div>
                <img
                  className="chat-avatar avatar-tiny"
                  alt=""
                  src={message.avatar}
                />
              </div>
            );
          }
          return (
            <div className="chat-other" key={index}>
              <Link to={`profile/${message.username}`}>
                <img className="avatar-tiny" alt="" src={message.avatar} />
              </Link>
              <div className="chat-message">
                <div className="chat-message-inner">
                  <Link to={`/profile/${message.username}`}>
                    <strong>{message.username}</strong>{" "}
                  </Link>
                  {message.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        id="chatForm"
        className="chat-form border-top"
      >
        <input
          type="text"
          className="chat-field"
          id="chatField"
          placeholder="Type a message…"
          autoComplete="off"
          ref={chatRef}
          value={state.chatFild}
          onChange={handleFildChange}
        />
      </form>
    </div>
  );
}
