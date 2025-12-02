<template>
  <q-page class="office-allocation-page">
    <!-- Compact Header Section -->
    <div class="page-header q-pa-md">
      <div class="row items-center justify-between">
        <div class="col-auto">
          <div class="flex items-center q-gutter-sm">
            <q-icon name="business" size="1.8rem" class="text-primary" />
            <div>
              <h5 class="text-h5 text-grey-9 q-ma-none office-title">
                {{ officeName }}
              </h5>
              <p class="text-caption text-grey-6 q-ma-none">
                অফিস ইভেন্টরি বরাদ্দ
              </p>
            </div>
          </div>
        </div>
        <div class="col-auto">
          <div class="flex items-center q-gutter-xs">
            <q-chip
              color="primary"
              text-color="white"
              icon="inventory"
              size="sm"
              class="text-weight-medium"
            >
              {{ productAllocations.length }} টি আইটেম
            </q-chip>
            <q-btn
              flat
              round
              icon="refresh"
              color="primary"
              size="sm"
              @click="fetchData"
              class="refresh-btn"
            >
              <q-tooltip>তথ্য পুনরায় লোড করুন</q-tooltip>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="q-pa-md">
      <q-card class="allocation-card" flat bordered>
        <q-card-section class="card-header q-pa-sm">
          <div class="flex items-center q-gutter-xs">
            <q-icon name="table_chart" class="text-primary" size="1.2rem" />
            <span class="text-subtitle1 text-grey-8 text-weight-medium"
              >পণ্য বরাদ্দসমূহ</span
            >
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pa-none">
          <q-table
            flat
            :rows="productAllocations"
            :columns="columns"
            row-key="resource_id"
            :loading="loading"
            :pagination="pagination"
            class="allocation-table"
            no-data-label="এই অফিসের জন্য কোন বরাদ্দ পাওয়া যায়নি"
            loading-label="বরাদ্দগুলো লোড হচ্ছে..."
            dense
          >
            <!-- Custom header -->
            <template v-slot:header="props">
              <q-tr :props="props" class="table-header">
                <q-th
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  class="text-weight-bold text-grey-8"
                >
                  <div class="flex items-center q-gutter-xs">
                    <q-icon
                      :name="getColumnIcon(col.name)"
                      size="1rem"
                      class="text-primary"
                    />
                    <span>{{ col.label }}</span>
                  </div>
                </q-th>
              </q-tr>
            </template>

            <!-- Custom body -->
            <template v-slot:body="props">
              <q-tr :props="props" class="table-row">
                <q-td key="product_name" :props="props" class="product-cell">
                  <div class="flex items-center q-gutter-xs">
                    <q-avatar
                      size="1.5rem"
                      color="primary"
                      text-color="white"
                      class="product-avatar"
                    >
                      <q-icon name="inventory_2" size="xs" />
                    </q-avatar>
                    <div class="product-info">
                      <div class="text-weight-medium text-grey-9 product-name">
                        {{ props.row.product_name }}
                      </div>
                    </div>
                  </div>
                </q-td>

                <q-td
                  key="quantity"
                  :props="props"
                  class="quantity-cell text-center"
                >
                  <q-badge
                    :color="getQuantityColor(props.row.quantity)"
                    text-color="white"
                    class="text-weight-bold quantity-badge"
                  >
                    {{ props.row.quantity }}
                  </q-badge>
                </q-td>

                <q-td key="date" :props="props" class="date-cell">
                  <div class="flex items-center q-gutter-xs">
                    <q-icon name="event" class="text-grey-5" size="xs" />
                    <span class="text-grey-8 date-text">{{
                      formatDate(props.row.date)
                    }}</span>
                  </div>
                </q-td>
              </q-tr>
            </template>

            <!-- No data template -->
            <template v-slot:no-data="{ message }">
              <div
                class="full-width row flex-center text-grey-6 q-gutter-sm q-py-lg"
              >
                <q-icon size="1.5rem" name="inbox" />
                <span class="text-body2">{{ message }}</span>
              </div>
            </template>

            <!-- Loading template -->
            <template v-slot:loading>
              <q-inner-loading showing color="primary" />
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { api } from "boot/axios";
import { handleApiError } from "src/utilities/apiErrorHandler.js";

const route = useRoute();
const officeId = route.query.child_office_id;
const officeName = route.query.office;

const productAllocations = ref([]);
const allResources = ref([]);
const loading = ref(false);

// Table pagination - increased rows per page to reduce scrolling
const pagination = ref({
  sortBy: "date",
  descending: true,
  page: 1,
  rowsPerPage: 15,
});

const columns = [
  {
    name: "product_name",
    label: "পণ্যের নাম",
    align: "left",
    field: "product_name",
    sortable: true,
  },
  {
    name: "quantity",
    label: "পরিমাণ",
    align: "center",
    field: "quantity",
    sortable: true,
  },
  {
    name: "date",
    label: "তারিখ",
    align: "left",
    field: "date",
    sortable: true,
  },
];


// Helper functions
const getColumnIcon = (columnName) => {
  const iconMap = {
    product_name: "inventory_2",
    quantity: "functions",
    date: "event",
  };
  return iconMap[columnName] || "help";
};

const getQuantityColor = (quantity) => {
  const qty = parseInt(quantity);
  if (qty >= 100) return "green";
  if (qty >= 50) return "orange";
  if (qty >= 10) return "amber";
  return "red";
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const fetchData = async () => {
  loading.value = true;
  try {
    // Step 1: Bring data from stock
    const stockRes = await api.get("/v1/resource-stocks?search=type:consume");

    const allStocks = stockRes.data.data;

    // Step 2: Bring all resource names (resource_id -> product_name)
    const resourceRes = await api.get("/v1/resources");
    allResources.value = resourceRes.data.data;

    // Step 3: Filter only for this office
    const filtered = allStocks.filter(
      (item) => item.additional_info?.child_office_id === officeId
    );

    // Step 4: Add product_name
    productAllocations.value = filtered.map((item) => {
      const matchedResource = allResources.value.find(
        (r) => r.id === item.resource_id
      );

      return {
        product_name: matchedResource ? matchedResource.name : "অজানা",
        quantity: item.quantity,
        date: new Date(item.date).toISOString().split("T")[0],
        resource_id: item.resource_id,
      };
    });
  } catch (error) {
    handleApiError(error, $q);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (officeId) {
    fetchData();
  }
});
</script>

<style lang="scss" scoped>
.office-allocation-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 0;
  min-height: auto;

  .office-title {
    background: linear-gradient(45deg, #1976d2, #42a5f5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 1.1rem;
    line-height: 1.2;
  }
}

.allocation-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .card-header {
    background: #fafafa;
    border-bottom: 1px solid #e0e0e0;
    min-height: auto;
  }
}

.allocation-table {
  .table-header {
    background: #f8f9fa;

    th {
      font-size: 0.8rem;
      padding: 8px 12px;
      height: 40px;
    }
  }

  .table-row {
    transition: background-color 0.2s ease;
    height: 48px;

    &:hover {
      background-color: #f5f5f5;
    }

    td {
      padding: 6px 12px;
    }
  }

  .product-cell {
    .product-avatar {
      flex-shrink: 0;
    }

    .product-info {
      min-width: 0;
      flex: 1;
    }

    .product-name {
      font-size: 0.875rem;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .quantity-cell {
    .quantity-badge {
      font-size: 0.75rem;
      padding: 4px 8px;
      border-radius: 12px;
    }
  }

  .date-cell {
    .date-text {
      font-size: 0.8rem;
    }
  }
}

.refresh-btn {
  transition: transform 0.2s ease;

  &:hover {
    transform: rotate(180deg);
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .page-header {
    .office-title {
      font-size: 1rem;
    }
  }

  .allocation-table {
    .table-row {
      height: 44px;

      td {
        padding: 4px 8px;
      }
    }

    .product-cell {
      .product-avatar {
        display: none;
      }

      .product-name {
        font-size: 0.8rem;
      }
    }

    .quantity-cell .quantity-badge {
      font-size: 0.7rem;
      padding: 2px 6px;
    }

    .date-cell .date-text {
      font-size: 0.75rem;
    }
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 0.75rem;

    .office-title {
      font-size: 0.9rem;
    }
  }

  .allocation-table {
    font-size: 0.8rem;

    .table-header th {
      font-size: 0.75rem;
      padding: 6px 8px;
    }

    .table-row {
      height: 40px;
    }
  }
}

// Ensure no horizontal scrolling
.q-table__container {
  max-width: 100%;
  overflow-x: auto;
}

// Compact spacing
.q-page {
  padding-bottom: 1rem !important;
}
</style>
