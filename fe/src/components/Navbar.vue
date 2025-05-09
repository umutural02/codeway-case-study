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
          <router-link to="/login" class="text-white">Sign in</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
