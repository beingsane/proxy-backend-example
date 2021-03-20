import { useEffect, useState } from "react";
import "./App.css";

const REFRESH_RATE = 1000 * 60 * 55;

function App() {
  const [accessToken, setAccessToken] = useState<null | string>(null);
  const [refreshToken, setRefreshToken] = useState<null | string>(null);

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const _accessToken = params.get("accessToken");
    const _refreshToken = params.get("refreshToken");

    setAccessToken(_accessToken);
    setRefreshToken(_refreshToken);
  }, []);

  useEffect(() => {
    if (!accessToken || !refreshToken) return;
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((res) => res.json())
      .then(setData);

    // Spotify tokens expire in 1 hour, maintains auth!
    let timeId = setTimeout(() => {
      fetch("http://localhost:5000/auth/refresh?refreshToken=" + refreshToken)
        .then((res) => res.json())
        .then((data) => setAccessToken(data.accessToken));
    }, REFRESH_RATE);

    return () => clearTimeout(timeId);
  }, [accessToken, refreshToken]);

  const isAuthenticated = !!data;

  return (
    <>
      <a href="http://localhost:5000/auth/spotify">Login to spotify</a>
      <h2>Authenticated? {isAuthenticated ? "yes" : "no"} </h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

export default App;
