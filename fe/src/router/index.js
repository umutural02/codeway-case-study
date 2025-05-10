import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
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
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        requiresAuth: false,
      },
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
      next({ name: "login" });
    }
  } else {
    next();
  }
});

export default router;
