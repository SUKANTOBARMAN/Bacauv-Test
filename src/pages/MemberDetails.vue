<template>
  <q-page class="profile-form-page q-pa-md">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container column items-center justify-center q-pa-xl">
      <q-spinner-cube color="primary" size="60px" />
      <div class="text-h6 q-mt-md text-blue-grey-6">Loading Profile...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container column items-center justify-center q-pa-xl">
      <q-icon name="error_outline" color="negative" size="70px" />
      <div class="text-h5 q-mt-md text-weight-medium text-negative">Profile Not Found</div>
      <div class="text-body1 q-mt-sm text-blue-grey-6 text-center">{{ error }}</div>
      <q-btn unelevated color="primary" @click="loadMemberData" class="q-mt-lg" icon="refresh">
        Try Again
      </q-btn>
    </div>

    <!-- Profile Content -->
    <div v-else-if="member.id" class="profile-form-content">
      <!-- Back Button (Top Right) -->
      <div class="row justify-end q-mb-lg">
        <q-btn 
          flat 
          color="blue-grey-6" 
          icon="arrow_back" 
          label="Back to List"
          @click="$router.back()"
          class="q-px-lg"
          size="md"
        />
      </div>

      <!-- Main Form Container -->
      <div class="form-container">
        <!-- Profile Header with Image -->
        <div class="profile-header-section q-mb-xl">
          <div class="profile-image-wrapper">
            <div class="profile-image-frame">
              <q-img
                :src="imageURL(member.photo,'/src/assets/action.jpg')"
                :ratio="1"
                class="profile-img"
                loading="lazy"
                @error="handleImageError"
                @load="handleImageLoad"
                spinner-color="primary"
                spinner-size="50px"
                :placeholder-src="defaultImage"
              >
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3 text-grey-7">
                    <q-icon name="person" size="60px" />
                  </div>
                </template>
              </q-img>
              <div v-if="member.verified_at" class="verified-badge">
                <q-icon name="verified" size="20px" />
              </div>
            </div>
          </div>
          
          <div class="profile-title-section text-center q-mt-lg">
            <div class="text-h3 text-weight-bold text-blue-grey-9 q-mb-xs">
              {{ member.name }}
            </div>
            <div class="text-h5 text-blue-grey-7 q-mb-md">
              {{ member.name_bangla }}
            </div>
            
            <!-- Member ID Badge -->
            <div class="member-id-badge q-mb-sm">
              <q-icon name="badge" size="18px" class="q-mr-sm" />
              <span class="text-weight-bold">Member ID:</span> {{ member.member_id }}
            </div>
            
          </div>
        </div>

        <!-- Form Sections -->
        <div class="form-sections q-col-gutter-y-lg">
          <!-- Personal Information Section -->
          <q-card class="form-section-card" flat>
            <q-card-section class="section-header">
              <div class="section-title text-h5 text-weight-medium">
                <q-icon name="person" size="28px" class="q-mr-sm" />
                Personal Information
              </div>
            </q-card-section>
            
            <q-separator />
            
            <q-card-section class="q-pa-lg">
              <div class="row q-col-gutter-lg">
                <!-- Left Column -->
                <div class="col-md-6 col-sm-12">
                         <!-- Designation -->
              <div class="form-field q-mb-lg">
                    <div class="field-label">
                      <q-icon name="work" class="q-mr-sm" />
                      Designation
                    </div>
                    <div class="field-value">{{ (member.designation) }}</div>
                  </div>
                  <!-- Date of Birth -->
                  <div class="form-field q-mb-lg">
                    <div class="field-label">
                      <q-icon name="cake" class="q-mr-sm" />
                      Date of Birth
                    </div>
                    <div class="field-value">{{ formatDate(member.dob) }}</div>
                  </div>
                  
                  <!-- Educational Qualification -->
                  <div class="form-field q-mb-lg">
                    <div class="field-label">
                      <q-icon name="school" class="q-mr-sm" />
                      Educational Qualification
                    </div>
                    <div class="field-value">{{ member.educational_qualification || 'Not provided' }}</div>
                  </div>
                  
                  <!-- Last Education Institution -->
                  <div class="form-field q-mb-lg">
                    <div class="field-label">
                      <q-icon name="location_city" class="q-mr-sm" />
                      Last Education Institution
                    </div>
                    <div class="field-value">{{ member.last_education_institution || 'Not provided' }}</div>
                  </div>
                  
                  <!-- Officer Joining Date -->
                  <div class="form-field">
                    <div class="field-label">
                      <q-icon name="calendar_today" class="q-mr-sm" />
                      Officer Since
                    </div>
                    <div class="field-value">{{ formatDate(member.officer_joining_date) }}</div>
                  </div>
                </div>
                
                <!-- Right Column -->
                <div class="col-md-6 col-sm-12">
                  <!-- Spouse Profession -->
                  <div class="form-field q-mb-lg">
                    <div class="field-label">
                      <q-icon name="family_restroom" class="q-mr-sm" />
                      Spouse Profession
                    </div>
                    <div class="field-value">{{ member.spouse_profession || 'Not provided' }}</div>
                  </div>
                  
                  <!-- Blood Group -->
                  <div v-if="member.blood_group" class="form-field q-mb-lg">
                    <div class="field-label">
                      <q-icon name="bloodtype" class="q-mr-sm" />
                      Blood Group
                    </div>
                    <div class="field-value">
                      <span class="blood-group-chip">{{ member.blood_group }}</span>
                    </div>
                  </div>
                  
                  <!-- Age -->
                  <div v-if="member.dob" class="form-field">
                    <div class="field-label">
                      <q-icon name="access_time" class="q-mr-sm" />
                      Age
                    </div>
                    <div class="field-value">{{ calculateAge(member.dob) }} years</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Contact Information Section -->
          <q-card class="form-section-card" flat>
            <q-card-section class="section-header">
              <div class="section-title text-h5 text-weight-medium">
                <q-icon name="contact_phone" size="28px" class="q-mr-sm" />
                Contact Information
              </div>
            </q-card-section>
            
            <q-separator />
            
            <q-card-section class="q-pa-lg">
              <div class="row q-col-gutter-lg">
                <!-- Left Column -->
                <div class="col-md-6 col-sm-12">
                  <!-- Email -->
                  <div class="form-field q-mb-lg">
                    <div class="field-label">
                      <q-icon name="mail" class="q-mr-sm" />
                      Email Address
                    </div>
                    <div class="field-value">
                      <a v-if="member.email" :href="`mailto:${member.email}`" class="contact-link">
                        {{ member.email }}
                        <q-icon name="open_in_new" size="16px" class="q-ml-xs" />
                      </a>
                      <span v-else class="text-grey-6">Not provided</span>
                    </div>
                  </div>
                  
                  <!-- Mobile -->
                  <div class="form-field q-mb-lg">
                    <div class="field-label">
                      <q-icon name="phone" class="q-mr-sm" />
                      Mobile Number
                    </div>
                    <div class="field-value">
                      <a v-if="member.mobile" :href="`tel:${member.mobile}`" class="contact-link">
                        {{ member.mobile }}
                      </a>
                      <span v-else class="text-grey-6">Not provided</span>
                    </div>
                  </div>
                </div>
                
                <!-- Right Column -->
                <div class="col-md-6 col-sm-12">
                  <!-- Address -->
                  <div class="form-field q-mb-lg">
                    <div class="field-label">
                      <q-icon name="location_on" class="q-mr-sm" />
                      Address
                    </div>
                    <div class="field-value">{{ member.address || 'Not provided' }}</div>
                  </div>
                  
                  <!-- Social Media -->
                  <div v-if="member.social_media_link" class="form-field">
                    <div class="field-label">
                      <q-icon name="link" class="q-mr-sm" />
                      Social Media
                    </div>
                    <div class="field-value">
                      <a :href="member.social_media_link" target="_blank" class="contact-link">
                        {{ formatUrl(member.social_media_link) }}
                        <q-icon name="open_in_new" size="16px" class="q-ml-xs" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Office Information Section -->
          <q-card class="form-section-card" flat>
            <q-card-section class="section-header">
              <div class="section-title text-h5 text-weight-medium">
                <q-icon name="business" size="28px" class="q-mr-sm" />
                Office Information
              </div>
            </q-card-section>
            
            <q-separator />
            
            <q-card-section class="q-pa-lg">
              <div class="row q-col-gutter-lg">
                <!-- Left Column -->
                <div class="col-md-6 col-sm-12">
                  <!-- Commissionerate -->
                  <div class="form-field q-mb-lg">
                    <div class="field-label">
                      <q-icon name="location_city" class="q-mr-sm" />
                      Commissionerate
                    </div>
                    <div class="field-value">{{ getCommissionerateName(member.commissionerate_id) }}</div>
                  </div>
                  
                  <!-- Division -->
                  <div class="form-field q-mb-lg">
                    <div class="field-label">
                      <q-icon name="account_balance" class="q-mr-sm" />
                      Division
                    </div>
                    <div class="field-value">{{ getDivisionName(member.division_id) }}</div>
                  </div>
                </div>
                
                <!-- Right Column -->
                <div class="col-md-6 col-sm-12">
                  <!-- Circle -->
                  <div class="form-field q-mb-lg">
                    <div class="field-label">
                      <q-icon name="settings" class="q-mr-sm" />
                      Circle
                    </div>
                    <div class="field-value">{{ getCircleName(member.circle_id) }}</div>
                  </div>
                  
                  <!-- District -->
                  <div class="form-field">
                    <div class="field-label">
                      <q-icon name="place" class="q-mr-sm" />
                      District
                    </div>
                    <div class="field-value">{{ getDistrictName(member.district_id) }}</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Bottom Actions -->
          <div class="bottom-actions row justify-center q-mt-xl q-pt-xl q-pb-lg">
        <q-btn 
              outline 
              color="blue-grey-6" 
              icon="arrow_back" 
              label="Back to Members"
              @click="$router.back()"
              class="action-btn q-px-xl"
              size="lg"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else class="no-data-container column items-center justify-center q-pa-xl">
      <q-icon name="person_off" size="80px" color="blue-grey-4" />
      <div class="text-h5 q-mt-md text-blue-grey-7 text-weight-medium">No Profile Data Available</div>
      <q-btn 
        unelevated 
        color="primary" 
        @click="$router.back()" 
        class="q-mt-lg" 
        icon="arrow_back"
      >
        Go Back
      </q-btn>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { useStore } from 'stores/store';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const store = useStore();

const loading = ref(true);
const error = ref(null);
const imageError = ref(false);
const defaultImage = ref('/src/assets/user-profile.jpg');
const imageLoaded = ref(false);

// Member data
const member = ref({
  id: null,
  name: "",
  name_bangla: "",
  member_id: "",
  designation: "",
  email: "",
  mobile: "",
  address: "",
  social_media_link: "",
  dob: "",
  blood_group: "",
  spouse_profession: "",
  officer_joining_date: "",
  educational_qualification: "",
  last_education_institution: "",
  commissionerate_id: null,
  division_id: null,
  circle_id: null,
  district_id: null,
  photo: null,
  verified_at: ""
});

// Helper functions
const path = process.env.DEV ? process.env.WEB_DEV_URL : process.env.WEB_BUILD_URL;

function imageURL(url) {
  if (!url || imageError.value) {
    return defaultImage.value;
  }
  if (url.startsWith("http")) {
    return url;
  }
  if (url.startsWith("data:image") || url.startsWith("/")) {
    return url;
  }
  const baseUrl = path || 'http://localhost:8000';
  return `${baseUrl}${url.startsWith('/') ? url : '/' + url}`;
}

function handleImageError() {
  imageError.value = true;
  console.log('Image load failed, using default');
}

function handleImageLoad() {
  imageLoaded.value = true;
}

const formatUrl = (url) => {
  if (!url) return '';
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
};

const formatDate = (dateString) => {
  if (!dateString) return 'Not provided';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

const calculateAge = (dateString) => {
  if (!dateString) return '—';
  try {
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  } catch (e) {
    return '—';
  }
};

const getCommissionerateName = (id) => {
  if (!id) return 'Not assigned';
  const item = store.getCommissionerate?.find(item => item.value == id);
  return item ? item.label : `Commissionerate ${id}`;
};

const getDivisionName = (id) => {
  if (!id) return 'Not assigned';
  const item = store.getDivision?.find(item => item.value == id);
  return item ? item.label : `Division ${id}`;
};

const getCircleName = (id) => {
  if (!id) return 'Not assigned';
  const item = store.getCircle?.find(item => item.value == id);
  return item ? item.label : `Circle ${id}`;
};

const getDistrictName = (id) => {
  if (!id) return 'Not assigned';
  const item = store.getDistrict?.find(item => item.value == id);
  return item ? item.label : `District ${id}`;
};

// Data loading
const loadMemberData = async () => {
  loading.value = true;
  error.value = null;
  imageError.value = false;
  imageLoaded.value = false;
  
  try {
    const memberId = route.params.id;
    
    // Try route state first
    if (route.state?.memberData) {
      Object.assign(member.value, route.state.memberData);
    }
    
    // Fetch from API
    const response = await api.get(`v1/users/${memberId}`);
    let memberData = response.data;
    
    // Handle response structure
    if (response.data.data) memberData = response.data.data;
    else if (response.data.user) memberData = response.data.user;
    else if (response.data.member) memberData = response.data.member;
    
    // Update member data
    Object.assign(member.value, memberData);
    
  } catch (err) {
    console.error('Error loading member data:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to load profile';
    
    // Fallback to route state
    if (!member.value.id && route.state?.memberData) {
      Object.assign(member.value, route.state.memberData);
    }
  } finally {
    loading.value = false;
  }
};

// Load store data
const ensureStoreData = async () => {
  try {
    if (!store.getCommissionerate?.length) await store.storeCommissionerate();
    if (!store.getDivision?.length) await store.storeDivision();
    if (!store.getCircle?.length) await store.storeCircle();
    if (!store.getDistrict?.length) await store.storeDistrict();
  } catch (err) {
    console.error('Error loading store data:', err);
  }
};

// Initialize
onMounted(async () => {
  try {
    await ensureStoreData();
    await loadMemberData();
  } catch (err) {
    console.error('Initialization error:', err);
    error.value = 'Initialization failed: ' + err.message;
    loading.value = false;
  }
});
</script>

<style scoped lang="scss">
.profile-form-page {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  min-height: 100vh;
}

.form-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 123, 255, 0.08);
  padding: 40px;
  border: 1px solid #e1e5eb;
}

/* Profile Header Section */
.profile-header-section {
  text-align: center;
  padding-bottom: 40px;
  border-bottom: 1px solid #e1e5eb;
  margin-bottom: 40px;
  
  .profile-image-wrapper {
    display: flex;
    justify-content: center;
    
    .profile-image-frame {
      position: relative;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 8px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      
      .profile-img {
        border-radius: 50%;
        border: 4px solid white;
        overflow: hidden;
        background: #f8fafc;
        
        :deep(.q-img__image) {
          background-size: cover;
          background-position: center;
        }
      }
      
      .verified-badge {
        position: absolute;
        bottom: 15px;
        right: 15px;
        background: #4caf50;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
      }
    }
  }
  
  .profile-title-section {
    .text-h3 {
      font-size: 2.5rem;
      color: #1a237e;
      margin-bottom: 8px;
    }
    
    .text-h5 {
      font-size: 1.5rem;
      color: #546e7a;
      margin-bottom: 16px;
    }
    
    .member-id-badge {
      display: inline-flex;
      align-items: center;
      background: #e8eaf6;
      color: #3949ab;
      padding: 10px 24px;
      border-radius: 25px;
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 12px;
      border: 1px solid #c5cae9;
      
      .q-icon {
        color: #3949ab;
      }
    }
    
    .designation-badge {
      display: inline-flex;
      align-items: center;
      background: #e3f2fd;
      color: #1565c0;
      padding: 10px 24px;
      border-radius: 25px;
      font-size: 16px;
      font-weight: 500;
      
      .q-icon {
        color: #1565c0;
      }
    }
  }
}

/* Form Section Cards */
.form-section-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e1e5eb;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.08);
    border-color: #bbdefb;
  }
  
  .section-header {
    padding: 24px 32px;
    background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
    border-radius: 16px 16px 0 0;
    
    .section-title {
      color: #1a237e;
      display: flex;
      align-items: center;
      
      .q-icon {
        color: #3949ab;
      }
    }
  }
  
  .q-separator {
    background: linear-gradient(to right, transparent, #bbdefb, transparent);
  }
  
  .form-field {
    padding: 16px 0;
    
    .field-label {
      display: flex;
      align-items: center;
      color: #546e7a;
      font-size: 15px;
      font-weight: 500;
      margin-bottom: 8px;
      
      .q-icon {
        color: #3949ab;
        font-size: 20px;
      }
    }
    
    .field-value {
      color: #263238;
      font-size: 17px;
      font-weight: 500;
      line-height: 1.6;
      padding-left: 32px;
      
      .contact-link {
        color: #3949ab;
        text-decoration: none;
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        transition: all 0.3s ease;
        
        &:hover {
          color: #1a237e;
          text-decoration: underline;
          transform: translateX(2px);
        }
      }
      
      .blood-group-chip {
        display: inline-block;
        background: linear-gradient(135deg, #ff5252 0%, #ff1744 100%);
        color: white;
        padding: 6px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 15px;
        box-shadow: 0 4px 12px rgba(255, 23, 68, 0.2);
      }
    }
  }
}

/* Bottom Actions */
.bottom-actions {
  border-top: 1px solid #e1e5eb;
  padding-top: 40px;
  
  .action-btn {
    min-width: 220px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    
    &.q-btn--unelevated.bg-primary {
      background: linear-gradient(135deg, #3949ab 0%, #1a237e 100%);
      box-shadow: 0 6px 20px rgba(57, 73, 171, 0.3);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(57, 73, 171, 0.4);
      }
    }
    
    &.q-btn--outline.text-blue-grey-6 {
      border: 2px solid #90a4ae;
      
      &:hover {
        background: #f5f7fa;
        border-color: #546e7a;
        color: #37474f;
      }
    }
  }
}

/* Loading & Error States */
.loading-container,
.error-container,
.no-data-container {
  min-height: 70vh;
  
  .text-h5,
  .text-h6 {
    letter-spacing: 0.5px;
  }
}

/* Responsive Design */
@media (max-width: 992px) {
  .form-container {
    padding: 24px;
  }
  
  .profile-header-section {
    .profile-image-frame {
      width: 160px !important;
      height: 160px !important;
    }
    
    .text-h3 {
      font-size: 2rem !important;
    }
    
    .text-h5 {
      font-size: 1.25rem !important;
    }
  }
  
  .form-section-card {
    .section-header {
      padding: 20px 24px;
      
      .section-title {
        font-size: 1.25rem;
      }
    }
  }
  
  .bottom-actions {
    .action-btn {
      min-width: 180px;
      margin-bottom: 12px;
    }
  }
}

@media (max-width: 768px) {
  .profile-form-page {
    padding: 16px !important;
  }
  
  .form-container {
    padding: 20px;
    border-radius: 16px;
  }
  
  .profile-header-section {
    padding-bottom: 30px;
    margin-bottom: 30px;
    
    .profile-image-frame {
      width: 140px !important;
      height: 140px !important;
    }
    
    .text-h3 {
      font-size: 1.75rem !important;
    }
  }
  
  .form-section-card {
    .field-value {
      font-size: 16px;
      padding-left: 28px;
    }
  }
  
  .bottom-actions {
    flex-direction: column;
    gap: 12px;
    
    .action-btn {
      width: 100%;
    }
  }
}

/* Print Styles */
@media print {
  .profile-form-page {
    background: white !important;
    padding: 0 !important;
  }
  
  .q-btn,
  .bottom-actions,
  .verified-badge {
    display: none !important;
  }
  
  .form-container {
    box-shadow: none !important;
    border: none !important;
    padding: 20px !important;
  }
  
  .profile-header-section {
    border-bottom: 2px solid #000 !important;
  }
  
  .form-section-card {
    break-inside: avoid;
    box-shadow: none !important;
    border: 1px solid #ddd !important;
    margin-bottom: 20px;
  }
}
</style>