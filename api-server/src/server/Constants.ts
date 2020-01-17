// Basic settings
export let PORT = 4000;
export const IP = "localhost";

// if (process.env.NODE_ENV === "production") {
//   PORT = 80;
// }
var SERVER_URL = `http://${IP}:${PORT}/parse`;
if (typeof window != "undefined") {
  SERVER_URL = window.location.hostname + `:${PORT}/parse`;
  alert(SERVER_URL);
}

export const CONSTANTS = {
  APP_ID: "psignApp",
  MASTER_KEY: "psignApp",
  APP_NAME: "Pangaea Server",
  SERVER_URL: SERVER_URL,
  DATABASE_URI: "postgres://psign:psign@localhost:5432/psign",
  UPLOAD_FOLDER: "./uploads" // __dirname + "./uploads"
};
