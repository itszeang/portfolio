import { renderToString } from "react-dom/server";
import App from "./App";

// Build-time render: the full page HTML is written into dist/index.html so
// visitors without JavaScript, link previews and crawlers see the content.
export function render() {
  return renderToString(<App />);
}
