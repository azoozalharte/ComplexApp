import { useContext } from "react";
import { Link } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
export default function HeaderLoggedIn() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  function handleLogout() {
    appDispatch({ type: "logout" });
  }

  function handleSearchIcon(e) {
    e.preventDefault();
    appDispatch({ type: "showSearch" });
  }
  return (
    <div className="flex-row my-3 my-md-0">
      <a
        onClick={handleSearchIcon}
        href="#"
        className="text-white mr-2 header-search-icon"
      >
        <i className="fas fa-search"></i>
      </a>
      <span
        onClick={() => {
          appDispatch({ type: "toggleChat" });
        }}
        className="mr-2 header-chat-icon text-white"
      >
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <Link to={`/profile/${appState.user.username}`} className="mr-2">
        <img
          className="small-header-avatar"
          src={appState.user.avatar}
          alt=""
        />
      </Link>
      <Link className="btn btn-sm btn-success mr-2" to="/create-post">
        Create Post
      </Link>
      <button onClick={handleLogout} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
}
