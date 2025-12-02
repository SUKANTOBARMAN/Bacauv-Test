<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row q-col-gutter-md">
      <!-- Left Side: Product Details Card -->
      <div class="col-lg-4 col-md-6 col-sm-12">
        <q-card class="product-card" bordered>
          <q-card-section class="bg-primary text-white">
            <div class="row items-center no-wrap">
              <q-icon name="inventory" size="md" class="q-mr-sm" />
              <div class="text-h6">পণ্যের বিস্তারিত</div>
            </div>
          </q-card-section>

          <q-card-section>
            <q-skeleton v-if="loading" type="text" class="q-mb-md" />
            <template v-else>
              <div class="product-info q-py-md">
                <div class="row items-center q-mb-md">
                  <q-icon
                    name="label"
                    color="primary"
                    size="sm"
                    class="q-mr-sm"
                  />
                  <div class="text-subtitle1 text-weight-medium">
                    Product Name:
                  </div>
                  <div class="text-subtitle1 q-ml-sm">{{ product.name }}</div>
                </div>

                <div class="row items-center">
                  <q-icon
                    name="inventory_2"
                    color="primary"
                    size="sm"
                    class="q-mr-sm"
                  />
                  <div class="text-subtitle1 text-weight-medium">
                   মোট স্টক
                  </div>
                  <q-badge
                    color="primary"
                    text-color="white"
                    class="q-ml-sm text-subtitle1"
                  >
                    {{ product.totalStocks }}
                  </q-badge>
                </div>
              </div>
            </template>

            <q-separator class="q-my-md" />

            <!-- Stock Summary -->
            <div class="text-subtitle2 text-primary q-mb-sm">
              <q-icon name="summarize" size="xs" class="q-mr-xs" />
              স্টকের সারাংশ
            </div>

            <q-list bordered separator class="rounded-borders">
              <q-item v-if="loading">
                <q-item-section>
                  <q-skeleton type="text" />
                </q-item-section>
              </q-item>

              <template v-else>
                <q-item class="stock-summary-item">
                  <q-item-section avatar>
                    <q-icon color="positive" name="trending_up" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>মোট রিস্টক</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-chip color="positive" text-color="white" size="sm">
                      {{ stockHistory.length }}
                    </q-chip>
                  </q-item-section>
                </q-item>

                <q-item class="stock-summary-item">
                  <q-item-section avatar>
                    <q-icon color="negative" name="trending_down" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>মোট বরাদ্দ</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-chip color="negative" text-color="white" size="sm">
                      {{ allocationHistory.length }}
                    </q-chip>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Right Side: Tab Pane for Stocks & Allocations -->
      <div class="col-lg-8 col-md-6 col-sm-12">
        <q-card class="stock-allocation-card" bordered>
          <q-card-section class="bg-primary text-white">
            <div class="row items-center no-wrap">
              <q-icon name="assessment" size="md" class="q-mr-sm" />
              <div class="text-h6">স্টক ও বরাদ্দের বিস্তারিত</div>
            </div>
          </q-card-section>

          <q-card-section class="q-pa-none">
            <!-- Tabs -->
            <q-tabs
              v-model="activeTab"
              class="text-primary"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="stocks" icon="add_business" label="স্টক" />
              <q-tab name="allocations" icon="move_down" label=" বরাদ্দ" />
            </q-tabs>

            <q-separator />

            <!-- Tab Panels -->
            <q-tab-panels v-model="activeTab" animated>
              <!-- Stocks Table -->
              <q-tab-panel name="stocks" class="q-pa-sm">
                <div class="row items-center q-mb-md">
                  <div class="col-12 col-sm-6">
                    <div class="text-subtitle1 text-primary">
                      <q-icon name="history" class="q-mr-xs" />
                      স্টকের ইতিহাস
                    </div>
                    <div class="text-caption text-grey-7">
                      সমস্ত স্টক যোগ করার রেকর্ড
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 text-right">
                    <q-input
                      dense
                      outlined
                      placeholder="স্টক সার্চ করুন"
                      class="stock-search"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <q-table
                  flat
                  bordered
                  :rows="stockHistory"
                  :columns="enhancedStockColumns"
                  row-key="id"
                  :loading="loading"
                  binary-state-sort
                  class="stock-table"
                >
                  <template v-slot:loading>
                    <q-inner-loading showing color="primary">
                      <q-spinner-dots size="40px" color="primary" />
                    </q-inner-loading>
                  </template>

                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="quantity" :props="props">
                        <q-badge color="positive" text-color="white">
                          +{{ props.row.quantity }}
                        </q-badge>
                      </q-td>
                      <q-td key="date" :props="props">
                        <q-chip
                          size="sm"
                          color="grey-3"
                          text-color="grey-8"
                          icon="event"
                        >
                          {{ formatDate(props.row.date) }}
                        </q-chip>
                      </q-td>
                    </q-tr>
                  </template>

                  <template v-slot:no-data>
                    <div class="full-width row flex-center q-pa-md text-grey-8">
                      <q-icon name="inventory_2" size="sm" class="q-mr-sm" />
                      কোন স্টক ইতিহাস নেই
                    </div>
                  </template>
                </q-table>
              </q-tab-panel>

              <!-- Allocations Table -->
              <q-tab-panel name="allocations" class="q-pa-sm">
                <div class="row items-center q-mb-md">
                  <div class="col-12 col-sm-6">
                    <div class="text-subtitle1 text-primary">
                      <q-icon name="business_center" class="q-mr-xs" />
                      কোন স্টক ইতিহাস নেই
                    </div>
                    <div class="text-caption text-grey-7">
                      অফিসগুলোতে সমস্ত বরাদ্দের রেকর্ড
                    </div>
                  </div>
                  <div class="col-12 col-sm-6 text-right">
                    <q-input
                      dense
                      outlined
                      placeholder="বরাদ্দ সার্চ করুন"
                      class="allocation-search"
                    >
                      <template v-slot:append>
                        <q-icon name="search" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <q-table
                  flat
                  bordered
                  :rows="allocationHistory"
                  :columns="enhancedAllocationColumns"
                  row-key="id"
                  :loading="loading"
                  binary-state-sort
                  class="allocation-table"
                >
                  <template v-slot:loading>
                    <q-inner-loading showing color="primary">
                      <q-spinner-dots size="40px" color="primary" />
                    </q-inner-loading>
                  </template>

                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="office" :props="props">
                        <div class="row items-center">
                          <q-icon
                            name="business"
                            color="primary"
                            size="xs"
                            class="q-mr-sm"
                          />
                          {{ props.row.office }}
                        </div>
                      </q-td>
                      <q-td key="quantity" :props="props">
                        <q-badge color="negative" text-color="white">
                          -{{ props.row.quantity }}
                        </q-badge>
                      </q-td>
                      <q-td key="date" :props="props">
                        <q-chip
                          size="sm"
                          color="grey-3"
                          text-color="grey-8"
                          icon="event"
                        >
                          {{ formatDate(props.row.date) }}
                        </q-chip>
                      </q-td>
                    </q-tr>
                  </template>

                  <template v-slot:no-data>
                    <div class="full-width row flex-center q-pa-md text-grey-8">
                      <q-icon name="business" size="sm" class="q-mr-sm" />
                      কোন বরাদ্দের ইতিহাস নেই
                    </div>
                  </template>
                </q-table>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { api } from "boot/axios"; // Adjust the import based on your project structure
import { handleApiError } from "src/utilities/apiErrorHandler.js"; // Adjust the import based on your project structure

const $q = useQuasar();
const route = useRoute();
const resourceId = route.params.resource_id;
const productName = route.query.product || "Unknown Product";
// Loading state
const loading = ref(true);
const stocks = ref([]);
const allocations = ref([]);
// Active tab
const activeTab = ref("stocks");

// Product details
const product = ref({
  name: productName,
  totalStocks: stocks.value.reduce((acc, stock) => acc + stock.quantity, 0),
});

// Stock history
const stockHistory = ref([]);

const allocationHistory = ref([]);

// Enhanced table columns for stock history
const enhancedStockColumns = [
  {
    name: "quantity",
    label: "স্টকের পরিমাণ",
    align: "left",
    field: "quantity",
    sortable: true,
  },
  {
    name: "date",
    label: "যোগ করার তারিখ",
    align: "left",
    field: "date",
    sortable: true,
  },
];

// Enhanced table columns for allocation history
const enhancedAllocationColumns = [
  {
    name: "office",
    label: "অফিসের নাম",
    align: "left",
    field: "office",
    sortable: true,
  },
  {
    name: "quantity",
    label: "বরাদ্দকৃত পরিমাণ",
    align: "left",
    field: "quantity",
    sortable: true,
  },
  {
    name: "date",
    label: "বরাদ্দের তারিখ",
    align: "left",
    field: "date",
    sortable: true,
  },
];


// Keep original columns for reference
const stockColumns = [
  {
    name: "quantity",
    label: "স্টকের পরিমাণ",
    align: "left",
    field: "quantity",
  },
  {
    name: "date",
    label: "তারিখ",
    align: "left",
    field: "date",
  },
];


const allocationColumns = [
  {
    name: "office",
    label: "অফিসের নাম",
    align: "left",
    field: "office",
  },
  {
    name: "quantity",
    label: "পরিমাণ",
    align: "left",
    field: "quantity",
  },
  {
    name: "date",
    label: "তারিখ",
    align: "left",
    field: "date",
  },
];


// Format date for better display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const fetchStocks = async () => {
  try {
    // Make both API calls in parallel
    const [restockResponse, consumeResponse] = await Promise.all([
      api.get(
        `/v1/resource-stocks?search=resource_id:${resourceId};type:restock;office_id:Z2arzQRNY8b9w463&searchJoin=and`
      ),
      api.get(
        `/v1/resource-stocks?search=resource_id:${resourceId};type:consume&searchJoin=and`
      ),
    ]);

    // Process restocks
    const formattedRestocks = restockResponse.data.data.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      office_id: item.office_id,
      type: item.type,
      date: new Date(item.date).toISOString().split("T")[0],
    }));

    stocks.value = formattedRestocks;
    stockHistory.value = formattedRestocks;
    // 1. Fetch offices
    const officeResponse = await api.get(
      "/v1/categories?search=type:head_office&include=children"
    );
    const offices = officeResponse.data?.data || [];

    // 2. Find office path helper
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

    // 3. Get full office name path
    function getOfficeNameById(officeId) {
      const path = findOfficePath(offices, officeId);
      return path ? path[path.length - 1].name : "অজানা অফিস";
    }

    // 4. Map formatted allocations
    const formattedAllocations = consumeResponse.data.data.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      office: getOfficeNameById(item.additional_info.child_office_id),
      date: new Date(item.date).toISOString().split("T")[0],
    }));

    allocationHistory.value = formattedAllocations;

    // Calculate totals
    const totalStock = formattedRestocks.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const totalAllocated = formattedAllocations.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const totalStocks = totalStock - totalAllocated;

    // Set product info
    product.value = {
      name: route.query.product || "Unknown Product",
      totalStocks,
    };

    loading.value = false;
  } catch (error) {
    handleApiError(error, $q);
    loading.value = false;
  }
};

onMounted(() => {
  fetchStocks();
});
</script>

<style scoped>
.product-card,
.stock-allocation-card {
  border-radius: 8px;
  transition: box-shadow 0.3s ease;
}

.product-card:hover,
.stock-allocation-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.product-info {
  border-left: 3px solid var(--q-primary);
  padding-left: 12px;
}

.stock-summary-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.stock-search,
.allocation-search {
  max-width: 250px;
  transition: max-width 0.3s ease;
}

@media (max-width: 600px) {
  .stock-search,
  .allocation-search {
    max-width: 100%;
  }

  .q-table__middle {
    overflow-x: auto;
  }
}

/* Make tabs more visible on mobile */
@media (max-width: 767px) {
  .q-tabs {
    margin-top: 8px;
  }

  .q-tab {
    padding: 8px 16px;
  }
}
</style>
