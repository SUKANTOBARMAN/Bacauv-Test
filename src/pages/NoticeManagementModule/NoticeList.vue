<template>
  <q-page class="q-py-lg q-px-md bg-grey-1">
    <div class="row justify-center">
      <div class="col-xl-10 col-lg-11 col-md-12 col-sm-12 col-xs-12">
        <q-card class="notice-list-card" flat bordered>
          <!-- Header Section -->
          <q-card-section class="bg-teal-1 q-pb-sm">
            <div class="row items-center justify-between">
              <div class="col-auto">
                <div class="text-h5 text-teal-10 text-weight-medium">
                  <q-icon name="list_alt" class="q-mr-sm" size="sm" />
                  নোটিশ বোর্ড
                </div>
                <div class="text-caption text-grey-7 q-mt-xs">
                  নোটিশ পরিচালনা ও প্রকাশ করুন
                </div>
              </div>
              <div class="col-auto">
                <q-btn
                  color="teal"
                  icon="add_circle"
                  class="q-px-sm q-py-xs"
                  unelevated
                  @click="router.push('/notices/add')"
                  label="নতুন নোটিশ তৈরি করুন"
                >
                  <q-tooltip>নতুন নোটিশ তৈরি করুন</q-tooltip>
                </q-btn>
              </div>
            </div>
            <q-separator color="teal-3" class="q-mt-sm" />
          </q-card-section>

          <!-- Tabs Section -->
          <q-card-section class="q-pa-none">
            <q-tabs
              v-model="activeTab"
              class="text-teal"
              active-color="teal"
              indicator-color="teal"
              align="center"
              narrow-indicator
              dense
              outside-arrows
              mobile-arrows
            >
              <q-tab name="draft" icon="drafts" label="ড্রাফট নোটিশ" />
              <q-tab name="published" icon="publish" label="প্রকাশিত নোটিশ" />
            </q-tabs>
            
            <q-separator />
            
            <q-tab-panels v-model="activeTab" animated>
              <!-- Draft Notices Panel -->
              <q-tab-panel name="draft" class="q-pa-sm">
                <div class="text-subtitle2 q-mb-sm text-teal-8">
                  <q-icon name="drafts" size="xs" class="q-mr-xs" />
                  ড্রাফট নোটিশ
                  <span class="text-caption q-ml-sm text-grey-7">
                    ({{ draftNotices.length }}টি নোটিশ)
                  </span>
                </div>
                
                <q-table
                  flat
                  :rows="draftNotices"
                  :columns="noticeColumns"
                  row-key="id"
                  :pagination-label="paginationLabel"
                  :rows-per-page-options="[5, 10, 15, 0]"
                  class="notice-table"
                  bordered
                  separator="cell"
                  v-model:pagination="draftPagination"
                  no-data-label="কোনো ড্রাফট নোটিশ পাওয়া যায়নি"
                  :loading="loadingDraft"
                >
                  <!-- Title column customization -->
                  <template v-slot:body-cell-title="props">
                    <q-td :props="props">
                      <div class="text-weight-medium text-teal-9">
                        {{ props.row.title }}
                      </div>
                    </q-td>
                  </template>
                  
                  <!-- Date column customization -->
                  <template v-slot:body-cell-date="props">
                    <q-td :props="props">
                      <q-chip
                        dense
                        size="sm"
                        outline
                        color="teal"
                        text-color="teal"
                        icon="event"
                      >
                        {{ formatDate(props.row.additional_info?.date || props.row.created_at) }}
                      </q-chip>
                    </q-td>
                  </template>
                  
                  <!-- Actions column customization -->
                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props" class="text-center">
                      <div class="row justify-center q-gutter-xs">
                        <q-btn
                          flat
                          round
                          size="sm"
                          color="green"
                          icon="publish"
                          @click="publishNotice(props.row)"
                          :loading="publishingNotice === props.row.id"
                        >
                          <q-tooltip>নোটিশ প্রকাশ করুন</q-tooltip>
                        </q-btn>
                        
                        <q-btn
                          flat
                          round
                          size="sm"
                          color="primary"
                          icon="edit"
                          @click="editNotice(props.row)"
                        >
                          <q-tooltip>নোটিশ সম্পাদনা করুন</q-tooltip>
                        </q-btn>
                        
                        <q-btn
                          flat
                          round
                          size="sm"
                          color="negative"
                          icon="delete"
                          @click="confirmDelete(props.row)"
                          :loading="deletingNotice === props.row.id"
                        >
                          <q-tooltip>নোটিশ মুছুন</q-tooltip>
                        </q-btn>
                      </div>
                    </q-td>
                  </template>
                  
                  <!-- Loading slot -->
                  <template v-slot:loading>
                    <q-inner-loading showing color="teal">
                      <q-spinner-dots size="50px" color="teal" />
                    </q-inner-loading>
                  </template>
                  
                  <!-- No data display -->
                  <template v-slot:no-data>
                    <div class="full-width row flex-center q-pa-lg text-grey-6">
                      <q-icon name="inbox" size="2em" class="q-mr-sm" />
                      <span>কোনো ড্রাফট নোটিশ পাওয়া যায়নি</span>
                    </div>
                  </template>
                </q-table>
              </q-tab-panel>

              <!-- Published Notices Panel -->
              <q-tab-panel name="published" class="q-pa-sm">
                <div class="text-subtitle2 q-mb-sm text-teal-8">
                  <q-icon name="publish" size="xs" class="q-mr-xs" />
                  প্রকাশিত নোটিশ
                  <span class="text-caption q-ml-sm text-grey-7">
                    ({{ publishedNotices.length }}টি নোটিশ)
                  </span>
                </div>
                
                <q-table
                  flat
                  :rows="publishedNotices"
                  :columns="noticeColumns"
                  row-key="id"
                  :pagination-label="paginationLabel"
                  :rows-per-page-options="[5, 10, 15, 0]"
                  class="notice-table"
                  bordered
                  separator="cell"
                  v-model:pagination="publishedPagination"
                  no-data-label="কোনো প্রকাশিত নোটিশ পাওয়া যায়নি"
                  :loading="loadingPublished"
                >
                  <!-- Title column customization -->
                  <template v-slot:body-cell-title="props">
                    <q-td :props="props">
                      <div class="text-weight-medium text-teal-9">
                        {{ props.row.title }}
                      </div>
                    </q-td>
                  </template>
                  
                  <!-- Date column customization -->
                  <template v-slot:body-cell-date="props">
                    <q-td :props="props">
                      <q-chip
                        dense
                        size="sm"
                        color="teal"
                        text-color="white"
                        icon="event"
                      >
                        {{ formatDate(props.row.additional_info?.date || props.row.created_at) }}
                      </q-chip>
                    </q-td>
                  </template>
                  
                  <!-- Actions column customization -->
                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props" class="text-center">
                      <div class="row justify-center q-gutter-xs">
                        <!-- Edit button commented out as before -->
                        
                        <q-btn
                          flat
                          round
                          size="sm"
                          color="negative"
                          icon="delete"
                          @click="confirmDelete(props.row)"
                          :loading="deletingNotice === props.row.id"
                        >
                          <q-tooltip>নোটিশ মুছুন</q-tooltip>
                        </q-btn>
                      </div>
                    </q-td>
                  </template>
                  
                  <!-- Loading slot -->
                  <template v-slot:loading>
                    <q-inner-loading showing color="teal">
                      <q-spinner-dots size="50px" color="teal" />
                    </q-inner-loading>
                  </template>
                  
                  <!-- No data display -->
                  <template v-slot:no-data>
                    <div class="full-width row flex-center q-pa-lg text-grey-6">
                      <q-icon name="inbox" size="2em" class="q-mr-sm" />
                      <span>কোনো প্রকাশিত নোটিশ পাওয়া যায়নি</span>
                    </div>
                  </template>
                </q-table>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>
    </div>
    
    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="confirmationDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="negative" text-color="white" />
          <span class="q-ml-sm">আপনি কি নিশ্চিত যে এই নোটিশটি মুছে ফেলতে চান?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="বাতিল করুন" color="primary" v-close-popup />
          <q-btn flat label="মুছুন" color="negative" @click="performDelete" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>


<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { date, useQuasar } from 'quasar';
import { api } from 'boot/axios';

// Initialize router and Quasar
const router = useRouter();
const $q = useQuasar();

// Tabs and data
const activeTab = ref("draft");
const draftNotices = ref([]);
const publishedNotices = ref([]);

// Loading states
const loadingDraft = ref(false);
const loadingPublished = ref(false);
const publishingNotice = ref(null);
const deletingNotice = ref(null);

// Table columns configuration
const noticeColumns = ref([
  { 
    name: "title", 
    label: "নোটিশ শিরোনাম",  // বাংলা লেবেল
    field: "title", 
    sortable: true,
    align: "left" 
  },
  { 
    name: "date", 
    label: "তারিখ",  // বাংলা লেবেল
    field: row => row.additional_info?.date || row.created_at,
    sortable: true,
    align: "center" 
  },
  { 
    name: "actions", 
    label: "কার্যক্রম",  // বাংলা লেবেল
    align: "center",
    sortable: false 
  }
]);


// Pagination settings
const draftPagination = ref({
  sortBy: 'created_at',
  descending: true,
  page: 1,
  rowsPerPage: 10
});

const publishedPagination = ref({
  sortBy: 'created_at',
  descending: true,
  page: 1,
  rowsPerPage: 10
});

// Format date helper function
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  
  // Handle different date formats
  if (dateStr.includes('/')) {
    // Format like "2025/05/14"
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return date.formatDate(`${parts[0]}-${parts[1]}-${parts[2]}`, 'MMM D, YYYY');
    }
  }
  
  // Default handling for ISO dates
  return date.formatDate(dateStr, 'MMM D, YYYY');
};

// Custom pagination label
const paginationLabel = (firstRowIndex, endRowIndex, totalRowsNumber) => {
  return `${firstRowIndex} to ${endRowIndex} of ${totalRowsNumber}`;
};

// Delete confirmation dialog
const confirmationDialog = ref(false);
const noticeToDelete = ref(null);

// Fetch notices when component is mounted
onMounted(() => {
  fetchDraftNotices();
  if (activeTab.value === 'published') {
    fetchPublishedNotices();
  }
});

// Watch for tab changes to load data
watch(activeTab, (newTab) => {
  if (newTab === 'published' && publishedNotices.value.length === 0) {
    fetchPublishedNotices();
  }
});

// Fetch draft notices from API
const fetchDraftNotices = async () => {
  try {
    loadingDraft.value = true;
    const response = await api.get('/v1/notices', {
      params: {
        search: 'status:draft;noticeables.noticeable_type:category',
        orderBy: 'created_at',
        sortedBy: 'desc',
        searchJoin: 'and',
        include: 'noticeable'
      }
    });
    
    draftNotices.value = response.data?.data || [];
  } catch (error) {
    console.error('Error fetching draft notices:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load draft notices',
      position: 'top',
      timeout: 3000
    });
  } finally {
    loadingDraft.value = false;
  }
};

// Fetch published notices from API
const fetchPublishedNotices = async () => {
  try {
    loadingPublished.value = true;
    const response = await api.get('/v1/notices', {
      params: {
        search: 'status:published;noticeables.noticeable_type:category',
        orderBy: 'created_at',
        sortedBy: 'desc',
        searchJoin: 'and',
        include: 'noticeable'
      }
    });
    
    publishedNotices.value = response.data?.data || [];
  } catch (error) {
    console.error('Error fetching published notices:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load published notices',
      position: 'top',
      timeout: 3000
    });
  } finally {
    loadingPublished.value = false;
  }
};

// Publish notice action
const publishNotice = async (notice) => {
  try {
    publishingNotice.value = notice.id;
    
    const response = await api.patch(`/v1/notices/${notice.id}`, {
      status: 'published'
    });
    
    // Remove from draft and add to published
    draftNotices.value = draftNotices.value.filter(n => n.id !== notice.id);
    
    // Only add to published if we're on that tab or have already loaded published notices
    if (publishedNotices.value.length > 0) {
      publishedNotices.value = [response.data.data, ...publishedNotices.value];
    }
    
    $q.notify({
      type: 'positive',
      message: 'Notice published successfully',
      position: 'top',
      timeout: 2000
    });
  } catch (error) {
    console.error('Error publishing notice:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to publish notice',
      position: 'top',
      timeout: 3000
    });
  } finally {
    publishingNotice.value = null;
  }
};

// Edit notice action
const editNotice = (notice) => {
  router.push(`/edit-notice/${notice.id}`);
};

// Confirm delete dialog
const confirmDelete = (notice) => {
  noticeToDelete.value = notice;
  confirmationDialog.value = true;
};

// Execute delete after confirmation
const performDelete = async () => {
  if (!noticeToDelete.value) return;
  
  try {
    deletingNotice.value = noticeToDelete.value.id;
    
    await api.delete(`/v1/notices/${noticeToDelete.value.id}`);
    
    // Remove from the appropriate list
    if (noticeToDelete.value.status === 'draft') {
      draftNotices.value = draftNotices.value.filter(n => n.id !== noticeToDelete.value.id);
    } else {
      publishedNotices.value = publishedNotices.value.filter(n => n.id !== noticeToDelete.value.id);
    }
    
    $q.notify({
      type: 'positive',
      message: 'Notice deleted successfully',
      position: 'top',
      timeout: 2000
    });
  } catch (error) {
    console.error('Error deleting notice:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to delete notice',
      position: 'top',
      timeout: 3000
    });
  } finally {
    deletingNotice.value = null;
    noticeToDelete.value = null;
  }
};
</script>

<style lang="scss" scoped>
.notice-list-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.notice-table {
  ::v-deep thead tr th {
    background-color: rgba(0, 150, 136, 0.08);
    color: #00695c;
    font-weight: 500;
  }
  
  ::v-deep tbody tr:hover {
    background-color: rgba(0, 150, 136, 0.05);
  }
  
  ::v-deep .q-table__bottom {
    background-color: #f5f5f5;
  }
}
</style>