<template>
  <q-page class="q-py-lg q-px-md bg-grey-1">
    <div class="row justify-center">
      <div class="col-xl-6 col-lg-8 col-md-10 col-sm-12 col-xs-12">
        <q-card 
          class="notice-card q-mb-lg" 
          bordered
          flat
        >
          <q-card-section class="bg-teal-1 q-pb-sm">
            <div class="row items-center justify-between">
              <div class="col">
                <div class="text-h5 text-teal-10 text-weight-medium">
                  <q-icon name="edit_note" class="q-mr-sm" size="sm" />
                  Edit Notice
                </div>
              </div>
              <div class="col-auto">
                <q-btn 
                  flat 
                  round 
                  color="teal" 
                  icon="arrow_back"
                  @click="router.push('/notices')"
                >
                  <q-tooltip>Back to Notice List</q-tooltip>
                </q-btn>
              </div>
            </div>
            <q-separator color="teal-3" class="q-mt-sm" />
          </q-card-section>

          <q-card-section class="q-px-md q-pb-none">
            <div class="text-caption text-grey-8 text-center">
              Update the notice information below
            </div>
          </q-card-section>

          <q-form @submit.prevent="updateNotice" class="q-gutter-md q-pa-md">
            <!-- Notice Title -->
            <q-input
              outlined
              v-model="notice.title"
              label="Notice Title"
              class="notice-input"
              bg-color="white"
              lazy-rules
              :rules="[(val) => !!val || 'Title is required']"
              :loading="isLoading"
            >
              <template v-slot:prepend>
                <q-icon name="title" color="teal" />
              </template>
            </q-input>

            <!-- Notice Details -->
            <q-input
              outlined
              v-model="notice.message"
              label="Notice Details"
              type="textarea"
              rows="4"
              class="notice-input"
              bg-color="white"
              lazy-rules
              :rules="[(val) => !!val || 'Details are required']"
              :loading="isLoading"
            >
              <template v-slot:prepend>
                <q-icon name="description" color="teal" />
              </template>
            </q-input>

            <!-- Date Selection -->
            <q-input
              outlined
              v-model="notice.additional_info.date"
              label="Notice Date"
              mask="date"
              class="notice-input"
              bg-color="white"
              lazy-rules
              :rules="['date']"
              :loading="isLoading"
            >
              <template v-slot:prepend>
                <q-icon name="event" color="teal" />
              </template>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date 
                      v-model="notice.additional_info.date" 
                      today-btn
                      color="teal"
                      minimal
                    >
                      <div class="row items-center justify-end q-pa-sm">
                        <q-btn v-close-popup label="Select" color="teal" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <!-- Notice Status Badge -->
            <div class="q-mt-md q-mb-md text-center">
              <q-badge 
                :color="notice.status === 'published' ? 'green' : 'orange'" 
                :label="notice.status === 'published' ? 'Published' : 'Draft'"
                class="q-pa-xs text-capitalize"
              >
                <q-icon 
                  :name="notice.status === 'published' ? 'publish' : 'drafts'" 
                  class="q-mr-xs" 
                  size="xs" 
                />
                {{ notice.status }}
              </q-badge>
              <div class="text-caption text-grey-7 q-mt-xs">
                <q-icon name="info" size="xs" class="q-mr-xs" />
                Last updated: {{ formatDateTime(notice.updated_at) }}
              </div>
            </div>

            <div class="row justify-center q-mt-lg q-gutter-md">
              <q-btn 
                label="Save Changes" 
                type="submit" 
                color="teal" 
                :loading="isSubmitting"
                class="q-px-xl q-py-sm"
                unelevated
                icon="save"
              >
                <q-tooltip>Update this notice</q-tooltip>
              </q-btn>
              <q-btn 
                label="Cancel" 
                color="grey-7" 
                flat
                @click="router.push('/notices')"
                icon="close"
              >
                <q-tooltip>Cancel editing</q-tooltip>
              </q-btn>
            </div>
          </q-form>
        </q-card>
      </div>
    </div>
    
    <!-- Loading overlay -->
    <q-inner-loading :showing="isLoading">
      <q-spinner-dots size="50px" color="teal" />
    </q-inner-loading>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { date, useQuasar } from 'quasar';
import { api } from 'boot/axios';

// Initialize router, route, and Quasar
const router = useRouter();
const route = useRoute();
const $q = useQuasar();

// Get the notice ID from route params
const noticeId = route.params.id;

// State variables
const isLoading = ref(true);
const isSubmitting = ref(false);

// Initialize notice with empty structure
const notice = reactive({
  title: '',
  message: '',
  status: 'draft',
  additional_info: {
    date: date.formatDate(new Date(), 'YYYY/MM/DD')
  },
  updated_at: null
});

// Format date helper function
const formatDateTime = (dateStr) => {
  if (!dateStr) return 'Unknown';
  return date.formatDate(dateStr, 'MMM D, YYYY [at] h:mm A');
};

// Fetch notice details when component mounts
onMounted(async () => {
  await fetchNoticeDetails();
});

// Fetch notice details from API
const fetchNoticeDetails = async () => {
  try {
    isLoading.value = true;
    
    const response = await api.get(`/v1/notices/${noticeId}`);
    const noticeData = response.data?.data;
    
    if (noticeData) {
      // Populate form fields
      notice.title = noticeData.title || '';
      notice.message = noticeData.message || '';
      notice.status = noticeData.status || 'draft';
      notice.updated_at = noticeData.updated_at;
      
      // Handle additional_info and date
      if (noticeData.additional_info?.date) {
        notice.additional_info = {
          date: noticeData.additional_info.date
        };
      } else {
        notice.additional_info = {
          date: date.formatDate(new Date(), 'YYYY/MM/DD')
        };
      }
    } else {
      throw new Error('No notice data found');
    }
  } catch (error) {
    console.error('Error fetching notice details:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load notice details. Please try again.',
      position: 'top',
      timeout: 3000
    });
    
    // Navigate back to notice list on error
    router.push('/notices');
  } finally {
    isLoading.value = false;
  }
};

// Update notice in the API
const updateNotice = async () => {
  try {
    isSubmitting.value = true;
    
    // Create payload for the API
    const payload = {
      title: notice.title,
      message: notice.message,
      additional_info: {
        date: notice.additional_info.date
      }
    };
    
    // Send patch request to update the notice
    const response = await api.patch(`/v1/notices/${noticeId}`, payload);
    
    // Show success notification
    $q.notify({
      type: 'positive',
      message: 'Notice updated successfully',
      position: 'top',
      timeout: 2000
    });
    
    // Navigate back to notice list
    router.push('/notices');
  } catch (error) {
    console.error('Error updating notice:', error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to update notice. Please try again.',
      position: 'top',
      timeout: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
.notice-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.notice-input {
  border-radius: 4px;
  
  ::v-deep .q-field__control {
    background-color: white;
  }
}
</style>