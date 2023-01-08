import Axios from "axios";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { useImmerReducer } from "use-immer";
import StateContext from "../StateContext";

// comonents
import PageTitle from "./PageTitle";
export default function EditPost() {
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
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "featchComplete":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isLodding = false;
        break;
      case "editTitle":
        draft.title.value = action.value;
        break;
      case "editBody":
        draft.body.value = action.value;
        break;
      case "submitForm":
        console.log("Azoozka");
        draft.sendCount++;
        break;
      case "saveRequestStarted":
        draft.isSaveing = true;
        break;
      case "saveRequestFinshed":
        draft.isSaveing = false;
        break;
      default:
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);
  const appState = useContext(StateContext);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function featchPost() {
      try {
        const res = await Axios.get(`/post/${state.id}`, {
          cancelToken: ourRequest.token,
        });
        console.log(`our request ${ourRequest.token}`);
        dispatch({ type: "featchComplete", value: res.data });
      } catch (error) {
        console.log(error);
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
          dispatch({ type: "saveRequestFinshed" });
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
    dispatch({ type: "submitForm" });
  }
  if (state.isLodding) return <LoadingDotsIcon />;

  return (
    <PageTitle title="Edit Post">
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
            onChange={(e) =>
              dispatch({ type: "editTitle", value: e.target.value })
            }
            value={state.title.value}
          />
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
            onChange={(e) =>
              dispatch({ type: "editBody", value: e.target.value })
            }
          />
        </div>

        <button className="btn btn-primary" disabled={state.isSaveing}>
          {state.isSaveing ? "Saving..." : "Save Updates"}
        </button>
      </form>
    </PageTitle>
  );
}
