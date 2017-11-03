## Run the frontend

- Make sure the backend is running and that the API URL of the backend is configured in *env.js*
- Execute `npm run serve -- -p <PORT>` to run the frontend on a webserver on a specific port

## Prepare for production

- In *env.js*, set the environment variable `window.__env.apiUrl` to *'/rest'*