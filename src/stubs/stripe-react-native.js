// Stub for @stripe/stripe-react-native for web builds
// This provides a compatible interface that works in browser environments
var React = require("react");

// Mock the StripeProvider component
exports.StripeProvider = function StripeProvider({ children }) {
  return React.createElement(React.Fragment, {}, children);
};

// Mock the useStripe hook to return mock functions
exports.useStripe = function useStripe() {
  return {
    // Mock initPaymentSheet - returns a promise that resolves
    initPaymentSheet: async function (options) {
      return Promise.resolve();
    },
    // Mock presentPaymentSheet - returns a promise that resolves with success
    presentPaymentSheet: async function () {
      return Promise.resolve({ result: "success" });
    },
    // Mock reset - returns a promise that resolves
    reset: async function () {
      return Promise.resolve();
    },
    // Mock confirmPaymentSheetPresent - returns false by default
    confirmPaymentSheetPresent: async function () {
      return Promise.resolve(false);
    },
  };
};

// Export other components as empty divs for compatibility
exports.CardField = function CardField() {
  return React.createElement(
    "div",
    { "data-testid": "stripe-card-field" },
    "Mock Card Field"
  );
};

exports.ApplePayButton = function ApplePayButton() {
  return React.createElement(
    "button",
    { "data-testid": "stripe-apple-pay" },
    "Apple Pay (Mock)"
  );
};

exports.GooglePayButton = function GooglePayButton() {
  return React.createElement(
    "button",
    { "data-testid": "stripe-google-pay" },
    "Google Pay (Mock)"
  );
};

exports.LinkAuthenticationElement = function LinkAuthenticationElement() {
  return React.createElement(
    "div",
    { "data-testid": "stripe-link-auth" },
    "Link Auth (Mock)"
  );
};

exports.PaymentSheet = function PaymentSheet() {
  return React.createElement(
    "div",
    { "data-testid": "stripe-payment-sheet" },
    "Payment Sheet (Mock)"
  );
};

// Export the default object
exports.default = {
  StripeProvider: exports.StripeProvider,
  useStripe: exports.useStripe,
  CardField: exports.CardField,
  ApplePayButton: exports.ApplePayButton,
  GooglePayButton: exports.GooglePayButton,
  LinkAuthenticationElement: exports.LinkAuthenticationElement,
  PaymentSheet: exports.PaymentSheet,
  PaymentSheetPresets: {},
};
