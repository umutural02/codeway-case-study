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
        <template v-if="editForm.parameterKey === item.parameterKey">
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
            <input v-model="editForm.value" class="codeway-input w-full" />
          </p>

          <!-- Description -->
          <p class="font-bold text-codeway-text">
            Description:
            <input
              v-model="editForm.description"
              class="codeway-input w-full"
            />
          </p>

          <!-- Apply and Cancel Buttons -->
          <div class="flex gap-4 mt-2">
            <button
              class="codeway-cyan-button flex-1"
              @click="editParameter(item)"
            >
              Apply
            </button>
            <button
              class="codeway-red-button flex-1"
              @click="
                () => {
                  editForm = { ...defaultForm };
                }
              "
            >
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
              formatDate(item.createDate)
            }}</span>
          </p>

          <!-- Edit and Delete Buttons -->
          <div class="flex gap-4 mt-2">
            <button
              class="codeway-blue-button flex-1"
              @click="
                () => {
                  editForm = { ...item };
                }
              "
              :disabled="editForm.parameterKey !== ''"
            >
              Edit
            </button>
            <button
              class="codeway-red-button flex-1"
              @click="deleteParameter(item.parameterKey)"
              :disabled="editForm.parameterKey !== ''"
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
          v-model="createForm.parameterKey"
          type="text"
          placeholder="Parameter Key"
          class="codeway-input w-full mb-2"
        />

        <!-- Value -->
        <input
          v-model="createForm.value"
          type="text"
          placeholder="Value"
          class="codeway-input w-full mb-2"
        />

        <!-- Description -->
        <input
          v-model="createForm.description"
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
            <template v-if="editForm.parameterKey === item.parameterKey">
              <td class="w-full">{{ item.parameterKey }}</td>
              <td class="w-full">
                <input v-model="editForm.value" class="codeway-input !w-9/10" />
              </td>
              <td colspan="2" class="w-full">
                <input
                  v-model="editForm.description"
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
                <button
                  class="codeway-red-button w-20"
                  @click="
                    () => {
                      editForm = { ...defaultForm };
                    }
                  "
                >
                  Cancel
                </button>
              </td>
            </template>

            <!-- View Mode -->
            <template v-else>
              <td class="w-full">{{ item.parameterKey }}</td>
              <td class="w-full">{{ item.value }}</td>
              <td class="w-full">{{ item.description }}</td>
              <td class="w-full">{{ formatDate(item.createDate) }}</td>
              <td class="flex gap-4">
                <button
                  class="codeway-blue-button w-20"
                  @click="
                    () => {
                      editForm = { ...item };
                    }
                  "
                  :disabled="editForm.parameterKey !== ''"
                >
                  Edit
                </button>
                <button
                  class="codeway-red-button w-20"
                  @click="deleteParameter(item.parameterKey)"
                  :disabled="editForm.parameterKey !== ''"
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
                v-model="createForm.parameterKey"
              />
            </td>
            <!-- Value -->
            <td>
              <input
                type="text"
                placeholder="Value"
                class="codeway-input !w-9/10"
                v-model="createForm.value"
              />
            </td>
            <!-- Description -->
            <td colspan="2">
              <input
                type="text"
                placeholder="Description"
                class="codeway-input !w-9/10"
                v-model="createForm.description"
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
import { useToast } from "vue-toastification";

const toast = useToast();
const parameters = ref([]);

const defaultForm = {
  parameterKey: "",
  value: "",
  description: "",
  version: 0,
};
const createForm = ref({ ...defaultForm });
const editForm = ref({ ...defaultForm });

const selectedRegion = ref(localStorage.getItem("selectedRegion") || "");

onMounted(fetchParameters);

/* 
  This is not the prettiest solution, but for this kind of an application it is the easiest and one of the fastest to implement.
  A global state management solution would be better.
*/
window.addEventListener("storage", () => {
  selectedRegion.value = localStorage.getItem("selectedRegion") || "";
  fetchParameters();
});

function formatDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/* CRUD FUNCTIONS */

async function fetchParameters() {
  const params = {};
  if (selectedRegion.value) {
    params.region = selectedRegion.value;
  }

  const response = await apiGet("/parameters", params);
  if (!response?.data) return;

  parameters.value = response.data;
}
async function addParameter() {
  if (!createForm.value.parameterKey || !createForm.value.value) {
    toast.error("Key and Value are required");
    return;
  }

  const response = await apiPost("/parameters", createForm.value);
  if (!response?.data) return;

  createForm.value = { ...defaultForm };
  parameters.value.push(response.data);
}
async function deleteParameter(parameterKey) {
  if (!confirm(`Are you sure you want to delete "${parameterKey}"?`)) return;

  const response = await apiDelete("/parameters", { parameterKey });
  if (!response?.data) return;

  parameters.value = parameters.value.filter(
    (item) => item.parameterKey !== parameterKey
  );
}
async function editParameter(item) {
  if (!editForm.value.parameterKey || !item) return;

  const params = {};
  if (selectedRegion.value) {
    params.region = selectedRegion.value;
  }

  const response = await apiPut("/parameters", editForm.value, params);

  /* C */
  editForm.value = { ...defaultForm };
  if (!response?.data) return;

  Object.assign(item, response.data);
}
</script>
