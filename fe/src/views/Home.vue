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

        <!-- Value -->
        <p class="font-bold text-codeway-text">
          Value:
          <template v-if="editingKey === item.parameterKey">
            <input v-model="editValue" class="codeway-input w-full" />
          </template>
          <template v-else>
            <span class="text-codeway-text-placeholder">{{ item.value }}</span>
          </template>
        </p>

        <!-- Description -->
        <p class="font-bold text-codeway-text">
          Description:
          <template v-if="editingKey === item.parameterKey">
            <input v-model="editDescription" class="codeway-input w-full" />
          </template>
          <template v-else>
            <span class="text-codeway-text-placeholder">{{
              item.description
            }}</span>
          </template>
        </p>

        <p class="font-bold text-codeway-text">
          Create Date:
          <span class="text-codeway-text-placeholder">{{
            item.createDate.split("T")[0]
          }}</span>
        </p>

        <!-- Edit / Apply / Cancel Buttons -->
        <div class="flex gap-4 mt-2">
          <template v-if="editingKey === item.parameterKey">
            <button
              class="codeway-cyan-button flex-1"
              @click="editParameter(item)"
            >
              Apply
            </button>
            <button class="codeway-red-button flex-1" @click="cancelEditing">
              Cancel
            </button>
          </template>
          <template v-else>
            <button
              class="codeway-blue-button flex-1"
              @click="startEditing(item)"
              :disabled="editingKey !== null"
            >
              Edit
            </button>
            <button
              class="codeway-red-button flex-1"
              @click="deleteParameter(item.parameterKey)"
              :disabled="editingKey !== null"
            >
              Del
            </button>
          </template>
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
      <table class="w-full border-separate border-spacing-4 table-fixed">
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
          <!-- Parameter List -->
          <tr v-for="item in parameters" :key="item.parameterKey">
            <!-- Edit Mode -->
            <template v-if="editingKey === item.parameterKey">
              <td class="w-full">{{ item.parameterKey }}</td>
              <td class="w-full">
                <input v-model="editValue" class="codeway-input !w-9/10" />
              </td>
              <td colspan="2" class="w-full">
                <input
                  v-model="editDescription"
                  class="codeway-input !w-9/10"
                />
              </td>
              <td class="flex gap-4">
                <button
                  class="codeway-cyan-button w-20"
                  @click="editParameter(item)"
                >
                  Apply
                </button>
                <button class="codeway-red-button w-20" @click="cancelEditing">
                  Cancel
                </button>
              </td>
            </template>

            <!-- View Mode -->
            <template v-else>
              <td class="w-full">{{ item.parameterKey }}</td>
              <td class="w-full">{{ item.value }}</td>
              <td class="w-full">{{ item.description }}</td>
              <td class="w-full">{{ item.createDate.split("T")[0] }}</td>
              <td class="flex gap-4">
                <button
                  class="codeway-blue-button w-20"
                  @click="startEditing(item)"
                  :disabled="editingKey !== null"
                >
                  Edit
                </button>
                <button
                  class="codeway-red-button w-20"
                  @click="deleteParameter(item.parameterKey)"
                  :disabled="editingKey !== null"
                >
                  Del
                </button>
              </td>
            </template>
          </tr>

          <!-- Create New Parameter -->
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
import { apiGet, apiPost, apiDelete, apiPut } from "@/api";

const parameters = ref([]);

const newKey = ref("");
const newValue = ref("");
const newDescription = ref("");

const editingKey = ref(null);
const editValue = ref("");
const editDescription = ref("");

function startEditing(item) {
  editingKey.value = item.parameterKey;
  editValue.value = item.value;
  editDescription.value = item.description;
}

function cancelEditing() {
  editingKey.value = null;
  editValue.value = "";
  editDescription.value = "";
}

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

async function deleteParameter(key) {
  if (!confirm(`Are you sure you want to delete "${key}"?`)) return;

  try {
    await apiDelete("/parameters", { key });
    fetchParameters();
  } catch (error) {
    console.error(
      "Failed to delete parameter:",
      error.response?.data || error.message
    );
  }
}

async function editParameter(item) {
  if (!editingKey.value || !item) return;

  try {
    const response = await apiPut("/parameters", {
      key: editingKey.value,
      value: editValue.value,
      description: editDescription.value,
      version: item.version,
    });

    console.log("Updated:", response.data);
    cancelEditing();
    fetchParameters();
  } catch (error) {
    console.error(
      "Failed to update parameter:",
      error.response?.data || error.message
    );
  }
}
</script>
