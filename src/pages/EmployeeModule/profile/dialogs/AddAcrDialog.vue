<template>
    <q-dialog v-model="showDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add New Annual Confidential Report</div>
        </q-card-section>
  
        <q-card-section>
          <q-form @submit="addAcr">
            <q-input
              v-model.number="acr.year"
              label="Year"
              type="number"
              outlined
              class="q-mb-md"
              :rules="[val => !!val || 'Field is required']"
            />
  
            <q-select
              v-model="acr.status"
              :options="['submitted', 'not submitted']"
              label="Submission Status"
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
  import { ref, computed } from 'vue';
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
  
  const emit = defineEmits(['update:modelValue', 'acr-added']);
  
  const $q = useQuasar();
  const showDialog = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  });
  
  const acr = ref({
    year: '',
    status: ''
  });
  
  const addAcr = async () => {
    try {
      const payload = {
        employee_id: props.employeeId,
        year: acr.value.year,
        additional_info: { status: acr.value.status }
      };
  
      await api.post('/v1/confidential-reports', payload);
      
      $q.notify({ type: 'positive', message: 'ACR added successfully' });
      showDialog.value = false;
      acr.value = { year: '', status: '' };
      emit('acr-added');
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Failed to add ACR' });
      console.error('Error adding ACR:', error);
    }
  };
  </script>