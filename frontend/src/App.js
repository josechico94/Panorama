"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var react_router_dom_1 = require("react-router-dom");
var AppLayout_1 = require("@/components/layout/AppLayout");
var AdminLayout_1 = require("@/components/layout/AdminLayout");
var VenueLayout_1 = require("@/components/layout/VenueLayout");
var RequireAdmin_1 = require("@/components/layout/RequireAdmin");
var RequireVenue_1 = require("@/components/layout/RequireVenue");
var SuperAdminLayout_1 = require("@/pages/superadmin/SuperAdminLayout");
var HomePage_1 = require("@/pages/HomePage");
var ExplorePage_1 = require("@/pages/ExplorePage");
var PlaceDetailPage_1 = require("@/pages/PlaceDetailPage");
var SavedPage_1 = require("@/pages/SavedPage");
var CouponDetailPage_1 = require("@/pages/CouponDetailPage");
var AuthPage_1 = require("@/pages/user/AuthPage");
var ProfilePage_1 = require("@/pages/user/ProfilePage");
var AdminLoginPage_1 = require("@/pages/admin/AdminLoginPage");
var AdminDashboardPage_1 = require("@/pages/admin/AdminDashboardPage");
var AdminPlacesPage_1 = require("@/pages/admin/AdminPlacesPage");
var AdminPlaceFormPage_1 = require("@/pages/admin/AdminPlaceFormPage");
var VenueLoginPage_1 = require("@/pages/venue/VenueLoginPage");
var VenueDashboardPage_1 = require("@/pages/venue/VenueDashboardPage");
var VenueScannerPage_1 = require("@/pages/venue/VenueScannerPage");
var VenueInfoPage_1 = require("@/pages/venue/VenueInfoPage");
var SADashboard_1 = require("@/pages/superadmin/SADashboard");
var SAPlaces_1 = require("@/pages/superadmin/SAPlaces");
var SAUsers_1 = require("@/pages/superadmin/SAUsers");
var SACoupons_1 = require("@/pages/superadmin/SACoupons");
var SAReviews_1 = require("@/pages/superadmin/SAReviews");
var SAVenues_1 = require("@/pages/superadmin/SAVenues");
var SAExperiences_1 = require("@/pages/superadmin/SAExperiences");
var ExperiencesPage_1 = require("@/pages/ExperiencesPage");
var ExperienceDetailPage_1 = require("@/pages/ExperienceDetailPage");
var WeeklyOffersPage_1 = require("@/pages/WeeklyOffersPage");
function App() {
    return (<react_router_dom_1.Routes>
      {/* Public app */}
      <react_router_dom_1.Route element={<AppLayout_1.default />}>
        <react_router_dom_1.Route path="/" element={<HomePage_1.default />}/>
        <react_router_dom_1.Route path="/esplora" element={<ExplorePage_1.default />}/>
        <react_router_dom_1.Route path="/place/:slug" element={<PlaceDetailPage_1.default />}/>
        <react_router_dom_1.Route path="/salvati" element={<SavedPage_1.default />}/>
        <react_router_dom_1.Route path="/coupon/:id" element={<CouponDetailPage_1.default />}/>
        <react_router_dom_1.Route path="/esperienze" element={<ExperiencesPage_1.default />}/>
        <react_router_dom_1.Route path="/esperienze/:slug" element={<ExperienceDetailPage_1.default />}/>
        <react_router_dom_1.Route path="/offerte" element={<WeeklyOffersPage_1.default />}/>
        <react_router_dom_1.Route path="/profilo" element={<ProfilePage_1.default />}/>
      </react_router_dom_1.Route>

      {/* Auth */}
      <react_router_dom_1.Route path="/accedi" element={<AuthPage_1.default />}/>

      {/* Venue portal */}
      <react_router_dom_1.Route path="/locale/login" element={<VenueLoginPage_1.default />}/>
      <react_router_dom_1.Route element={<RequireVenue_1.default />}>
        <react_router_dom_1.Route element={<VenueLayout_1.default />}>
          <react_router_dom_1.Route path="/locale" element={<VenueDashboardPage_1.default />}/>
          <react_router_dom_1.Route path="/locale/scanner" element={<VenueScannerPage_1.default />}/>
          <react_router_dom_1.Route path="/locale/info" element={<VenueInfoPage_1.default />}/>
        </react_router_dom_1.Route>
      </react_router_dom_1.Route>

      {/* Super Admin */}
      <react_router_dom_1.Route element={<RequireAdmin_1.default />}>
        <react_router_dom_1.Route element={<SuperAdminLayout_1.default />}>
          <react_router_dom_1.Route path="/superadmin" element={<SADashboard_1.default />}/>
          <react_router_dom_1.Route path="/superadmin/places" element={<SAPlaces_1.default />}/>
          <react_router_dom_1.Route path="/superadmin/users" element={<SAUsers_1.default />}/>
          <react_router_dom_1.Route path="/superadmin/coupons" element={<SACoupons_1.default />}/>
          <react_router_dom_1.Route path="/superadmin/reviews" element={<SAReviews_1.default />}/>
          <react_router_dom_1.Route path="/superadmin/experiences" element={<SAExperiences_1.default />}/>
          <react_router_dom_1.Route path="/superadmin/venues" element={<SAVenues_1.default />}/>
        </react_router_dom_1.Route>
      </react_router_dom_1.Route>

      {/* Legacy admin (keep for compatibility) */}
      <react_router_dom_1.Route path="/admin/login" element={<AdminLoginPage_1.default />}/>
      <react_router_dom_1.Route element={<RequireAdmin_1.default />}>
        <react_router_dom_1.Route element={<AdminLayout_1.default />}>
          <react_router_dom_1.Route path="/admin" element={<AdminDashboardPage_1.default />}/>
          <react_router_dom_1.Route path="/admin/places" element={<AdminPlacesPage_1.default />}/>
          <react_router_dom_1.Route path="/admin/places/new" element={<AdminPlaceFormPage_1.default />}/>
          <react_router_dom_1.Route path="/admin/places/:id/edit" element={<AdminPlaceFormPage_1.default />}/>
        </react_router_dom_1.Route>
      </react_router_dom_1.Route>

      <react_router_dom_1.Route path="*" element={<react_router_dom_1.Navigate to="/" replace/>}/>
    </react_router_dom_1.Routes>);
}
