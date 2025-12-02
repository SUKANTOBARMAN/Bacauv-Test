<template>
  <q-dialog v-model="showDialog" persistent @update:model-value="onDialogToggle">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Add New Transfer</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="addTransfer">
          <q-select
            v-model="selectedOffice"
            :options="currentLevelOptions"
            label="Select Office"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'Field is required']"
            emit-value
            map-options
            option-value="value"
            option-label="label"
            use-chips
            options-cover
            @update:model-value="handleOfficeSelection"
            :disable="isDropdownDisabled"
            :loading="isLoading"
          >
            <!-- Customize the selected value display -->
            <template v-slot:selected>
              <span v-if="selectedOffice">
                {{ selectedOfficeName }}
              </span>
            </template>

            <!-- Dropdown option template -->
            <template v-slot:option="scope">
              <q-item
                v-bind="scope.itemProps"
                :style="{
                  'font-weight': scope.opt.type === 'head_office' ? 'bold' : 
                              (['regional_office', 'district_office'].includes(scope.opt.type) ? '600' : 'normal'),
                  'padding-left': scope.opt.type === 'thana_office' ? '30px' : 
                                (scope.opt.type === 'metrothana_office' ? '25px' : 
                                (scope.opt.type === 'training_center' ? '20px' : 
                                (scope.opt.type === 'district_office' ? '15px' : '10px')))
                }"
              >
                <q-item-section>
                  <q-item-label>{{ scope.opt.label }}</q-item-label>
                  <q-item-label caption>{{ formatOfficeType(scope.opt.type) }}</q-item-label>
                </q-item-section>
                <q-item-section side v-if="scope.opt.children && scope.opt.children.length > 0">
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Breadcrumbs to show navigation path -->
          <div class="q-mb-md" v-if="navigationPath.length > 0">
            <q-breadcrumbs>
              <q-breadcrumbs-el
                v-for="(path, index) in navigationPath"
                :key="index"
                :label="path.label"
                @click="navigateToLevel(index)"
                class="cursor-pointer"
              />
            </q-breadcrumbs>
          </div>

          <!-- Selected Office Chip -->
          <q-chip v-if="transfer.office_id" removable @remove="resetSelection">
            Selected: {{ navigationPath[navigationPath.length - 1]?.label }}
          </q-chip>

          <q-input
            v-model="transfer.start_date"
            label="Start Date"
            type="date"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'Field is required']"
          />

          <q-input
            v-model="transfer.end_date"
            label="End Date (leave empty if current)"
            type="date"
            outlined
            class="q-mb-md"
          />

          <div class="row justify-end q-gutter-sm">
            <q-btn label="Cancel" color="negative" v-close-popup />
            <q-btn label="Save" type="submit" color="positive" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';
import { fasCloudUploadAlt } from '@quasar/extras/fontawesome-v5';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'transfer-added']);

const $q = useQuasar();
const route = useRoute();
const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const transfer = ref({
  office_id: '',
  start_date: '',
  end_date: null
});
const selectedOffice = ref(null);
const navigationPath = ref([]);
const currentLevel = ref([]);
const officeOptions = ref([]);
const officeHierarchy = ref([]);
const isLoading = ref(false);


// Extract employee_id from URL (e.g., /employees/{id})
const employeeId = computed(() => {
  const employeeId = route.params.id;
  if (!employeeId) {
    $q.notify({ type: 'negative', message: 'Employee ID not found in URL' });
    return null;
  }
  return employeeId;
});

// Fetch office hierarchy from API
const fetchOfficeHierarchy = async () => {
  isLoading.value = true;
  try {
    const response = await api.get(`/v1/categories?search=type:head_office&include=children`);
    const offices = response.data.data;

    // Transform API data into officeOptions format
    const transformedOffices = offices.map(office => ({
      label: office.name,
      value: office.id,
      type: office.type,
      children: office.children.data.map(child => ({
        label: child.name,
        value: child.id,
        type: child.type,
        children: child.children.data.map(grandchild => ({
          label: grandchild.name,
          value: grandchild.id,
          type: grandchild.type,
          children: grandchild.children.data
        }))
      }))
    }));

    officeOptions.value = transformedOffices;
    officeHierarchy.value = transformedOffices;
    currentLevel.value = transformedOffices;

  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to load office hierarchy' });
    console.error('Error fetching office hierarchy:', error);
  } finally {
    isLoading.value = false;
  }
};

// Load office hierarchy when component is mounted
fetchOfficeHierarchy();

// Compute the selected office name for display
const selectedOfficeName = computed(() => {
  if (!selectedOffice.value) return '';
  const findOffice = (offices, value) => {
    for (const opt of offices) {
      if (opt.value === value) return opt;
      if (opt.children && opt.children.length > 0) {
        const found = findOffice(opt.children, value);
        if (found) return found;
      }
    }
    return null;
  };
  const office = findOffice(officeOptions.value, selectedOffice.value);
  return office ? office.label : '';
});

// Compute current level options for the dropdown
const currentLevelOptions = computed(() => {
  return currentLevel.value.length === 0 ? officeOptions.value : currentLevel.value;
});

// Compute whether the dropdown should be disabled
const isDropdownDisabled = computed(() => {
  return !!transfer.value.office_id && currentLevel.value.length === 0;
});

// Format office type for display
const formatOfficeType = (type) => {
  const types = {
    'head_office': 'Head Office',
    'training_center': 'Training Center',
    'district_office': 'District Office',
    'metro_thana': 'Metro Thana',
    'metrothana_office': 'Metro Thana',
    'thana_office': 'Thana Office',
    'regional_office': 'Regional Office'
  };
  return types[type] || type;
};

// Handle office selection
const handleOfficeSelection = (office) => {
  if (!office) return;

  const findOffice = (offices, value) => {
    for (const opt of offices) {
      if (opt.value === value) return opt;
      if (opt.children && opt.children.length > 0) {
        const found = findOffice(opt.children, value);
        if (found) return found;
      }
    }
    return null;
  };

  const selected = findOffice(officeOptions.value, office);
  if (selected) {
    const path = [];
    let current = selected;
    while (current) {
      path.unshift({ label: current.label, value: current.value, type: current.type });
      current = findParent(officeOptions.value, current.value);
    }
    navigationPath.value = path;

    transfer.value.office_id = selected.value;
    currentLevel.value = selected.children && selected.children.length > 0 ? [...selected.children] : [];
  }
};

// Find parent office in hierarchy
const findParent = (offices, childValue) => {
  for (const office of offices) {
    if (office.children && office.children.some(child => child.value === childValue)) {
      return office;
    }
    if (office.children && office.children.length > 0) {
      const found = findParent(office.children, childValue);
      if (found) return found;
    }
  }
  return null;
};

// Navigate to a higher level using breadcrumbs
const navigateToLevel = (index) => {
  const target = navigationPath.value[index];
  navigationPath.value = navigationPath.value.slice(0, index + 1);

  let current = officeOptions.value;
  for (const path of navigationPath.value) {
    const found = current.find(opt => opt.value === path.value);
    if (found) {
      current = found.children || [];
    }
  }

  currentLevel.value = current;
  selectedOffice.value = target.value;
  transfer.value.office_id = target.value;
};

// Reset selection
const resetSelection = () => {
  transfer.value.office_id = '';
  navigationPath.value = [];
  currentLevel.value = [];
  selectedOffice.value = null;
};

// Reset state when dialog opens
const onDialogToggle = (value) => {
  if (value) {
    resetSelection();
    transfer.value.start_date = '';
    transfer.value.end_date = null;
  }
  emit('update:modelValue', value);
};

// Submit the transfer
const addTransfer = async () => {
  if (!employeeId.value) {
    $q.notify({ type: 'negative', message: 'Employee ID is required' });
    return;
  }

  if (!transfer.value.office_id) {
    $q.notify({ type: 'negative', message: 'Please select an office' });
    return;
  }
  const current_transfer=await api.get(`/v1/transfer-histories?search=employee_id:${employeeId.value}&orderBy=start_date&sortedBy=desc&include=office&limit=1`);
  await api.delete(`/v1/transfer-histories/${current_transfer.data.data[0].id}`);
  const postPayload={
    employee_id: employeeId.value,
    office_id: current_transfer.data.data[0].office_id,
    start_date: current_transfer.data.data[0].start_date,
    end_date: transfer.value.start_date,
    additional_info: null
  }
  const previous_transfer_update=await api.post(`/v1/transfer-histories`,postPayload);

  const payload = {
    employee_id: employeeId.value,
    office_id: transfer.value.office_id,
    start_date: transfer.value.start_date,
    end_date: transfer.value.end_date,
    additional_info: null
  };

  try {
    await api.post(`/v1/transfer-histories`, payload);
    $q.notify({ type: 'positive', message: 'Transfer added successfully' });
    showDialog.value = false;
    transfer.value = { office_id: '', start_date: '', end_date: null };
    navigationPath.value = [];
    currentLevel.value = [];
    selectedOffice.value = null;
    emit('transfer-added');
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to add transfer' });
    console.error('Error adding transfer:', error);
  }
};
</script>