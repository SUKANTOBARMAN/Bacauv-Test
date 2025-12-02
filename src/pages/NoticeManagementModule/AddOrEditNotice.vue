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
            <div class="flex items-center justify-center q-mb-md">
              <div class="text-h5 text-teal-10 text-weight-medium">
                <q-icon name="notifications_active" class="q-mr-sm" size="sm" />
                নোটিশ যোগ করুন
              </div>
            </div>
            <q-separator color="teal-3" />
          </q-card-section>

          <q-card-section class="q-px-md q-pb-none">
            <div class="text-caption text-grey-8 text-center">
              নতুন নোটিশ তৈরির জন্য নিচের ফর্মটি পূরণ করুন
            </div>
          </q-card-section>

          <q-form @submit.prevent="submitNotice" class="q-gutter-md q-pa-md">
            <!-- Notice Title -->
            <q-input
              outlined
              v-model="notice.title"
              label="নোটিশ শিরোনাম"
              class="notice-input"
              bg-color="white"
              lazy-rules
              :rules="[(val) => !!val || 'শিরোনাম আবশ্যক']"
            >
              <template v-slot:prepend>
                <q-icon name="title" color="teal" />
              </template>
            </q-input>

            <!-- Notice Details -->
            <q-input
              outlined
              v-model="notice.details"
              label="নোটিশের বিস্তারিত"
              type="textarea"
              rows="4"
              class="notice-input"
              bg-color="white"
              lazy-rules
              :rules="[(val) => !!val || 'বিস্তারিত লিখুন']"
            >
              <template v-slot:prepend>
                <q-icon name="description" color="teal" />
              </template>
            </q-input>

            <!-- Date Selection -->
            <q-input
              outlined
              v-model="notice.date"
              label="নোটিশের তারিখ"
              mask="date"
              class="notice-input"
              bg-color="white"
              lazy-rules
              :rules="['date']"
            >
              <template v-slot:prepend>
                <q-icon name="event" color="teal" />
              </template>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date 
                      v-model="notice.date" 
                      today-btn
                      color="teal"
                      minimal
                    >
                      <div class="row items-center justify-end q-pa-sm">
                        <q-btn v-close-popup label="নির্বাচন করুন" color="teal" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <!-- Designation Selection Section -->
            <q-card class="q-pa-sm bg-teal-1" bordered flat>
              <q-card-section class="q-pa-sm">
                <div class="text-subtitle2 text-teal-10 q-mb-sm">
                  <q-icon name="people" class="q-mr-xs" size="xs" />
                  পদবী নির্বাচন করুন
                </div>

                <div class="row items-center q-col-gutter-sm">
                  <div class="col">
                    <q-select
                      outlined
                      v-model="selectedDesignation"
                      :options="availableDesignations"
                      label="পদবী যোগ করুন"
                      @update:model-value="addDesignation"
                      class="notice-input"
                      bg-color="white"
                      use-input
                      hide-selected
                      fill-input
                      input-debounce="0"
                      new-value-mode="add-unique"
                    >
                      <template v-slot:prepend>
                        <q-icon name="work" color="teal" />
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            মিলছে না এমন পদবী নেই
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="col-auto">
                    <q-btn
                      outline
                      label="সব নির্বাচন করুন"
                      color="teal"
                      icon="select_all"
                      @click="selectAllDesignations"
                      :disable="selectedDesignations.length === availableDesignations.length"
                      size="md"
                    />
                  </div>
                </div>

                <div class="q-mt-md">
                  <div v-if="selectedDesignations.length" class="selected-designations q-py-sm">
                    <q-chip
                      v-for="(designation, index) in selectedDesignations"
                      :key="index"
                      removable
                      @remove="removeDesignation(index)"
                      color="teal"
                      text-color="white"
                      class="q-ma-xs"
                      square
                    >
                      {{ designation }}
                    </q-chip>
                  </div>
                  <div class="q-mt-sm text-grey-7 text-center text-caption" v-else>
                    <q-icon name="info" size="xs" class="q-mr-xs" />
                    কোনো পদবী নির্বাচন করা হয়নি। অনুগ্রহ করে অন্তত একটি পদবী নির্বাচন করুন।
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <div class="text-center q-mt-lg">
              <q-btn 
                label="নোটিশ জমা দিন" 
                type="submit" 
                color="teal" 
                :loading="isSubmitting"
                :disable="selectedDesignations.length === 0"
                class="q-px-xl q-py-sm"
                unelevated
                icon="send"
              >
                <q-tooltip>এই নোটিশটি তৈরি করুন</q-tooltip>
              </q-btn>
              <q-btn 
                label="ফর্ম রিসেট করুন" 
                color="grey-7" 
                flat
                class="q-ml-sm"
                @click="resetForm"
                icon="restart_alt"
              >
                <q-tooltip>সব ক্ষেত্র পরিষ্কার করুন</q-tooltip>
              </q-btn>
            </div>
          </q-form>
        </q-card>
      </div>
    </div>
  </q-page>
</template>


<script setup>
import { reactive, ref, onMounted } from 'vue';
import { date, useQuasar } from 'quasar';
import notice_board from 'src/assets/notice_board.svg'; 
import bell_notification from 'src/assets/bell_notification.png';
import { api } from 'boot/axios';

// Initialize Quasar framework for notifications
const $q = useQuasar();


// Initialize notice with today's date as default
const notice = reactive({
  title: '',
  details: '',
  date: date.formatDate(new Date(), 'YYYY/MM/DD'), // Use Quasar's date format
  designations: [], 
});

const availableDesignations = ref([]);
const isSubmitting = ref(false);
const designationMap = ref({}); // Map to store designation name to ID mapping

const dummyResponse = {
  "data": [
    {
      "id": "OWjzL91WjEDAZw5m",
      "name": "Barrett Weimann V",
      "type": "designation",
    },
    {
      "id": "EdkzYX8nWORN09p4",
      "name": "DG-Bhola",
      "type": "designation",
    },
    {
      "id": "79yzNQ1xdp1KrdOa",
      "name": "Security Head",
      "type": "designation",
    }
  ]
};

onMounted(() => {
  fetchDesignations(); // Fetch designations when the component is mounted
});

const fetchDesignations = async () => {
  try {
    const response = await api.get('/v1/categories?search=type:designation&limit=0');
    
    // Check if response has a data property that contains an array
    const designationsData = response.data?.data || [];
    
    if (Array.isArray(designationsData) && designationsData.length > 0) {
      // Create a map of designation names to IDs
      designationMap.value = {};
      designationsData.forEach(designation => {
        designationMap.value[designation.name] = designation.id;
      });
      
      // Set available designations for dropdown
      availableDesignations.value = designationsData.map(designation => designation.name);
    } else {
      console.warn('No designations found in the response');
      // Fallback to dummy data if API call returns empty
      fallbackToDesignationDummyData();
    }
  } catch (error) {
    console.error('Error fetching designations:', error);
    // Fallback to dummy data if API call fails
    fallbackToDesignationDummyData();
  }
};

// Function to populate with dummy data if API fails
const fallbackToDesignationDummyData = () => {
  designationMap.value = {};
  dummyResponse.data.forEach(designation => {
    designationMap.value[designation.name] = designation.id;
  });
  availableDesignations.value = dummyResponse.data.map(designation => designation.name);
};

// Track selected designations
const selectedDesignations = ref([]);

// Track the currently selected designation from the dropdown
const selectedDesignation = ref(null);

// Add a designation to the selected list
function addDesignation() {
  if (selectedDesignation.value && !selectedDesignations.value.includes(selectedDesignation.value)) {
    selectedDesignations.value.push(selectedDesignation.value);
    notice.designations = selectedDesignations.value; // Sync with notice object
  }
  selectedDesignation.value = null; // Reset dropdown after selection
}

// Remove a designation by index
function removeDesignation(index) {
  selectedDesignations.value.splice(index, 1);
  notice.designations = selectedDesignations.value; // Sync with notice object
}

// Select all designations
function selectAllDesignations() {
  selectedDesignations.value = [...availableDesignations.value];
  notice.designations = selectedDesignations.value; // Sync with notice object
}

// Handle form submission
async function submitNotice() {
  try {
    isSubmitting.value = true;
    
    // Validate that designations are selected
    if (selectedDesignations.value.length === 0) {
      $q.notify({
        type: 'negative',
        message: 'Please select at least one designation',
        position: 'top',
        timeout: 3000
      });
      return;
    }
    
    // Get selected designation IDs
    const selectedDesignationIds = selectedDesignations.value.map(name => {
      const id = designationMap.value[name];
      if (!id) {
        console.error(`No ID found for designation: ${name}`);
      }
      return id;
    }).filter(id => id); // Remove any undefined IDs
    
    // Validate that we have valid designation IDs
    if (selectedDesignationIds.length === 0) {
      $q.notify({
        type: 'negative',
        message: 'Invalid designations selected',
        position: 'top',
        timeout: 3000
      });
      return;
    }
    
    // Create notice payload
    const noticePayload = {
      title: notice.title,
      status: 'draft',
      message: notice.details,
      noticeable_type: 'category',
      noticeable_ids: selectedDesignationIds, // Use the correct designation IDs
      additional_info: {
        date: notice.date
      }
    };
    
    
    
    // Send POST request to create notice
    const response = await api.post('/v1/notices', noticePayload);
    
    
    
    // Show success toast
    $q.notify({
      type: 'positive',
      message: 'Notice has been created successfully',
      position: 'top',
      timeout: 2000
    });

    
    
    // Reset form
    resetForm();
  } catch (error) {
    console.error('Error creating notice:', error.response?.data || error);
    
    // Show error toast with more detailed error message
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to create notice. Please try again.',
      position: 'top',
      timeout: 3000
    });
  } finally {
    isSubmitting.value = false;
  }
}

// Reset form after submission
function resetForm() {
  notice.title = '';
  notice.details = '';
  notice.date = date.formatDate(new Date(), 'YYYY/MM/DD');
  selectedDesignations.value = [];
  selectedDesignation.value = null;
  notice.designations = [];
}
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

.selected-designations {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  min-height: 60px;
  padding: 8px;
  border: 1px dashed rgba(0, 150, 136, 0.3);
}
</style>