import Axios from "axios";
import { useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { useImmerReducer } from "use-immer";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
// comonents
import PageTitle from "./PageTitle";
import NotFound from "./NotFound";
export default function EditPost() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  const originalState = {
    title: {
      value: "",
      hasError: false,
      message: "",
    },
    body: {
      value: "",
      hasError: false,
      message: "",
    },
    isLodding: true,
    isSaveing: false,
    id: useParams().id,
    sendCount: 0,
    noData: false,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "featchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isLodding = false;
        break;
      case "titleChange":
        draft.title.hasError = false;
        draft.title.value = action.value;
        break;
      case "bodyChange":
        draft.body.hasError = false;
        draft.body.value = action.value;
        break;
      case "submitForm":
        if (!draft.title.hasError && !draft.body.hasError) {
          draft.sendCount++;
        }
        break;
      case "saveRequestStarted":
        draft.isSaveing = true;
        break;
      case "saveRequestFinshed":
        draft.isSaveing = false;
        break;
      case "titleRules":
        if (!action.value.trim()) {
          draft.title.hasError = true;
          draft.title.message = "Please Porived value in the title";
        }
        break;
      case "bodyRules":
        if (!action.value.trim()) {
          draft.body.hasError = true;
          draft.body.message = "Please Porived value in the body";
        }
        break;
      case "notFound":
        draft.isLodding = false;
        draft.noData = true;
        break;
      default:
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function featchPost() {
      try {
        const res = await Axios.get(`/post/${state.id}`, {
          cancelToken: ourRequest.token,
        });
        if (res.data) {
          dispatch({ type: "featchComplete", value: res.data });
          if (appState.user.username !== res.data.author.username) {
            appDispatch({
              type: "flashMessage",
              value: "You don't have premition to edit this post",
            });
            navigate("/");
          }
        } else {
          dispatch({ type: "notFound" });
        }
      } catch (error) {
        console.log("there was an error");
      }
    }

    featchPost();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "saveRequestStarted" });
      const ourRequest = Axios.CancelToken.source();
      async function featchPost() {
        try {
          await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token,
            },
            {
              cancelToken: ourRequest.token,
            }
          );
          appDispatch({ type: "flashMessage", value: "Post Edited" });
          dispatch({ type: "saveRequestFinshed" });
          navigate(`/post/${state.id}`);
        } catch (error) {
          console.log("some error here");
        }
      }

      featchPost();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: "titleRules", value: state.title.value });
    dispatch({ type: "bodyRules", value: state.body.value });
    dispatch({ type: "submitForm" });
  }
  if (state.isLodding) return <LoadingDotsIcon />;
  if (state.noData) return <NotFound />;
  return (
    <PageTitle title="Edit Post">
      <Link to={`/post/${state.id}`}>Go back to post</Link>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            onBlur={(e) =>
              dispatch({ type: "titleRules", value: e.target.value })
            }
            onChange={(e) =>
              dispatch({ type: "titleChange", value: e.target.value })
            }
            value={state.title.value}
          />
          {state.title.hasError && (
            <div className="alert alert-danger liveValidateMessage">
              {state.title.message}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            value={state.body.value}
            onBlur={(e) =>
              dispatch({ type: "bodyRules", value: e.target.value })
            }
            onChange={(e) =>
              dispatch({ type: "bodyChange", value: e.target.value })
            }
          />
          {state.body.hasError && (
            <div className="alert alert-danger liveValidateMessage">
              {state.body.message}
            </div>
          )}
        </div>

        <button
          className="btn btn-primary"
          disabled={
            state.isSaveing || state.body.hasError || state.title.hasError
          }
        >
          {state.isSaveing ? "Saving..." : "Save Updates"}
        </button>
      </form>
    </PageTitle>
  );
}
