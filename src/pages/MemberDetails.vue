<template>
  <q-page class="bg-grey-1">
    <div class="q-pa-md">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center q-pt-xl">
        <q-spinner-cube color="primary" size="60px" />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center q-pt-xl">
        <q-icon name="error_outline" color="negative" size="70px" />
        <div class="text-h6 q-mt-md text-negative">Error Loading Member</div>
        <div class="text-body2 q-mt-sm text-grey-7">{{ error }}</div>
        <q-btn 
          unelevated 
          color="primary" 
          @click="fetchUserProfile" 
          class="q-mt-lg" 
          icon="refresh"
          label="Try Again"
        />
      </div>

      <!-- Main Content -->
      <div v-else-if="user.id">
        <!-- Header -->
        <div class="q-mb-lg">
          <div class="flex items-center q-mb-md">
            <q-btn 
              flat 
              round 
              color="grey-7" 
              icon="arrow_back" 
              @click="$router.back()"
              class="q-mr-sm"
            />
            <div>
              <div class="text-h5 text-weight-bold" style="color: #1976d2;">Member Details</div>
              <div class="text-body2 text-grey-7">{{ user.name }}'s complete information</div>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <!-- Left Column - Profile -->
          <div class="col-12 col-md-4">
            <q-card class="shadow-1 rounded-borders">
              <q-card-section style="background-color: #1976d2; color: white;">
                <div class="text-center text-h6">Profile</div>
              </q-card-section>
              
              <q-card-section class="text-center q-pa-lg">
                <!-- Profile Image -->
                <div class="q-mb-md">
                  <q-avatar size="120px" class="profile-avatar">
                    <img 
                      v-if="user.photo || photoPreview" 
                      :src="photoPreview || `${baseUrl}${user.photo}`" 
                      alt="Profile"
                      @error="handleImageError"
                    >
                    <q-icon v-else name="person" size="60px" color="grey-5" />
                  </q-avatar>
                  <q-badge 
                    v-if="user.verified_at" 
                    color="green" 
                    class="verified-badge"
                  >
                    <q-icon name="verified" size="14px" />
                  </q-badge>
                </div>

                <!-- Basic Info -->
                <div class="q-mb-md">
                  <div class="text-h6 text-weight-bold text-dark">{{ user.name_bangla || user.name }}</div>
                  <div class="text-body1 text-primary q-mb-sm">{{ getDesignationLabel(user.designation) }}</div>
                  <div class="text-caption text-grey-7">ID: {{ user.member_id }}</div>
                </div>

                <!-- Quick Info -->
                <div class="text-left">
                  <div class="row items-center q-mb-xs">
                    <q-icon name="email" size="16px" color="grey-6" class="q-mr-sm" />
                    <div class="text-body2 text-truncate">{{ user.email || 'N/A' }}</div>
                  </div>
                  <div class="row items-center q-mb-xs">
                    <q-icon name="phone" size="16px" color="grey-6" class="q-mr-sm" />
                    <div class="text-body2">{{ user.mobile || 'N/A' }}</div>
                  </div>
                  <!-- <div class="row items-center q-mb-xs">
                    <q-icon name="calendar_today" size="16px" color="grey-6" class="q-mr-sm" />
                    <div class="text-body2">Joined: {{ formatDate(user.created_at) }}</div>
                  </div> -->
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Right Column - Tabs -->
          <div class="col-12 col-md-8">
  <q-card class="shadow-1 rounded-borders">
    <q-card-section class="text-white q-py-md" style="background-color: #1976d2;">
  <div class="text-h6 text-weight-bold">
    <q-icon name="account_circle" class="q-mr-sm" size="28px" />
    Full Profile Information
  </div>
</q-card-section>

    <q-card-section class="q-pa-lg">
      <div class="section-container q-mb-xl">
        <div class="row items-center q-mb-md">
          <q-icon name="person" size="24px" class="q-mr-sm" style="color: #1976d2;" />
          <div class="text-h6 text-weight-bold" style="color: #1976d2;">Personal Information</div>
        </div>
        
        <div class="row q-col-gutter-md">
  <div class="col-12 col-sm-6">
    <div class="q-mb-md">
      <div class="text-caption text-grey-7">Full Name (English)</div>
      <div class="text-body1 text-weight-medium">{{ user.name || 'N/A' }}</div>
    </div>
  </div>

  <div class="col-12 col-sm-6">
    <div class="q-mb-md">
      <div class="text-caption text-grey-7">Full Name (Bangla)</div>
      <div class="text-body1 text-weight-medium">{{ user.name_bangla || 'N/A' }}</div>
    </div>
  </div>

  <div class="col-12 col-sm-6">
    <div class="q-mb-md">
      <div class="text-caption text-grey-7">Designation</div>
      <div class="text-body1">{{ getDesignationLabel(user.designation) }}</div>
    </div>
  </div>

  <div class="col-12 col-sm-6">
    <div class="q-mb-md">
      <div class="text-caption text-grey-7">Date of Birth</div>
      <div class="text-body1">{{ formatDate(user.dob) }}</div>
    </div>
  </div>

  <div class="col-12 col-sm-6">
    <div class="q-mb-md">
      <div class="text-caption text-grey-7">Blood Group</div>
      <div class="text-body1">
        <span v-if="user.blood_group" class="blood-group">{{ user.blood_group }}</span>
        <span v-else>N/A</span>
      </div>
    </div>
  </div>

  <div class="col-12 col-sm-6">
    <div class="q-mb-md">
      <div class="text-caption text-grey-7">Officer Joining Date</div>
      <div class="text-body1">{{ formatDate(user.officer_joining_date) }}</div>
    </div>
  </div>

  <div class="col-12 col-sm-6">
    <div class="q-mb-md">
      <div class="text-caption text-grey-7">Educational Qualification</div>
      <div class="text-body1">{{ user.educational_qualification || 'N/A' }}</div>
    </div>
  </div>

  <div class="col-12 col-sm-6">
    <div class="q-mb-md">
      <div class="text-caption text-grey-7">Last Education Institution</div>
      <div class="text-body1">{{ user.last_education_institution || 'N/A' }}</div>
    </div>
  </div>

  <div class="col-12">
    <div class="q-mb-md">
      <div class="text-caption text-grey-7">Spouse Profession</div>
      <div class="text-body1">{{ user.spouse_profession || 'N/A' }}</div>
    </div>
  </div>
</div>
      </div>

      <q-separator class="q-my-lg" />

      <div class="section-container q-mb-xl">
        <div class="row items-center q-mb-md">
          <q-icon name="contacts" size="24px" class="q-mr-sm" style="color: #1976d2;" />
          <div class="text-h6 text-weight-bold" style="color: #1976d2;">Contact Information</div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <div class="q-mb-md">
              <div class="text-caption text-grey-7">Email Address</div>
              <a v-if="user.email" :href="`mailto:${user.email}`" class="text-primary text-body1">
                {{ user.email }}
              </a>
              <div v-else class="text-body1">N/A</div>
            </div>
          </div>
          <div class="col-12 col-sm-6">
            <div class="q-mb-md">
              <div class="text-caption text-grey-7">Mobile Number</div>
              <a v-if="user.mobile" :href="`tel:${user.mobile}`" class="text-primary text-body1">
                {{ user.mobile }}
              </a>
              <div v-else class="text-body1">N/A</div>
            </div>
          </div>
          <div class="col-12">
            <div class="q-mb-md">
              <div class="text-caption text-grey-7">Address</div>
              <div class="text-body1">{{ user.address || 'N/A' }}</div>
            </div>
          </div>
          <div class="col-12">
            <div class="q-mb-md">
              <div class="text-caption text-grey-7">Facebook Profile Link</div>
              <a v-if="user.social_media_link" :href="user.social_media_link" target="_blank" class="text-primary text-body1">
                {{ formatSocialLink(user.social_media_link) }}
              </a>
              <div v-else class="text-body1">N/A</div>
            </div>
          </div>
        </div>
      </div>

      <q-separator class="q-my-lg" />

      <div class="section-container">
        <div class="row items-center q-mb-md">
          <q-icon name="business" size="24px" class="q-mr-sm" style="color: #1976d2;" />
          <div class="text-h6 text-weight-bold" style="color: #1976d2;">Office Information</div>
        </div>

        <div class="q-mb-md">
          <div class="text-subtitle1 text-weight-medium q-mb-sm text-grey-8">Administrative Hierarchy</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div class="q-mb-md">
                <div class="text-caption text-grey-7">Commissionerate</div>
                <div class="text-body1">{{ user.commissionerate?.data?.name || 'N/A' }}</div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="q-mb-md">
                <div class="text-caption text-grey-7">Division</div>
                <div class="text-body1">{{ user.division?.data?.name || 'N/A' }}</div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="q-mb-md">
                <div class="text-caption text-grey-7">Circle</div>
                <div class="text-body1">{{ user.circle?.data?.name || 'N/A' }}</div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="q-mb-md">
                <div class="text-caption text-grey-7">District</div>
                <div class="text-body1">{{ user.district?.data?.name || 'N/A' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</div>
        </div>
      </div>

      <!-- No Data -->
      <div v-else class="text-center q-pt-xl">
        <q-icon name="person_off" size="80px" color="grey-4" />
        <div class="text-h6 q-mt-md text-grey-6">No Member Data Available</div>
        <q-btn 
          unelevated 
          color="primary" 
          @click="$router.back()" 
          class="q-mt-md" 
          icon="arrow_back"
          label="Go Back"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

const $q = useQuasar();
const route = useRoute();
const baseUrl = process.env.DEV_WEB_URL;

const tab = ref("personal");
const loading = ref(true);
const error = ref(null);
const user = ref({
  name: "",
  name_bangla: "",
  email: "",
  mobile: "",
  designation: "",
  address: "",
  dob: "",
  verified_at: "",
  photo: null,
  commissionerate: null,
  division: null,
  circle: null,
  district: null,
  created_at: "",
  id: null,
  member_id: "",
  officer_joining_date: "",
  blood_group: "",
  social_media_link: "",
  educational_qualification: "",
  last_education_institution: "",
  spouse_profession: ""
});

const designationOptions = [
  { label: "RO (Revenue Officer)", value: "RO" },
  { label: "ARO (Assistant Revenue Officer)", value: "ARO" },
];

// Methods (keep existing logic)
const fetchUserProfile = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const memberId = route.params.id;
    
    const { data } = await api.get(`/v1/users/${memberId}`, {
      params: { include: "commissionerate,division,circle,district" }
    });
    
    if (data.data) user.value = data.data;
    else if (data.user) user.value = data.user;
    else user.value = data;
    
  } catch (err) {
    console.error("Error loading member:", err);
    error.value = err.response?.data?.message || err.message || "Failed to load member";
    
    $q.notify({
      type: "negative",
      message: "Failed to load member details",
      caption: error.value,
    });
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (photoPath) => {
  if (!photoPath) return '';
  if (photoPath.startsWith('http') || photoPath.startsWith('data:image')) return photoPath;
  const base = baseUrl || 'http://localhost:8000';
  return photoPath.startsWith('storage/') ? `${base}/${photoPath}` : `${base}/storage/${photoPath}`;
};

const handleImageError = (event) => {
  event.target.style.display = 'none';
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch {
    return dateString;
  }
};

const getDesignationLabel = (designationValue) => {
  const found = designationOptions.find(opt => opt.value === designationValue);
  return found ? found.label : designationValue || "N/A";
};

const formatSocialLink = (url) => {
  if (!url) return "";
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
};

onMounted(fetchUserProfile);
</script>

<style scoped>
/* Profile avatar styling */
.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.verified-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  border-radius: 50%;
  padding: 4px;
  border: 2px solid white;
}

/* Blood group styling */
.blood-group {
  display: inline-block;
  background: #fef2f2;
  color: #dc2626;
  padding: 4px 12px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid #fecaca;
}

/* Tab styling */
:deep(.q-tab) {
  padding: 12px 20px;
  text-transform: none;
  font-weight: 500;
  min-width: 120px;
}

:deep(.q-tab--active) {
  color: #1976d2;
  border-bottom: 3px solid #1976d2;
}

/* Card styling */
.q-card {
  border-radius: 12px;
  overflow: hidden;
}

/* Responsive design */
@media (max-width: 1023px) {
  .q-card-section {
    padding: 16px;
  }
  
  :deep(.q-tab) {
    padding: 10px 16px;
    min-width: 100px;
  }
}

@media (max-width: 599px) {
  /* Mobile adjustments */
  .text-h5 {
    font-size: 1.25rem;
  }
  
  .profile-avatar {
    width: 100px;
    height: 100px;
  }
  
  .q-pa-lg {
    padding: 16px;
  }
  
  :deep(.q-tab) {
    padding: 8px 12px;
    font-size: 14px;
    min-width: auto;
  }
  
  .row.q-col-gutter-lg {
    margin-left: -8px !important;
    margin-right: -8px !important;
  }
  
  .col-12 {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
}

@media (max-width: 399px) {
  /* Small mobile */
  .profile-avatar {
    width: 80px;
    height: 80px;
  }
  
  .text-h6 {
    font-size: 1rem;
  }
  
  .text-body1 {
    font-size: 14px;
  }
  
  .text-caption {
    font-size: 12px;
  }
  
  :deep(.q-tab) {
    padding: 6px 10px;
    font-size: 13px;
  }
}

/* Desktop optimization */
@media (min-width: 1440px) {
  .profile-avatar {
    width: 140px;
    height: 140px;
  }
  
  .q-card-section {
    padding: 24px;
  }
}
</style>