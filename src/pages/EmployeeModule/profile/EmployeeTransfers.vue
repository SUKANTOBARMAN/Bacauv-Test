<template>
    <q-expansion-item
      group="profile-sections"
      label="Transfer History"
      icon="business"
      header-class="text-h6"
    >
      <q-card>
        <q-card-section>
          <div v-if="loading" class="text-center q-pa-md">
            <q-spinner color="primary" size="3em" />
            <div class="q-mt-sm">Loading transfer history...</div>
          </div>
          <div v-else>
            <q-table
              :rows="transfers"
              :columns="columns"
              row-key="id"
              flat
              bordered
            >
              <template v-slot:top>
                <div class="text-h6">Transfer History</div>
                <q-space />
                <q-btn
                  v-if="isAdminOrSubadmin"
                  color="primary"
                  label="Add Transfer"
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
  
              <template v-slot:body-cell-end_date="props">
                <q-td :props="props">
                  {{ props.row.end_date ? formatDate(props.row.end_date) : 'Running' }}
                </q-td>
              </template>
            </q-table>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  
    <AddTransferDialog
      v-model="showAddDialog"
      @transfer-added="fetchTransfers"
    />
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useQuasar } from 'quasar';
  import { api } from 'boot/axios';
  import AddTransferDialog from './dialogs/AddTransferDialog.vue';
  import { useUserStore } from 'src/stores/userStore';


  const userStore = useUserStore();

  const isAdminOrSubadmin = computed(() => {
    const highestRole = userStore.user?.highestRole;
    return highestRole === 'admin' || highestRole === 'subadmin';
  });

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
  const transfers = ref([]);
  const loading = ref(false);
  const showAddDialog = ref(false);
  
  const columns = [
    { name: 'office_name', label: 'Office Name', align: 'left', field: row => row.office?.data?.name || 'N/A', sortable: true },
    { name: 'start_date', label: 'Start Date', align: 'center', field: 'start_date', format: val => formatDate(val), sortable: true },
    { name: 'end_date', label: 'End Date', align: 'center', field: 'end_date', sortable: true },
    { name: 'action', label: 'Action', align: 'center', sortable: false }
  ];
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const fetchTransfers = async () => {
    try {
      loading.value = true;
      const response = await api.get(
        `/v1/transfer-histories?search=employee_id:${props.employeeId}&orderBy=start_date&sortedBy=desc&include=office`
      );
      transfers.value = response.data.data;
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Failed to load transfer history' });
      console.error('Error fetching transfer history:', error);
    } finally {
      loading.value = false;
    }
  };
  
  const confirmDelete = (transfer) => {
    $q.dialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete transfer to ${transfer.office?.data?.name || 'this office'}?`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      try {
        await api.delete(`/v1/transfer-histories/${transfer.id}`);
        $q.notify({ type: 'positive', message: 'Transfer deleted successfully' });
        await fetchTransfers();
      } catch (error) {
        $q.notify({ type: 'negative', message: 'Failed to delete transfer' });
        console.error('Error deleting transfer:', error);
      }
    });
  };
  
  onMounted(() => {
    fetchTransfers();
  });
  </script>