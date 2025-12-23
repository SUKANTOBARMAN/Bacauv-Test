<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-gradient flex-center">
        <div class="registration-container">
          <q-card class="registration-card shadow-24 q-pa-lg" flat bordered>
            
            <q-card-section class="text-center q-pb-md">
              <div class="logo-container q-mb-md">
                <img src="../assets/logo.jpg" alt="Corporation Logo" class="corporation-logo">
              </div>
              <div class="text-subtitle2 text-grey-7">Create your Account</div>
            </q-card-section>

            <!-- Error Banner -->
            <q-card-section v-if="error" class="q-pt-none">
              <q-banner class="bg-negative text-white rounded-borders" dense>
                <template v-slot:avatar>
                  <q-icon name="error" />
                </template>
                {{ error }}
              </q-banner>
            </q-card-section>

            <!-- Registration Form -->
            <q-card-section>
              <q-form @submit.prevent="handleRegister" class="q-gutter-lg">
                
                <!-- Personal Information Section -->
                <div class="section-header">
                  <q-icon name="person" color="primary" size="24px" />
                  <span class="text-h6 text-weight-medium q-ml-sm text-primary">Personal Information</span>
                </div>
                
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      v-model="formData.name"
                      label="Full Name *"
                      lazy-rules
                      class="custom-input"
                      :rules="[(val) => !!val || 'Name is required']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="badge" color="primary" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      v-model="formData.name_bangla"
                      label="Full Name (Bangla)"
                      class="custom-input"
                    >
                      <template v-slot:prepend>
                        <q-icon name="badge" color="primary" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      v-model="formData.email"
                      label="Email Address *"
                      lazy-rules
                      type="email"
                      class="custom-input"
                      :rules="[
                        (val) => !!val || 'Email is required',
                        (val) => /.+@.+\..+/.test(val) || 'Email must be valid',
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="email" color="primary" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      v-model="formData.mobile"
                      label="Mobile Number *"
                      mask="###########"
                      lazy-rules
                      class="custom-input"
                      :rules="[
                        (val) => !!val || 'Mobile is required',
                        (val) => val.length === 11 || 'Mobile must be 11 digits',
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="phone" color="primary" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      v-model="formData.password"
                      label="Password *"
                      :type="showPassword ? 'text' : 'password'"
                      lazy-rules
                      class="custom-input"
                      :rules="[
                        (val) => !!val || 'Password is required',
                        (val) => val.length >= 6 || 'Password must be at least 6 characters'
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="lock" color="primary" />
                      </template>
                      <template v-slot:append>
                        <q-icon
                          :name="showPassword ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="showPassword = !showPassword"
                          color="grey-5"
                        />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      v-model="confirmPassword"
                      label="Confirm Password *"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      lazy-rules
                      class="custom-input"
                      :rules="[
                        (val) => !!val || 'Please confirm your password',
                        (val) => val === formData.password || 'Passwords do not match'
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="lock_outline" color="secondary" />
                      </template>
                      <template v-slot:append>
                        <q-icon
                          :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="showConfirmPassword = !showConfirmPassword"
                          color="grey-5"
                        />
                      </template>
                    </q-input>
                  </div>
                </div>

                <!-- Additional Personal Information -->
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      v-model="formData.dob"
                      label="Date of Birth *"
                      mask="####-##-##"
                      lazy-rules
                      class="custom-input"
                      :rules="[(val) => !!val || 'Date of Birth is required']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="cake" color="primary" />
                      </template>
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer" color="grey-5">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="formData.dob" mask="YYYY-MM-DD">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      v-model="formData.officer_joining_date"
                      label="Joining Date"
                      mask="####-##-##"
                      class="custom-input"
                    >
                      <template v-slot:prepend>
                        <q-icon name="date_range" color="primary" />
                      </template>
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer" color="grey-5">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-date v-model="formData.officer_joining_date" mask="YYYY-MM-DD">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat />
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-select
                      filled
                      v-model="formData.designation"
                      :options="designationOptions"
                      label="Designation *"
                      emit-value
                      map-options
                      class="custom-input"
                      :rules="[(val) => !!val || 'Designation is required']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="work" color="primary" />
                      </template>
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                          <q-item-section avatar>
                            <q-icon :name="scope.opt.icon" :color="scope.opt.color" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ scope.opt.label }}</q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-select
                      filled
                      v-model="formData.blood_group"
                      :options="bloodGroupOptions"
                      label="Blood Group"
                      emit-value
                      map-options
                      class="custom-input"
                    >
                      <template v-slot:prepend>
                        <q-icon name="favorite" color="primary" />
                      </template>
                    </q-select>
                  </div>
                </div>

                <!-- Address Section -->
                <q-input
                  filled
                  v-model="formData.address"
                  label="Address *"
                  lazy-rules
                  class="custom-input"
                  :rules="[(val) => !!val || 'Address is required']"
                >
                  <template v-slot:prepend>
                    <q-icon name="home" color="primary" />
                  </template>
                </q-input>

                <!-- Educational Information -->
                <div class="section-header q-mt-xl">
                  <q-icon name="school" color="teal" size="24px" />
                  <span class="text-h6 text-weight-medium q-ml-sm text-teal">Educational Information</span>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      v-model="formData.educational_qualification"
                      label="Educational Qualification"
                      class="custom-input"
                    >
                      <template v-slot:prepend>
                        <q-icon name="school" color="teal" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      v-model="formData.last_education_institution"
                      label="Last Education Institution"
                      class="custom-input"
                    >
                      <template v-slot:prepend>
                        <q-icon name="account_balance" color="teal" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <!-- Family Information -->
                <div class="section-header q-mt-xl">
                  <q-icon name="family_restroom" color="deep-orange" size="24px" />
                  <span class="text-h6 text-weight-medium q-ml-sm text-deep-orange">Family Information</span>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      v-model="formData.spouse_profession"
                      label="Spouse Profession"
                      class="custom-input"
                    >
                      <template v-slot:prepend>
                        <q-icon name="work_outline" color="deep-orange" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      v-model="formData.social_media_link"
                      label="Social Media ID"
                      class="custom-input"
                    >
                      <template v-slot:prepend>
                        <q-icon name="share" color="deep-orange" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <!-- Location Information Section -->
                <div class="section-header q-mt-xl">
                  <q-icon name="location_on" color="secondary" size="24px" />
                  <span class="text-h6 text-weight-medium q-ml-sm text-secondary">Location Information (Optional)</span>
                </div>
                
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-select
                      filled
                      v-model="formData.commissionerate_id"
                      :options="filteredCommissionerates"
                      option-label="name"
                      option-value="id"
                      label="Commissionerate"
                      emit-value
                      map-options
                      use-input
                      class="custom-input"
                      @filter="filterCommissionerates"
                      @update:model-value="loadDivisions"
                    >
                      <template v-slot:prepend>
                        <q-icon name="location_city" color="secondary" />
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No results
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>

                  <div class="col-12 col-sm-6">
                    <q-select
                      filled
                      v-model="formData.division_id"
                      :options="filteredDivisions"
                      option-label="name"
                      option-value="id"
                      label="Division"
                      emit-value
                      map-options
                      use-input
                      class="custom-input"
                      :disable="!formData.commissionerate_id"
                      @filter="filterDivisions"
                      @update:model-value="loadCircles"
                    >
                      <template v-slot:prepend>
                        <q-icon name="account_balance" color="secondary" />
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            {{
                              formData.commissionerate_id
                                ? 'No divisions found'
                                : 'Select commissionerate first'
                            }}
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-select
                      filled
                      v-model="formData.circle_id"
                      :options="filteredCircles"
                      option-label="name"
                      option-value="id"
                      label="Circle"
                      emit-value
                      map-options
                      use-input
                      class="custom-input"
                      :disable="!formData.division_id"
                      @filter="filterCircles"
                    >
                      <template v-slot:prepend>
                        <q-icon name="maps_home_work" color="secondary" />
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            {{
                              formData.division_id
                                ? 'No circles found'
                                : 'Select division first'
                            }}
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>

                  <div class="col-12 col-sm-6">
                    <q-select
                      filled
                      v-model="formData.district_id"
                      :options="filteredDistricts"
                      option-label="name"
                      option-value="id"
                      label="District"
                      emit-value
                      map-options
                      use-input
                      class="custom-input"
                      @filter="filterDistricts"
                    >
                      <template v-slot:prepend>
                        <q-icon name="map" color="secondary" />
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No districts found
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="row justify-between q-mt-xl q-pt-lg">
                  <q-btn
                    label="Back to Login"
                    to="/login"
                    color="grey-6"
                    flat
                    icon="arrow_back"
                    size="md"
                    no-caps
                    class="q-px-lg"
                  />
                  <q-btn
                    label="Create Account"
                    type="submit"
                    color="primary"
                    :loading="loading"
                    icon="how_to_reg"
                    size="md"
                    no-caps
                    class="q-px-xl"
                    rounded
                  />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();

const loading = ref(false);
const error = ref(null);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const confirmPassword = ref('');

// Form data
const formData = ref({
  name: '',
  name_bangla: '',
  email: '',
  mobile: '',
  password: '',
  designation: '',
  address: '',
  dob: '',
  officer_joining_date: '',
  blood_group: '',
  social_media_link: '',
  educational_qualification: '',
  last_education_institution: '',
  spouse_profession: '',
  role: 'subadmin',
  commissionerate_id: null,
  division_id: null,
  circle_id: null,
  district_id: null,
});

// Designation options
const designationOptions = [
  { label: 'RO (Revenue Officer)', value: 'RO', icon: 'badge', color: 'blue' },
  { label: 'ARO (Assistant Revenue Officer)', value: 'ARO', icon: 'assistant', color: 'green' },
];

// Blood group options
const bloodGroupOptions = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

// Location data
const commissionerates = ref([]);
const divisions = ref([]);
const circles = ref([]);
const districts = ref([]);

// Filtered options for search
const filteredCommissionerates = ref([]);
const filteredDivisions = ref([]);
const filteredCircles = ref([]);
const filteredDistricts = ref([]);

// Load initial data
onMounted(async () => {
  try {
    await loadCommissionerates();
    await loadDistricts();
  } catch (err) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load location data',
    });
  }
});

// Load commissionerates
const loadCommissionerates = async () => {
  const response = await api.get(
    '/v1/categories?limit=0&search=type:commissionerate'
  );
  commissionerates.value = response.data.data;
  filteredCommissionerates.value = commissionerates.value;
};

// Load divisions for selected commissionerate
const loadDivisions = async () => {
  if (!formData.value.commissionerate_id) return;

  const response = await api.get(
    `/v1/categories?limit=0&search=parent_id:${formData.value.commissionerate_id}`
  );
  divisions.value = response.data.data || [];
  filteredDivisions.value = divisions.value;
  formData.value.division_id = null;
  formData.value.circle_id = null;
};

// Load circles for selected division
const loadCircles = async () => {
  if (!formData.value.division_id) return;

  const response = await api.get(
    `/v1/categories?limit=0&search=parent_id:${formData.value.division_id}`
  );
  circles.value = response.data.data || [];
  filteredCircles.value = circles.value;
  formData.value.circle_id = null;
};

// Load all districts
const loadDistricts = async () => {
  const response = await api.get('/v1/categories?limit=0&search=type:district');
  districts.value = response.data.data;
  filteredDistricts.value = districts.value;
};

// Filter functions for searchable selects
const filterCommissionerates = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    filteredCommissionerates.value = commissionerates.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const filterDivisions = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    filteredDivisions.value = divisions.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const filterCircles = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    filteredCircles.value = circles.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const filterDistricts = (val, update) => {
  update(() => {
    const needle = val.toLowerCase();
    filteredDistricts.value = districts.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

// Handle registration
const handleRegister = async () => {
  try {
    loading.value = true;
    error.value = null;

    const params = new URLSearchParams();
    params.append('name', formData.value.name);
    params.append('name_bangla', formData.value.name_bangla || '');
    params.append('email', formData.value.email);
    params.append('mobile', formData.value.mobile);
    params.append('password', formData.value.password);
    params.append('designation', formData.value.designation);
    params.append('address', formData.value.address);
    params.append('dob', formData.value.dob);
    params.append('role', formData.value.role);
    
    // Optional fields - only append if they have value
    if (formData.value.officer_joining_date) {
      params.append('officer_joining_date', formData.value.officer_joining_date);
    }
    if (formData.value.blood_group) {
      params.append('blood_group', formData.value.blood_group);
    }
    if (formData.value.social_media_id) {
      params.append('social_media_link', formData.value.social_media_link);
    }
    if (formData.value.educational_qualification) {
      params.append('educational_qualification', formData.value.educational_qualification);
    }
    if (formData.value.last_education_institution) {
      params.append('last_education_institution', formData.value.last_education_institution);
    }
    if (formData.value.spouse_profession) {
      params.append('spouse_profession', formData.value.spouse_profession);
    }
    
    // Optional location fields
    if (formData.value.commissionerate_id) {
      params.append('commissionerate_id', formData.value.commissionerate_id);
    }
    if (formData.value.division_id) {
      params.append('division_id', formData.value.division_id);
    }
    if (formData.value.circle_id) {
      params.append('circle_id', formData.value.circle_id);
    }
    if (formData.value.district_id) {
      params.append('district_id', formData.value.district_id);
    }

    const response = await api.post('/v1/register', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    console.log('Registration response:', response.data);
    
    $q.notify({
      type: 'positive',
      message: 'Registration successful! Please login.',
      icon: 'check_circle',
      position: 'top',
      timeout: 3000
    });
    
    router.push('/login');
    
  } catch (err) {
    console.error('Registration error:', err);
    
    error.value =
      err.response?.data?.message || 'Registration failed. Please try again.';
    
    $q.notify({
      type: 'negative',
      message: error.value,
      icon: 'error',
      position: 'top',
      timeout: 5000
    });
    
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #36839d 0%, #2a5b6e 100%);
  min-height: 100vh;
}

.registration-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.registration-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.registration-header {
  position: relative;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 16px;
  border-radius: 8px;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.02), transparent);
  padding-left: 12px;
}

.section-header .q-icon {
  background: rgba(0, 0, 0, 0.05);
  padding: 8px;
  border-radius: 50%;
}

.custom-input {
  border-radius: 12px;
}

.custom-input :deep(.q-field__control) {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.custom-input :deep(.q-field__control:hover) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.corporation-logo {
  max-width: 200px; 
  height: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.required-field :deep(.q-field__label)::after {
  content: " *";
  color: #f44336;
}

@media (max-width: 600px) {
  .registration-container {
    padding: 16px;
  }
  
  .registration-card {
    margin: 0;
    border-radius: 16px;
  }
  
  .section-header {
    padding: 12px 0;
    margin-bottom: 12px;
  }
  
  .section-header .text-h6 {
    font-size: 1.1rem;
  }
}
</style>