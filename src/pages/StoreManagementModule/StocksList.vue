<template>
  <div class="q-pa-md">
    <q-card bordered class="no-shadow stock-list-card">
      <!-- Header Section with Gradient Background -->
      <q-card-section class="bg-gradient-primary text-white">
        <div class="row items-center justify-between">
          <div class="col-auto">
            <div class="text-h5 text-weight-bold q-mb-xs">
              <q-icon name="inventory_2" size="sm" class="q-mr-sm" />
              স্টক ম্যানেজমেন্ট
            </div>
            <div class="text-subtitle2 text-blue-1">
              সহজে আপনার পণ্য মজুদ ব্যবস্থাপনা করুন
            </div>

          </div>
          <div class="col-auto">
            <q-btn
              unelevated
              color="white"
              text-color="primary"
              icon="add_circle"
              label="নতুন স্টক যোগ করুন"
              class="text-weight-medium shadow-2"
              size="md"
              @click="$router.push('add-stock')"
            >
              <q-tooltip class="bg-grey-8">নতুন স্টক আইটেম যোগ করুন</q-tooltip>
            </q-btn>

          </div>
        </div>
      </q-card-section>

      <!-- Search and Filter Section -->
      <q-card-section class="bg-grey-1">
        <div class="row q-col-gutter-md items-end">
          <!-- Search Input -->
          <div class="col-12 col-md-4">
            <q-input
              v-model="filter"
              outlined
              dense
              placeholder="পণ্য খুঁজুন..."
              clearable
              class="search-input"
              bg-color="white"
            >
              <template v-slot:prepend>
                <q-icon name="search" color="primary" />
              </template>
            </q-input>

          </div>

          <!-- Date Range Filters -->
          <div class="col-12 col-md-6 q-mt-sm">
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-input
                  v-model="dateFrom"
                  outlined
                  dense
                  label="তারিখ থেকে"
                  mask="date"
                  placeholder="YYYY/MM/DD"
                  :rules="['date']"
                  bg-color="white"
                  class="date-input"
                >
                  <template class="suku" v-slot:prepend>
                    <q-icon name="event" color="primary" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="dateFrom"
                          mask="YYYY/MM/DD"
                          color="primary"
                          class="shadow-4"
                        >
                          <div class="row items-center justify-end q-pa-sm">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                              size="sm"
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <q-input
                  v-model="dateTo"
                  outlined
                  dense
                  label="তারিখ পর্যন্ত"
                  mask="date"
                  placeholder="YYYY/MM/DD"
                  :rules="['date']"
                  bg-color="white"
                  class="date-input"
                >
                  <template class="suku" v-slot:prepend>
                    <q-icon name="event" color="primary" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="dateTo"
                          mask="YYYY/MM/DD"
                          color="primary"
                          class="shadow-4"
                        >
                          <div class="row items-center justify-end q-pa-sm">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                              size="sm"
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </div>
          <!-- Filter Button -->
          <div class="col-12 col-md-2">
            <q-btn
              color="primary"
              icon="filter_alt"
              label="ফিল্টার প্রয়োগ করুন"
              class="full-width filter-btn"
              unelevated
              @click="applyDateFilter"
            >
              <q-tooltip>তারিখ অনুযায়ী তথ্য ফিল্টার করুন</q-tooltip>
            </q-btn>

          </div>
        </div>

        <!-- Active Filter Chip -->
        <div class="row q-mt-sm" v-if="isFilterActive">
          <div class="col-12">
            <q-chip
              removable
              color="primary"
              text-color="white"
              icon="filter_alt"
              @remove="clearDateFilter"
              class="shadow-2"
            >
              <q-icon name="date_range" size="xs" class="q-mr-xs" />
              {{ formatDateForDisplay(dateFrom) }} -
              {{ formatDateForDisplay(dateTo) }}
            </q-chip>
          </div>
        </div>
      </q-card-section>

      <!-- Table Section -->
      <q-card-section class="q-pa-none">
        <q-table
          :columns="columns"
          :filter="filter"
          :rows="filteredStocks"
          :pagination="{ rowsPerPage: 0 }"
          class="stock-table"
          row-key="id"
          flat
          :loading="loading"
        >
          <!-- Loading State -->
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <!-- No Data State -->
          <template v-slot:no-data="{ message }">
            <div class="full-width row flex-center text-grey-6 q-pa-lg">
              <q-icon name="inventory" size="3em" class="q-mb-md" />
              <div class="text-h6 q-mb-sm">কোনো স্টক পাওয়া যায়নি</div>
              <div class="text-body2">
                {{
                  filter
                    ? "অনুগ্রহ করে আপনার সার্চ বা ফিল্টার পরিবর্তন করে দেখুন"
                    : "শুরু করতে প্রথম স্টক আইটেমটি যোগ করুন"
                }}
              </div>

            </div>
          </template>

          <!-- Product Column -->
          <template v-slot:body-cell-product="props">
            <q-td :props="props">
              <q-btn
                flat
                no-caps
                color="primary"
                class="text-weight-medium product-link"
                @click="
                  $router.push({
                    name: 'product-view',
                    params: { resource_id: props.row.resource_id },
                    query: { product: props.row.product || 'Unknown Product' },
                  })
                "
              >
                <q-icon name="inventory" size="xs" class="q-mr-xs" />
                {{ props.row.product }}
                <q-tooltip class="bg-grey-8">
                  পণ্যের বিস্তারিত দেখতে ক্লিক করুন
                </q-tooltip>

              </q-btn>
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
                  name="calendar_today"
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
                      name: 'edit-stock',
                      query: { id: props.row.id },
                    })
                  "
                >
                  <q-tooltip class="bg-blue-6">Edit Stock</q-tooltip>
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
                  <q-tooltip class="bg-red-6">Delete Stock</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <!-- Table Footer -->
          <template v-slot:bottom>
            <div class="full-width text-center q-pa-md text-grey-6">
              <div class="row items-center justify-center q-gutter-md">
                <div class="text-body2">
                  <q-icon name="info" size="xs" class="q-mr-xs" />
                  মোট {{ stocks.length }}টির মধ্যে {{ filteredStocks.length }}টি দেখানো হচ্ছে
                </div>
                <q-separator vertical />
                <div class="text-body2">
                  <q-icon name="refresh" size="xs" class="q-mr-xs" />
                  সর্বশেষ আপডেট: {{ new Date().toLocaleTimeString() }}
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
      <q-card class="delete-dialog" style="min-width: 400px; max-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="warning" color="red-1" text-color="red-6" size="md" />
          <div class="q-ml-sm">
            <div class="text-h6 text-red-6 text-weight-bold">
              মুছে ফেলার নিশ্চয়তা?
            </div>
            <div class="text-subtitle2 text-grey-7">
              এই কাজটি বাতিল করা যাবে না
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-sm">
          <div class="text-body1 text-grey-8">
            আপনি কি নিশ্চিতভাবে এই স্টক ডেটা মুছে ফেলতে চান? এটি স্থায়ীভাবে মুছে যাবে।
          </div>
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
            label="স্টক মুছুন"
            color="red-6"
            icon="delete"
            v-close-popup
            unelevated
            class="text-weight-medium"
            no-caps
            @click="deleteStock"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

const route = useRoute();
const $q = useQuasar();

// Reactive state
const filter = ref("");
const stocks = ref([]);
const filteredStocks = ref([]);
const deleteDialogVisible = ref(false);
const stockToDelete = ref(null);
const stockData = ref(null);
const loading = ref(false);

// Date filter states
const dateFrom = ref("");
const dateTo = ref("");
const isFilterActive = ref(false);

const columns = ref([
  {
    name: "product",
    label: "পণ্যের নাম",
    align: "left",
    field: "product",
    sortable: true,
    headerStyle: "font-weight: 600; color: #1976d2;",
  },
  {
    name: "quantity",
    label: "পরিমাণ",
    align: "center",
    field: "quantity",
    sortable: true,
    headerStyle: "font-weight: 600; color: #1976d2;",
  },
  {
    name: "date",
    label: "তারিখ",
    align: "left",
    field: "date",
    sortable: true,
    headerStyle: "font-weight: 600; color: #1976d2;",
  },
  {
    name: "Action",
    label: "অ্যাকশন",
    align: "center",
    headerStyle: "font-weight: 600; color: #1976d2;",
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

const fetchStocks = async () => {
  loading.value = true;
  try {
    const stockResponse = await api.get(
      "/v1/resource-stocks?search=type:restock;office_id:Z2arzQRNY8b9w463&searchJoin=and&limit=0"
    );

    // Fetch resource data
    const resourceResponse = await api.get("/v1/resources");

    if (resourceResponse.data && Array.isArray(resourceResponse.data.data)) {
      const resourceMap = resourceResponse.data.data.reduce((map, resource) => {
        map[resource.id] = resource.name;
        return map;
      }, {});

      // Map stock data and add product name
      stocks.value = stockResponse.data.data.map((item) => {
        const product = resourceMap[item.resource_id];
        return {
          id: item.id,
          product: product || "Unknown Product",
          resource_id: item.resource_id,
          office_id: item.office_id,
          type: item.type,
          quantity: item.quantity,
          date: new Date(item.date).toISOString().split("T")[0],
        };
      });

      // Initialize filtered stocks with all stocks
      filteredStocks.value = [...stocks.value];
    } else {
      $q.notify({
        message: "Error fetching stocks",
        color: "negative",
        icon: "error",
        position: "top",
      });
    }
  } catch (error) {
    handleApiError(error, $q);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchStocks();
});

// Format date for display in UI
const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  const parts = dateString.split("/");
  if (parts.length === 3) {
    return `${parts[0]}-${parts[1]}-${parts[2]}`;
  }
  return dateString;
};

// Apply date filter to the stock list
const applyDateFilter = () => {
  if (!dateFrom.value && !dateTo.value) {
    filteredStocks.value = [...stocks.value];
    isFilterActive.value = false;
    return;
  }

  let fromDate = null;
  let toDate = null;

  if (dateFrom.value) {
    fromDate = new Date(dateFrom.value.replace(/\//g, "-"));
  }

  if (dateTo.value) {
    toDate = new Date(dateTo.value.replace(/\//g, "-"));
    toDate.setHours(23, 59, 59, 999);
  }

  filteredStocks.value = stocks.value.filter((stock) => {
    const stockDate = new Date(stock.date);

    if (fromDate && toDate) {
      return stockDate >= fromDate && stockDate <= toDate;
    } else if (fromDate) {
      return stockDate >= fromDate;
    } else if (toDate) {
      return stockDate <= toDate;
    }

    return true;
  });

  isFilterActive.value = true;

  $q.notify({
    message: `Filter applied: ${filteredStocks.value.length} of ${stocks.value.length} items shown`,
    color: "info",
    icon: "filter_alt",
    position: "top",
    timeout: 3000,
  });
};

// Clear date filters
const clearDateFilter = () => {
  dateFrom.value = "";
  dateTo.value = "";
  filteredStocks.value = [...stocks.value];
  isFilterActive.value = false;

  $q.notify({
    message: "Date filters cleared",
    color: "positive",
    icon: "clear_all",
    position: "top",
    timeout: 2000,
  });
};

// Open the delete confirmation dialog
const openDeleteDialogue = (stockId) => {
  stockToDelete.value = stockId;
  deleteDialogVisible.value = true;
};

// Delete stock
const deleteStock = async () => {
  try {
    const response = await api.delete(
      `/v1/resource-stocks/${stockToDelete.value}`
    );

    stocks.value = stocks.value.filter(
      (stock) => stock.id !== stockToDelete.value
    );

    filteredStocks.value = filteredStocks.value.filter(
      (stock) => stock.id !== stockToDelete.value
    );

    $q.notify({
      message: "Stock deleted successfully",
      color: "positive",
      icon: "check_circle",
      position: "top",
    });

    deleteDialogVisible.value = false;
  } catch (error) {
    $q.notify({
      message: "Failed to delete stock. Please try again",
      color: "negative",
      icon: "error",
      position: "top",
    });
  }
};
</script>

<style scoped>
.stock-list-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
}

.search-input {
  border-radius: 8px;
}

.suku {
  margin-top: 100px;
}

.date-input {
  border-radius: 8px;
}

.filter-btn {
  border-radius: 8px;
  font-weight: 500;
}

.stock-table {
  border-radius: 0;
}

.stock-table .q-table__top {
  display: none;
}

.product-link {
  border-radius: 6px;
  transition: all 0.3s ease;
}

.product-link:hover {
  background-color: rgba(25, 118, 210, 0.04);
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
  .bg-gradient-primary .row {
    flex-direction: column;
    text-align: center;
  }

  .bg-gradient-primary .col-auto:first-child {
    margin-bottom: 16px;
  }
}

/* Table styling */
.stock-table :deep(.q-table__top) {
  padding: 0;
}

.stock-table :deep(.q-table thead th) {
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
}

.stock-table :deep(.q-table tbody td) {
  border-bottom: 1px solid #f0f0f0;
}

.stock-table :deep(.q-table tbody tr:hover) {
  background-color: rgba(25, 118, 210, 0.02);
}

/* Loading animation */
.q-inner-loading {
  border-radius: 12px;
}
</style>
