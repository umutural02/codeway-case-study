<template>
  <main class="h-full w-full p-4 md:p-8">
    <!-- Mobile View -->
    <div class="grid grid-cols-1 md:hidden gap-4">
      <div
        v-for="item in parameters"
        :key="item.parameterKey"
        class="border border-white rounded-xl p-4 gap-1"
      >
        <!-- Edit Mode -->
        <template v-if="editingKey === item.parameterKey">
          <!-- Parameter Key -->
          <p class="font-bold text-codeway-text">
            Parameter Key:
            <span class="text-codeway-text-placeholder">{{
              item.parameterKey
            }}</span>
          </p>

          <!-- Value -->
          <p class="font-bold text-codeway-text">
            Value:
            <input v-model="editValue" class="codeway-input w-full" />
          </p>

          <!-- Description -->
          <p class="font-bold text-codeway-text">
            Description:
            <input v-model="editDescription" class="codeway-input w-full" />
          </p>

          <!-- Apply and Cancel Buttons -->
          <div class="flex gap-4 mt-2">
            <button
              class="codeway-cyan-button flex-1"
              @click="editParameter(item)"
            >
              Apply
            </button>
            <button class="codeway-red-button flex-1" @click="cancelEditing">
              Cancel
            </button>
          </div>
        </template>

        <!--  View Mode -->
        <template v-else>
          <!-- Parameter Key -->
          <p class="font-bold text-codeway-text">
            Parameter Key:
            <span class="text-codeway-text-placeholder">{{
              item.parameterKey
            }}</span>
          </p>

          <!-- Value -->
          <p class="font-bold text-codeway-text">
            Value:
            <span class="text-codeway-text-placeholder">{{ item.value }}</span>
          </p>

          <!-- Description -->
          <p class="font-bold text-codeway-text">
            Description:
            <span class="text-codeway-text-placeholder">{{
              item.description
            }}</span>
          </p>

          <!-- Create Date -->
          <p class="font-bold text-codeway-text">
            Create Date:
            <span class="text-codeway-text-placeholder">{{
              item.createDate.split("T")[0]
            }}</span>
          </p>

          <!-- Edit and Delete Buttons -->
          <div class="flex gap-4 mt-2">
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
          </div>
        </template>
      </div>

      <!-- Create New Parameter -->
      <div class="border border-dashed border-white rounded-xl p-4 gap-1">
        <p class="font-bold text-codeway-text mb-2">Create New Parameter</p>

        <!-- Parameter Key -->
        <input
          v-model="newKey"
          type="text"
          placeholder="Parameter Key"
          class="codeway-input w-full mb-2"
        />

        <!-- Value -->
        <input
          v-model="newValue"
          type="text"
          placeholder="Value"
          class="codeway-input w-full mb-2"
        />

        <!-- Description -->
        <input
          v-model="newDescription"
          type="text"
          placeholder="Description"
          class="codeway-input w-full mb-2"
        />

        <!-- Add Button -->
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
            <!-- Parameter Key -->
            <td>
              <input
                type="text"
                placeholder="Parameter Key"
                class="codeway-input !w-9/10"
                v-model="newKey"
              />
            </td>
            <!-- Value -->
            <td>
              <input
                type="text"
                placeholder="Value"
                class="codeway-input !w-9/10"
                v-model="newValue"
              />
            </td>
            <!-- Description -->
            <td colspan="2">
              <input
                type="text"
                placeholder="Description"
                class="codeway-input !w-9/10"
                v-model="newDescription"
              />
            </td>
            <!-- Add Button -->
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

const selectedRegion = ref(localStorage.getItem("selectedRegion") || "");

onMounted(fetchParameters);

/* EDITING FUNCTIONS */

/* 
  This is not the prettiest solution, but for this kind of an application it is the easiest and one of the fastest to implement.
  A global state management solution would be better.
*/
window.addEventListener("storage", () => {
  selectedRegion.value = localStorage.getItem("selectedRegion") || "";
  fetchParameters();
});
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

/* CRUD FUNCTIONS */

async function fetchParameters() {
  const params = {};
  if (selectedRegion.value) {
    params.region = selectedRegion.value;
  }

  const response = await apiGet("/parameters", params);
  parameters.value = response.data;
}
async function addParameter() {
  if (!newKey.value || !newValue.value) {
    alert("Key and Value are required");
    return;
  }

  const response = await apiPost("/parameters", {
    parameterKey: newKey.value,
    value: newValue.value,
    description: newDescription.value,
  });

  if (response.status !== 201) {
    alert("Failed to add parameter. Please try again.");
    return;
  }

  // Clear inputs
  newKey.value = "";
  newValue.value = "";
  newDescription.value = "";

  // Refresh list
  parameters.value.push(response.data.data);
}
async function deleteParameter(parameterKey) {
  if (!confirm(`Are you sure you want to delete "${parameterKey}"?`)) return;

  const response = await apiDelete("/parameters", { parameterKey });
  if (response.status !== 200) {
    alert("Failed to delete parameter. Please try again.");
    return;
  }

  /* Remove the parameter from the list */
  parameters.value = parameters.value.filter(
    (item) => item.parameterKey !== parameterKey
  );
}
async function editParameter(item) {
  if (!editingKey.value || !item) return;

  const params = {};
  if (selectedRegion.value) {
    params.region = selectedRegion.value;
  }

  const response = await apiPut(
    "/parameters",
    {
      parameterKey: editingKey.value,
      value: editValue.value,
      description: editDescription.value,
      version: item.version,
    },
    params
  );

  /* Check response and update the parameter accordingly */
  if (response.status === 200) {
    cancelEditing();
    item.value = response.data.data.value;
  } else if (response.status === 409) {
    alert(
      "The parameter has been updated by another user. Please check the new value and try again."
    );
    item.value = response.data.data.value;
  } else {
    alert("Failed to update parameter. Please try again.");
  }
}
</script>
