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

        <!-- ✅ Edit & Delete Buttons -->
        <div class="flex gap-4 mt-2">
          <button
            class="codeway-blue-button flex-1"
            @click="editParameter(item)"
          >
            Edit
          </button>
          <button
            class="codeway-red-button flex-1"
            @click="deleteParameter(item.parameterKey)"
          >
            Del
          </button>
        </div>
      </div>
      <!-- Create New Parameter -->
      <div class="border border-dashed border-white rounded-xl p-4 gap-1">
        <p class="font-bold text-codeway-text mb-2">Create New Parameter</p>

        <input
          v-model="newKey"
          type="text"
          placeholder="Parameter Key"
          class="codeway-input w-full mb-2"
        />

        <input
          v-model="newValue"
          type="text"
          placeholder="Value"
          class="codeway-input w-full mb-2"
        />

        <input
          v-model="newDescription"
          type="text"
          placeholder="Description"
          class="codeway-input w-full mb-2"
        />

        <button class="codeway-cyan-button w-full" @click="addParameter">
          Add
        </button>
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
                v-model="newKey"
              />
            </td>
            <td>
              <input
                type="text"
                placeholder="Value"
                class="codeway-input !w-9/10"
                v-model="newValue"
              />
            </td>
            <td colspan="2">
              <input
                type="text"
                placeholder="Description"
                class="codeway-input !w-9/10"
                v-model="newDescription"
              />
            </td>
            <td>
              <button class="codeway-cyan-button" @click="addParameter">
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { apiGet, apiPost } from "@/api";

const parameters = ref([]);

const newKey = ref("");
const newValue = ref("");
const newDescription = ref("");

onMounted(fetchParameters);

async function fetchParameters() {
  try {
    const response = await apiGet("/parameters");
    parameters.value = response.data;
  } catch (error) {
    console.error(
      "Failed to load parameters:",
      error.response?.data || error.message
    );
  }
}

async function addParameter() {
  if (!newKey.value || !newValue.value) {
    alert("Key and Value are required");
    return;
  }

  try {
    await apiPost("/parameters", {
      key: newKey.value,
      value: newValue.value,
      description: newDescription.value,
    });

    // Clear inputs
    newKey.value = "";
    newValue.value = "";
    newDescription.value = "";

    // Refresh list
    fetchParameters();
  } catch (error) {
    alert("Failed to add parameter. Please try again.");
  }
}
</script>
