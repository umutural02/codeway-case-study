<template>
  <div class="h-full flex flex-col">
    <Navbar />
    <div class="flex-1">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
</script>
