"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var client_1 = require("react-dom/client");
var react_router_dom_1 = require("react-router-dom");
var react_query_1 = require("@tanstack/react-query");
var App_1 = require("./App");
var ThemeToggle_1 = require("./components/ui/ThemeToggle");
require("./index.css");
var queryClient = new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
client_1.default.createRoot(document.getElementById('root')).render(<react_1.default.StrictMode>
    <react_query_1.QueryClientProvider client={queryClient}>
      <react_router_dom_1.BrowserRouter>
        <ThemeToggle_1.ThemeProvider>
          <App_1.default />
        </ThemeToggle_1.ThemeProvider>
      </react_router_dom_1.BrowserRouter>
    </react_query_1.QueryClientProvider>
  </react_1.default.StrictMode>);
