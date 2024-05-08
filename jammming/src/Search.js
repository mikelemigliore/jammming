import "./Search.css";
import React, { useState, useEffect } from "react";

function Search() {
  const [search, setSearch] = useState(0);

  const musicSearch = () => {
    setSearch(search + 1);
  };

  return (
    <div>
      <p>Count: {search}</p>
      <button onClick={musicSearch}>Search</button>
    </div>
  );
}

export default Search;
