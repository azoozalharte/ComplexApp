import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Axios from "axios";

// components
import About from "./components/About";
import CreatePost from "./components/CreatePost";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import HomeGuest from "./components/HomeGuest";
import Terms from "./components/Terms";
import ViewSinglePost from "./components/ViewSinglePost";

Axios.defaults.baseURL = "http://localhost:8080/";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("complexappToken"))
  );
  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <HomeGuest />} />
        <Route path="/post/:id" element={<ViewSinglePost />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="/create-post"
          element={<CreatePost />}
          isLoggedIn={isLoggedIn}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
