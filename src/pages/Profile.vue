<template>
  <q-layout view="hHh Lpr lFf">
    <q-page-container>
      <q-page class="app-profile-page bg-grey-2">
        
        <!-- Mobile/App Style Top Header Background -->
        <div class="profile-header-bg"></div>

        <!-- Main Content Wrapper -->
        <div class="profile-content-wrapper mt-10 q-pa-md q-pa-sm-lg">
          
          <!-- Page Header (Desktop mostly, blends in mobile) -->
          <div class="row items-center justify-between q-mb-lg desktop-header text-white">
            <div class="col-12">
              <div class="text-h4 text-h5-sm text-weight-bold q-mb-xs">প্রোফাইল</div>
              <div class="text-subtitle1 text-subtitle2-sm opacity-80">আপনার ব্যক্তিগত তথ্য</div>
            </div>
          </div>

          <div class="row q-col-gutter-lg q-col-gutter-md-xl">
            <!-- Left Side - Profile Picture -->
            <div class="col-12 col-md-4">
              <q-card class="app-card profile-card shadow-soft">
                <q-card-section class="text-center q-pt-xl q-pb-lg px-md-lg profile-avatar-section">
                  
                  <!-- Clickable Profile Picture -->
                  <div class="profile-image-container q-mb-md" @click="triggerPhotoUpload">
                    <q-avatar size="140px" class="profile-avatar shadow-4">
                      <img
                        v-if="user.photo || photoPreview"
                        :src="photoPreview || `${baseUrl}${user.photo}`"
                        alt="Profile"
                        class="profile-img"
                      />
                      <div v-else class="profile-placeholder">
                        <q-icon name="person" size="70px" color="white" />
                      </div>

                      <!-- Hover Overlay -->
                      <div class="profile-overlay">
                        <q-icon name="camera_alt" size="30px" />
                        <div class="text-caption q-mt-sm">ছবি পরিবর্তন</div>
                      </div>
                    </q-avatar>

                    <!-- Upload Status Badge -->
                    <div v-if="user.verified_at" class="verified-badge shadow-2">
                      <q-icon name="verified" size="18px" />
                    </div>
                  </div>

                  <!-- Hidden File Input -->
                  <input
                    type="file"
                    ref="fileInput"
                    style="display: none"
                    accept=".jpg,.jpeg,.png"
                    @change="handlePhotoSelect"
                  />

                  <!-- Upload Actions -->
                  <div v-if="photoPreview" class="upload-actions q-mb-md">
                    <q-linear-progress v-if="uploadingPhoto" indeterminate color="indigo-7" class="q-mb-md rounded-borders" />
                    <div class="row q-col-gutter-sm">
                      <div class="col-12 col-sm-6">
                        <q-btn label="আপলোড" color="indigo-7" class="full-width rounded-8" :loading="uploadingPhoto" @click="uploadPhoto" icon="cloud_upload" unelevated />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-btn label="বাতিল" color="negative" outline class="full-width rounded-8" @click="cancelUpload" />
                      </div>
                    </div>
                  </div>

                  <!-- User Quick Info -->
                  <div class="q-mt-sm">
                    <div class="text-h5 text-subtitle1-sm text-weight-bold text-grey-9 q-mb-xs">
                      {{ user.name_bangla || user.name || 'নাম নেই' }}
                    </div>
                    <div class="text-subtitle2 text-indigo-7 q-mb-lg text-wrap">
                      {{ user.email }}
                    </div>

                    <!-- Contact Chips (App Style) -->
                    <div class="row justify-center q-gutter-sm">
                      <q-chip color="indigo-1" text-color="indigo-8" class="font-weight-medium px-4">
                        <q-icon name="phone" size="xs" class="q-mr-xs" />
                        {{ user.mobile || "N/A" }}
                      </q-chip>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Right Side - Profile Information -->
            <div class="col-12 col-md-8">
              <q-card class="app-card info-card shadow-soft q-pb-md">
                <!-- App Style Segmented Tabs -->
                <div class="q-pa-md bg-white border-bottom">
                  <q-tabs
                    v-model="tab"
                    dense
                    class="app-segmented-tabs text-grey-7"
                    active-color="white"
                    active-bg-color="indigo-7"
                    indicator-color="transparent"
                    align="justify"
                    narrow-indicator
                  >
                    <!-- Fixed Tab alignment for Mobile -->
                    <q-tab name="personal" class="rounded-8 tab-item" no-caps>
                      <div class="row items-center no-wrap">
                        <q-icon name="person_outline" size="20px" class="q-mr-sm" />
                        <span class="text-weight-bold">ব্যক্তিগত তথ্য</span>
                      </div>
                    </q-tab>
                    <q-tab name="admin" class="rounded-8 tab-item" no-caps>
                      <div class="row items-center no-wrap">
                        <q-icon name="business_center" size="20px" class="q-mr-sm" />
                        <span class="text-weight-bold">অফিসিয়াল তথ্য</span>
                      </div>
                    </q-tab>
                  </q-tabs>
                </div>

                <!-- Tab Panels -->
                <q-tab-panels v-model="tab" animated class="bg-transparent">
                  
                  <!-- Personal Information -->
                  <q-tab-panel name="personal" class="q-pa-none">
                    <div class="q-pa-lg q-pa-md-md form-container-padding">
                      <div class="form-grid">
                        
                        <!-- Row 1: Names -->
                        <div class="form-section">
                          <div class="form-label">নাম (ইংরেজি)</div>
                          <q-input outlined v-model="editForm.name" readonly dense bg-color="grey-2" class="app-input" />
                        </div>
                        <div class="form-section">
                          <div class="form-label">নাম (বাংলা)</div>
                          <q-input outlined v-model="editForm.name_bangla" readonly dense bg-color="grey-2" class="app-input" />
                        </div>

                        <!-- Row 2: Contact -->
                        <div class="form-section">
                          <div class="form-label">ইমেইল</div>
                          <q-input outlined v-model="editForm.email" type="email" readonly dense bg-color="grey-2" class="app-input" />
                        </div>
                        <div class="form-section">
                          <div class="form-label">মোবাইল নম্বর</div>
                          <q-input outlined v-model="editForm.mobile" mask="###########" readonly dense bg-color="grey-2" class="app-input" />
                        </div>

                        <!-- Row 3: Others -->
                        <div class="form-section">
                          <div class="form-label">যোগদানের তারিখ</div>
                          <q-input outlined v-model="editForm.officer_joining_date" dense color="indigo" class="app-input" @update:model-value="markFieldAsChanged('officer_joining_date')">
                            <template v-slot:append>
                              <q-icon name="event" class="cursor-pointer text-indigo">
                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                  <q-date v-model="editForm.officer_joining_date" mask="YYYY-MM-DD" color="indigo">
                                    <div class="row items-center justify-end">
                                      <q-btn v-close-popup label="Close" color="primary" flat />
                                    </div>
                                  </q-date>
                                </q-popup-proxy>
                              </q-icon>
                            </template>
                          </q-input>
                        </div>

                        <div class="form-section">
                          <div class="form-label">রক্তের গ্রুপ</div>
                          <q-select outlined v-model="editForm.blood_group" :options="bloodGroupOptions" option-value="value" option-label="label" emit-value map-options dense clearable color="indigo" class="app-input" @update:model-value="markFieldAsChanged('blood_group')" />
                        </div>
                        
                        <!-- Social & Address -->
                        <div class="form-section">
                          <div class="form-label">Facebook ID</div>
                          <q-input outlined v-model="editForm.social_media_link" dense color="indigo" placeholder="https://facebook.com/username" class="app-input" @update:model-value="markFieldAsChanged('social_media_link')">
                            <template v-slot:prepend><q-icon name="facebook" color="blue-8" size="xs"/></template>
                          </q-input>
                        </div>
                        <div class="form-section full-width">
                          <div class="form-label">ঠিকানা</div>
                          <q-input outlined v-model="editForm.address" dense color="indigo" autogrow class="app-input" @update:model-value="markFieldAsChanged('address')" />
                        </div>

                        <!-- Education & Spouse -->
                        <div class="form-section">
                          <div class="form-label">শিক্ষাগত যোগ্যতা (সর্বোচ্চ)</div>
                          <q-input outlined v-model="editForm.educational_qualification" dense color="indigo" placeholder="যেমন: মাস্টার্স, বিএসসি" class="app-input" @update:model-value="markFieldAsChanged('educational_qualification')" />
                        </div>
                        <div class="form-section">
                          <div class="form-label">শিক্ষাপ্রতিষ্ঠান (সর্বোচ্চ)</div>
                          <q-input outlined v-model="editForm.last_education_institution" dense color="indigo" placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয়" class="app-input" @update:model-value="markFieldAsChanged('last_education_institution')" />
                        </div>
                        <div class="form-section">
                          <div class="form-label">স্বামী/স্ত্রীর পেশা</div>
                          <q-input outlined v-model="editForm.spouse_profession" dense color="indigo" placeholder="যেমন: সরকারি কর্মকর্তা, শিক্ষক" class="app-input" @update:model-value="markFieldAsChanged('spouse_profession')" />
                        </div>

                        <!-- Dates (Read Only) -->
                        <div class="form-section">
                          <div class="form-label">জন্ম তারিখ</div>
                          <q-input outlined :model-value="formatDate(user.dob)" readonly dense bg-color="grey-2" class="app-input" />
                        </div>
                        <div class="form-section">
                          <div class="form-label">যাচাইকরণ তারিখ</div>
                          <q-input outlined :model-value="formatDate(user.verified_at)" readonly dense bg-color="grey-2" class="app-input" />
                        </div>
                      </div>

                      <!-- Desktop Save Button -->
                      <div class="text-right q-mt-xl desktop-only">
                        <q-btn color="indigo-7" class="text-white save-btn rounded-8" icon="save" label="সংরক্ষণ করুন" unelevated :loading="updatingProfile" @click="updateProfile" size="md" />
                      </div>
                    </div>
                  </q-tab-panel>

                  <!-- Administrative Information -->
                  <q-tab-panel name="admin" class="q-pa-none">
                    <div class="q-pa-lg q-pa-md-md bg-grey-1">
                      
                      <div class="text-caption text-grey-7 q-mb-md text-center flex flex-center">
                        <q-icon name="info" size="xs" class="q-mr-xs" /> এই তথ্যগুলি পরিবর্তনযোগ্য নয়
                      </div>

                      <!-- App Style Settings List for Admin Info -->
                      <q-list bordered class="rounded-borders bg-white shadow-soft app-list q-mb-lg">
                        <q-item-label header class="text-weight-bold text-indigo-9 text-subtitle1">কাঠামো</q-item-label>
                        
                        <q-item>
                          <q-item-section avatar>
                            <q-avatar color="indigo-1" text-color="indigo-7" icon="apartment" size="md" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label caption>কমিশনারেট</q-item-label>
                            <!-- Text wrap class added for long names -->
                            <q-item-label class="text-weight-medium text-wrap">{{ user.commissionerate?.data?.name || "N/A" }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-separator inset />
                        
                        <q-item>
                          <q-item-section avatar>
                            <q-avatar color="indigo-1" text-color="indigo-7" icon="account_tree" size="md" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label caption>ডিভিশন</q-item-label>
                            <q-item-label class="text-weight-medium text-wrap">{{ user.division?.data?.name || "N/A" }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-separator inset />

                        <q-item>
                          <q-item-section avatar>
                            <q-avatar color="indigo-1" text-color="indigo-7" icon="workspaces" size="md" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label caption>সার্কেল</q-item-label>
                            <q-item-label class="text-weight-medium text-wrap">{{ user.circle?.data?.name || "N/A" }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-separator inset />

                        <q-item>
                          <q-item-section avatar>
                            <q-avatar color="indigo-1" text-color="indigo-7" icon="map" size="md" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label caption>জেলা</q-item-label>
                            <q-item-label class="text-weight-medium text-wrap">{{ user.district?.data?.name || "N/A" }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>

                      <!-- Account Info List -->
                      <q-list bordered class="rounded-borders bg-white shadow-soft app-list">
                        <q-item-label header class="text-weight-bold text-indigo-9 text-subtitle1">অ্যাকাউন্ট তথ্য</q-item-label>
                        
                        <q-item>
                          <q-item-section avatar>
                            <q-avatar color="grey-2" text-color="grey-8" icon="badge" size="md" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label caption>ইউজার আইডি</q-item-label>
                            <q-item-label class="text-weight-medium">{{ user.member_id || "N/A" }}</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-separator inset />

                        <q-item>
                          <q-item-section avatar>
                            <q-avatar :color="user.verified_at ? 'green-1' : 'orange-1'" :text-color="user.verified_at ? 'positive' : 'warning'" icon="verified_user" size="md" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label caption>অ্যাকাউন্ট স্ট্যাটাস</q-item-label>
                            <q-item-label>
                              <q-badge :color="user.verified_at ? 'positive' : 'warning'" class="q-px-sm q-py-xs rounded-borders text-subtitle2">
                                {{ user.verified_at ? "যাচাইকৃত" : "অপেক্ষমান" }}
                              </q-badge>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>

                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </div>
          </div>
        </div>

        <!-- Sticky Bottom Bar for Mobile Only -->
        <div class="mobile-bottom-action-bar mobile-only shadow-up-3" v-if="tab === 'personal'">
          <q-btn color="indigo-7" class="full-width app-btn-large" unelevated icon="save" label="তথ্য সংরক্ষণ করুন" :loading="updatingProfile" @click="updateProfile" />
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

const $q = useQuasar();
const baseUrl = process.env.DEV_WEB_URL;

// Refs
const tab = ref("personal");
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
  updated_at: "",
  id: null,
  officer_joining_date: "",
  blood_group: "",
  social_media_link: "",
  educational_qualification: "",
  last_education_institution: "",
  spouse_profession: "",
});

// Editable form
const editForm = ref({
  name: "",
  name_bangla: "",
  email: "",
  mobile: "",
  designation: "",
  address: "",
  officer_joining_date: "",
  blood_group: "",
  social_media_link: "",
  educational_qualification: "",
  last_education_institution: "",
  spouse_profession: "",
});

// Original form data for comparison
const originalForm = ref({});

// Track changed fields
const changedFields = ref(new Set());

// Options
const designationOptions = [
  { label: "RO (Revenue Officer)", value: "RO" },
  { label: "ARO (Assistant Revenue Officer)", value: "ARO" },
];

const bloodGroupOptions = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
];

const photoFile = ref(null);
const photoPreview = ref(null);
const uploadingPhoto = ref(false);
const updatingProfile = ref(false);
const fileInput = ref(null);

// Methods
const fetchUserProfile = async () => {
  try {
    const { data } = await api.get("/v1/profile", {
      params: {
        include: "commissionerate,division,circle,district",
      },
    });
    user.value = data.data;

    // Store original data
    originalForm.value = {
      name: data.data.name,
      name_bangla: data.data.name_bangla,
      email: data.data.email,
      mobile: data.data.mobile,
      designation: data.data.designation,
      address: data.data.address,
      officer_joining_date: data.data.officer_joining_date || "",
      blood_group: data.data.blood_group || "",
      social_media_link: data.data.social_media_link || "",
      educational_qualification: data.data.educational_qualification || "",
      last_education_institution: data.data.last_education_institution || "",
      spouse_profession: data.data.spouse_profession || "",
    };

    // Initialize edit form with original data
    editForm.value = { ...originalForm.value };

    // Clear changed fields
    changedFields.value.clear();
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "প্রোফাইল লোড করতে ব্যর্থ হয়েছে",
      caption: error.message,
    });
  }
};

// Mark field as changed
const markFieldAsChanged = (fieldName) => {
  changedFields.value.add(fieldName);
};

// Trigger file upload
const triggerPhotoUpload = () => {
  fileInput.value.click();
};

// Handle photo selection
const handlePhotoSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      $q.notify({
        type: "negative",
        message: "শুধুমাত্র JPG, JPEG, PNG ফাইল আপলোড করা যাবে",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      $q.notify({
        type: "negative",
        message: "ছবির সাইজ 5MB এর বেশি হতে পারবে না",
      });
      return;
    }

    photoFile.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Cancel photo upload
const cancelUpload = () => {
  photoFile.value = null;
  photoPreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Upload photo
const uploadPhoto = async () => {
  if (!photoFile.value) return;

  try {
    uploadingPhoto.value = true;
    const formData = new FormData();
    formData.append("photo", photoFile.value);

    await api.post(`/v1/users/${user.value.id}/photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    $q.notify({
      message: "ছবি সফলভাবে আপডেট করা হয়েছে",
      color: "positive",
      icon: "check",
    });

    // নিজের data refresh
    await fetchUserProfile();
    cancelUpload();

    // Reload the page
    window.location.reload();
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "ছবি আপলোড করতে ব্যর্থ হয়েছে",
      caption: error.response?.data?.message || error.message,
    });
  } finally {
    uploadingPhoto.value = false;
  }
};

// Update profile - only send changed fields
const updateProfile = async () => {
  try {
    const hasChanges = Array.from(changedFields.value).some((field) => {
      return editForm.value[field] !== originalForm.value[field];
    });

    if (!hasChanges) {
      $q.notify({
        message: "কোনো তথ্য পরিবর্তন করা হয়নি",
        color: "info",
        icon: "info",
        timeout: 2000,
      });
      return;
    }

    updatingProfile.value = true;

    const payload = new URLSearchParams();
    payload.append("name", editForm.value.name);
    payload.append("name_bangla", editForm.value.name_bangla);
    payload.append("email", editForm.value.email);
    payload.append("mobile", editForm.value.mobile);
    payload.append("designation", editForm.value.designation);
    payload.append("address", editForm.value.address);

    const optionalFields = [
      "officer_joining_date",
      "blood_group",
      "social_media_link",
      "educational_qualification",
      "last_education_institution",
      "spouse_profession",
    ];

    optionalFields.forEach((field) => {
      if (changedFields.value.has(field)) {
        payload.append(field, editForm.value[field] || "");
      }
    });

    await api.patch(`/v1/users/${user.value.id}`, payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    $q.notify({
      message: "প্রোফাইল সফলভাবে আপডেট করা হয়েছে",
      color: "positive",
      icon: "check",
    });

    originalForm.value = { ...editForm.value };
    changedFields.value.clear();
    await fetchUserProfile();
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে",
      caption: error.response?.data?.message || error.message,
    });
  } finally {
    updatingProfile.value = false;
  }
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Initialize
onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
/* ========== GLOBAL RESPONSIVE UTILITIES ========== */
.app-profile-page {
  position: relative;
  min-height: 100vh;
  padding-bottom: 90px;
}

/* Background gradient overlapping effect */
.profile-header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 220px;
  background: linear-gradient(135deg, #275294 0%, #303f9f 100%);
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  z-index: 0;
}

.profile-content-wrapper {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
}

.desktop-header {
  padding-top: 10px;
}

/* ========== CARD & UI STYLES ========== */
.app-card {
  border-radius: 20px;
  overflow: hidden;
  background: white;
}

.shadow-soft {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0,0,0,0.02);
}

.rounded-8 {
  border-radius: 8px !important;
}

.text-wrap {
  word-wrap: break-word;
  white-space: normal;
}

/* ========== PROFILE IMAGE STYLES ========== */
.profile-avatar-section {
  position: relative;
}

.profile-image-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-top: -30px; 
}

.profile-avatar {
  border: 5px solid #ffffff;
  background: #ffffff;
  transition: transform 0.3s ease;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #9fa8da 0%, #5c6bc0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.profile-image-container:hover .profile-overlay {
  opacity: 1;
}

.verified-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: #10b981;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  z-index: 2;
}

/* ========== SEGMENTED TABS ========== */
.app-segmented-tabs {
  background: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
}

.border-bottom {
  border-bottom: 1px solid #f8fafc;
}

/* Fix for tab items collapsing text on top of icon */
.tab-item :deep(.q-tab__content) {
  flex-direction: row !important;
  align-items: center;
  padding: 0;
}

:deep(.q-tab) {
  min-height: 48px;
  transition: all 0.3s ease;
  padding: 0 16px;
}
:deep(.q-tab--active) {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* ========== FORM STYLES ========== */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.form-section.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
  margin-left: 2px;
}

/* App-like Input styling */
:deep(.app-input .q-field__control) {
  border-radius: 10px;
  transition: all 0.2s ease;
}

:deep(.app-input.q-field--focused .q-field__control) {
  border-color: #3949ab !important;
  box-shadow: 0 0 0 3px rgba(57, 73, 171, 0.1);
}

/* ========== ADMIN LIST (iOS Settings Style) ========== */
.app-list {
  border-color: #e2e8f0;
  border-radius: 16px;
}
:deep(.app-list .q-item) {
  padding: 14px 16px;
}
:deep(.app-list .q-item__label--caption) {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 4px;
}
:deep(.app-list .q-item__label:not(.q-item__label--caption)) {
  font-size: 15px;
  color: #1e293b;
}

/* ========== SAVE BUTTON & BOTTOM BAR ========== */
.save-btn {
  padding: 10px 32px;
  font-weight: 600;
  transition: all 0.3s ease;
}
.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(57, 73, 171, 0.25);
}

.desktop-only { display: block; }
.mobile-only { display: none; }

.mobile-bottom-action-bar {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  padding: 12px 16px;
  z-index: 2000;
  border-top: 1px solid #e2e8f0;
}

.app-btn-large {
  height: 52px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
}

/* ========== RESPONSIVE DESIGN ========== */

@media (max-width: 1023px) {
  .profile-header-bg { height: 180px; }
  .profile-avatar { width: 120px; height: 120px; }
  .form-grid { gap: 16px; }
}

@media (max-width: 767px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: block; }
  
  .profile-header-bg {
    height: 140px;
    border-radius: 0; 
  }

  .desktop-header {
    display: none; 
  }

  .profile-content-wrapper {
    padding-top: 50px; 
  }
  
  .app-card {
    border-radius: 16px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-container-padding {
    padding: 16px 12px 30px 12px;
  }

  .profile-avatar {
    width: 110px;
    height: 110px;
  }
  
  .verified-badge {
    width: 26px;
    height: 26px;
    bottom: 2px;
    right: 2px;
  }

  :deep(.q-tab) {
    min-height: 42px;
    padding: 0 8px;
  }

  :deep(.q-tab .q-icon) {
    font-size: 18px !important;
  }
  
  :deep(.q-tab span) {
    font-size: 13px !important;
  }
}
</style>