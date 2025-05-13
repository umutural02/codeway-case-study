<template>
  <main class="h-full w-full p-4 md:p-8">
    <!-- Mobile View -->
    <div class="grid grid-cols-1 md:hidden gap-4">
      <div
        v-for="item in parameters"
        :key="item.parameterKey"
        class="border border-white rounded-xl p-4 gap-1"
      >
        <p class="font-bold text-codeway-text">
          Parameter Key:
          <span class="text-codeway-text-placeholder">{{
            item.parameterKey
          }}</span>
        </p>

        <p class="font-bold text-codeway-text">
          Value:
          <span class="text-codeway-text-placeholder">{{ item.value }}</span>
        </p>

        <p class="font-bold text-codeway-text">
          Description:
          <span class="text-codeway-text-placeholder">{{
            item.description
          }}</span>
        </p>

        <p class="font-bold text-codeway-text">
          Create Date:
          <span class="text-codeway-text-placeholder">{{
            item.createDate
          }}</span>
        </p>
      </div>
    </div>

    <!-- Desktop View -->
    <div class="hidden md:block text-left">
      <table class="w-full border-separate border-spacing-y-4">
        <thead>
          <tr class="text-codeway-text-blue text-2xl *:font-light">
            <th>Parameter Key</th>
            <th>Value</th>
            <th>Description</th>
            <th>Create Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="text-codeway-text text-sm *:font-light">
          <tr v-for="item in parameters" :key="item.parameterKey">
            <td>{{ item.parameterKey }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.createDate }}</td>
            <td class="flex gap-4">
              <button class="codeway-blue-button">Edit</button>
              <button class="codeway-red-button">Delete</button>
            </td>
          </tr>

          <tr>
            <td>
              <input
                type="text"
                placeholder="Parameter Key"
                class="codeway-input !w-9/10"
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Value"
                class="codeway-input !w-9/10"
              />
            </td>
            <td colspan="2">
              <input
                type="text"
                placeholder="Description"
                class="codeway-input !w-9/10"
              />
            </td>
            <td>
              <button class="codeway-cyan-button">Add</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { apiGet } from "@/api";

const parameters = ref([]);

onMounted(async () => {
  try {
    const response = await apiGet("/parameters");
    parameters.value = response.data;
  } catch (error) {
    console.error(
      "Failed to load parameters:",
      error.response?.data || error.message
    );
  }
});
</script>
