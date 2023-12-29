import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";

import JobBoard from "./components/JobBoard.vue";
import UserProfile from "./components/UserProfile.vue";
import EditUserProfile from "./components/EditUserProfile.vue";
import EmployerDashboard from "./components/EmployerDashboard.vue";
import SignUp from "./components/SignUp.vue";
import LogIn from "./components/LogIn.vue";
import LogOut from "./components/LogOut.vue";
import Unauthorized from "./components/Unauthorized.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/unauthorized", component: Unauthorized },
    { path: "/", redirect: "/main" },
    { path: "/main", component: JobBoard },
    {
      path: "/profiles/:profileId",
      component: UserProfile,
      name: "profileLink",
      meta: { notGuest: true },
    },
    {
      path: "/edit/:routerProfileId",
      component: EditUserProfile,
      name: "editProfileLink",
      meta: { requireAuthen: true, notGuest: true },
    },
    {
      path: "/company",
      component: EmployerDashboard,
      meta: { requireAuthen: true, notGuest: true },
    },
    { path: "/logIn", component: LogIn, meta: { loggedIn: true } },
    { path: "/logOut", component: LogOut, meta: { loggedOut: true } },
    { path: "/signUp", component: SignUp, meta: { loggedIn: true } },
  ],
});

router.beforeEach(function (to, from, next) {
  // Unauthorized is a landing page if users modify URL
  // However since Netlify doesn't allow URL modification
  // The unauthorized component isn't used, but it appears on locally run instance
  // Disallow guest to access unauthorized pages
  if (to.meta.notGuest) {
    if (app.config.globalProperties.$userAccountType === "Guest") {
      next("/unauthorized");
      return;
    }
  }

  // For cases where users are trying to modify the URL to access these pages
  if (to.meta.loggedIn) {
    // If logged in user is trying to access sign up or log in page
    if (app.config.globalProperties.$authenticated === true) {
      next("/unauthorized");
      return;
    }
  }

  if (to.meta.loggedOut) {
    // If logged out user is trying to log out
    if (app.config.globalProperties.$authenticated === false) {
      next("/unauthorized");
      return;
    }
  }

  // Disallow unauthenticated users to access
  if (to.meta.requireAuthen) {
    if (app.config.globalProperties.$authenticated) {
      next();
    } else {
      next("/unauthorized");
    }
  } else {
    // If page doesn't require login, go to other page
    next();
  }
});

const app = createApp(App);
app.use(router);
app.mount("#app");

// Default global variable values
app.config.globalProperties.$idToken = "";
app.config.globalProperties.$expiresIn = "";
app.config.globalProperties.$authenticated = false;
app.config.globalProperties.$userAccountType = "Guest";
app.config.globalProperties.$userIdent = "1";
app.config.globalProperties.$accountName = "";

export { app };
