<template>
  <q-page class="allocate-product-page">
    <!-- Compact Header Section -->
    <div class="page-header q-pa-md">
      <div class="row items-center justify-center">
        <div class="col-12 text-center">
          <h5 class="text-h5 text-grey-9 q-ma-none q-mb-xs">
            পণ্য বরাদ্দ করুন
          </h5>
          <p class="text-subtitle2 text-grey-6 q-ma-none q-mb-sm">
            অফিস ও বিভাগে পণ্য বিতরণ করুন
          </p>
          <q-chip
            color="primary"
            text-color="white"
            icon="inventory"
            size="sm"
            class="text-weight-medium"
          >
            {{ stocks.length }} টি বরাদ্দ{{ stocks.length !== 1 ? "s" : "" }}
          </q-chip>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="q-pa-md">
      <div class="row justify-center">
        <div class="col-12">
          <q-card class="allocation-form-card" flat bordered>
            <q-card-section class="form-content q-pa-md">
              <q-form
                @submit.prevent="submitAllocation"
                class="allocation-form"
              >
                <div class="allocations-container">
                  <div
                    v-for="(stock, index) in stocks"
                    :key="index"
                    class="allocation-item"
                  >
                    <!-- Compact Allocation Card -->
                    <q-card class="allocation-card q-mb-md" flat bordered>
                      <q-card-section class="allocation-header q-pa-sm">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center q-gutter-sm">
                            <q-badge color="secondary" class="text-weight-bold">
                              {{ index + 1 }}
                            </q-badge>
                            <span class="text-subtitle2 text-weight-medium">
                              বরাদ্দ #{{ index + 1 }}
                            </span>
                          </div>
                          <q-btn
                            v-if="stocks.length > 1"
                            flat
                            round
                            icon="close"
                            color="negative"
                            size="xs"
                            @click="removeStock(index)"
                            class="remove-btn"
                          >
                            <q-tooltip>এই বরাদ্দটি মুছুন</q-tooltip>

                          </q-btn>
                        </div>
                      </q-card-section>

                      <!-- Compact Breadcrumb Display -->
                      <div
                        v-if="breadcrumbStacks[index]?.length"
                        class="breadcrumb-section q-px-sm q-pb-sm"
                      >
                        <div class="breadcrumb-simple">
                          <span class="text-caption text-grey-6 q-mr-sm">অবস্থান:</span>

                          <span class="text-body2 text-weight-medium">
                            {{ breadcrumbStacks[index].join(" > ") }}
                          </span>
                        </div>
                      </div>

                      <q-card-section class="form-fields q-pa-sm">
                        <div class="row q-col-gutter-sm">
                          <!-- Product Selection -->
                          <div class="col-12 col-sm-6 col-md-3">
                            <q-select
                              outlined
                              v-model="stock.resource_id"
                              :options="resourceOptions"
                              option-label="name"
                              option-value="id"
                              label="পণ্য"
                              emit-value
                              map-options
                              dense
                              :rules="[(val) => !!val || 'পণ্য নির্বাচন আবশ্যক']"
                              class="compact-select"
                            >
                              <template v-slot:prepend>
                                <q-icon
                                  name="inventory_2"
                                  color="primary"
                                  size="sm"
                                />
                              </template>
                            </q-select>
                          </div>

                          <!-- Office Selection -->
                          <div class="col-12 col-sm-6 col-md-4">
                            <q-select
                              v-model="stock.office_id"
                              :options="getCurrentLevelOptions(index)"
                              option-label="name"
                              option-value="id"
                              label="অফিস"
                              outlined
                              emit-value
                              map-options
                              dense
                              @update:model-value="
                                (val) => handleOfficeSelection(val, index)
                              "
                              class="compact-select"
                            >
                              <template v-slot:prepend>
                                <q-icon
                                  name="business"
                                  color="primary"
                                  size="sm"
                                />
                              </template>
                            </q-select>

                            <!-- Compact Office Navigation -->
                            <div class="office-nav-buttons q-mt-xs">
                              <q-btn
                                v-if="canGoDeeper(index)"
                                :label="`এক্সপ্লোর করুন: ${selectedOffice(index)?.name}`"
                                color="secondary"
                                @click="goDeeper(index)"
                                dense
                                class="q-mr-xs nav-btn"
                                icon="subdirectory_arrow_right"
                                size="xs"
                              />
                              <q-btn
                                label="রিসেট করুন"
                                color="negative"
                                @click="resetWorkplaceSelection(index)"
                                dense
                                icon="refresh"
                                size="xs"
                                class="nav-btn"
                              />
                            </div>
                          </div>

                          <!-- Quantity -->
                          <div class="col-12 col-sm-6 col-md-2">
                            <q-input
                              outlined
                              type="number"
                              v-model.number="stock.quantity"
                              label="পরিমাণ"
                              dense
                              :rules="[(val) => val > 0 || 'পরিমাণ ০ এর চেয়ে বেশি হতে হবে']"
                              class="compact-input"
                            >
                              <template v-slot:prepend>
                                <q-icon
                                  name="functions"
                                  color="primary"
                                  size="sm"
                                />
                              </template>
                            </q-input>
                          </div>

                          <!-- Date -->
                          <div class="col-12 col-sm-6 col-md-3">
                            <q-input
                              outlined
                              v-model="stock.date"
                              label="তারিখ"
                              type="date"
                              required
                              dense
                              class="compact-input"
                            >
                              <template v-slot:prepend>
                                <q-icon
                                  name="event"
                                  color="primary"
                                  size="sm"
                                />
                              </template>
                            </q-input>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>

                <!-- Compact Form Actions -->
                <div class="form-actions q-mt-md">
                  <q-separator class="q-mb-md" />

                  <div class="row justify-center q-gutter-sm">
                    <q-btn
                      color="primary"
                      icon="add"
                      label="আরো যোগ করুন"
                      @click="addStock"
                      class="action-btn"
                      size="sm"
                      unelevated
                      dense
                    />

                    <q-btn
                      label="বরাদ্দ জমা দিন"
                      type="submit"
                      color="positive"
                      icon="check"
                      class="action-btn submit-btn"
                      size="sm"
                      unelevated
                      dense
                    />
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { handleApiError } from "src/utilities/apiErrorHandler.js";

const router = useRouter();
const $q = useQuasar();

// Refs
const breadcrumbStacks = ref([]);
const stocks = ref([]);
const officeTreeData = ref(null);
const pathStacks = ref([]);
const currentLevelNodesList = ref([]);
const selectedOfficeId = ref(null);
const selectedWorkplace = ref(null);
const resourceOptions = ref([]);

// Fetch resources
const fetchResources = async () => {
  try {
    const response = await api.get("/v1/resources");
    resourceOptions.value = response.data.data;
  } catch (error) {
    handleApiError(error, $q);
  }
};

// Fetch office tree
const fetchOfficeTree = async () => {
  try {
    const response = await api.get(
      `/v1/categories?search=type:head_office&include=children`
    );
    officeTreeData.value = response.data.data;
  } catch (error) {
    handleApiError(error, $q);
  }
};

// Add a new stock
const addStock = () => {
  stocks.value.push({
    resource_id: "",
    office_id: "",
    type: "consume",
    quantity: 1,
    date: "",
  });

  pathStacks.value.push([]);
  breadcrumbStacks.value.push([]);

  const headOffices =
    officeTreeData.value?.filter((item) => item.type === "head_office") || [];
  currentLevelNodesList.value.push([...headOffices]);
};

// Remove stock
const removeStock = (index) => {
  if (stocks.value.length > 1) {
    stocks.value.splice(index, 1);
    pathStacks.value.splice(index, 1);
    breadcrumbStacks.value.splice(index, 1);
    currentLevelNodesList.value.splice(index, 1);
  }
};

// Selected office
const selectedOffice = (index) =>
  currentLevelNodesList.value[index]?.find(
    (node) => node.id === stocks.value[index]?.office_id
  );

// Can go deeper
const canGoDeeper = (index) =>
  selectedOffice(index) && selectedOffice(index).children?.data?.length > 0;

// Go deeper in tree
const goDeeper = (index) => {
  const office = selectedOffice(index);
  if (office) {
    pathStacks.value[index].push(office);
    breadcrumbStacks.value[index] = pathStacks.value[index].map(
      (item) => item.name
    );
    currentLevelNodesList.value[index] = office.children?.data || [];
    stocks.value[index].office_id = null;
  }
};

// Handle selection
const handleOfficeSelection = (officeId, index) => {
  stocks.value[index].office_id = officeId;
  if (!officeId) return;

  const selected = currentLevelNodesList.value[index].find(
    (node) => node.id === officeId
  );
  if (selected) {
    selectedWorkplace.value = {
      id: selected.id,
      name: selected.name,
      type: selected.type,
      additional_info: selected.additional_info,
    };
    breadcrumbStacks.value[index] = [
      ...pathStacks.value[index].map((n) => n.name),
      selected.name,
    ];
  }
};

// Reset workplace for specific stock
const resetWorkplaceSelection = (index) => {
  const headOffices =
    officeTreeData.value?.filter((item) => item.type === "head_office") || [];

  pathStacks.value[index] = [];
  breadcrumbStacks.value[index] = [];
  currentLevelNodesList.value[index] = [...headOffices];

  const prevOfficeId = stocks.value[index]?.office_id;
  stocks.value[index].office_id = null;

  if (selectedOfficeId.value === prevOfficeId) {
    selectedOfficeId.value = null;
    selectedWorkplace.value = null;
  }
};

// Get current level options for a specific index
const getCurrentLevelOptions = (index) =>
  currentLevelNodesList.value[index]?.map((node) => ({
    id: node.id,
    name: node.name,
    type: node.type,
  })) || [];

// Watcher: when officeTreeData loads, initialize stocks
watch(officeTreeData, (newData) => {
  if (!newData || newData.length === 0) return;

  const headOffices = newData.filter((item) => item.type === "head_office");

  if (stocks.value.length === 0) {
    addStock(); // Add a stock if none exists
  } else {
    currentLevelNodesList.value = stocks.value.map(() => [...headOffices]);
    pathStacks.value = stocks.value.map(() => []);
  }
});

// Submit Handler
const submitAllocation = async () => {
  $q.loading.show({
    message: "বরাদ্দ প্রক্রিয়াজাত করা হচ্ছে...",
  });

  try {
    for (const item of stocks.value) {
      const dateStr = new Date(item.date).toISOString().split("T")[0];
      console.log("Submitting allocation for item:", item);
      const payloadConsume = {
        resource_id: item.resource_id,
        office_id: "Z2arzQRNY8b9w463",
        type: "consume",
        quantity: item.quantity,
        date: dateStr,
        additional_info: {
          child_office_id: item.office_id,
        },
      };

      const payloadRestock = {
        resource_id: item.resource_id,
        office_id: item.office_id,
        type: "restock",
        quantity: item.quantity,
        date: dateStr,
      };

      const allocates = await api.post("/v1/resource-stocks", payloadConsume);
      const stockAllocation = await api.post(
        "/v1/resource-stocks",
        payloadRestock
      );

      if (stockAllocation.data) {
        $q.notify({
          message: "সফলভাবে বরাদ্দ সম্পন্ন হয়েছে",
          color: "positive",
          icon: "check_circle",
          position: "top",
        });
      }
    }

    // Redirect to allocations page
    router.push("/allocations");
  } catch (error) {
    $q.notify({
     message: error?.response?.data?.message || "বরাদ্দ ব্যর্থ হয়েছে। আবার চেষ্টা করুন",
      color: "negative",
      icon: "error",
      position: "top",
    });
  } finally {
    $q.loading.hide();
  }
};

// Mount logic
onMounted(() => {
  fetchResources();
  fetchOfficeTree();
});
</script>

<style lang="scss" scoped>
.allocate-product-page {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;

  h5 {
    color: #1e293b;
    font-weight: 600;
  }
}

.allocation-form-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .card-header {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }
}

.allocation-card {
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }

  .allocation-header {
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;

    .remove-btn {
      opacity: 0.7;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 1;
      }
    }
  }
}

.breadcrumb-section {
  .breadcrumb-simple {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 0.5rem;
    display: flex;
    align-items: center;
  }
}

.form-fields {
  .compact-select,
  .compact-input {
    .q-field__control {
      border-radius: 6px;
      min-height: 40px;
    }

    &.q-field--focused {
      .q-field__control {
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
      }
    }
  }

  .office-nav-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;

    .nav-btn {
      border-radius: 4px;
      text-transform: none;
      font-size: 0.75rem;
      min-height: 24px;
    }
  }
}

.form-actions {
  .action-btn {
    min-width: 120px;
    border-radius: 6px;
    text-transform: none;
    font-weight: 500;

    &.submit-btn {
      background: linear-gradient(45deg, #10b981, #34d399);

      &:hover {
        background: linear-gradient(45deg, #047857, #10b981);
      }
    }
  }
}

.add-btn {
  border-radius: 4px;
  text-transform: none;
  font-weight: 500;
  min-height: 32px;
}

// Responsive adjustments
@media (max-width: 768px) {
  .page-header {
    h5 {
      font-size: 1.25rem;
    }
  }

  .allocation-card {
    .form-fields {
      .office-nav-buttons {
        .nav-btn {
          font-size: 0.7rem;
          min-height: 20px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 0.75rem;
  }

  .allocation-card {
    .allocation-header {
      .q-badge {
        font-size: 0.7rem;
      }
    }
  }

  .form-actions {
    .row {
      flex-direction: column;
      align-items: center;

      .action-btn {
        width: 100%;
        max-width: 200px;
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>
