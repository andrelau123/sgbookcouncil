import { createRouter, createWebHistory } from "vue-router";
import homePage from "@/screens/homePage.vue";
import tasksPage from "@/screens/tasksPage.vue";
import profilePage from "@/screens/profilePage.vue";
import aiPage from "@/screens/aiPage.vue";
import loginPage from "@/screens/loginPage.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: homePage,
  },
  {
    path: "/tasks",
    name: "Tasks",
    component: tasksPage,
  },
  {
    path: "/profile",
    name: "Profile",
    component: profilePage,
  },
  {
    path: "/aiPage",
    name: "AI page",
    component: aiPage,
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

export default router;
