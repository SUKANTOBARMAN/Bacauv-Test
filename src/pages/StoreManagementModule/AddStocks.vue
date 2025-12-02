<template>
  <q-page
    class="q-pa-sm"
    style="
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
    "
  >
    <div class="row justify-center">
      <div class="col-12 col-md-10 col-lg-10">
        <!-- Header Section -->
        <div class="text-center q-mb-md q-mt-sm">
          <div class="text-h5 text-weight-bold text-primary q-mb-xs">
            <q-icon name="inventory" size="md" class="q-mr-sm" />
            ইনভেন্টরি ব্যবস্থাপনা
          </div>
          <div class="text-caption text-grey-7">
            আপনার ইনভেন্টরিতে নতুন স্টক আইটেম যুক্ত করুন
          </div>

        </div>

        <!-- Main Card -->
        <q-card
          class="shadow-10 rounded-borders-lg"
          style="border-radius: 16px; overflow: hidden"
        >
          <!-- Card Header -->
          <q-card-section
            class="bg-gradient text-white text-center q-py-md"
            style="background: linear-gradient(45deg, #667eea 0%, #764ba2 100%)"
          >
            <div class="text-h5 text-weight-medium">
              <q-icon name="add_box" size="md" class="q-mr-sm" />
              নতুন স্টক আইটেম যোগ করুন
            </div>

          </q-card-section>

          <q-card-section class="q-pa-md">
            <q-form @submit.prevent="submitStocks">
              <!-- Stock Items -->
              <div class="q-mb-md">
                <div class="text-h6 text-grey-8 q-mb-md flex items-center">
                  <q-icon name="list_alt" class="q-mr-sm text-primary" />
                 স্টক আইটেমসমূহ
                  <q-chip
                    :label="`${stocks.length} টি আইটেম${
                      stocks.length !== 1 ? 's' : ''
                    }`"
                    color="primary"
                    text-color="white"
                    size="sm"
                    class="q-ml-sm"
                  />
                </div>

                <div
                  v-for="(stock, index) in stocks"
                  :key="index"
                  class="q-mb-md"
                >
                  <q-card
                    flat
                    bordered
                    class="rounded-borders stock-item-card"
                    style="border: 2px solid #e0e7ff; background: #fafbff"
                  >
                    <q-card-section class="q-pa-sm">
                      <!-- Item Header -->
                      <div class="flex items-center justify-between q-mb-md">
                        <div class="flex items-center">
                          <q-avatar
                            size="sm"
                            color="primary"
                            text-color="white"
                            class="q-mr-sm"
                          >
                            {{ index + 1 }}
                          </q-avatar>
                          <span class="text-weight-medium text-grey-8"
                            >স্টক আইটেমস #{{ index + 1 }}</span
                          >
                        </div>
                        <q-btn
                          v-if="stocks.length > 1"
                          flat
                          round
                          dense
                          icon="close"
                          color="negative"
                          size="sm"
                          @click="removeStock(index)"
                          class="hover-scale"
                        >
                          <q-tooltip>এই আইটেমটি মুছে ফেলুন</q-tooltip>

                        </q-btn>
                      </div>

                      <!-- Form Fields -->
                      <div class="row q-col-gutter-sm">
                        <!-- Product Selection -->
                        <div class="col-12 col-sm-6 col-md-6">
                          <q-select
                            outlined
                            v-model="stock.resource_id"
                            :options="resourceOptions"
                            option-label="name"
                            option-value="id"
                            label="পণ্য নির্বাচন করুন"
                            emit-value
                            map-options
                            :rules="[(val) => !!val || 'পণ্য নির্বাচন করা আবশ্যক']"

                            clearable
                            use-input
                            input-debounce="300"
                            behavior="menu"
                            class="animated-input"
                          >
                            <template v-slot:prepend>
                              <q-icon name="inventory_2" color="primary" />
                            </template>
                            <template v-slot:no-option>
                              <q-item>
                                <q-item-section class="text-grey">
                                  কোনো পণ্য পাওয়া যায়নি
                                </q-item-section>

                              </q-item>
                            </template>
                          </q-select>
                        </div>

                        <!-- Office Selection -->
                        <div class="col-12 col-sm-6 col-md-6">
                          <q-select
                            v-model="stock.office_id"
                            :options="currentLevelOptions"
                            option-label="name"
                            option-value="id"
                            label="অফিস নির্বাচন করুন"
                            outlined
                            emit-value
                            map-options
                            @update:model-value="
                              (val) => handleOfficeSelection(val, index)
                            "
                            clearable
                            use-input
                            input-debounce="300"
                            behavior="menu"
                            class="animated-input"
                          >
                            <template v-slot:prepend>
                              <q-icon name="business" color="primary" />
                            </template>
                            <template v-slot:no-option>
                              <q-item>
                               <q-item-section class="text-grey">
                                  কোনো অফিস নেই
                                </q-item-section>

                              </q-item>
                            </template>
                          </q-select>
                        </div>

                        <!-- Quantity -->
                        <div class="col-12 col-sm-6 col-md-6">
                          <q-input
                            outlined
                            type="number"
                            v-model.number="stock.quantity"
                            label="পরিমাণ"
                            :rules="[(val) => val > 0 || 'পরিমাণ ০ এর বেশি হতে হবে']"

                            min="1"
                            class="animated-input"
                          >
                            <template v-slot:prepend>
                              <q-icon
                                name="format_list_numbered"
                                color="primary"
                              />
                            </template>
                            <template v-slot:append>
                              <div class="row q-gutter-xs">
                                <q-btn
                                  flat
                                  round
                                  dense
                                  icon="remove"
                                  size="xs"
                                  color="negative"
                                  @click="
                                    stock.quantity = Math.max(
                                      1,
                                      (stock.quantity || 1) - 1
                                    )
                                  "
                                />
                                <q-btn
                                  flat
                                  round
                                  dense
                                  icon="add"
                                  size="xs"
                                  color="positive"
                                  @click="
                                    stock.quantity = (stock.quantity || 0) + 1
                                  "
                                />
                              </div>
                            </template>
                          </q-input>
                        </div>

                        <!-- Stock Date -->
                        <div class="col-12 col-sm-6 col-md-6">
                          <q-input
                            outlined
                            v-model="stock.date"
                            label="স্টক তারিখ"
                            type="date"
                            required
                            class="animated-input"
                          >
                            <template v-slot:prepend>
                              <q-icon name="event" color="primary" />
                            </template>
                          </q-input>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="text-center q-gutter-sm q-mb-sm">
                <q-btn
                  color="primary"
                  icon="add_circle"
                  label="আরও একটি আইটেম যোগ করুন"
                  @click="addStock"
                  unelevated
                  size="sm"
                  class="hover-scale"
                  style="border-radius: 8px"
                >
                  <q-tooltip>আরও স্টক আইটেম যোগ করুন</q-tooltip>
                </q-btn>
              </div>

              <q-separator class="q-my-sm" />

              <!-- Submit Section -->
              <div class="text-center">
                <q-btn
                  label="স্টক জমা দিন"
                  type="submit"
                  color="teal"
                  icon="save"
                  unelevated
                  size="sm"
                  class="text-weight-medium hover-scale submit-btn"
                  style="border-radius: 8px; min-width: 140px"
                >
                 <q-tooltip>সমস্ত স্টক ইনভেন্টরিতে সংরক্ষণ করুন</q-tooltip>
                </q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>

        <!-- Footer Info -->
        <div class="text-center q-mt-sm q-mb-sm">
          <q-chip
            icon="info"
            color="blue-grey-2"
            text-color="blue-grey-8"
            size="sm"
            class="q-px-sm"
          >
            <span class="text-caption">
              টিপস: আইটেম যুক্ত করার তারিখ ট্র্যাক করতে তারিখ ফিল্ড ব্যবহার করুন
            </span>

          </q-chip>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed, watch, toRaw } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { handleApiError } from "src/utilities/apiErrorHandler.js";

const router = useRouter();
const $q = useQuasar();

// Office selection state
const pathStack = ref([]);
const currentLevelNodes = ref([]);
const selectedOfficeId = ref(null);
const selectedWorkplace = ref(null);
const officeTreeData = ref(null);

const resourceOptions = ref([]);

const fetchResources = async () => {
  try {
    const response = await api.get("/v1/resources");
    resourceOptions.value = response.data.data;
  } catch (error) {
    handleApiError(error, $q);
  }
};

onMounted(fetchResources);

const stocks = ref([
  {
    resource_id: "",
    office_id: "",
    type: "restock",
    quantity: 1,
    date: new Date().toISOString().split("T")[0], // Set default date to today
  },
]);

const addStock = () => {
  stocks.value.push({
    resource_id: "",
    office_id: "",
    type: "restock",
    quantity: 1,
    date: new Date().toISOString().split("T")[0], // Set default date to today
  });
};

const removeStock = async (index) => {
  if (stocks.value.length > 1) {
    stocks.value.splice(index, 1);
  }
};

// Workplace Selection Computed Properties
const currentLevelOptions = computed(() =>
  currentLevelNodes.value.map((node) => ({
    id: node.id,
    name: node.name,
    type: node.type,
  }))
);

const selectedOffice = (index) =>
  currentLevelNodes.value.find(
    (node) => node.id === stocks.value[index]?.office_id
  );

const handleOfficeSelection = (officeId, index) => {
  stocks.value[index].office_id = officeId;
  if (!officeId) return;

  const selected = currentLevelNodes.value.find((node) => node.id === officeId);
  if (selected) {
    selectedWorkplace.value = {
      id: selected.id,
      name: selected.name,
      type: selected.type,
      additional_info: selected.additional_info,
    };
  }
};

const resetWorkplaceSelection = () => {
  pathStack.value = [];
  currentLevelNodes.value =
    officeTreeData.value?.filter((item) => item.type === "head_office") || [];
  selectedOfficeId.value = null;
  selectedWorkplace.value = null;
};

onMounted(async () => {
  try {
    const response = await api.get("/v1/categories?search=type:head_office");
    officeTreeData.value = response.data.data;
    resetWorkplaceSelection();
  } catch (error) {
    handleApiError(error, $q);
  }
});

const submitStocks = async () => {
  const rawArray = toRaw(stocks.value);

  // Show loading notification
  const loading = $q.notify({
    group: false,
    spinner: true,
    message: "Submitting stock items...",
    timeout: 0,
  });

  let successCount = 0;

  for (const item of rawArray) {
    const payload = {
      resource_id: item.resource_id,
      office_id: item.office_id,
      type: "restock",
      quantity: item.quantity,
      date: new Date(item.date).toISOString().split("T")[0],
    };

    try {
      const response = await api.post("/v1/resource-stocks", payload);

      if (response.data) {
        successCount++;
      }
    } catch (error) {
      loading();
      handleApiError(error, $q);
      return;
    }
  }

  loading();

  // Show success notification
  $q.notify({
    message: `Successfully added ${successCount} stock item${
      successCount !== 1 ? "s" : ""
    }!`,
    color: "positive",
    icon: "check_circle",
    position: "top",
    timeout: 3000,
    actions: [
      { icon: "close", color: "white", round: true, handler: () => {} },
    ],
  });

  // redirect to stock page
  router.push("/stocks");
};
</script>

<style scoped>
.stock-item-card {
  transition: all 0.3s ease;
}

.stock-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.animated-input {
  transition: all 0.3s ease;
}

.animated-input:hover {
  transform: translateY(-1px);
}

.submit-btn {
  transition: all 0.3s ease;
}

.rounded-borders-lg {
  border-radius: 16px;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.5rem;
  }

  .text-h5 {
    font-size: 1.25rem;
  }

  .q-pa-lg {
    padding: 16px;
  }
}

/* Animation for form fields */
.q-field--outlined .q-field__control:hover:before {
  border-color: var(--q-primary);
}

/* Custom gradient backgrounds */
.bg-gradient {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
}
</style>
