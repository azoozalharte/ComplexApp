import { useState } from "react";
import { Link } from "react-router-dom";
import HeaderLoggedIn from "./HeaderLoggedIn";
import HeaderLoggedOut from "./HeaderLoggedOut";

export default function Header({ isLoggedIn, setIsLoggedIn }) {
  return (
    <div>
      <header className="header-bar bg-primary mb-3">
        <div className="container d-flex flex-column flex-md-row align-items-center p-3">
          <h4 className="my-0 mr-md-auto font-weight-normal">
            <Link to="/" className="text-white">
              {" "}
              ComplexApp{" "}
            </Link>
          </h4>
          {isLoggedIn ? (
            <HeaderLoggedIn setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <HeaderLoggedOut setIsLoggedIn={setIsLoggedIn} />
          )}
        </div>
      </header>
    </div>
  );
}
