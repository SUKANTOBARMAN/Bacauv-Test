<template>
  <q-page class="q-pa-md q-gutter-md bg-grey-1">
    <!-- Header Card -->
    <q-card class="no-shadow bg-white" bordered>
      <q-card-section>
        <div class="row items-center justify-between">
          <div>
            <div class="text-h5 text-indigo-8">
              <q-icon name="payments" size="md" class="q-mr-sm" />
              বেতন স্কেল টেবিল
            </div>
            <div class="text-subtitle1 text-grey-7">বেতন স্কেল এবং বর্ধিত বেতন ব্যবস্থাপনা করুন</div>

          </div>
          <q-btn
            label="বেতন স্কেল যোগ করুন"
            color="primary"
            icon="add"
            class="q-px-md text-subtitle1"
            unelevated
            rounded
            @click="showCreateModal = true"
          />

        </div>
      </q-card-section>
    </q-card>

    <!-- Main Table -->
    <q-card class="bg-white">
      <q-card-section>
        <q-table 
          :rows="salaryScales" 
          :columns="columns" 
          row-key="id"
          flat 
          bordered
          :loading="loading"
          :pagination="{ rowsPerPage: 10 }"
          class="salary-scale-table"
          separator="cell"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary">
              <q-spinner-dots size="50px" color="primary" />
            </q-inner-loading>
          </template>
          
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props" class="bg-blue-1 text-indigo-9 text-subtitle1">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="font-weight-bold text-primary text-subtitle1">{{ props.value }}</div>
            </q-td>
          </template>
          
          <template v-slot:body-cell-basicSalary="props">
            <q-td :props="props" class="text-right">
              <q-chip dense outline color="green" text-color="green" size="md" class="text-h6">
                <span class="currency-symbol">৳</span>
                {{ props.value || '-' }}
              </q-chip>
            </q-td>
          </template>
          
          <template v-slot:body-cell-increments="props">
            <q-td align="center" :props="props">
              <div class="text-grey-8 text-subtitle1">
                <q-icon name="trending_up" size="md" class="q-mr-xs" />
                {{ getIncrementSalaries(props.row) }}
              </div>
            </q-td>
          </template>
          
          <template v-slot:body-cell-actions="props">
            <q-td align="center" :props="props">
              <q-btn
                flat
                round
                icon="add_circle"
                color="primary"
                size="md"
                class="q-mx-xs"
                @click="openIncrementModal(props.row)"
              >
                <q-tooltip>Add Increments</q-tooltip>
              </q-btn>
            </q-td>
          </template>
          
          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-md text-grey-7">
              <q-icon name="sentiment_dissatisfied" size="2em" class="q-mr-sm" />
              No salary scales found
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Create Salary Scale Modal -->
    <q-dialog v-model="showCreateModal" persistent>
      <q-card style="min-width: 400px" class="q-px-sm">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            <q-icon name="add_circle" size="md" class="q-mr-sm" />
            Create New Salary Scale
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <q-form @submit.prevent="createSalaryScale">
            <div class="q-gutter-md">
              <q-input
                v-model="newSalaryScale.name"
                label="Grade Name"
                outlined
                dense
                class="q-mb-md"
                bg-color="white"
                :rules="[val => !!val || 'Name is required']"
              >
                <template v-slot:prepend>
                  <q-icon name="badge" />
                </template>
              </q-input>

              <q-input
                v-model.number="newSalaryScale.basicSalary"
                type="number"
                label="Basic Salary"
                outlined
                dense
                bg-color="white"
                :rules="[val => val >= 0 || 'Must be positive']"
              >
                <template v-slot:prepend>
                  <span class="currency-symbol">৳</span>
                </template>
              </q-input>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-1 q-pa-md">
          <q-btn flat label="Cancel" color="negative" icon="close" v-close-popup />
          <q-btn 
            label="Create" 
            color="primary" 
            icon="check"
            unelevated
            @click="createSalaryScale"
            :loading="creating"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Increment Modal -->
    <q-dialog v-model="showIncrementModal" persistent>
      <q-card style="min-width: 550px">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">
            <q-icon name="trending_up" size="md" class="q-mr-sm" />
            Increment Management
          </div>
          <div class="text-subtitle1 q-mt-sm">
            Grade: <span class="text-white text-weight-bold">{{ selectedScale?.name }}</span> | 
            Base Salary: <span class="text-white text-weight-bold">
              <span class="currency-symbol">৳</span>{{ getBaseSalary(selectedScale) }}</span>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <q-table
            :rows="getIncrementsWithoutZero(selectedScale)"
            :columns="modalColumns"
            row-key="id"
            flat
            bordered
            hide-pagination
            separator="cell"
            class="increment-table"
          >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props" class="bg-blue-1 text-indigo-9 text-subtitle1">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <div class="text-weight-medium text-subtitle1">{{ props.value }}</div>
              </q-td>
            </template>
            
            <template v-slot:body-cell-basicSalary="props">
              <q-td align="center" :props="props">
                <q-chip dense outline color="green" text-color="green" size="md" class="text-subtitle1">
                  <span class="currency-symbol">৳</span>
                  {{ props.row.additional_info?.payment_details?.basic || '-' }}
                </q-chip>
              </q-td>
            </template>
            
            <template v-slot:body-cell-actions="props">
              <q-td align="center" :props="props">
                <q-btn
                  flat
                  round
                  icon="edit"
                  color="primary"
                  size="md"
                  @click="editIncrement(props.row)"
                >
                  <q-tooltip>Edit Increment</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  icon="delete"
                  color="negative"
                  size="md"
                >
                  <q-tooltip>Delete Increment</q-tooltip>
                </q-btn>
              </q-td>
            </template>
            
            <template v-slot:no-data>
              <div class="full-width row flex-center q-pa-md text-grey-7">
                <q-icon name="info" size="2em" class="q-mr-sm" />
                No increments found
              </div>
            </template>
          </q-table>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-md">
          <div class="text-h6 text-grey-8 q-mb-sm">
            <q-icon name="add_circle" size="sm" class="q-mr-xs" />
            {{ editingIncrement ? 'Update Increment' : 'Add New Increment' }}
          </div>
          <q-form @submit.prevent="saveIncrement">
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-input
                  v-model="incrementForm.name"
                  label="Increment Name"
                  outlined
                  dense
                  bg-color="white"
                  :rules="[val => !!val || 'Name is required']"
                >
                  <template v-slot:prepend>
                    <q-icon name="label" />
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <q-input
                  v-model.number="incrementForm.basicSalary"
                  type="number"
                  label="Basic Salary"
                  outlined
                  dense
                  bg-color="white"
                  :rules="[val => val >= 0 || 'Must be positive']"
                >
                  <template v-slot:prepend>
                    <span class="currency-symbol">৳</span>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-mt-md justify-end">
              <q-btn
                :label="editingIncrement ? 'Update' : 'Add'"
                color="primary"
                icon="save"
                unelevated
                type="submit"
                :loading="savingIncrement"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-1 q-pa-md">
          <q-btn flat label="Close" color="negative" icon="close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();

const modalColumns = [
  {
    name: "name",
    label: "Increment Name",
    field: "name",
    align: "left",
  },
  {
    name: "basicSalary",
    label: "Basic Salary",
    field: "basicSalary",
    align: "center",
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
    align: "center",
  },
];

const columns = [
  { name: "name", label: "গ্রেড", field: "name", align: "left" },
  {
    name: "basicSalary",
    label: "মৌলিক বেতন",
    field: row => {
      const increment0 = row.children?.data?.find(inc => inc.name === "Increment 0");
      return increment0?.additional_info?.payment_details?.basic || '-';
    },
    align: "left",
  },
  {
    name: "increments",
    label: "বর্ধিত বেতন (মৌলিক বেতনসমূহ)",
    field: "increments",
    align: "center",
  },
  { name: "actions", label: "কর্ম", field: "actions", align: "center" },
];


const salaryScales = ref([]);
const loading = ref(false);
const creating = ref(false);
const savingIncrement = ref(false);

const showCreateModal = ref(false);
const showIncrementModal = ref(false);

const newSalaryScale = ref({
  name: "",
  basicSalary: 0
});

const selectedScale = ref(null);
const incrementForm = ref({
  name: "",
  basicSalary: 0
});
const editingIncrement = ref(null);

const getBaseSalary = (scale) => {
  const increment0 = scale.children?.data?.find(inc => inc.name === "Increment 0");
  return increment0?.additional_info?.payment_details?.basic || '-';
};

const getIncrementsWithoutZero = (scale) => {
  if (!scale.children?.data?.length) return [];
  return scale.children.data.filter(inc => inc.name !== "Increment 0");
};

const getIncrementSalaries = (row) => {
  if (!row.children?.data?.length) return '-';
  return getIncrementsWithoutZero(row)
    .map(inc => inc.additional_info?.payment_details?.basic || '')
    .filter(Boolean)
    .join(', ');
};

const fetchSalaryScales = async () => {
  loading.value = true;
  try {
    const response = await api.get("/v1/categories?search=type:salary_scale&include=children");
    salaryScales.value = response.data.data;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "বেতন স্কেল আনার সময় সমস্যা হয়েছে"
    });
  } finally {
    loading.value = false;
  }
};

const createSalaryScale = async () => {
  creating.value = true;
  try {
    const response = await api.post("/v1/categories", {
      name: newSalaryScale.value.name,
      type: "salary_scale",
      parent_id: null,
      additional_info:null,
    });

    await api.post('/v1/categories', {
      name: "Increment 0",
      type: "scale_payments",
      parent_id: response.data.data.id,
      additional_info: {
        payment_details: {
          basic: newSalaryScale.value.basicSalary,
          rent_fee:0,
          medical_fee:1500,
          education_fee:500,
          tiffin_fee:200,
          washing_fee:100,
        }
      }
    });

   $q.notify({
      type: "positive",
      message: "বেতন স্কেল সফলভাবে তৈরি হয়েছে"
    });
    showCreateModal.value = false;
    newSalaryScale.value = { name: "", basicSalary: 0 };
    fetchSalaryScales();
  } catch (error) {
   $q.notify({
      type: "negative",
      message: "বেতন স্কেল আনার সময় সমস্যা হয়েছে"
    });
  } finally {
    creating.value = false;
  }
};

const openIncrementModal = (scale) => {
  selectedScale.value = scale;
  incrementForm.value = {
    name: `Increment ${getIncrementsWithoutZero(scale).length + 1}`,
    basicSalary: 0
  };
  editingIncrement.value = null;
  showIncrementModal.value = true;
};

const editIncrement = (increment) => {
  incrementForm.value = {
    name: increment.name,
    basicSalary: increment.additional_info?.payment_details?.basic || 0
  };
  editingIncrement.value = increment.id;
};

const saveIncrement = async () => {
  savingIncrement.value = true;
  try {
    const url = editingIncrement.value 
      ? `/v1/categories/${editingIncrement.value}` 
      : "/v1/categories";

    const payload = {
      name: incrementForm.value.name,
      type: "scale_payments",
      parent_id: selectedScale.value.id,
      additional_info: {
        payment_details: {
          basic: incrementForm.value.basicSalary,
          rent_fee:null,
          medical_fee:1500,
          education_fee:500,
          tiffin_fee:200,
          washing_fee:100,
        }
      }
    };

    if (editingIncrement.value) {
      await api.patch(url, payload);
    } else {
      await api.post(url, payload);
    }

    $q.notify({
      type: "positive",
      message: `বর্ধিত বেতন ${editingIncrement.value ? 'আপডেট হয়েছে' : 'যোগ করা হয়েছে'}`
    });
    
    showIncrementModal.value = false;
    fetchSalaryScales();
  } catch (error) {
    $q.notify({
      type: "negative",
      message: `বর্ধিত বেতন ${editingIncrement.value ? 'আপডেট করতে' : 'যোগ করতে'} ব্যর্থ হয়েছে`
    });
  } finally {
    savingIncrement.value = false;
  }
};

onMounted(() => {
  fetchSalaryScales();
});
</script>

<style scoped>
.salary-scale-table .q-table__top {
  padding: 8px 16px;
  background-color: #f5f8ff;
}

.increment-table {
  border-radius: 4px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
}

.q-table thead tr th {
  font-weight: bold;
  font-size: 1.05rem;
  padding: 12px 16px;
}

.q-table tbody td {
  height: 56px;
  font-size: 1.02rem;
}

.q-icon {
  font-size: 1.2rem;
}

.q-btn {
  font-size: 1rem;
}

.q-chip {
  height: auto;
  padding: 4px 8px;
}

.currency-symbol {
  font-family: Arial, sans-serif;
  margin-right: 4px;
}

/* Fallback for Taka symbol */
@supports not (content: "৳") {
  .currency-symbol:before {
    content: "BDT ";
  }
}
</style>