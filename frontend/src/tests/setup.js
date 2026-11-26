import "@testing-library/jest-dom";

// Polyfill window.HTMLElement.prototype.scrollIntoView for jsdom
if (!window.HTMLElement.prototype.scrollIntoView) {
  window.HTMLElement.prototype.scrollIntoView = () => {};
}
