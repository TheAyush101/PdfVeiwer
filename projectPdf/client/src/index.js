import React from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from '@auth0/auth0-react'; // Import Auth0Provider
import "./index.css";
import App from "./App";



const root = document.getElementById("root");
const reactRoot = createRoot(root);
reactRoot.render(
  <Auth0Provider
    domain="ayushbalpande.us.auth0.com"
    clientId="0xKGFZuVfSobBwuV1E68SQvy98F3ndRg"
    redirectUri={window.location.origin}
  >
    <App />
  </Auth0Provider>
);
