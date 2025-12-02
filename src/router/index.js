import {route} from "quasar/wrappers";
import {createMemoryHistory, createRouter, createWebHashHistory, createWebHistory,} from "vue-router";
import routes from "./routes";
import { useUserStore } from "src/stores/userStore";

export default route(function ({store}) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({left: 0, top: 0}),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const userStore=useUserStore();
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth === true);
     const isAuthenticated = localStorage.getItem("accessToken");
    if (
      requiresAuth &&
      !isAuthenticated
    ) {
      //console.log("Not authenticated");
      return next({name: "Login"}); // Redirect to login page if not authenticated
    } 
    // Check allowed roles
  const allowedRoles = to.meta.requiredRoles
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const userRole = userStore.getHighestRole;
    if (!allowedRoles.includes(userRole)) {
      return next('/unauthorized') // You can create this page
    }
  }
  next()
  });
  return Router;
});
