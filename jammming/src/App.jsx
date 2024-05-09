import React from "react";
import "./App.css";
import logo from "./logo.png";
import SearchBar from "./components/SearchBar";

function App() {
  return (
    <div className="App">
      <nav>
        <img src={logo} alt="logo" />
      </nav>
      <div>
        <div className="search-bar-container">
          <SearchBar />
          <h1 style={{color:"red"}}>allora</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
