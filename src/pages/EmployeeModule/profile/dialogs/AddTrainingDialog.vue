<template>
  <q-dialog v-model="showDialog">
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">Add New Training</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="addTraining">
          <q-select
            v-model="training.selectedProgram"
            :options="trainingProgramOptions"
            label="Training Program"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'Field is required']"
            emit-value
            map-options
          />

          <q-input
            v-model="training.start_date"
            label="Start Date"
            type="date"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'Field is required']"
          />

          <q-input
            v-model="training.end_date"
            label="End Date"
            type="date"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'Field is required']"
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
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  employeeId: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'training-added']);

const $q = useQuasar();
const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const training = ref({
  selectedProgram: null,
  start_date: '',
  end_date: ''
});

const trainingProgramOptions = ref([]);

const fetchTrainingPrograms = async () => {
  try {
    const response = await api.get('/v1/categories?search=type:training_type');
    trainingProgramOptions.value = response.data.data.map(item => ({
      label: item.name,
      value: item.id  // Store the ID as the value
    }));
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to load training programs' });
    console.error('Error fetching training programs:', error);
  }
};

const addTraining = async () => {
  try {
    const payload = {
      employee_id: props.employeeId,
      category_id: training.value.selectedProgram,  // Directly use the selected ID
      type: "training",
      title:"traninig",
      start_date: training.value.start_date,
      end_date: training.value.end_date,
      additional_info: { 
        name: trainingProgramOptions.value.find(
          p => p.value === training.value.selectedProgram
        )?.label || 'Training' 
      }
    };
    await api.post('/v1/employee-activities', payload);
    
    $q.notify({ type: 'positive', message: 'Training added successfully' });
    showDialog.value = false;
    training.value = { selectedProgram: null, start_date: '', end_date: '' };
    emit('training-added');
  } catch (error) {
    $q.notify({ 
      type: 'negative', 
      message: error.response?.data?.message || 'Failed to add training' 
    });
    console.error('Error adding training:', error);
  }
};

onMounted(() => {
  fetchTrainingPrograms();
});
</script>