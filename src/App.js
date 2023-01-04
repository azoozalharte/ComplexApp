import { useState, useReducer } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

Axios.defaults.baseURL = "http://localhost:8080/";

function App() {
  const initialState = {
    isLoggedIn: Boolean(localStorage.getItem("complexappToken")),
    flashMessages: [],
  };

  function ourReducer(state, action) {
    switch (action.type) {
      case "login":
        return { isLoggedIn: true, flashMessages: state.flashMessages };
      case "logout":
        return { isLoggedIn: false, flashMessages: state.flashMessages };
      case "flashMessage":
        return {
          isLoggedIn: state.isLoggedIn,
          flashMessages: state.flashMessages.concat(action.value),
        };
      default:
        return 0;
    }
  }

  const [state, dispatch] = useReducer(ourReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Header />
          <FlashMessages messages={state.flashMessages} />
          <Routes>
            <Route
              path="/"
              element={state.isLoggedIn ? <Home /> : <HomeGuest />}
            />
            <Route path="/post/:id" element={<ViewSinglePost />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/create-post" element={<CreatePost />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
