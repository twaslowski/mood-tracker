import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfill TextEncoder and TextDecoder for Supabase client
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill Web APIs for Next.js server actions
global.Request = class Request {};
global.Response = class Response {};
global.Headers = class Headers {};
