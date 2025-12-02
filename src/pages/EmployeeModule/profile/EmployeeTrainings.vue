<template>
    <q-expansion-item
      group="profile-sections"
      label="Training Information"
      icon="school"
      header-class="text-h6"
    >
      <q-card>
        <q-card-section>
          <div v-if="loading" class="text-center q-pa-md">
            <q-spinner color="primary" size="3em" />
            <div class="q-mt-sm">Loading training information...</div>
          </div>
          <div v-else>
            <q-table
              :rows="trainings"
              :columns="columns"
              row-key="id"
              flat
              bordered
            >
              <template v-slot:top>
                <div class="text-h6">Training Programs</div>
                <q-space />
                <q-btn
                  v-if="isAdminOrSubadmin"
                  color="primary"
                  label="Add Training"
                  @click="showAddDialog = true"
                />
              </template>
  
              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <q-btn
                    v-if="isAdminOrSubadmin"
                    flat
                    round
                    color="negative"
                    icon="delete"
                    @click="confirmDelete(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  
    <AddTrainingDialog
      v-model="showAddDialog"
      :employeeId="employeeId"
      @training-added="fetchTrainings"
    />
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useQuasar } from 'quasar';
  import { api } from 'boot/axios';
  import AddTrainingDialog from './dialogs/AddTrainingDialog.vue';
  import { useUserStore } from 'src/stores/userStore';
  
  const userStore = useUserStore();
  const props = defineProps({
    employeeId: {
      type: String,
      required: true
    },
    editMode: {
      type: Boolean,
      default: false
    }
  });
  
  const $q = useQuasar();
  const trainings = ref([]);
  const loading = ref(false);
  const showAddDialog = ref(false);
  
  const columns = [
    { name: 'name', label: 'Training Program Name', align: 'left', field: row => row.additional_info?.name || 'N/A', sortable: true },
    { name: 'start_date', label: 'Start Date', align: 'center', field: 'start_date', format: val => formatDate(val), sortable: true },
    { name: 'end_date', label: 'End Date', align: 'center', field: 'end_date', format: val => formatDate(val), sortable: true },
    { name: 'action', label: 'Action', align: 'center', sortable: false }
  ];

  // Add computed property to check role
  const isAdminOrSubadmin = computed(() => {
    const highestRole = userStore.user?.highestRole;
    return highestRole === 'admin' || highestRole === 'subadmin';
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const fetchTrainings = async () => {
    try {
      loading.value = true;
      const response = await api.get(
        `/v1/employee-activities?search=employee_id:${props.employeeId};type:training&searchJoin=and&orderBy=start_date&sortedBy=desc`
      );
      trainings.value = response.data.data;
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Failed to load training information' });
      console.error('Error fetching training information:', error);
    } finally {
      loading.value = false;
    }
  };
  
  const confirmDelete = (training) => {
    $q.dialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete "${training.additional_info?.name || 'this training'}"?`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      try {
        await api.delete(`/v1/employee-activities/${training.id}`);
        $q.notify({ type: 'positive', message: 'Training deleted successfully' });
        await fetchTrainings();
      } catch (error) {
        $q.notify({ type: 'negative', message: 'Failed to delete training' });
        console.error('Error deleting training:', error);
      }
    });
  };
  
  onMounted(() => {
    fetchTrainings();
  });
  </script>