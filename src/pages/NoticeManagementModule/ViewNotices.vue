<template>
  <q-page class="q-py-lg q-px-md bg-grey-1">
    <div class="row justify-center">
      <div class="col-xl-10 col-lg-11 col-md-12 col-sm-12 col-xs-12">
      
        <!-- Header Section -->
        <div class="row items-center justify-between q-mb-md">
          <div class="col-md-6 col-sm-12">
            <div class="text-h5 text-teal-10">
              <q-icon name="notifications" class="q-mr-sm" />
              My Notices
            </div>
            <div class="text-caption text-grey-7 q-mt-xs">
              Latest notices and announcements for you
            </div>
          </div>
          <div class="col-md-6 col-sm-12 text-right q-mt-sm-xs">
            <q-btn 
              outline 
              color="teal" 
              icon="refresh" 
              label="Refresh" 
              @click="refreshNotices"
              :loading="loading"
              class="q-mr-sm"
            />
            <q-btn-dropdown
              color="teal"
              label="Sort"
              icon="sort"
              flat
            >
              <q-list>
                <q-item clickable v-close-popup @click="sortBy('newest')">
                  <q-item-section avatar>
                    <q-icon name="trending_down" />
                  </q-item-section>
                  <q-item-section>Newest First</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="sortBy('oldest')">
                  <q-item-section avatar>
                    <q-icon name="trending_up" />
                  </q-item-section>
                  <q-item-section>Oldest First</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        
        <!-- No Notices Message -->
        <div v-if="!loading && notices.length === 0" class="column items-center justify-center q-py-xl">
          <q-icon name="notifications_off" size="4rem" color="grey-5" />
          <div class="text-h6 text-grey-7 q-mt-md">No notices available</div>
          <div class="text-body2 text-grey-6 q-mt-sm">Check back later for new announcements</div>
        </div>
        
        <!-- Loading Indicator -->
        <div v-if="loading" class="column items-center justify-center q-py-xl">
          <q-spinner-dots color="teal" size="3rem" />
          <div class="text-subtitle1 text-grey-7 q-mt-md">Loading notices...</div>
        </div>
        
        <!-- Notices Grid -->
        <div v-if="!loading && notices.length > 0" class="row q-col-gutter-md">
          <div 
            v-for="notice in paginatedNotices" 
            :key="notice.id" 
            class="col-md-4 col-sm-6 col-xs-12"
          >
            <q-card class="notice-card" bordered flat>
              <q-card-section class="bg-teal-1">
                <div class="text-subtitle1 text-teal-9 text-weight-medium ellipsis-2-lines">
                  {{ notice.title }}
                </div>
              </q-card-section>
              
              <q-separator />
              
              <q-card-section class="q-pb-none">
                <div class="text-body2 ellipsis-3-lines notice-message">
                  {{ notice.message }}
                </div>
              </q-card-section>
              
              <q-card-section class="q-pt-xs">
                <div class="row items-center justify-between">
                  <q-chip
                    dense
                    size="sm"
                    color="teal"
                    text-color="white"
                    icon="event"
                  >
                    {{ formatDate(notice.additional_info?.date || notice.created_at) }}
                  </q-chip>
                  <q-badge color="teal-8" outline>
                    {{ getTimeAgo(notice.created_at) }}
                  </q-badge>
                </div>
              </q-card-section>
              
              <q-separator />
              
              <q-card-actions>
                <q-btn 
                  flat 
                  color="teal" 
                  label="View Details" 
                  @click="viewNoticeDetails(notice)"
                />
                <q-space />
                <q-btn 
                  flat 
                  round 
                  color="grey" 
                  icon="content_copy" 
                  @click="copyToClipboard(notice.message)"
                >
                  <q-tooltip>Copy text</q-tooltip>
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="!loading && notices.length > itemsPerPage" class="row justify-center q-mt-lg">
          <q-pagination
            v-model="currentPage"
            :max="totalPages"
            :max-pages="6"
            boundary-numbers
            direction-links
            color="teal"
            active-color="teal"
            unelevated
            flat
            :input="notices.length > 18"
          />
        </div>
        
      </div>
    </div>
    
    <!-- Notice Detail Dialog -->
    <q-dialog v-model="noticeDetailDialog" transition-show="scale" transition-hide="scale">
      <q-card class="notice-detail-card">
        <q-card-section class="bg-teal-1 row items-center">
          <div class="text-h6 text-teal-9">{{ selectedNotice.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        
        <q-separator />
        
        <q-card-section class="q-pb-none">
          <div class="row items-center q-mb-sm">
            <q-icon name="event" size="xs" color="teal" class="q-mr-xs" />
            <div class="text-caption text-teal-8">
              {{ formatDate(selectedNotice.additional_info?.date || selectedNotice.created_at) }}
            </div>
            <q-space />
            <div class="text-caption text-grey-7">
              {{ getTimeAgo(selectedNotice.created_at) }}
            </div>
          </div>
        </q-card-section>
        
        <q-card-section class="notice-detail-content">
          <div class="text-body1">
            {{ selectedNotice.message }}
          </div>
        </q-card-section>
        
        <q-separator />
        
        <q-card-actions align="right">
          <q-btn 
            flat 
            color="grey" 
            icon="content_copy" 
            label="Copy" 
            @click="copyToClipboard(selectedNotice.message)"
          />
          <q-btn flat color="teal" icon="close" label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useQuasar, date } from 'quasar';
import { api } from 'boot/axios';
import { useEmployeeStore } from 'src/stores/employeeStore';

// Initialize Quasar framework for notifications
const $q = useQuasar();
const employeeStore=useEmployeeStore();
// State variables
const loading = ref(false);
const notices = ref([]);
const currentPage = ref(1);
const itemsPerPage = 9; // 9 cards per page
const sortOrder = ref('desc'); // Default sort order (newest first)
const sample_designation_id = employeeStore.designtionId; // Sample designation ID

// Notice detail dialog
const noticeDetailDialog = ref(false);
const selectedNotice = ref({});

// Computed properties
const totalPages = computed(() => Math.ceil(notices.value.length / itemsPerPage));

const paginatedNotices = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return notices.value.slice(startIndex, endIndex);
});

// Format date helper function
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  
  // Handle different date formats
  if (dateStr.includes('/')) {
    // Format like "2025/05/15"
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return date.formatDate(`${parts[0]}-${parts[1]}-${parts[2]}`, 'MMM D, YYYY');
    }
  }
  
  // Default handling for ISO dates
  return date.formatDate(dateStr, 'MMM D, YYYY');
};

// Get time ago helper function
const getTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  
  // Return the readable_created_at field or calculate it
  const now = new Date();
  const created = new Date(dateStr);
  const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 30) return `${diffInDays} days ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths === 1) return '1 month ago';
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  
  const diffInYears = Math.floor(diffInMonths / 12);
  if (diffInYears === 1) return '1 year ago';
  return `${diffInYears} years ago`;
};

// When component is mounted, fetch notices
onMounted(() => {
  fetchNotices();
});

// Fetch notices from API
const fetchNotices = async () => {
  try {
    loading.value = true;
    
    const response = await api.get('/v1/notices', {
      params: {
        page: 1,
        search: `status:published;noticeables.noticeable_type:category;noticeables.noticeable_id:${sample_designation_id}`,
        orderBy: 'id',
        sortedBy: sortOrder.value,
        searchJoin: 'and'
      }
    });
    
    if (response.data && Array.isArray(response.data.data)) {
      notices.value = response.data.data;
    } else {
      console.warn('Invalid API response structure:', response.data);
      notices.value = [];
    }
  } catch (error) {
    console.error('Error fetching notices:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load notices. Please try again.',
      position: 'top',
      timeout: 3000
    });
    notices.value = [];
  } finally {
    loading.value = false;
  }
};

// Sort notices
const sortBy = (order) => {
  if (order === 'newest') {
    sortOrder.value = 'desc';
  } else {
    sortOrder.value = 'asc';
  }
  fetchNotices();
};

// Refresh notices
const refreshNotices = () => {
  currentPage.value = 1;
  fetchNotices();
};

// View notice details
const viewNoticeDetails = (notice) => {
  selectedNotice.value = notice;
  noticeDetailDialog.value = true;
};

// Copy text to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    $q.notify({
      type: 'positive',
      message: 'Text copied to clipboard',
      position: 'top',
      timeout: 2000
    });
  }, (err) => {
    console.error('Could not copy text: ', err);
    $q.notify({
      type: 'negative',
      message: 'Failed to copy text',
      position: 'top',
      timeout: 2000
    });
  });
};
</script>

<style lang="scss" scoped>
.notice-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
}

.notice-detail-card {
  width: 700px;
  max-width: 90vw;
  border-radius: 8px;
}

.notice-detail-content {
  max-height: 60vh;
  overflow-y: auto;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ellipsis-3-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notice-message {
  min-height: 72px; // Keeps cards somewhat uniform in height
}
</style>