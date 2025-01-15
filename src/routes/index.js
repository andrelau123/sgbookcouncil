import { createRouter, createWebHistory } from "vue-router";
import homePage from "@/screens/homePage.vue";
import tasksPage from "@/screens/tasksPage.vue";
import profilePage from "@/screens/profilePage.vue";
import aiPage from "@/screens/aiPage.vue";
import loginPage from "@/screens/loginPage.vue";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

const routes = [
  {
    path: "/",
    name: "Home",
    component: homePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/tasks",
    name: "Tasks",
    component: tasksPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: profilePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/aiPage",
    name: "AI page",
    component: aiPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: loginPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash, // Scroll to the element with the id matching the hash
        behavior: "smooth", // Optional smooth scrolling
      };
    }

    return { top: 0, behavior: "auto" };
  },
});

// Add a flag to track auth state initialization
let isAuthResolved = false;

const waitForAuth = () =>
  new Promise((resolve) => {
    if (isAuthResolved) {
      resolve(auth.currentUser);
    } else {
      onAuthStateChanged(auth, (user) => {
        isAuthResolved = true;
        resolve(user);
      });
    }
  });

router.beforeEach(async (to, from, next) => {
  const user = await waitForAuth();

  if (to.name === "Login" && user) {
    next({ name: "Home" });
  } else if (to.meta.requiresAuth && !user) {
    next({ name: "Login" });
  } else {
    next(); // Allow the route to proceed
  }
});

export default router;
