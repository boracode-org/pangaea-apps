// Basic settings
export let PORT = parseInt(process.env.PORT, 10) || 80;
export const IP = "localhost";

// if (process.env.NODE_ENV === "production") {
//   PORT = 80;
// }
var SERVER_URL = process.env.SERVER_URL || "https://psign.zeus.iriosystems.com/parse"//`http://${IP}:${PORT}/parse`;
if (typeof window != "undefined") {
  SERVER_URL = window.location.hostname + `:${PORT}/parse`;
  // alert(SERVER_URL);
}

export const CONSTANTS = {
  APP_ID: "psignApp",
  MASTER_KEY: "psignApp",
  APP_NAME: "Pangaea Server",
  SERVER_URL: SERVER_URL,
  DATABASE_URI: process.env.DATABASE_URL
    ? process.env.DATABASE_URL 
    : "postgres://psign:psign@localhost:5432/psign",
  UPLOAD_FOLDER: "/storage" // __dirname + "./uploads"
};


