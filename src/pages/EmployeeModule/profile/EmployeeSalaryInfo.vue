<template>
  <q-expansion-item
    group="profile-sections"
    label="Salary Scale"
    icon="work"
    header-class="text-h6"
  >
    <q-card bordered flat>
      <q-card-section class="row items-center">
        <div class="text-h6">Salary Scale</div>
        <q-space />
        <div class="col-auto" v-if="isAdminOrSubadmin">
          <q-btn
            color="primary"
            :label="salaryEditMode ? 'Save Changes' : 'Edit Salary'"
            @click="toggleSalaryEditMode"
            :loading="salaryLoading"
          />
          <q-btn
            v-if="salaryEditMode"
            flat
            color="negative"
            label="Cancel"
            class="q-ml-sm"
            @click="cancelSalaryEdit"
            :disabled="salaryLoading"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <div v-if="salaryLoading" class="text-center q-pa-md">
          <q-spinner color="primary" size="3em" />
          <div class="q-mt-sm">Loading salary information...</div>
        </div>
        <div v-else class="row q-col-gutter-md">
          <!-- Salary Grade Dropdown -->
          <div class="col-md-6 col-sm-12">
            <q-select
              outlined
              v-model="selectedGradeId"
              :options="gradeOptions"
              label="Salary Grade *"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              :readonly="!salaryEditMode"
              :rules="[val => !!val || 'Salary grade is required']"
              :error="!selectedGradeId && formSubmitted"
              error-message="Please select a salary grade"
              @update:model-value="onGradeChange"
            />
          </div>

          <!-- Increment Dropdown -->
          <div class="col-md-6 col-sm-12">
            <q-select
              outlined
              v-model="selectedIncrementId"
              :options="currentIncrementOptions"
              label="Current Increment *"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              :readonly="!salaryEditMode"
              :rules="[val => !!val || 'Increment is required']"
              :error="!selectedIncrementId && formSubmitted"
              error-message="Please select an increment"
              @update:model-value="onIncrementChange"
            />
          </div>

          <!-- Basic Salary (readonly) -->
          <div class="col-md-6 col-sm-12">
            <q-input
              outlined
              v-model="displayBasicSalary"
              label="Basic Salary"
              type="number"
              readonly
            />
          </div>

          <!-- Additional Fees Section -->
          <div class="col-12">
            <div class="text-h6 q-mb-md">Additional Fees</div>
            <div class="row q-col-gutter-md">
              <!-- Rent Fee -->
              <div class="col-md-4 col-sm-6 col-xs-12" v-if="currentPaymentDetails.rent_fee !== 0">
                <q-input
                  outlined
                  v-model="currentPaymentDetails.rent_fee"
                  label="Rent Fee"
                  type="number"
                  readonly
                />
              </div>
              
              <!-- Tiffin Fee -->
              <div class="col-md-4 col-sm-6 col-xs-12" v-if="currentPaymentDetails.tiffin_fee !== 0">
                <q-input
                  outlined
                  :value="currentEmployeeSalary?.additional_info?.tiffin_fee ? currentPaymentDetails.tiffin_fee : 'N/A'"
                  label="Tiffin Fee"
                  readonly
                >
                  <template v-slot:append>
                    <q-icon 
                      v-if="currentEmployeeSalary?.additional_info?.tiffin_fee"
                      name="check_circle" 
                      color="positive"
                    />
                  </template>
                </q-input>
              </div>
              
              <!-- Medical Fee -->
              <div class="col-md-4 col-sm-6 col-xs-12" v-if="currentPaymentDetails.medical_fee !== 0">
                <q-input
                  outlined
                  v-model="currentPaymentDetails.medical_fee"
                  label="Medical Fee"
                  type="number"
                  readonly
                />
              </div>
              
             <!-- Washing Fee -->
            <div class="col-md-4 col-sm-6 col-xs-12" v-if="currentPaymentDetails.washing_fee !== 0">
              <q-input
                outlined
                :value="currentEmployeeSalary?.additional_info?.washing_fee ? currentPaymentDetails.washing_fee : 'N/A'"
                label="Washing Fee"
                readonly
              >
                <template v-slot:append>
                  <q-icon 
                    v-if="currentEmployeeSalary?.additional_info?.washing_fee"
                    name="check_circle" 
                    color="positive"
                  />
                </template>
              </q-input>
            </div>

              <!-- Education Fee -->
              <div class="col-md-4 col-sm-6 col-xs-12" v-if="currentPaymentDetails.education_fee !== 0">
                <q-input
                  outlined
                  v-model="educationFeeAmount"
                  label="Education Fee"
                  type="number"
                  :readonly="!salaryEditMode"
                  :rules="[val => val === null || val >= 0 || 'Must be positive']"
                />
              </div>

            </div>
          </div>


           <!-- not added as education fee is added to salary's addtional info but not counted in total_salary -->
            
          <!-- Total Salary -->
          <!-- <div class="col-md-6 col-sm-12">
            <q-input
              outlined
              v-model="totalSalary"
              label="Total Salary"
              type="number"
              readonly
              class="text-weight-bold"
            />
          </div> -->
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import { useUserStore } from 'src/stores/userStore';

const userStore = useUserStore();
const $q = useQuasar();
const route = useRoute();
const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  employee: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['saved', 'update:employee']);

// Reactive data
const employeeId = ref(route.params.id);
const allSalaryScales = ref([]);
const selectedGradeId = ref(null);
const selectedIncrementId = ref(null);
const currentEmployeeSalary = ref(null);
const salaryEditMode = ref(false);
const salaryLoading = ref(false);
const formSubmitted = ref(false);
const originalSalaryData = ref(null);
const educationFeeAmount = ref(0);

// Computed properties
const isValid = computed(() => {
  return !!selectedGradeId.value && !!selectedIncrementId.value;
});

const isAdminOrSubadmin = computed(() => {
  const highestRole = userStore.user?.highestRole;
  return highestRole === 'admin' || highestRole === 'subadmin';
});

const gradeOptions = computed(() => {
  return allSalaryScales.value
    .filter(scale => !scale.parent_id)
    .map(grade => ({
      id: grade.id,
      name: grade.name
    }));
});

const currentIncrementOptions = computed(() => {
  if (!selectedGradeId.value) return [];
  
  const grade = allSalaryScales.value.find(g => g.id === selectedGradeId.value);
  if (!grade || !grade.children?.data) return [];
  
  return grade.children.data.map(increment => ({
    id: increment.id,
    name: increment.name,
    basicSalary: increment.additional_info?.payment_details?.basic || 0,
    paymentDetails: increment.additional_info?.payment_details || {}
  }));
});

const currentPaymentDetails = computed(() => {
  if (selectedIncrementId.value) {
    const increment = currentIncrementOptions.value.find(i => i.id === selectedIncrementId.value);
    if (increment) return increment.paymentDetails;
  }
  
  if (currentEmployeeSalary.value?.salaryscale?.data?.additional_info?.payment_details) {
    return currentEmployeeSalary.value.salaryscale.data.additional_info.payment_details;
  }
  
  return {
    basic: 0,
    rent_fee: 0,
    tiffin_fee: 0,
    medical_fee: 0,
    washing_fee: 0,
    education_fee: 0
  };
});

const displayBasicSalary = computed(() => {
  return currentPaymentDetails.value.basic || 0;
});

const totalSalary = computed(() => {
  let total = parseFloat(displayBasicSalary.value) || 0;
  
  // Add all fees that are not null
  Object.keys(currentPaymentDetails.value).forEach(key => {
    if (key !== 'basic' && currentPaymentDetails.value[key] !==0) {
      // For education fee, use the edited amount if available
      if (key === 'education_fee') {
        const amount = educationFeeAmount.value !== 0 ? 
                      educationFeeAmount.value : 
                      currentPaymentDetails.value[key];
        if (currentEmployeeSalary.value?.additional_info?.education_fee) {
          total += parseFloat(amount) || 0;
        }
      } 
      // For other boolean fees
      else if (['tiffin_fee', 'washing_fee'].includes(key)) {
        if (currentEmployeeSalary.value?.additional_info?.[key]) {
          total += parseFloat(currentPaymentDetails.value[key]) || 0;
        }
      } 
      // For regular fees
      else {
        total += parseFloat(currentPaymentDetails.value[key]) || 0;
      }
    }
  });
  
  return total.toFixed(2);
});

// Methods
const fetchAllSalaryScales = async () => {
  try {
    const response = await api.get('/v1/categories/?search=type:salary_scale');
    allSalaryScales.value = response.data.data;
  } catch (err) {
    showError('Failed to load salary scales');
  }
};

const fetchCurrentSalary = async () => {
  try {
    salaryLoading.value = true;
    const response = await api.get(
      `/v1/salaries?search=employee_id:${employeeId.value}&limit=1&orderBy=start_date&sortedBy=desc&include=salaryscale`
    );
    
    if (response.data.data.length > 0) {
      currentEmployeeSalary.value = response.data.data[0];
      
      // Set education fee amount - first check if there's a custom amount in additional_info
      if (currentEmployeeSalary.value?.additional_info?.education_fee_amount !==0) {
        educationFeeAmount.value = currentEmployeeSalary.value.additional_info.education_fee;
      } else if (currentEmployeeSalary.value?.salaryscale?.data?.additional_info?.payment_details?.education_fee !==0) {
        educationFeeAmount.value = currentEmployeeSalary.value.salaryscale.data.additional_info.payment_details.education_fee;
      } else {
        educationFeeAmount.value = 0;
      }
      
      if (currentEmployeeSalary.value.salaryscale?.data) {
        const scaleData = currentEmployeeSalary.value.salaryscale.data;
        selectedGradeId.value = scaleData.parent_id;
        selectedIncrementId.value = scaleData.id;
      }
    }
    originalSalaryData.value = JSON.parse(JSON.stringify({
      selectedGradeId: selectedGradeId.value,
      selectedIncrementId: selectedIncrementId.value,
      educationFeeAmount: educationFeeAmount.value
    }));
    emit('update:employee', {
      salaryScale: displayBasicSalary.value
    });
  } catch (err) {
    showError('Failed to load current salary');
  } finally {
    salaryLoading.value = false;
  }
};

const toggleSalaryEditMode = async () => {
  if (!salaryEditMode.value) {
    originalSalaryData.value = JSON.parse(JSON.stringify({
      selectedGradeId: selectedGradeId.value,
      selectedIncrementId: selectedIncrementId.value,
      educationFeeAmount: educationFeeAmount.value
    }));
    salaryEditMode.value = true;
  } else {
    try {
      salaryLoading.value = true;
      await saveChanges();
      salaryEditMode.value = false;
      $q.notify({ type: 'positive', message: 'Salary information updated successfully' });
      emit('saved');
    } catch (error) {
      console.error('Error saving salary info:', error);
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Failed to update salary information',
      });
    } finally {
      salaryLoading.value = false;
    }
  }
};

const cancelSalaryEdit = () => {
  selectedGradeId.value = originalSalaryData.value.selectedGradeId;
  selectedIncrementId.value = originalSalaryData.value.selectedIncrementId;
  educationFeeAmount.value = originalSalaryData.value.educationFeeAmount;
  salaryEditMode.value = false;
  formSubmitted.value = false;
  emit('update:employee', {
    salaryScale: displayBasicSalary.value
  });
};

const saveChanges = async () => {
  formSubmitted.value = true;
  
  if (!isValid.value) {
    showError('Please select both grade and increment');
    return;
  }

  salaryLoading.value = true;
  
  try {
    const payload = {
      employee_id: employeeId.value,
      salaryscale_id: selectedIncrementId.value,
      additional_info: {
        ...currentEmployeeSalary.value?.additional_info,
        education_fee: Number(educationFeeAmount.value)
      }
    };
    
    await api.patch(
      `/v1/salaries/${currentEmployeeSalary.value.id}?include=salaryscale`,
      payload
    );
    
    await fetchCurrentSalary();
  } catch (err) {
    showError('Failed to update salary');
    throw err;
  } finally {
    salaryLoading.value = false;
  }
};

const onGradeChange = () => {
  selectedIncrementId.value = null;
};

const onIncrementChange = () => {
  // Reset education fee amount to the default when increment changes
  if (selectedIncrementId.value) {
    const increment = currentIncrementOptions.value.find(i => i.id === selectedIncrementId.value);
    if (increment) {
      educationFeeAmount.value = increment.paymentDetails.education_fee || 0;
    }
  }
  emit('update:employee', {
    salaryScale: displayBasicSalary.value
  });
};

const showError = (message) => {
  $q.notify({
    type: 'negative',
    message: message
  });
};

// Lifecycle hooks
onMounted(async () => {
  await Promise.all([
    fetchAllSalaryScales(),
    fetchCurrentSalary()
  ]);
});

watch(() => props.editMode, (newVal) => {
  salaryEditMode.value = newVal;
  if (!newVal && currentEmployeeSalary.value?.salaryscale?.data) {
    const scaleData = currentEmployeeSalary.value.salaryscale.data;
    selectedGradeId.value = scaleData.parent_id;
    selectedIncrementId.value = scaleData.id;
    formSubmitted.value = false;
  }
});
</script>