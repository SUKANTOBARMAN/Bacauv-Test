<template>
  <q-page class="q-pa-sm bg-white">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-10 col-md-11 col-sm-12 col-xs-12 q-px-sm" style="margin: auto">
        <q-card class="no-shadow" bordered style="margin-top: 30px">
          <q-card-section>
            <div class="text-h4 text-grey-8 text-center q-mb-md">Profile</div>

            <!-- Profile Header -->
            <div class="row items-center q-mb-lg">
              <div class="col-auto">
                <q-avatar size="120px">
                  <img :src="employeePhotoUrl">
                </q-avatar>
              </div>
              <div class="col q-pl-md">
                <div class="text-h5">{{ employee.name || 'No Name' }}</div>
                <div class="text-subtitle1">{{employee.designation || 'No Designation' }}</div>
                <div class="text-caption text-grey-7">
                  ID: {{ employee.nid || 'Not Available' }}
                </div>
              </div>
            </div>

            <!-- Personal Information -->
            <EmployeePersonalInfo
              ref="personalInfo"
              v-model:employee="employee"
              :editMode="personalEditMode"
              @saved="handlePersonalInfoSaved"
            />

            <!-- Job Information with its own edit button -->
            <EmployeeSalaryInfo
              ref="salaryInfo"
              v-model:employee="employee"
              :editMode="salaryEditMode"
              @saved="handleSalaryInfoSaved"
            />
            
            <!-- Transfer History -->
            <EmployeeTransfers
              :employeeId="employeeId"
              :editMode="false"
            />

            <!-- Training Information -->
            <EmployeeTrainings
              :employeeId="employeeId"
              :editMode="false"
            />

            <!-- Annual Confidential Report -->
            <EmployeeACRs
              :employeeId="employeeId"
              :editMode="false"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useEmployeeStore } from 'src/stores/employeeStore';
import { api } from 'boot/axios';
import EmployeePersonalInfo from './EmployeePersonalInfo.vue';
import EmployeeSalaryInfo from './EmployeeSalaryInfo.vue';
import EmployeeTransfers from './EmployeeTransfers.vue';
import EmployeeTrainings from './EmployeeTrainings.vue';
import EmployeeACRs from './EmployeeACRs.vue';

const $q = useQuasar();
const employeeStore = useEmployeeStore();
const personalInfo = ref(null);
const salaryInfo = ref(null);

// Reactive state
const employee = ref({
    id:"",
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
  imageUrl: '',
  blood_group: '',
  designation: '',
  joiningDate: '',
  salaryScale: '',
  basicSalary: '',
  district: '',
  upazila: '',
  trainingName: '',
  trainingStart: '',
  trainingEnd: '',
  Acr: '',
  fileUrl: '',
});

const employeeId = employeeStore.getEmployeeId;
const personalEditMode = ref(false);
const salaryEditMode = ref(false);
const personalLoading = ref(false);
const salaryLoading = ref(false);
const originalPersonalData = ref({});
const originalSalaryData = ref({});

// Utility Functions
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const fetchEmployeeData = async () => {
  try {
    personalLoading.value = true;
    const response = await api.get(`/v1/employees/${employeeId}?include=user`);

    const apiData = response.data.data;
    const userData = apiData.user.data;
    // Handle additionalInfo safely
    const additionalInfo = typeof apiData.additional_info === 'string' 
      ? JSON.parse(apiData.additional_info || '{}')
      : (apiData.additional_info || {});

    // Get designation name if available
    let designationName = '';
    if (apiData.designation_id) {
      try {
        const designationResponse = await api.get(`/v1/categories/?search=id:${apiData.designation_id}`);
        if (designationResponse.data.data && designationResponse.data.data.length > 0) {
          designationName = designationResponse.data.data[0].name;
        }
      } catch (designationError) {
        console.error('Error fetching designation:', designationError);
      }
    }

    employee.value = {
      ...employee.value,
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
      designation: apiData.designation || '',
      designationId: apiData.designation_id || '',
      designationName: designationName,
    };
  } catch (error) {
    console.error('Error fetching employee data:', error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to load employee data',
    });
  } finally {
    personalLoading.value = false;
  }
};

// Add this reactive reference
const employeePhotoUrl = ref('https://cdn.quasar.dev/img/boy-avatar.png');

// Modify your fetchEmployeePhoto function to update the ref
const fetchEmployeePhoto = async () => {
  try {
    const { data } = await api.get(
      `/v1/files?searchJoin=and&search=owner_type:employee;owner_id:${employeeId}`
    );
    if (data.data.length > 0) {
      employeePhotoUrl.value = `https://yshr_app.dyd-govbd.com/storage/${data.data[0].path}`;
    }
  } catch (error) {
    console.error("Error fetching employee photo:", error);
  }
};

onMounted(() => {
  fetchEmployeeData();
  fetchEmployeePhoto();
});
</script>