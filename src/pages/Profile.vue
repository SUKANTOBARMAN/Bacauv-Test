<template>
  <q-layout view="hHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-lg bg-grey-2">
        <!-- Page Header -->
        <div class="row items-center justify-between q-mb-xl">
          <div>
            <div class="text-h4 text-weight-bold text-indigo-9">প্রোফাইল</div>
            <div class="text-subtitle1 text-grey-7">আপনার ব্যক্তিগত এবং প্রশাসনিক তথ্য</div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="row q-col-gutter-xl">
          <!-- Left Side - Profile Picture -->
          <div class="col-md-4 col-sm-12">
            <q-card class="shadow-5 rounded-borders" style="border-radius: 16px;">
              <q-card-section class="bg-indigo-8 text-white">
                <div class="text-h6 text-center">
                  <q-icon name="photo" class="q-mr-sm" />
                  প্রোফাইল ছবি
                </div>
              </q-card-section>
              
              <q-card-section class="text-center q-pa-xl">
                <!-- Clickable Profile Picture -->
                <div class="profile-image-container q-mb-lg" @click="triggerPhotoUpload">
                  <q-avatar size="200px" class="profile-avatar">
                    <img 
                      v-if="user.photo || photoPreview" 
                      :src="photoPreview || `${baseUrl}${user.photo}`" 
                      alt="Profile"
                      class="profile-img"
                    >
                    <div v-else class="profile-placeholder">
                      <q-icon name="person" size="90px" color="grey-6" />
                    </div>
                    
                    <!-- Hover Overlay -->
                    <div class="profile-overlay">
                      <q-icon name="camera_alt" size="40px" />
                      <div class="text-subtitle2 q-mt-sm">ছবি পরিবর্তন করুন</div>
                    </div>
                  </q-avatar>
                  
                  <!-- Upload Status Badge -->
                  <div v-if="user.verified_at" class="verified-badge">
                    <q-icon name="verified" size="16px" />
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
                <div v-if="photoPreview" class="upload-actions">
                  <q-linear-progress 
                    v-if="uploadingPhoto" 
                    indeterminate 
                    color="indigo-7" 
                    class="q-mb-md"
                  />
                  
                  <div class="row q-col-gutter-sm">
                    <div class="col-6">
                      <q-btn
                        label="আপলোড"
                        color="indigo-7"
                        class="full-width text-white"
                        :loading="uploadingPhoto"
                        @click="uploadPhoto"
                        icon="cloud_upload"
                      />
                    </div>
                    <div class="col-6">
                      <q-btn
                        label="বাতিল"
                        color="negative"
                        outline
                        class="full-width"
                        @click="cancelUpload"
                      />
                    </div>
                  </div>
                </div>

                <!-- User Quick Info -->
                <div class="q-mt-xl">
                  <div class="text-h6 text-weight-bold text-grey-9">{{ user.name_bangla || user.name }}</div>
                  <div class="text-subtitle1 text-indigo-7 q-mb-md">{{ getDesignationLabel(user.designation) }}</div>
                  
                  <div class="text-left q-gutter-y-md">
                    <div class="row items-center">
                      <q-icon name="email" size="sm" color="grey-6" class="q-mr-sm" />
                      <div class="text-caption text-grey-7">{{ user.email }}</div>
                    </div>
                    <div class="row items-center">
                      <q-icon name="phone" size="sm" color="grey-6" class="q-mr-sm" />
                      <div class="text-caption text-grey-7">{{ user.mobile || 'N/A' }}</div>
                    </div>
                    <div class="row items-center">
                      <q-icon name="calendar_today" size="sm" color="grey-6" class="q-mr-sm" />
                      <div class="text-caption text-grey-7">{{ formatDate(user.created_at) }}</div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Right Side - Profile Information -->
          <div class="col-md-8 col-sm-12">
            <q-card class="shadow-5 rounded-borders" style="border-radius: 16px;">
              <!-- Tabs -->
              <q-tabs
                v-model="tab"
                dense
                class="text-grey-7 q-mt-sm"
                active-color="indigo-8"
                indicator-color="indigo-8"
                align="left"
                narrow-indicator
              >
                <q-tab name="personal" icon="person" label="ব্যক্তিগত তথ্য" />
                <q-tab name="admin" icon="account_balance" label="প্রশাসনিক তথ্য" />
              </q-tabs>

              <q-separator />

              <!-- Tab Panels -->
              <q-tab-panels v-model="tab" animated class="q-pa-none">
                <!-- Personal Information -->
                <q-tab-panel name="personal">
                  <div class="q-pa-lg">
                    <div class="section-header q-mb-lg">
                      <q-icon name="person" size="24px" color="indigo-7" class="q-mr-sm" />
                      <span class="text-h5 text-weight-bold text-grey-9">ব্যক্তিগত তথ্য</span>
                    </div>

                    <div class="form-grid">
                      <!-- Row 1: Names -->
                      <div class="form-section">
                        <div class="form-label">নাম (ইংরেজি)</div>
                        <q-input
                          outlined
                          v-model="editForm.name"
                          readonly
                          dense
                          bg-color="grey-3"
                        />
                      </div>

                      <div class="form-section">
                        <div class="form-label">নাম (বাংলা)</div>
                        <q-input
                          outlined
                          v-model="editForm.name_bangla"
                          readonly
                          dense
                          bg-color="grey-3"
                        />
                      </div>

                      <!-- Row 2: Contact -->
                      <div class="form-section">
                        <div class="form-label">ইমেইল</div>
                        <q-input
                          outlined
                          v-model="editForm.email"
                          type="email"
                          readonly
                          dense
                          bg-color="grey-3"
                        />
                      </div>

                      <div class="form-section">
                        <div class="form-label">মোবাইল নম্বর</div>
                        <q-input
                          outlined
                          v-model="editForm.mobile"
                          mask="###########"
                          readonly
                          dense
                          bg-color="grey-3"
                        />
                      </div>

                      <!-- Row 3: Designation -->
                      <div class="form-section">
                        <div class="form-label">পদবি</div>
                        <q-select
                          outlined
                          v-model="editForm.designation"
                          :options="designationOptions"
                          option-value="value"
                          option-label="label"
                          emit-value
                          map-options
                          dense
                          color="indigo"
                        />
                      </div>

                      <div class="form-section">
                        <div class="form-label">যোগদানের তারিখ</div>
                        <q-input
                          outlined
                          v-model="editForm.officer_joining_date"
                          dense
                          color="indigo"
                          class="full-width"
                          :rules="['date']"
                        >
                          <template v-slot:append>
                            <q-icon name="event" class="cursor-pointer">
                              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-date v-model="editForm.officer_joining_date" mask="YYYY-MM-DD">
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-date>
                              </q-popup-proxy>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>

                      <!-- Row 4: Blood Group & Facebook -->
                      <div class="form-section">
                        <div class="form-label">রক্তের গ্রুপ</div>
                        <q-select
                          outlined
                          v-model="editForm.blood_group"
                          :options="bloodGroupOptions"
                          option-value="value"
                          option-label="label"
                          emit-value
                          map-options
                          dense
                          color="indigo"
                          class="full-width"
                          clearable
                        />
                      </div>

                      <div class="form-section">
                        <div class="form-label">Facebook ID</div>
                        <q-input
                          outlined
                          v-model="editForm.social_media_link"
                          dense
                          color="indigo"
                          class="full-width"
                          placeholder="https://facebook.com/username"
                        />
                      </div>

                      <!-- Row 5: Address -->
                      <div class="form-section full-width">
                        <div class="form-label">ঠিকানা</div>
                        <q-input
                          outlined
                          v-model="editForm.address"
                          dense
                          color="indigo"
                          autogrow
                          class="full-width"
                        />
                      </div>

                      <!-- Row 6: Education -->
                      <div class="form-section">
                        <div class="form-label">শিক্ষাগত যোগ্যতা (সর্বোচ্চ)</div>
                        <q-input
                          outlined
                          v-model="editForm.educational_qualification"
                          dense
                          color="indigo"
                          class="full-width"
                          placeholder="যেমন: মাস্টার্স, বিএসসি ইঞ্জিনিয়ারিং"
                        />
                      </div>

                      <div class="form-section">
                        <div class="form-label">শিক্ষাপ্রতিষ্ঠান (সর্বোচ্চ)</div>
                        <q-input
                          outlined
                          v-model="editForm.last_education_institution"
                          dense
                          color="indigo"
                          class="full-width"
                          placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয়"
                        />
                      </div>

                      <!-- Row 7: Spouse Info -->
                      <div class="form-section">
                        <div class="form-label">স্বামী/স্ত্রীর পদবি</div>
                        <q-input
                          outlined
                          v-model="editForm.spouse_profession"
                          dense
                          color="indigo"
                          class="full-width"
                          placeholder="যেমন: সরকারি কর্মকর্তা, শিক্ষক"
                        />
                      </div>

                      <!-- Row 8: Dates (Read Only) -->
                      <div class="form-section">
                        <div class="form-label">জন্ম তারিখ</div>
                        <q-input
                          outlined
                          :model-value="formatDate(user.dob)"
                          readonly
                          dense
                          bg-color="grey-3"
                        />
                      </div>

                      <div class="form-section">
                        <div class="form-label">যাচাইকরণ তারিখ</div>
                        <q-input
                          outlined
                          :model-value="formatDate(user.verified_at)"
                          readonly
                          dense
                          bg-color="grey-3"
                        />
                      </div>
                    </div>

                    <!-- Save Button at Bottom of Personal Info -->
                    <div class="text-right q-mt-xl">
                      <q-btn
                        color="indigo-7"
                        class="text-white"
                        icon="save"
                        label="সংরক্ষণ করুন"
                        :loading="updatingProfile"
                        @click="updateProfile"
                      />
                    </div>
                  </div>
                </q-tab-panel>

                <!-- Administrative Information -->
                <q-tab-panel name="admin">
                  <div class="q-pa-lg">
                    <div class="section-header q-mb-lg">
                      <q-icon name="account_balance" size="24px" color="indigo-7" class="q-mr-sm" />
                      <span class="text-h5 text-weight-bold text-grey-9">প্রশাসনিক তথ্য</span>
                      <div class="text-caption text-grey-7 q-mt-xs"> (এই তথ্যগুলি পরিবর্তনযোগ্য নয়)</div>
                    </div>

                    <div class="admin-grid">
                      <!-- Administrative Hierarchy -->
                      <div class="admin-section">
                        <div class="admin-section-header">
                          <q-icon name="business" size="20px" color="indigo-6" class="q-mr-sm" />
                          <span class="text-subtitle1 text-weight-bold">প্রশাসনিক কাঠামো</span>
                        </div>
                        
                        <div class="hierarchy-grid">
                          <div class="hierarchy-item">
                            <div class="hierarchy-label">
                              <q-icon name="apartment" size="sm" class="q-mr-xs" />
                              কমিশনারেট
                            </div>
                            <div class="hierarchy-value">{{ user.commissionerate?.data?.name || 'N/A' }}</div>
                          </div>
                          
                          <div class="hierarchy-item">
                            <div class="hierarchy-label">
                              <q-icon name="account_tree" size="sm" class="q-mr-xs" />
                              ডিভিশন
                            </div>
                            <div class="hierarchy-value">{{ user.division?.data?.name || 'N/A' }}</div>
                          </div>
                          
                          <div class="hierarchy-item">
                            <div class="hierarchy-label">
                              <q-icon name="workspaces" size="sm" class="q-mr-xs" />
                              সার্কেল
                            </div>
                            <div class="hierarchy-value">{{ user.circle?.data?.name || 'N/A' }}</div>
                          </div>
                          
                          <div class="hierarchy-item">
                            <div class="hierarchy-label">
                              <q-icon name="map" size="sm" class="q-mr-xs" />
                              জেলা
                            </div>
                            <div class="hierarchy-value">{{ user.district?.data?.name || 'N/A' }}</div>
                          </div>
                        </div>
                      </div>

                      <!-- Account Information -->
                      <div class="admin-section">
                        <div class="admin-section-header">
                          <q-icon name="info" size="20px" color="indigo-6" class="q-mr-sm" />
                          <span class="text-subtitle1 text-weight-bold">অ্যাকাউন্ট তথ্য</span>
                        </div>
                        
                        <div class="account-grid">
                          <div class="account-item">
                            <div class="account-label">ইউজার আইডি</div>
                            <div class="account-value text-weight-bold">{{ user.member_id || 'N/A' }}</div>
                          </div>
                          
                          <div class="account-item">
                            <div class="account-label">অ্যাকাউন্ট স্ট্যাটাস</div>
                            <div class="account-value">
                              <q-badge 
                                :color="user.verified_at ? 'green' : 'orange'" 
                                class="status-badge"
                              >
                                {{ user.verified_at ? 'যাচাইকৃত' : 'অপেক্ষমান' }}
                              </q-badge>
                            </div>
                          </div>
                          
                          <div class="account-item">
                            <div class="account-label">রেজিস্ট্রেশন তারিখ</div>
                            <div class="account-value">{{ formatDate(user.created_at) }}</div>
                          </div>
                          
                          <div class="account-item">
                            <div class="account-label">সর্বশেষ আপডেট</div>
                            <div class="account-value">{{ formatDate(user.updated_at) }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </div>
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
  // New fields
  officer_joining_date: "",
  blood_group: "",
  social_media_link: "",
  educational_qualification: "",
  last_education_institution: "",
  spouse_profession: ""
});

const editForm = ref({
  name: "",
  name_bangla: "",
  email: "",
  mobile: "",
  designation: "",
  address: "",
  // New fields
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

    editForm.value = {
      name: data.data.name,
      name_bangla: data.data.name_bangla,
      email: data.data.email,
      mobile: data.data.mobile,
      designation: data.data.designation,
      address: data.data.address,
      // New fields
      officer_joining_date: data.data.officer_joining_date || "",
      blood_group: data.data.blood_group || "",
      social_media_link: data.data.social_media_link || "",
      educational_qualification: data.data.educational_qualification || "",
      last_education_institution: data.data.last_education_institution || "",
      spouse_profession: data.data.spouse_profession || ""
    };
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "প্রোফাইল লোড করতে ব্যর্থ হয়েছে",
      caption: error.message,
    });
  }
};

const triggerPhotoUpload = () => {
  fileInput.value.click();
};

const handlePhotoSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
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

const cancelUpload = () => {
  photoFile.value = null;
  photoPreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

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
      message: "ছবি সফলভাবে আপলোড করা হয়েছে",
      color: "positive",
      icon: "check",
    });

    await fetchUserProfile();
    cancelUpload();
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

const updateProfile = async () => {
  try {
    updatingProfile.value = true;

    const payload = new URLSearchParams();
    for (const key in editForm.value) {
      if (editForm.value[key] !== null && editForm.value[key] !== undefined) {
        payload.append(key, editForm.value[key]);
      }
    }

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

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getDesignationLabel = (designationValue) => {
  const found = designationOptions.find(opt => opt.value === designationValue);
  return found ? found.label : designationValue;
};

onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
/* Profile Image Styles */
.profile-image-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.profile-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
}

.profile-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
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

.profile-image-container:hover .profile-avatar {
  transform: scale(1.05);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.verified-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #10b981;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 3px solid white;
  z-index: 2;
}

.upload-actions {
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Form Styles */
.section-header {
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 2px solid #e0e0e0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.form-section {
  margin-bottom: 8px;
}

.form-section.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  display: block;
}

/* Admin Information Styles */
.admin-grid {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.admin-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.admin-section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.hierarchy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.hierarchy-item {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.hierarchy-item:hover {
  border-color: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
}

.hierarchy-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.hierarchy-value {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.account-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.account-item {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.account-item:hover {
  border-color: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
}

.account-label {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.account-value {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.status-badge {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
}

/* Tabs Styling */
:deep(.q-tab) {
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;
}

:deep(.q-tab--active) {
  color: #4f46e5;
  border-bottom: 3px solid #4f46e5;
}

:deep(.q-tab:hover) {
  background-color: rgba(79, 70, 229, 0.05);
}

:deep(.q-tabs__content) {
  border-bottom: 1px solid #e0e0e0;
}

/* Card Styling */
.q-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.q-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

/* Save Button Styling */
.text-right .q-btn {
  padding: 10px 24px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.text-right .q-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
}

/* Input field styling for better alignment */
:deep(.q-field--outlined .q-field__control) {
  border-radius: 8px;
}

:deep(.q-field--focused .q-field__control) {
  border-color: #4f46e5 !important;
}

/* Date picker styling */
:deep(.q-date) {
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 1023px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-section.full-width {
    grid-column: 1;
  }
  
  .hierarchy-grid,
  .account-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 599px) {
  .text-h4 {
    font-size: 1.5rem;
  }
  
  .text-h5 {
    font-size: 1.25rem;
  }
  
  .q-pa-lg {
    padding: 16px;
  }
  
  .profile-avatar {
    width: 160px;
    height: 160px;
  }
  
  .form-grid {
    gap: 16px;
  }
  
  .admin-section {
    padding: 16px;
  }
}

/* Animation for form sections */
.form-section {
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animation for form items */
.form-section:nth-child(1) { animation-delay: 0.1s; }
.form-section:nth-child(2) { animation-delay: 0.2s; }
.form-section:nth-child(3) { animation-delay: 0.3s; }
.form-section:nth-child(4) { animation-delay: 0.4s; }
.form-section:nth-child(5) { animation-delay: 0.5s; }
.form-section:nth-child(6) { animation-delay: 0.6s; }
.form-section:nth-child(7) { animation-delay: 0.7s; }
.form-section:nth-child(8) { animation-delay: 0.8s; }
.form-section:nth-child(9) { animation-delay: 0.9s; }
.form-section:nth-child(10) { animation-delay: 1.0s; }
.form-section:nth-child(11) { animation-delay: 1.1s; }
.form-section:nth-child(12) { animation-delay: 1.2s; }
</style>