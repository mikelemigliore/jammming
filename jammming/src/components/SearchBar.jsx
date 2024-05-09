import React, { useState } from "react";
import "./SearchBar.css";
import { IoSearchCircleSharp } from "react-icons/io5";

function SearchBar() {
  const spotifyUrl = "https://api.spotify.com/v1/search";
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState("");

  const fetchData = async () => {
    try {
      //Post to send a request of permission in the form of an access_token to access API data
      const authRepsonse = await fetch(
        "https://accounts.spotify.com/api/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials&client_id=fea0709279ed4657b71b9303bd4205f2&client_secret=1d6f9baca00448d4a06e895c2609aadc",
        }
      );
      const res = await authRepsonse.json();

      //GET  to receive the specific data indicated ion the input and using the access_token as credentials
      const urlToFetch = `${spotifyUrl}?q=remaster%2520track%3ADoxy%2520artist%3A${input}&type=track`;
      const response = await fetch(urlToFetch, {
        headers: {
          Authorization: "Bearer " + res.access_token,
        },
      });

      const data = await response.json();

      console.log(data);
      setUsers(data.tracks.items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchData();
    }
  };

  return (
    <>
      <div className="input-wrapper">
        <input
          id="search"
          placeholder="Type Song,Artist, or Album"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <IoSearchCircleSharp id="icon" onClick={fetchData} />
      </div>
      <div className="results-wrapper">
        <h1>Results</h1>
        {users.map((track) => (
          <div key={track.id} className="result-text">
            {track.name}
          </div>
        ))}
      </div>
    </>
  );
}

export default SearchBar;

// In your fetchData function, the POST and GET requests are used sequentially to first authenticate with the Spotify API and then retrieve data based on the authentication provided by the first request. Here's a step-by-step breakdown of how these two requests correlate and work together in your context:

// 1. POST Request: Authentication
// Purpose: The initial POST request is made to the Spotify token endpoint (https://accounts.spotify.com/api/token). The goal here is to authenticate your application by proving that it has the credentials (client ID and client secret) to access the Spotify API. This is necessary because Spotify requires a valid access token for most of its API endpoints to ensure that requests are authorized.
// Data Sent: This request sends the client ID and client secret, along with the grant_type parameter set to client_credentials, which tells Spotify that your application is using the Client Credentials OAuth flow. This is typical for server-to-server authentication where no user data is required, just access to general, non-user-specific information like fetching songs from a particular artist.
// Response Received: If the credentials are valid, Spotify responds with a JSON object that includes an access token. This access token is essentially a temporary "key" that your application will use to access other Spotify API endpoints.
// 2. GET Request: Data Retrieval
// Purpose: Once you have the access token, the GET request is made to fetch data from the Spotify API. In your specific example, this might be used to retrieve tracks related to a particular search query. This request is where you actually use the access token obtained from the POST request.
// Headers and Authentication: The GET request includes an Authorization header, which uses the access token in the format Bearer ${access_token}. This header is crucial as it proves to the Spotify API that your request is authorized to access the data. Without this header, or if the token is invalid or expired, Spotify would reject the request.
// Data Retrieved: The specific endpoint and the parameters you include in the URL determine what data you get back. For instance, if you're querying the /v1/search endpoint with parameters related to an artist and track, Spotify returns data that matches your query, typically in JSON format.
// How They Correlate:
// Sequential Dependency: The GET request depends on the success of the POST request. Without a successful POST request that provides a valid access token, the GET request cannot authenticate properly and will fail to retrieve the desired data.
// Use of the Access Token: The direct correlation is that the access token acquired from the POST request must be used in the Authorization header of the GET request. This is a typical pattern in OAuth-secured APIs where a token obtained through a "token endpoint" (via a POST request) is used for subsequent API interactions (via GET or other HTTP methods).
// Error Handling: Both requests should ideally include error handling. If the POST request fails, the application should not attempt the GET request since it won't have a valid token. Similarly, the GET request should handle errors that might arise due to issues like an expired token, insufficient permissions, or network problems.
// By understanding the role and correlation of these requests, you can effectively manage interactions with APIs that require OAuth authentication, like Spotify. This method ensures secure and authorized access to APIs while maintaining the confidentiality and integrity of both the credentials and the data accessed.
