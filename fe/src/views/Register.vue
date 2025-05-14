<template>
  <div class="h-full flex justify-center items-center">
    <div class="flex flex-col items-center w-68">
      <img src="../assets/logo.png" alt="Logo" class="w-60" />
      <h1 class="text-2xl text-codeway-blue-50 mt-10 mb-3">
        Create an account
      </h1>
      <form class="flex flex-col w-full" @submit.prevent="signup">
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
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm password"
          class="w-full border border-codeway-border focus:border-codeway-border-focus focus:outline-none focus:ring-0 p-2 rounded-b-md placeholder:text-codeway-text-placeholder text-codeway-text"
        />
        <button type="submit" class="codeway-blue-button mt-2">Sign up</button>
        <router-link
          to="/signin"
          class="text-codeway-text-placeholder text-center text-sm mt-2"
        >
          Already have an account?
          <span class="text-codeway-blue-50">Sign in</span>
        </router-link>
      </form>
      <p class="text-codeway-text-placeholder text-sm mt-16">Codeway © 2021</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const auth = getAuth();
const router = useRouter();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const toast = useToast();

const signup = () => {
  if (password.value !== confirmPassword.value) {
    toast.error("Passwords do not match.");
    return;
  }

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      router.push("/");
    })
    .catch((error) => {
      handleError(error);
    });
};

const handleError = (error) => {
  if (error.code === "auth/email-already-in-use") {
    toast.error("This email is already in use.");
  } else if (error.code === "auth/invalid-email") {
    toast.error("Invalid email address.");
  } else if (error.code === "auth/weak-password") {
    toast.error("Password should be at least 6 characters.");
  } else {
    toast.error("An error occurred. Please try again.");
  }
};
</script>
