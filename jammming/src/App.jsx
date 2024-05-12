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
        <div>
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

export default App;
