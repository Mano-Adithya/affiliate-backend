import authRoute from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import userTypeRoute from "./routes/user_type.routes.js";
import portalRoute from "./routes/portal.routes.js";
import dashboardRoute from "./routes/dashboard.routes.js";
import payoutRoute from "./routes/payout.routes.js";
import notificationRoute from "./routes/notification.routes.js";

export default [
  {
    url: "/api/auth",
    route: authRoute,
  },
  {
    url: "/api/user",
    route: userRoute,
  },
  {
    url: "/api/user_type",
    route: userTypeRoute,
  },
  {
    url: "/api/referral",
    route: portalRoute,
  },
  {
    url: "/api/dashboard",
    route: dashboardRoute,
  },
  {
    url: "/api/payout",
    route: payoutRoute,
  },
  {
    url: "/api/notification",
    route: notificationRoute,
  },
];
