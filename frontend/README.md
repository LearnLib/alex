# ALEX frontend

The user interface for ALEX.

## Build instructions

1. `npm install`
2. `npm run build`

## CLI commands

| Command | Description                                             |
|---------|---------------------------------------------------------|
| `build` | Build a bundle for production.                          |
| `dev`   | Watch for file changes and bundle.                      |
| `serve` | Start local HTTP server that serves the frontend files. |

## Run the frontend

- Make sure the backend is running and that the API URL of the backend is configured in *environments.js*.
- Execute `npm run serve -- -p <PORT>` to run the frontend on a web server on a specific port.

## Prepare for production

- In *environments.js*, set the environment variable `apiUrl` to *'/rest'*:

```javascript
export const apiUrl = '/rest';
// export const apiUrl = 'http://localhost:8000/rest';
```
