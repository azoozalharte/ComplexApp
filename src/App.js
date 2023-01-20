import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
// components
import About from "./components/About";
import CreatePost from "./components/CreatePost";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import HomeGuest from "./components/HomeGuest";
import Terms from "./components/Terms";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
import Search from "./components/Search";
import Chat from "./components/Chat";

Axios.defaults.baseURL = "http://localhost:8080/";

function App() {
  const initialState = {
    isLoggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
    isDanger: false,
    user: {
      token: localStorage.getItem("complexappToken"),
      username: localStorage.getItem("complexappUsername"),
      avatar: localStorage.getItem("complexappAvatar"),
    },
    isSearch: false,
    isChatOpen: false,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.isLoggedIn = true;
        draft.user = action.data;
        break;
      case "logout":
        draft.isLoggedIn = false;
        break;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        draft.isDanger = action.isDanger;
        break;
      case "showSearch":
        draft.isSearch = true;
        break;
      case "closeSearch":
        draft.isSearch = false;
        break;
      case "toggleChat":
        draft.isChatOpen = !draft.isChatOpen;
        break;
      case "closeChat":
        draft.isChatOpen = false;
        break;
      default:
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.isLoggedIn) {
      localStorage.setItem("complexappToken", state.user.token);
      localStorage.setItem("complexappUsername", state.user.username);
      localStorage.setItem("complexappAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("complexappToken");
      localStorage.removeItem("complexappUsername");
      localStorage.removeItem("complexappAvatar");
    }
  }, [state.isLoggedIn]);

  useEffect(() => {
    if (state.isLoggedIn) {
      const ourRequest = Axios.CancelToken.source();
      async function request() {
        try {
          const res = await Axios.post(
            "/checkToken",
            { token: state.user.token },
            { cancelToketn: ourRequest.token }
          );

          if (!res.data) {
            dispatch({ type: "logout" });
            dispatch({
              type: "flashMessage",
              value: "please loggin again",
              isDanger: true,
            });
          }
        } catch (e) {
          console.log("there was an error or the request is canciled");
        }
      }
      request();
      return () => ourRequest.cancel();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Header />
          <FlashMessages
            messages={state.flashMessages}
            isDanger={state.isDanger}
          />
          <Routes>
            <Route
              path="/"
              element={state.isLoggedIn ? <Home /> : <HomeGuest />}
            />
            <Route path="/post/:id" element={<ViewSinglePost />} />
            <Route path="/post/:id/edit" element={<EditPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/profile/:username/*" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CSSTransition
            timeout={330}
            in={state.isSearch}
            classNames="search-overlay"
            unmountOnExit
          >
            <Search />
          </CSSTransition>
          <Chat />
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
