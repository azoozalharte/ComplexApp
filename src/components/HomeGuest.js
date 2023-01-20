import PageTitle from "./PageTitle";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";
import { useEffect } from "react";
import { useContext } from "react";
import DispatchContext from "../DispatchContext";

export default function HomeGuest() {
  const appDispatch = useContext(DispatchContext);
  const initialState = {
    username: {
      value: "",
      hasError: false,
      message: "",
      isUnique: false,
      cheackCount: 0,
    },
    email: {
      value: "",
      hasError: false,
      message: "",
      isUnique: false,
      cheackCount: 0,
    },
    password: {
      value: "",
      hasError: false,
      message: "",
    },
    submitCount: 0,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "usernameImmediately":
        draft.username.hasError = false;
        draft.username.value = action.value;
        if (draft.username.value.length > 30) {
          draft.username.hasError = true;
          draft.username.message = "Username must be under 30 charchter";
        }

        if (
          draft.username.value &&
          !/^([a-zA-Z0-9]+)$/.test(draft.username.value)
        ) {
          draft.username.hasError = true;
          draft.username.message = "Username must just have litters and number";
        }
        break;
      case "usernameAfterDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasError = true;
          draft.username.message = "Username must have more then 3 charcters";
        }

        if (!draft.username.hasError && !action.noRequest) {
          draft.username.cheackCount++;
        }
        break;
      case "usernameUniqueResult":
        if (action.value) {
          draft.username.hasError = true;
          draft.username.isUnique = false;
          draft.username.message = "Username is already exists";
        } else {
          draft.username.isUnique = true;
        }
        break;
      case "emailImmediately":
        draft.email.hasError = false;
        draft.email.value = action.value;
        break;
      case "emailAfterDelay":
        if (
          !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            draft.email.value
          )
        ) {
          draft.email.hasError = true;
          draft.email.message = "You must provide a vaild email address";
        }

        if (!draft.email.hasError && !action.noRequest) {
          draft.email.cheackCount++;
        }
        break;
      case "emailUniqueResult":
        if (action.value) {
          draft.email.hasError = true;
          draft.email.isUnique = false;
          draft.email.message = "email is already exists";
        } else {
          draft.email.isUnique = true;
        }
        break;
      case "passwordImmediately":
        draft.password.hasError = false;
        draft.password.value = action.value;
        if (draft.password.value.length > 50) {
          draft.password.hasError = true;
          draft.password.message = "Password cannot exceed 50 characters.";
        }
        break;
      case "passwordAfterDelay":
        if (draft.password.value.length < 8) {
          draft.password.hasError = true;
          draft.password.message = "Password must be at least 7 characters.";
        }
        break;
      case "submitForm":
        if (
          !draft.username.hasError &&
          draft.username.isUnique &&
          !draft.email.hasError &&
          draft.email.isUnique &&
          !draft.password.hasError
        ) {
          draft.submitCount++;
        }
        break;
      case "userCreated":
        draft.username.value = "";
        draft.email.value = "";
        draft.password.value = "";
      default:
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(
        () => dispatch({ type: "usernameAfterDelay" }),
        900
      );
      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(
        () => dispatch({ type: "emailAfterDelay" }),
        900
      );
      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(
        () => dispatch({ type: "passwordAfterDelay" }),
        900
      );
      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  useEffect(() => {
    if (state.username.cheackCount) {
      const ourRequest = Axios.CancelToken.source();
      async function request() {
        try {
          const res = await Axios.post(
            "/doesUsernameExist",
            { username: state.username.value },
            { cancelToketn: ourRequest.token }
          );

          dispatch({ type: "usernameUniqueResult", value: res.data });
        } catch (e) {
          console.log("there was an error or the request is canciled");
        }
      }
      request();
      return () => ourRequest.cancel();
    }
  }, [state.username.cheackCount]);

  useEffect(() => {
    if (state.email.cheackCount) {
      const ourRequest = Axios.CancelToken.source();
      async function request() {
        try {
          const res = await Axios.post(
            "/doesEmailExist",
            { email: state.email.value },
            { cancelToketn: ourRequest.token }
          );

          dispatch({ type: "emailUniqueResult", value: res.data });
        } catch (e) {
          console.log("there was an error or the request is canciled");
        }
      }
      request();
      return () => ourRequest.cancel();
    }
  }, [state.email.cheackCount]);

  useEffect(() => {
    if (state.submitCount) {
      const ourRequest = Axios.CancelToken.source();
      async function request() {
        try {
          const res = await Axios.post(
            "/register",
            {
              username: state.username.value,
              email: state.email.value,
              password: state.password.value,
            },
            { cancelToketn: ourRequest.token }
          );
          if (res.data) {
            appDispatch({
              type: "flashMessage",
              value: "user created successfully You can login now.",
            });
            dispatch({ type: "userCreated" });
          }
        } catch (e) {
          console.log("there was an error or the request is canciled");
        }
      }
      request();
      return () => ourRequest.cancel();
    }
  }, [state.submitCount]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({
      type: "usernameImmediately",
      value: state.username.value,
    });
    dispatch({
      type: "usernameAfterDelay",
      value: state.username.value,
      noRequest: true,
    });
    dispatch({
      type: "emailImmediately",
      value: state.email.value,
    });
    dispatch({
      type: "emailAfterDelay",
      value: state.email.value,
      noRequest: true,
    });
    dispatch({ type: "passwordImmediately", value: state.password.value });
    dispatch({ type: "passwordAfterDelay", value: state.password.value });
    dispatch({ type: "submitForm" });
  }
  return (
    <PageTitle title="Welcome!" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">
            Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
            posts that are reminiscent of the late 90&rsquo;s email forwards? We
            believe getting back to actually writing is the key to enjoying the
            internet again.
          </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
                value={state.username.value}
                onChange={(e) => {
                  dispatch({
                    type: "usernameImmediately",
                    value: e.target.value,
                  });
                }}
              />
              <CSSTransition
                in={state.username.hasError}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger liveValidateMessage">
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
                value={state.email.value}
                onChange={(e) => {
                  dispatch({
                    type: "emailImmediately",
                    value: e.target.value,
                  });
                }}
              />
              <CSSTransition
                in={state.email.hasError}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger liveValidateMessage">
                  {state.email.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Create a password"
                value={state.password.value}
                onChange={(e) => {
                  dispatch({
                    type: "passwordImmediately",
                    value: e.target.value,
                  });
                }}
              />
              <CSSTransition
                in={state.password.hasError}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger liveValidateMessage">
                  {state.password.message}
                </div>
              </CSSTransition>
            </div>
            <button
              type="submit"
              className="py-3 mt-4 btn btn-lg btn-success btn-block"
            >
              Sign up for ComplexApp
            </button>
          </form>
        </div>
      </div>
    </PageTitle>
  );
}
