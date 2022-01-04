import http from "./http.js";

export function sendFcmToken(token) {
  console.log('Sending token to server...');
  return http.post("/users/devices/token", { token: token }).then(response => {
    if(response.status == 200) {
      console.log("Token sent to server!");
      window.localStorage.setItem('fcmTokenSent', 'true');
      return true;
    } else {
      console.log("There was an error sending the token to the server!");
      console.error(response.json());
      return false;
    }
  });
}