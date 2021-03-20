The client is written quick and dirty, just to showcase how it works. For production apps I recommend rewriting it because it has some flaws.

Something to note about the refresh token is that its probably best to persist it on the server for the given user and get it when the user wants to refresh their access token. This means that the refresh token will never leave the backend and never reaches the client.

The oauth2 examples still requires some work but I will leave that up to you.

- express-sessions
- logout
- persist user in database and add refresh token
- Upon browser refresh the client doesn't know about the expiry date!
- You are logged out after a refresh. Store the access token in a cookie / localstorage.
