<template>
  <div class="h-full flex justify-center items-center">
    <div class="flex flex-col items-center w-68">
      <img src="../assets/logo.png" alt="Logo" class="w-60" />
      <h1 class="text-2xl text-codeway-blue-50 mt-10 mb-3">Please sign in</h1>
      <form class="flex flex-col w-full" @submit.prevent="login">
        <input
          v-model="email"
          type="email"
          placeholder="E-mail address"
          class="w-full border border-codeway-border focus:border-codeway-border-focus focus:outline-none p-2 rounded-t-md placeholder:text-codeway-text-placeholder text-codeway-text"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full border border-codeway-border focus:border-codeway-border-focus focus:outline-none focus:ring-0 p-2 rounded-b-md placeholder:text-codeway-text-placeholder text-codeway-text"
        />
        <button type="submit" class="codeway-blue-button mt-2">Sign in</button>
        <router-link
          to="/signup"
          class="text-codeway-text-placeholder text-center text-sm mt-2"
        >
          Don't have an account?
          <span class="text-codeway-blue-50">Sign up</span>
        </router-link>
      </form>
      <p class="text-codeway-text-placeholder text-sm mt-16">Codeway © 2021</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const auth = getAuth();
const router = useRouter();

const email = ref("");
const password = ref("");

const toast = useToast();

const login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      // Redirect to the home page.
      router.push("/");
    })
    .catch((error) => {
      handleError(error);
    });
};

const handleError = (error) => {
  /*
   * At this point, since e-mail enumeration protection is enabled, we can't tell if the user exists or not.
   * We can only tell if the password is wrong or the email is invalid.
   *
   * In the future, e-mail enumeration protection can be disabled to better handle errors.
   */
  if (error.code === "auth/invalid-credential") {
    toast.error("Invalid email or password");
  } else {
    toast.error("An error occurred");
  }
};
</script>
