import "@testing-library/jest-dom";

global.TextEncoder = jest.fn();
global.Request = jest.fn();

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
