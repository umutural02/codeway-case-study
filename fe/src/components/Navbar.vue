<template>
  <nav>
    <div class="px-4 sm:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <img src="../assets/logo.png" alt="Logo" class="h-8 w-auto" />
          </router-link>
        </div>
        <div class="flex items-center space-x-4">
          <template v-if="user">
            <div class="flex items-center space-x-2">
              <button
                @click="handleSignOut"
                class="text-white hover:text-gray-300 transition-colors"
              >
                Sign out
              </button>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="text-white">Sign in</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const user = ref(null);
const router = useRouter();
const auth = getAuth();

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    console.log(user.value);
  });
});

const handleSignOut = async () => {
  try {
    await signOut(auth);
    router.push("/login");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};
</script>
