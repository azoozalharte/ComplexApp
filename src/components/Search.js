import React, { useContext, useEffect } from "react";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import Axios from "axios";
import { Link } from "react-router-dom";
export default function Search() {
  const appDispatch = useContext(DispatchContext);

  const [state, setState] = useImmer({
    searchTerm: "",
    result: [],
    show: "neither",
    requestCount: 0,
  });
  useEffect(() => {
    document.addEventListener("keyup", handleKeyEvent);

    return () => document.removeEventListener("keyup", handleKeyEvent);
  }, []);

  function handleChangeSearch(e) {
    setState((draft) => {
      draft.searchTerm = e.target.value;
    });
  }

  useEffect(() => {
    if (state.searchTerm.trim()) {
      setState((draft) => {
        draft.show = "loading";
      });

      const delay = setTimeout(() => {
        setState((draft) => {
          draft.requestCount++;
        });
      }, 1000);

      return () => clearTimeout(delay);
    } else {
      setState((draft) => {
        draft.show = "nither";
      });
    }
  }, [state.searchTerm]);

  useEffect(() => {
    if (state.requestCount) {
      const ourRequest = Axios.CancelToken.source();
      async function request() {
        try {
          const res = await Axios.post(
            "/search",
            { searchTerm: state.searchTerm },
            { cancelToketn: ourRequest.token }
          );
          setState((draft) => {
            draft.result = res.data;
            draft.show = "result";
          });
        } catch (e) {
          console.log("there was an error or the request is canciled");
        }
      }
      request();
      return () => ourRequest.cancel();
    }
  }, [state.requestCount]);

  function handleKeyEvent(e) {
    if (e.keyCode === 27) {
      appDispatch({ type: "closeSearch" });
    }
  }
  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            autoFocus
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
            onChange={handleChangeSearch}
          />
          <span
            onClick={() => appDispatch({ type: "closeSearch" })}
            className="close-live-search"
          >
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div
            className={`circle-loader ${
              state.show === "loading" ? "circle-loader--visible" : ""
            }`}
          ></div>
          <div
            className={`live-search-results ${
              state.show === "result" ? "live-search-results--visible" : ""
            }`}
          >
            <div className="list-group shadow-sm">
              <div className="list-group-item active">
                <strong>Search Results</strong> ({state.result.length} items
                found)
              </div>
              {state.result &&
                state.result.map((post) => {
                  const date = new Date(post.createdDate);
                  const formateDate = `${date.getDay()}/${
                    date.getMonth() + 1
                  }/${date.getFullYear()}`;
                  return (
                    <Link
                      to={`/post/${post._id}`}
                      key={post._id}
                      onClick={() => appDispatch({ type: "closeSearch" })}
                      className="list-group-item list-group-item-action"
                    >
                      <img
                        className="avatar-tiny"
                        alt="Porfile user"
                        src={post.author.avatar}
                      />{" "}
                      <strong>{post.title}</strong>{" "}
                      <span className="text-muted small">
                        by {post.author.username} on {formateDate}{" "}
                      </span>
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
