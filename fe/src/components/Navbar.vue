<template>
  <nav>
    <div class="px-4 sm:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center">
            <img src="../assets/logo.png" alt="Logo" class="h-8 w-auto" />
          </router-link>
        </div>

        <!-- User Controls -->
        <div class="flex items-center space-x-4">
          <template v-if="user">
            <!-- User Icon Button and Dropdown -->
            <div class="relative">
              <!-- User Icon Button -->
              <button
                @click.stop="toggleDropdown"
                class="flex items-center space-x-2 text-white"
              >
                <UserIcon />
              </button>

              <!-- Dropdown -->
              <div
                v-if="showDropdown"
                id="user-dropdown"
                class="absolute right-0 mt-2 bg-codeway-blue-50 rounded-lg shadow-lg text-white p-2 py-4 w-60 z-50 grid gap-2"
              >
                <p class="text-sm">{{ user.email }}</p>

                <!-- Region Selector -->
                <div class="mb-2 grid gap-1">
                  <label for="region" class="text-sm mb-1">Region</label>
                  <select
                    @change="updateSelectedRegion"
                    v-model="selectedRegion"
                    id="region"
                    class="w-full border rounded p-1"
                  >
                    <option
                      v-for="region in regions"
                      :key="region.code"
                      :value="region.code"
                    >
                      {{ region.name }}
                    </option>
                  </select>
                </div>

                <!-- Sign Out -->
                <button @click="handleSignOut" class="codeway-red-button">
                  Sign out
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <router-link to="/signin" class="text-white">Sign in</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import UserIcon from "@/components/icons/UserIcon.vue";

const user = ref(null);
const showDropdown = ref(false);
const selectedRegion = ref(localStorage.getItem("selectedRegion") || "");
const router = useRouter();
const auth = getAuth();

const regions = [
  { code: "", name: "Global" },
  { code: "TR", name: "Turkey (TR)" },
  { code: "US", name: "United States (US)" },
  { code: "DE", name: "Germany (DE)" },
  { code: "FR", name: "France (FR)" },
  { code: "IT", name: "Italy (IT)" },
  { code: "ES", name: "Spain (ES)" },
  { code: "GB", name: "United Kingdom (GB)" },
  { code: "JP", name: "Japan (JP)" },
  { code: "AU", name: "Australia (AU)" },
  /* More regions can be added. Or this can be moved to back-end entirely. 
    But for simplicity I will just leave it like this. */
];

onMounted(() => {
  /* To get the current user */
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });

  /* To close the dropdown when clicking outside of it */
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

function updateSelectedRegion(event) {
  localStorage.setItem("selectedRegion", event.target.value);
  window.dispatchEvent(new Event("storage"));
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function closeDropdown() {
  showDropdown.value = false;
}

function handleClickOutside(event) {
  const dropdown = document.getElementById("user-dropdown");
  if (dropdown && !dropdown.contains(event.target)) {
    closeDropdown();
  }
}

async function handleSignOut() {
  try {
    await signOut(auth);
    router.push("/signin");
  } catch (error) {
    console.error("Error signing out:", error);
  }
}
</script>
