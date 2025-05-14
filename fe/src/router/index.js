import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/signin",
      name: "signin",
      component: Login,
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: "/signup",
      name: "signup",
      component: Register,
    },
  ],
});

/* Get the current user asynchronously */
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

/* Check if the user is authenticated before accessing a route */
router.beforeEach(async (to, from, next) => {
  const currentUser = await getCurrentUser();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (currentUser) {
      next();
    } else {
      next({ name: "signin" });
    }
  } else {
    next();
  }
});

export default router;
