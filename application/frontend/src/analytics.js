// src/analytics.js
import ReactGA from "react-ga4";

// Replace with your actual GA4 Measurement ID
const MEASUREMENT_ID = "G-S3TKRJ95D0";

export const initGA = () => {
  ReactGA.initialize(MEASUREMENT_ID);
};

export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const logEvent = (action, category, label, value) => {
  ReactGA.event({
    action,
    category,
    label,
    value,
  });
};
