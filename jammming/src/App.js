import React from "react";
import "./App.css";
import logo from "./logo.png";
import Search from "./Search";

function App() {
  return (
    <div>
      <nav>
        <img src={logo} alt="logo" />
      </nav>
        <Search />
    </div>
  );
}

export default App;
