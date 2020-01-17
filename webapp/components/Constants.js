export let PORT = 4000;
export const IP = "localhost";
var SERVER_URL = `http://${IP}:${PORT}/parse`
if (typeof window != "undefined") {
  SERVER_URL = window.location.hostname + `:${PORT}/parse`;
  // alert(SERVER_URL);
}
export default {
    SERVER_URL: "http://psign.iriosystems.com:8080"
}