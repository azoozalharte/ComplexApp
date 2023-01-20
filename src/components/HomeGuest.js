import PageTitle from "./PageTitle";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";

export default function HomeGuest() {
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
        break;
      case "usernameUniqueResult":
        break;
      case "emailImmediately":
        draft.email.hasError = false;
        draft.email.value = action.value;
        break;
      case "emailAfterDelay":
        break;
      case "emailUniqueResult":
        break;
      case "passwordImmediately":
        draft.password.hasError = false;
        draft.password.value = action.value;
        break;
      case "passwordAfterDelay":
        break;
      case "submitForm":
        break;
      default:
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  function handleSubmit(e) {
    e.preventDefault();
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
                onChange={(e) => {
                  dispatch({
                    type: "emailImmediately",
                    value: e.target.value,
                  });
                }}
              />
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
                onChange={(e) => {
                  dispatch({
                    type: "passwordImmediately",
                    value: e.target.value,
                  });
                }}
              />
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
