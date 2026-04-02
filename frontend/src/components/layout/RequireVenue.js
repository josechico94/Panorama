"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RequireVenue;
var react_router_dom_1 = require("react-router-dom");
var store_1 = require("@/store");
function RequireVenue() {
    var token = (0, store_1.useVenueStore)(function (s) { return s.token; });
    if (!token)
        return <react_router_dom_1.Navigate to="/locale/login" replace/>;
    return <react_router_dom_1.Outlet />;
}
