<template>
  <div class="q-pa-md">
    <q-card bordered class="no-shadow allocation-list-card">
      <!-- Header Section with Gradient Background -->
      <q-card-section class="bg-gradient-secondary text-white">
        <div class="row items-center justify-between">
          <div class="col-auto">
            <div class="text-h5 text-weight-bold q-mb-xs">
              <q-icon name="assignment" size="sm" class="q-mr-sm" />
              বরাদ্দ ব্যবস্থাপনা
            </div>
            <div class="text-subtitle2 text-purple-1">
              অফিসসমূহে সম্পদ বরাদ্দের ট্র্যাক ও ব্যবস্থাপনা করুন
            </div>

          </div>
          <div class="col-auto">
            <q-btn
              unelevated
              color="white"
              text-color="secondary"
              icon="add_business"
              label="নতুন বরাদ্দ যুক্ত করুন"
              class="text-weight-medium shadow-2"
              size="md"
              @click="$router.push('add-allocation')"
            >
              <q-tooltip class="bg-grey-8">নতুন বরাদ্দ তৈরি করুন</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <!-- Search Section -->
      <q-card-section class="bg-grey-1">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-6">
            <q-input
              v-model="filter"
              outlined
              dense
              placeholder="বরাদ্দ, অফিস অথবা পণ্য অনুসন্ধান করুন..."
              clearable
              class="search-input"
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="secondary" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
            <div class="row justify-end">
              <q-chip
                color="secondary"
                text-color="white"
                icon="info"
                class="text-weight-medium"
              >
                মোট বরাদ্দ: {{ allocations.length }}
              </q-chip>
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Table Section -->
      <q-card-section class="q-pa-none">
        <q-table
          :columns="columns"
          :filter="filter"
          :rows="allocations"
          :rows-per-page-options="[20]"
          class="allocation-table"
          row-key="id"
          flat
          :loading="loading"
          virtual-scroll
        >
          <!-- Loading State -->
          <template v-slot:loading>
            <q-inner-loading showing color="secondary" />
          </template>

          <!-- No Data State -->
          <template v-slot:no-data="{ message }">
            <div class="full-width row flex-center text-grey-6 q-pa-lg">
              <div class="column items-center">
                <q-icon name="assignment_late" size="4em" class="q-mb-md" />
                <div class="text-h6 q-mb-sm">কোনো বরাদ্দ পাওয়া যায়নি</div>
                <div class="text-body2 text-center">
                  {{
                    filter
                      ? "অনুসন্ধানের শব্দ পরিবর্তন করে চেষ্টা করুন"
                      : "আপনার প্রথম বরাদ্দ তৈরি করে শুরু করুন"
                  }}
                </div>
                <q-btn
                  v-if="!filter"
                  color="secondary"
                  icon="add_business"
                  label="প্রথম বরাদ্দ যুক্ত করুন"
                  class="q-mt-md"
                  unelevated
                  @click="$router.push('add-allocation')"
                />
              </div>
            </div>
          </template>

          <!-- Office Column -->
          <template v-slot:body-cell-office="props">
            <q-td :props="props">
              <q-btn
                flat
                no-caps
                color="secondary"
                class="text-weight-medium office-link"
                @click="
                  $router.push({
                    name: 'allocation-office-view',
                    query: {
                      child_office_id: props.row.child_office_id,
                      office: props.row.office,
                    },
                  })
                "
              >
                <q-icon name="business" size="xs" class="q-mr-xs" />
                {{ props.row.office }}
                <q-tooltip class="bg-grey-8">
                  ক্লিক করে অফিসের বরাদ্দ বিবরণ দেখুন
                </q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <!-- Product Column -->
          <template v-slot:body-cell-product="props">
            <q-td :props="props">
              <div class="row items-center">
                <q-avatar
                  size="24px"
                  color="blue-1"
                  text-color="blue-6"
                  class="q-mr-sm"
                >
                  <q-icon name="inventory" size="xs" />
                </q-avatar>
                <span class="text-body1 text-weight-medium">
                  {{ props.row.product }}
                </span>
              </div>
            </q-td>
          </template>

          <!-- Quantity Column -->
          <template v-slot:body-cell-quantity="props">
            <q-td :props="props">
              <q-chip
                :color="getQuantityColor(props.row.quantity)"
                text-color="white"
                size="sm"
                class="text-weight-medium"
              >
                <q-icon name="inventory_2" size="xs" class="q-mr-xs" />
                {{ props.row.quantity }}
              </q-chip>
            </q-td>
          </template>

          <!-- Date Column -->
          <template v-slot:body-cell-date="props">
            <q-td :props="props">
              <div class="row items-center">
                <q-icon
                  name="schedule"
                  size="xs"
                  color="grey-6"
                  class="q-mr-xs"
                />
                <span class="text-body2">{{ formatDate(props.row.date) }}</span>
              </div>
            </q-td>
          </template>

          <!-- Actions Column -->
          <template v-slot:body-cell-Action="props">
            <q-td :props="props" class="text-center">
              <div class="row justify-center q-gutter-xs">
                <q-btn
                  dense
                  round
                  flat
                  icon="edit"
                  color="blue-6"
                  size="sm"
                  class="action-btn"
                  @click="
                    $router.push({
                      name: 'edit-allocation',
                      query: { id: props.row.id },
                    })
                  "
                >
                  <q-tooltip class="bg-blue-6">Edit Allocation</q-tooltip>
                </q-btn>
                <q-btn
                  dense
                  round
                  flat
                  icon="delete"
                  color="red-6"
                  size="sm"
                  class="action-btn"
                  @click="openDeleteDialogue(props.row.id)"
                >
                  <q-tooltip class="bg-red-6">বরাদ্দ মুছুন</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <!-- Table Footer -->
          <template v-slot:bottom>
            <div class="full-width text-center q-pa-md text-grey-6">
              <div class="row items-center justify-center q-gutter-md">
                <div class="text-body2">
                  <q-icon name="visibility" size="xs" class="q-mr-xs" />
                  Showing {{ allocations.length }} allocation{{
                    allocations.length !== 1 ? "s" : ""
                  }}
                </div>
                <q-separator vertical />
                <div class="text-body2">
                  <q-icon name="refresh" size="xs" class="q-mr-xs" />
                  Last updated: {{ new Date().toLocaleTimeString() }}
                </div>
              </div>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Enhanced Delete Confirmation Dialog -->
    <q-dialog
      v-model="deleteDialogVisible"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="delete-dialog" style="min-width: 420px; max-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="warning" color="red-1" text-color="red-6" size="md" />
          <div class="q-ml-sm">
            <div class="text-h6 text-red-6 text-weight-bold">
              বাতিল নিশ্চিতকরণ
            </div>
            <div class="text-subtitle2 text-grey-7">
              এই কাজটি ফিরিয়ে আনা যাবে না
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <div class="text-body1 text-grey-8">
            আপনি কি নিশ্চিতভাবে এই বরাদ্দ মুছতে চান?এটি স্থায়ীভাবে বরাদ্দ রেকর্ড মুছে দেবে এবং তা আর ফিরিয়ে আনা যাবে না।
          </div>
          <q-banner class="bg-red-1 text-red-8 q-mt-md" rounded>
            <template v-slot:avatar>
              <q-icon name="info" color="red-6" />
            </template>
            <div class="text-body2">
              <strong>সতর্কতা:</strong> এই কাজটি ইনভেন্টরি ট্র্যাকিং ও রিপোর্টিং-এ প্রভাব ফেলবে।
            </div>
          </q-banner>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md q-gutter-sm">
          <q-btn
            label="বাতিল করুন"
            flat
            color="grey-6"
            v-close-popup
            class="text-weight-medium"
            no-caps
          />
          <q-btn
            label="বরাদ্দ মুছুন"
            color="red-6"
            icon="delete"
            v-close-popup
            unelevated
            class="text-weight-medium"
            no-caps
            @click="deleteAllocation"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { handleApiError } from "src/utilities/apiErrorHandler.js";

const $q = useQuasar();

const filter = ref("");
const allocations = ref([]);
const deleteDialogVisible = ref(false);
const allocateToDelete = ref(null);
const loading = ref(false);

const columns = ref([
  {
    name: "office",
    label: "অফিসের নাম",
    align: "left",
    field: "office",
    sortable: true,
    headerStyle: "font-weight: 600; color: #7b1fa2;",
  },
  {
    name: "product",
    label: "পণ্য",
    align: "left",
    field: "product",
    sortable: true,
    headerStyle: "font-weight: 600; color: #7b1fa2;",
  },
  {
    name: "quantity",
    label: "পরিমাণ",
    align: "center",
    field: "quantity",
    sortable: true,
    headerStyle: "font-weight: 600; color: #7b1fa2;",
  },
  {
    name: "date",
    label: "তারিখ",
    align: "left",
    field: "date",
    sortable: true,
    headerStyle: "font-weight: 600; color: #7b1fa2;",
  },
  {
    name: "Action",
    label: "কার্যক্রম",
    align: "center",
    headerStyle: "font-weight: 600; color: #7b1fa2;",
  },
]);


// Helper function to get quantity color based on value
const getQuantityColor = (quantity) => {
  if (quantity > 100) return "green-6";
  if (quantity > 50) return "orange-6";
  return "red-6";
};

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const fetchAllocations = async () => {
  loading.value = true;
  try {
    // 1. Fetch allocations (filtered by type:consume)
    const allocationsResponse = await api.get(
      "/v1/resource-stocks?search=type:consume"
    );

    // 2. Fetch resources
    const resourceResponse = await api.get("/v1/resources");

    // 3. Fetch hierarchical office structure (head_office + children)
    const officeResponse = await api.get(
      "/v1/categories?search=type:head_office&include=children"
    );

    if (
      resourceResponse.data?.data &&
      Array.isArray(resourceResponse.data.data) &&
      officeResponse.data?.data &&
      Array.isArray(officeResponse.data.data)
    ) {
      const resources = resourceResponse.data.data;
      const offices = officeResponse.data.data;
      const allocationsData = allocationsResponse.data.data;

      // Create a map of resource_id -> resource name
      const resourceMap = resources.reduce((map, resource) => {
        map[resource.id] = resource.name;
        return map;
      }, {});

      // Recursive function to find full office path by id
      function findOfficePath(data, targetId, path = []) {
        for (const office of data) {
          const currentPath = [...path, office];
          if (office.id === targetId) {
            return currentPath;
          }
          if (office.children?.data?.length) {
            const result = findOfficePath(
              office.children.data,
              targetId,
              currentPath
            );
            if (result) return result;
          }
        }
        return null;
      }

      // Map each allocation with office name breadcrumb
      allocations.value = allocationsData.map((item) => {
        const resourceName =
          resourceMap[item.resource_id] || "অজানা পণ্য";

        const officePath = findOfficePath(
          offices,
          item.additional_info.child_office_id
        );
        const officeNamePath = officePath
          ? officePath[officePath.length - 1].name
          : "Unknown Office";

        return {
          id: item.id,
          product: resourceName,
          office: officeNamePath,
          type: item.type,
          office_id: item.office_id,
          child_office_id: item.additional_info.child_office_id,
          quantity: item.quantity,
          date: new Date(item.date).toISOString().split("T")[0],
        };
      });
    } else {
      $q.notify({
        message: "পণ্য বা অফিস সম্পর্কিত তথ্য খুঁজে পাওয়া যায়নি",
        color: "negative",
        icon: "error",
        position: "top",
      });
    }
  } catch (error) {
    $q.notify({
      message: "অ্যালোকেশন তথ্য লোড করা যায়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।",
      color: "negative",
      icon: "error",
      position: "top",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAllocations();
});

// Open the delete confirmation dialog
const openDeleteDialogue = (stockId) => {
  allocateToDelete.value = stockId;
  deleteDialogVisible.value = true;
};

// Delete allocation
const deleteAllocation = async () => {
  try {
    if (!allocateToDelete.value) {
      $q.notify({
         message: "মুছে ফেলার জন্য কোনো বরাদ্দ নির্বাচন করা হয়নি",
        color: "warning",
        icon: "warning",
        position: "top",
      });
      return;
    }

    const response = await api.delete(
      `/v1/resource-stocks/${allocateToDelete.value}`
    );

    if (response.status !== 200 && response.status !== 204) {
      throw new Error("API স্তরে মুছে ফেলা ব্যর্থ হয়েছে");
    }

    if (!Array.isArray(allocations.value)) {
      throw new Error("allocations.value একটি অ্যারে নয়");
    }

    // Remove from allocations list
    allocations.value = allocations.value.filter(
      (allocation) => allocation.id !== allocateToDelete.value
    );

    $q.notify({
      message: "অ্যালোকেশন সফলভাবে মুছে ফেলা হয়েছে",
      color: "positive",
      icon: "check_circle",
      position: "top",
    });

    deleteDialogVisible.value = false;
  } catch (error) {
    $q.notify({
      message: "অ্যালোকেশন মুছে ফেলতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন",
      color: "negative",
      icon: "error",
      position: "top",
    });
  }
};
</script>

<style scoped>
.allocation-list-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bg-gradient-secondary {
  background: linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%);
}

.search-input {
  border-radius: 8px;
}

.allocation-table {
  border-radius: 0;
}

.allocation-table .q-table__top {
  display: none;
}

.office-link {
  border-radius: 6px;
  transition: all 0.3s ease;
}

.office-link:hover {
  background-color: rgba(123, 31, 162, 0.04);
  transform: translateY(-1px);
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.delete-dialog {
  border-radius: 12px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .bg-gradient-secondary .row {
    flex-direction: column;
    text-align: center;
  }

  .bg-gradient-secondary .col-auto:first-child {
    margin-bottom: 16px;
  }
}

/* Table styling */
.allocation-table :deep(.q-table__top) {
  padding: 0;
}

.allocation-table :deep(.q-table thead th) {
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
}

.allocation-table :deep(.q-table tbody td) {
  border-bottom: 1px solid #f0f0f0;
}

.allocation-table :deep(.q-table tbody tr:hover) {
  background-color: rgba(123, 31, 162, 0.02);
}

/* Loading animation */
.q-inner-loading {
  border-radius: 12px;
}

/* Enhanced visual elements */
.q-avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.q-banner {
  border-left: 4px solid #f44336;
}
</style>
