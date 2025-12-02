<template>
  <q-card flat bordered class="q-mb-md">
    <q-card-section class="row items-center">
      <div class="text-h6">Personal Information</div>
      <q-space />
      <div class="col-auto">
        <q-btn
          color="primary"
          :label="personalEditMode ? 'Save Changes' : 'Edit Info'"
          @click="togglePersonalEditMode"
          :loading="personalLoading"
        />
        <q-btn
          v-if="personalEditMode"
          flat
          color="negative"
          label="Cancel"
          class="q-ml-sm"
          @click="cancelPersonalEdit"
          :disabled="personalLoading"
        />
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div v-if="loading" class="text-center q-pa-md">
        <q-spinner color="primary" size="3em" />
        <div class="q-mt-sm">Loading personal information...</div>
      </div>
      <div v-else class="row q-col-gutter-md">
        <div class="col-md-6 col-sm-12">
          <q-input
            outlined
            v-model="employeeData.name"
            label="Name"
            :readonly="!personalEditMode"
          />
        </div>
        <div class="col-md-6 col-sm-12">
          <q-input
            outlined
            v-model="employeeData.dob"
            label="Date of Birth"
            type="date"
            :readonly="!personalEditMode"
          />
        </div>
        <div class="col-md-6 col-sm-12">
          <q-input
            outlined
            v-model="employeeData.fatherName"
            label="Father's Name"
            :readonly="!personalEditMode"
          />
        </div>
        <div class="col-md-6 col-sm-12">
          <q-input
            outlined
            v-model="employeeData.motherName"
            label="Mother's Name"
            :readonly="!personalEditMode"
          />
        </div>
        <div class="col-md-6 col-sm-12">
          <q-input
            outlined
            v-model="employeeData.wifeName"
            label="Wife's Name"
            :readonly="!personalEditMode"
          />
        </div>
        <div class="col-md-6 col-sm-12">
          <q-select
            outlined
            v-model="employeeData.religion"
            :options="['Islam', 'Hinduism', 'Christianity', 'Buddhism']"
            label="Religion"
            :readonly="!personalEditMode"
          />
        </div>
        <div class="col-md-6 col-sm-12">
          <q-select
            outlined
            v-model="employeeData.gender"
            :options="['Male', 'Female', 'Others']"
            label="Gender"
            :readonly="!personalEditMode"
          />
        </div>
        <div class="col-md-6 col-sm-12">
          <q-input
            outlined
            v-model="employeeData.address"
            label="Address"
            :readonly="!personalEditMode"
          />
        </div>
        <div class="col-md-6 col-sm-12">
          <q-input
            outlined
            v-model="employeeData.mobile"
            label="Phone number"
            type="tel"
            :readonly="!personalEditMode"
          />
        </div>
        <div class="col-md-6 col-sm-12">
          <q-input
            outlined
            v-model="employeeData.nid"
            label="NID Number"
            type="number"
            :readonly="!personalEditMode"
          />
        </div>
        <div class="col-md-6 col-sm-12">
          <q-select
            outlined
            v-model="employeeData.blood_group"
            label="Blood Group"
            :options="['A+', 'A-', 'O+', 'O-', 'B+', 'B-', 'AB+', 'AB-']"
            :readonly="!personalEditMode"
          />
        </div>
        <div class="col-md-6 col-sm-12">
          <q-select
            outlined
            v-model="employeeData.designationId"
            :options="designationOptions"
            label="Designation"
            option-label="name"
            option-value="id"
            emit-value
            map-options
            :readonly="!personalEditMode"
            :loading="designationLoading"
            :disable="designationLoading"
          />
        </div>
        <div v-if="personalEditMode" class="col-12">
          <q-file
            outlined
            label="Upload New Picture"
            v-model="newImage"
            accept="image/*"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute } from 'vue-router';
import { api } from 'boot/axios';

const $q = useQuasar();
const route = useRoute();

const props = defineProps({
  employee: { type: Object, required: true },
  editMode: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['update:editMode', 'update:loading', 'update:employee']);

const newImage = ref(null);
const designations = ref([]);
const designationLoading = ref(false);
const personalEditMode = ref(false);
const personalLoading = ref(false);
const employeeData = ref({
  name: '',
  dob: '',
  fatherName: '',
  motherName: '',
  wifeName: '',
  religion: '',
  gender: '',
  address: '',
  mobile: '',
  nid: '',
  blood_group: '',
  joiningDate: '',
  designationId: '',
  designationName: '',
  imageId: null, // Add imageId to track current profile picture
});
const originalEmployeeData = ref(null);

const employeeId = computed(() => route.params.id);

const designationOptions = computed(() => {
  if (personalEditMode.value) {
    return designations.value;
  }
  if (employeeData.value.designationId && employeeData.value.designationName) {
    return [{ id: employeeData.value.designationId, name: employeeData.value.designationName }];
  }
  return [];
});

const fetchDesignationById = async (id) => {
  if (!id) return null;
  designationLoading.value = true;
  try {
    const response = await api.get(`/v1/categories/?search=id:${id}`);
    return response.data.data || null;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to load designation details' });
    return null;
  } finally {
    designationLoading.value = false;
  }
};

const fetchAllDesignations = async () => {
  designationLoading.value = true;
  try {
    const response = await api.get('/v1/categories/?search=type:designation');
    designations.value = response.data.data;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Failed to load designations list' });
  } finally {
    designationLoading.value = false;
  }
};

// Update fetchEmployeeData to include imageId
const fetchEmployeeData = async () => {
  try {
    emit('update:loading', true);
    personalLoading.value = true;
    if (!employeeId.value) throw new Error('No employee ID found in route');

    const response = await api.get(`/v1/employees/${employeeId.value}?include=user`);
    const apiData = response.data.data;
    const userData = apiData.user.data;
    const additionalInfo = apiData.additional_info || {};

    const newEmployeeData = {
      name: userData.name || '',
      mobile: userData.mobile || '',
      nid: apiData.nid || '',
      gender: apiData.gender || '',
      dob: apiData.dob ? apiData.dob.split('T')[0] : '',
      religion: apiData.religion || '',
      blood_group: apiData.blood_group || '',
      fatherName: additionalInfo.fatherName || '',
      motherName: additionalInfo.motherName || '',
      wifeName: additionalInfo.wifeName || '',
      address: additionalInfo.address || '',
      joiningDate: additionalInfo.joiningDate || '',
      designationId: apiData.designation_id || '',
      designationName: '',
      imageId: apiData.image_id || null, // Add imageId from API response
    };

    if (newEmployeeData.designationId) {
      const designation = await fetchDesignationById(newEmployeeData.designationId);
      if (designation && designation.length > 0) {
        newEmployeeData.designationName = designation[0].name;
      }
    }

    employeeData.value = newEmployeeData;
    originalEmployeeData.value = JSON.parse(JSON.stringify(newEmployeeData));
    emit('update:employee', newEmployeeData);

    if (personalEditMode.value) await fetchAllDesignations();
  } catch (error) {
    console.error('Error fetching employee data:', error.response?.data || error.message);
    $q.notify({ 
      type: 'negative', 
      message: error.response?.data?.message || 'Failed to load employee data' 
    });
  } finally {
    emit('update:loading', false);
    personalLoading.value = false;
  }
};

const togglePersonalEditMode = async () => {
  if (!personalEditMode.value) {
    originalEmployeeData.value = JSON.parse(JSON.stringify(employeeData.value));
    personalEditMode.value = true;
    await fetchAllDesignations();
  } else {
    try {
      personalLoading.value = true;
      await saveChanges();
      personalEditMode.value = false;
      $q.notify({ type: 'positive', message: 'Personal information updated successfully' });
    } catch (error) {
      console.error('Error saving personal info:', error);
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Failed to update personal information',
      });
    } finally {
      personalLoading.value = false;
    }
  }
};

const cancelPersonalEdit = () => {
  employeeData.value = { ...originalEmployeeData.value };
  newImage.value = null;
  personalEditMode.value = false;
  emit('update:employee', employeeData.value);
};




const deleteCurrentPhoto = async () => {
  if (!employeeData.value.imageId) return true; // No photo to delete
  
  try {
    await api.delete(`/v1/files/${employeeData.value.imageId}`);
    return true;
  } catch (error) {
    console.error('Error deleting photo:', error.response || error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to delete current photo'
    });
    return false;
  }
};

const uploadPhoto = async () => {
  if (!newImage.value) return null;

  try {
    // First delete the current photo if it exists
    if (employeeData.value.imageId) {
      const deleted = await deleteCurrentPhoto();
      if (!deleted) return null;
    }

    const formData = new FormData();
    formData.append('title', 'Employee Profile Picture');
    formData.append('file', newImage.value);
    formData.append('owner_id', employeeId.value);
    formData.append('owner_type', 'employee');

    const response = await api.post('/v1/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.data.id;
  } catch (error) {
    console.error('Error uploading photo:', error.response || error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to upload employee photo'
    });
    return null;
  }
};



async function saveChanges() {
  try {
    personalLoading.value = true;
    if (!employeeId.value) throw new Error('No employee ID found');

    // Upload photo if a new image is selected
    let fileId = null;
    if (newImage.value) {
      fileId = await uploadPhoto();
    }

    const additionalInfo = {
      fatherName: employeeData.value.fatherName,
      motherName: employeeData.value.motherName,
      wifeName: employeeData.value.wifeName,
      address: employeeData.value.address,
      joiningDate: employeeData.value.joiningDate,
    };

    // Add file ID to payload if photo was uploaded successfully
    const payload = {
      name: employeeData.value.name,
      mobile: employeeData.value.mobile,
      nid: employeeData.value.nid,
      designation_id: employeeData.value.designationId,
      gender: employeeData.value.gender,
      dob: employeeData.value.dob,
      religion: employeeData.value.religion,
      blood_group: employeeData.value.blood_group,
      additional_info: additionalInfo,
    };

    // Add profile image ID if available
    if (fileId) {
      payload.image_id = fileId; // Make sure this matches what your API expects
    }
    const response = await api.patch(
      `/v1/employees/${employeeId.value}`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Reset the newImage after successful upload
    newImage.value = null;
    
    await fetchEmployeeData();
    return response.data;
  } catch (error) {
    console.error('Error saving employee data:', error.response?.data || error.message);
    throw error;
  } finally {
    personalLoading.value = false;
  }
}


  watch(() => route.params.id, () => {
    if (route.name === 'employee-edit' || route.name === 'employee-view') {
      fetchEmployeeData();
    }
  });

  watch(() => props.editMode, (newVal) => {
    if (newVal) fetchAllDesignations();
  });

  watch(employeeData, (newValue) => {
    emit('update:employee', newValue);
  }, { deep: true, immediate: true });

  defineExpose({ saveChanges });

  onMounted(() => {
    fetchEmployeeData();
  });
</script>