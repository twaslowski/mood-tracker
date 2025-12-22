import "@testing-library/jest-dom";

global.TextEncoder = jest.fn();
global.Request = jest.fn();

// Polyfill for Radix UI components (hasPointerCapture, releasePointerCapture)
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => {};
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => {};
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// Suppress Supabase multiple client instances warning in tests
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (
    typeof message === "string" &&
    message.includes("Multiple GoTrueClient instances detected")
  ) {
    return;
  }
  originalWarn.apply(console, args);
};
