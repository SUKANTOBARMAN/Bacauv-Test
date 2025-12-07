<template>
  <q-layout view="hHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md bg-grey-1">
        <q-card flat class="bg-indigo-8 text-white q-mb-md rounded-borders-md">
          <q-card-section>
            <div class="text-h4">
              <q-icon name="account_circle" class="q-mr-sm" />
              প্রোফাইল
            </div>
            <div class="text-subtitle1">আপনার ব্যক্তিগত এবং প্রশাসনিক তথ্য</div>
          </q-card-section>
        </q-card>

        <div class="row q-col-gutter-md">
          
          <div class="col-md-4 col-sm-12 col-xs-12">
            <q-card class="shadow-6 rounded-borders-md">
              <q-card-section class="bg-teal-1">
                <div class="text-h6 text-teal-8 text-center">
                  <q-icon name="photo" class="q-mr-sm" />
                  প্রোফাইল ছবি
                </div>
              </q-card-section>
              <q-card-section>
                <div class="flex flex-center q-mt-sm">
                  <q-avatar size="200px" class="profile-avatar shadow-1">
                    <img 
                      v-if="user.photo || photoPreview" 
                      :src="photoPreview || `${baseUrl}/storage/${user.photo}`" 
                      alt=""
                    >
                    <q-icon v-else name="person" size="90px" color="grey-6" />
                  </q-avatar>
                </div>

                <div class="q-mt-md">
                  <q-file
                    v-model="photoFile"
                    label="ছবি নির্বাচন করুন"
                    accept=".jpg,.jpeg,.png"
                    outlined
                    dense
                    color="teal"
                    @update:model-value="handlePhotoSelect"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>

                  <q-btn
                    v-if="photoPreview"
                    label="ছবি আপলোড করুন"
                    color="teal-7"
                    class="full-width text-white q-mt-sm"
                    :loading="uploadingPhoto"
                    @click="uploadPhoto"
                    icon="cloud_upload"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-md-8 col-sm-12 col-xs-12">
            <q-card class="shadow-6 rounded-borders-md">
              <q-tabs
                v-model="tab"
                dense
                class="text-grey-7"
                active-color="indigo-8"
                indicator-color="indigo-8"
                align="justify"
                narrow-indicator
              >
                <q-tab name="personal" icon="person_outline" label="ব্যক্তিগত তথ্য" />
                <q-tab name="admin" icon="account_tree" label="প্রশাসনিক তথ্য" />
              </q-tabs>

              <q-separator />

              <q-tab-panels v-model="tab" animated>
                
                <q-tab-panel name="personal" class="q-pa-md">
                  <q-form
                    @submit.prevent="updateProfile"
                    class="q-gutter-md"
                  >
                    <div class="text-h6 text-indigo-8 q-mb-md">আপনার ব্যক্তিগত বিবরণ</div>
                    
                    <div class="row q-col-gutter-md">
                      <div class="col-md-6 col-sm-12 col-xs-12">
                        <q-input
                          outlined
                          v-model="editForm.name"
                          label="নাম (ইংরেজি)"
                          readonly
                          bg-color="grey-2"
                        />
                      </div>
                      <div class="col-md-6 col-sm-12 col-xs-12">
                        <q-input
                          outlined
                          v-model="editForm.name_bangla"
                          label="নাম (বাংলা)"
                          readonly
                          bg-color="grey-2"
                        />
                      </div>
                    </div>

                    <div class="row q-col-gutter-md">
                      <div class="col-md-6 col-sm-12 col-xs-12">
                        <q-input
                          outlined
                          v-model="editForm.email"
                          label="ইমেইল"
                          type="email"
                          readonly
                          bg-color="grey-2"
                        />
                      </div>
                      <div class="col-md-6 col-sm-12 col-xs-12">
                        <q-input
                          outlined
                          v-model="editForm.mobile"
                          label="মোবাইল নম্বর"
                          mask="###########"
                          readonly
                          bg-color="grey-2"
                        />
                      </div>
                    </div>

                    <div class="row q-col-gutter-md">
                      <div class="col-md-6 col-sm-12 col-xs-12">
                        <q-select
                          outlined
                          v-model="editForm.designation"
                          label="পদবি"
                          :options="designationOptions"
                          option-value="value"
                          option-label="label"
                          emit-value
                          map-options
                          color="indigo"
                        />
                      </div>
                      <div class="col-md-6 col-sm-12 col-xs-12">
                        <q-input
                          outlined
                          v-model="editForm.address"
                          label="ঠিকানা"
                          color="indigo"
                        />
                      </div>
                    </div>

                    <div class="row q-col-gutter-md">
                      <div class="col-md-6 col-sm-12 col-xs-12">
                        <q-input
                          outlined
                          :model-value="formatDate(user.dob)"
                          label="জন্ম তারিখ"
                          readonly
                          bg-color="grey-2"
                        />
                      </div>
                      <div class="col-md-6 col-sm-12 col-xs-12">
                        <q-input
                          outlined
                          :model-value="formatDate(user.verified_at)"
                          label="যাচাইকরণ তারিখ"
                          readonly
                          bg-color="grey-2"
                        />
                      </div>
                    </div>

                    <div class="q-mt-lg text-right">
                      <q-btn
                        label="আপডেট করুন"
                        type="submit"
                        color="indigo-8"
                        size="lg"
                        class="text-white"
                        :loading="updatingProfile"
                        icon="save"
                      />
                    </div>
                  </q-form>
                </q-tab-panel>

                <q-tab-panel name="admin" class="q-pa-md">
                  <div class="text-h6 text-teal-8 q-mb-md">প্রশাসনিক তথ্য (পরিবর্তনযোগ্য নয়)</div>

                  <div class="q-gutter-md">
                    <div class="row q-col-gutter-md">
                      <div class="col-md-6 col-sm-12 col-xs-12">
                        <q-input
                          outlined
                          :model-value="user.commissionerate?.data?.name || 'N/A'"
                          label="কমিশনারেট"
                          readonly
                          bg-color="grey-2"
                        />
                      </div>
                      <div class="col-md-6 col-sm-12 col-xs-12">
                        <q-input
                          outlined
                          :model-value="user.division?.data?.name || 'N/A'"
                          label="ডিভিশন"
                          readonly
                          bg-color="grey-2"
                        />
                      </div>
                    </div>

                    <div class="row q-col-gutter-md">
                      <div class="col-md-6 col-sm-12 col-xs-12">
                        <q-input
                          outlined
                          :model-value="user.circle?.data?.name || 'N/A'"
                          label="সার্কেল"
                          readonly
                          bg-color="grey-2"
                        />
                      </div>
                      <div class="col-md-6 col-sm-12 col-xs-12">
                        <q-input
                          outlined
                          :model-value="user.district?.data?.name || 'N/A'"
                          label="জেলা"
                          readonly
                          bg-color="grey-2"
                        />
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
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// New ref for handling tabs
const tab = ref("personal");

// User data
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
});

// Edit form
const editForm = ref({
  name: "",
  name_bangla: "",
  email: "",
  mobile: "",
  designation: "",
  address: "",
});

// Designation options
const designationOptions = [
  { label: "RO (Revenue Officer)", value: "RO", icon: "badge", color: "blue" },
  {
    label: "ARO (Assistant Revenue Officer)",
    value: "ARO",
    icon: "assistant",
    color: "green",
  },
];

// Photo upload
const photoFile = ref(null);
const photoPreview = ref(null);
const uploadingPhoto = ref(false);
const updatingProfile = ref(false);

// Fetch user profile
const fetchUserProfile = async () => {
  try {
    const { data } = await api.get("/v1/profile", {
      params: {
        include: "commissionerate,division,circle,district",
      },
    });
    user.value = data.data;
    // Initialize edit form with current values
    editForm.value = {
      name: data.data.name,
      name_bangla: data.data.name_bangla,
      email: data.data.email,
      mobile: data.data.mobile,
      designation: data.data.designation,
      address: data.data.address,
    };
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "প্রোফাইল লোড করতে ব্যর্থ হয়েছে",
      caption: error.message,
    });
  }
};

// Handle photo selection
const handlePhotoSelect = (file) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    photoPreview.value = null;
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
      message: "ছবি সফলভাবে আপলোড করা হয়েছে",
      color: "positive",
      icon: "check",
    });

    // Refresh user data to show new photo
    await fetchUserProfile();
    photoFile.value = null;
    photoPreview.value = null;
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

// Update profile
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

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Initialize component
onMounted(() => {
  fetchUserProfile();
});
</script>

<style scoped>
.profile-avatar {
  /* Teal color border for a professional look */
  border: 5px solid #009688; 
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.2);
}

.rounded-borders-md {
  border-radius: 8px;
}

.q-avatar {
  border: 3px solid #e0e0e0;
} 
/* Ensure responsiveness on smaller screens */
.q-tab-panel {
  padding: 16px;
}
</style>