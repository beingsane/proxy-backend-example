import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [token, setToken] = useState<null | string>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const _token = params.get("token");

    setToken(_token);
  }, []);

  useEffect(() => {
    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then(setData);
    }
  }, [token]);

  const isAuthenticated = !!token;

  return (
    <>
      <a href="http://localhost:5000/auth/spotify">Login to spotify</a>
      <h2>Authenticated? {isAuthenticated ? "yes" : "no"} </h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

export default App;
