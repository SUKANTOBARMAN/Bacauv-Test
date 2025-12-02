<template>
    <q-expansion-item
      group="profile-sections"
      label="Annual Confidential Report"
      icon="description"
      header-class="text-h6"
    >
      <q-card>
        <q-card-section>
          <div v-if="loading" class="text-center q-pa-md">
            <q-spinner color="primary" size="3em" />
            <div class="q-mt-sm">Loading ACR information...</div>
          </div>
          <div v-else>
            <q-table
              :rows="acrs"
              :columns="columns"
              row-key="id"
              flat
              bordered
            >
              <template v-slot:top>
                <div class="text-h6">Annual Confidential Reports</div>
                <q-space />
                <q-btn
                  color="primary"
                  label="Add ACR"
                  @click="showAddDialog = true"
                />
              </template>
  
              <template v-slot:body-cell-action="props">
                <q-td :props="props">
                  <q-btn
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
  
    <AddAcrDialog
      v-model="showAddDialog"
      :employeeId="employeeId"
      @acr-added="fetchAcrs"
    />
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useQuasar } from 'quasar';
  import { api } from 'boot/axios';
  import AddAcrDialog from './dialogs/AddAcrDialog.vue';
  
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
  const acrs = ref([]);
  const loading = ref(false);
  const showAddDialog = ref(false);
  
  const columns = [
    { name: 'year', label: 'Year', align: 'left', field: 'year', sortable: true },
    { 
      name: 'status', 
      label: 'Submission Status', 
      align: 'center', 
      field: row => row.additional_info?.status === 'submitted' ? '✅ Submitted' : '❌ Not Submitted',
      sortable: true 
    },
    { name: 'action', label: 'Action', align: 'center', sortable: false }
  ];
  
  const fetchAcrs = async () => {
    try {
      loading.value = true;
      const response = await api.get(
        `/v1/confidential-reports?search=employee_id:${props.employeeId}&orderBy=year&sortedBy=desc`
      );
      acrs.value = response.data.data;
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Failed to load ACR information' });
      console.error('Error fetching ACR information:', error);
    } finally {
      loading.value = false;
    }
  };
  
  const confirmDelete = (acr) => {
    $q.dialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ACR for year ${acr.year}?`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      try {
        await api.delete(`/v1/confidential-reports/${acr.id}`);
        $q.notify({ type: 'positive', message: 'ACR deleted successfully' });
        await fetchAcrs();
      } catch (error) {
        $q.notify({ type: 'negative', message: 'Failed to delete ACR' });
        console.error('Error deleting ACR:', error);
      }
    });
  };
  
  onMounted(() => {
    fetchAcrs();
  });
  </script>