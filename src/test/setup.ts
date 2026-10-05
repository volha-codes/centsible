import "@testing-library/jest-dom/vitest";

import { afterEach, vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }),
});

afterEach(() => {
  vi.unstubAllGlobals();
});
