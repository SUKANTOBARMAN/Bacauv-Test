<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-gradient flex-center">
        <div class="registration-container">
          <q-card class="registration-card shadow-24 q-pa-lg" flat bordered>
            <!-- Header -->
            <q-card-section class="text-center q-pb-sm">
              <img
                src="../assets/logo.jpg"
                alt="Logo"
                class="corporation-logo"
              />

              <div
                class="text-subtitle1 text-size text-weight-bold text-primary q-mt-sm"
              >
                Bangladesh Customs & VAT Officers' Association
              </div>

              <div class="text-caption text-grey-7 q-mt-xs">
                Create Your Account
              </div>
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
                  <span class="text-h6 text-weight-medium q-ml-sm text-primary"
                    >Personal Information</span
                  >
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
                        (val) =>
                          val.length === 11 || 'Mobile must be 11 digits',
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
                        (val) =>
                          val.length >= 6 ||
                          'Password must be at least 6 characters',
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
                        (val) =>
                          val === formData.password || 'Passwords do not match',
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="lock_outline" color="primary" />
                      </template>
                      <template v-slot:append>
                        <q-icon
                          :name="
                            showConfirmPassword
                              ? 'visibility_off'
                              : 'visibility'
                          "
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
                        <q-icon
                          name="event"
                          class="cursor-pointer"
                          color="grey-5"
                        >
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="formData.dob" mask="YYYY-MM-DD">
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
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
                        <q-icon
                          name="event"
                          class="cursor-pointer"
                          color="grey-5"
                        >
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="formData.officer_joining_date"
                              mask="YYYY-MM-DD"
                            >
                              <div class="row items-center justify-end">
                                <q-btn
                                  v-close-popup
                                  label="Close"
                                  color="primary"
                                  flat
                                />
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
                            <q-icon
                              :name="scope.opt.icon"
                              :color="scope.opt.color"
                            />
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

                <div class="row q-col-gutter-md">
                  <div class="col-12">
                    <q-input
                      filled
                      v-model="formData.address"
                      label="Address *"
                      lazy-rules
                      class="custom-input full-width"
                      :rules="[(val) => !!val || 'Address is required']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="home" color="primary" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-12">
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
                      :loading="districtLoading"
                    >
                      <template v-slot:prepend>
                        <q-icon name="map" color="primary" />
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

                <!-- Educational Information -->
                <div class="section-header q-mt-xl">
                  <q-icon name="school" color="primary" size="24px" />
                  <span class="text-h6 text-weight-medium q-ml-sm text-primary"
                    >Educational Information</span
                  >
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-select
                      filled
                      v-model="formData.educational_qualification"
                      label="Educational Qualification"
                      :options="degreeOptions"
                      option-label="label"
                      option-value="value"
                      emit-value
                      map-options
                      class="custom-input"
                      clearable
                      dropdown-icon="expand_more"
                      use-input
                      input-debounce="300"
                      @filter="filterDegrees"
                      :loading="degreeLoading"
                    >
                      <template v-slot:prepend>
                        <q-icon name="school" color="primary" />
                      </template>

                      <!-- Custom dropdown with categories -->
                      <template v-slot:option="scope">
                        <q-item v-bind="scope.itemProps">
                          <q-item-section avatar>
                            <q-icon
                              :name="scope.opt.icon"
                              :color="getDegreeColor(scope.opt.category)"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label class="text-weight-medium">{{
                              scope.opt.label
                            }}</q-item-label>
                            <q-item-label caption class="text-grey-7">
                              {{ getCategoryLabel(scope.opt.category) }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>

                      <!-- Custom selected display -->
                      <template v-slot:selected>
                        <div
                          v-if="formData.educational_qualification"
                          class="flex items-center"
                        >
                          <q-icon
                            :name="getSelectedDegreeIcon()"
                            :color="getSelectedDegreeColor()"
                            size="20px"
                            class="q-mr-sm"
                          />
                          {{ getSelectedDegreeLabel() }}
                        </div>
                        <span v-else class="text-grey-6"></span>
                      </template>

                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No matching degree found
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>

                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      v-model="formData.last_education_institution"
                      label="Last Education Institution"
                      class="custom-input"
                      placeholder="e.g., University of Dhaka"
                    >
                      <template v-slot:prepend>
                        <q-icon name="account_balance" color="primary" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <!-- Family Information -->
                <div class="section-header q-mt-xl">
                  <q-icon name="family_restroom" color="black" size="24px" />
                  <span class="text-h6 text-weight-medium q-ml-sm text-black"
                    >Family Information</span
                  >
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      v-model="formData.spouse_profession"
                      label="Spouse Profession"
                      class="custom-input"
                      placeholder="e.g., Government Officer, Teacher"
                    >
                      <template v-slot:prepend>
                        <q-icon name="work_outline" color="primary" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-12 col-sm-6">
                    <q-input
                      filled
                      v-model="formData.social_media_link"
                      label="Facebook Profile Link"
                      class="custom-input"
                      placeholder="https://facebook.com/username"
                    >
                      <template v-slot:prepend>
                        <q-icon name="share" color="primary" />
                      </template>
                    </q-input>
                  </div>
                </div>

                <!-- Location Information Section -->
                <div class="section-header q-mt-xl">
                  <q-icon name="location_on" color="primary" size="24px" />
                  <span class="text-h6 text-weight-medium q-ml-sm text-primary"
                    >Office Information (Optional)</span
                  >
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
                      :loading="commissionerateLoading"
                    >
                      <template v-slot:prepend>
                        <q-icon name="location_city" color="primary" />
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
                      :loading="divisionLoading"
                    >
                      <template v-slot:prepend>
                        <q-icon name="account_balance" color="primary" />
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            {{
                              formData.commissionerate_id
                                ? "No divisions found"
                                : "Select commissionerate first"
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
                      :loading="circleLoading"
                    >
                      <template v-slot:prepend>
                        <q-icon name="maps_home_work" color="primary" />
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            {{
                              formData.division_id
                                ? "No circles found"
                                : "Select division first"
                            }}
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="row justify-between q-mt-xl q-pt-lg action-buttons">
                  <q-btn
                    label="Back to Login"
                    to="/login"
                    color="grey-6"
                    flat
                    icon="arrow_back"
                    size="md"
                    no-caps
                    class="q-px-lg back-btn"
                  />
                  <q-btn
                    label="Create Account"
                    type="submit"
                    color="primary"
                    :loading="loading"
                    icon="how_to_reg"
                    size="md"
                    no-caps
                    class="q-px-xl submit-btn"
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
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();

const loading = ref(false);
const error = ref(null);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const confirmPassword = ref("");
const termsAccepted = ref(false);

// Loading states
const commissionerateLoading = ref(false);
const divisionLoading = ref(false);
const circleLoading = ref(false);
const districtLoading = ref(false);
const degreeLoading = ref(false);

// Form data
const formData = ref({
  name: "",
  name_bangla: "",
  email: "",
  mobile: "",
  password: "",
  designation: "",
  address: "",
  dob: "",
  officer_joining_date: "",
  blood_group: "",
  social_media_link: "",
  educational_qualification: "",
  last_education_institution: "",
  spouse_profession: "",
  role: "subadmin",
  commissionerate_id: null,
  division_id: null,
  circle_id: null,
  district_id: null,
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

// Blood group options
const bloodGroupOptions = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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
const filteredDegrees = ref([]);

// Degree options with categories
const allDegreeOptions = ref([
  // Bachelor's Degrees
  {
    label: "Bachelor of Science (BSc)",
    value: "bsc",
    category: "bachelor",
    icon: "science",
  },
  {
    label: "Bachelor of Arts (BA)",
    value: "ba",
    category: "bachelor",
    icon: "menu_book",
  },
  {
    label: "Bachelor of Commerce (BCom)",
    value: "bcom",
    category: "bachelor",
    icon: "account_balance",
  },
  {
    label: "Bachelor of Business Administration (BBA)",
    value: "bba",
    category: "bachelor",
    icon: "business",
  },
  {
    label: "Bachelor of Science in Engineering (BSc Engg)",
    value: "bsc_engg",
    category: "engineering",
    icon: "engineering",
  },

  // Master's Degrees
  {
    label: "Master of Science (MSc)",
    value: "msc",
    category: "masters",
    icon: "science",
  },
  {
    label: "Master of Arts (MA)",
    value: "ma",
    category: "masters",
    icon: "menu_book",
  },
  {
    label: "Master of Commerce (MCom)",
    value: "mcom",
    category: "masters",
    icon: "account_balance",
  },
  {
    label: "Master of Business Administration (MBA)",
    value: "mba",
    category: "masters",
    icon: "business",
  },
  {
    label: "Master of Science in Engineering (MSc Engg)",
    value: "msc_engg",
    category: "engineering_masters",
    icon: "engineering",
  },
]);

// Initialize filtered degrees
const degreeOptions = computed(() => {
  return filteredDegrees.value.length > 0
    ? filteredDegrees.value
    : allDegreeOptions.value;
});

// Category labels for display
const getCategoryLabel = (category) => {
  const categories = {
    bachelor: "Bachelor's Degree",
    engineering: "Engineering Degree",
    masters: "Master's Degree",
  };
  return categories[category] || "Other";
};

// Color coding for categories
const getDegreeColor = (category) => {
  const colors = {
    bachelor: "indigo",
    engineering: "deep-purple",
    masters: "orange",
    engineering_masters: "purple",
  };
  return colors[category] || "grey";
};

// Helper functions for selected value
const getSelectedDegreeIcon = () => {
  if (!formData.value.educational_qualification) return "school";
  const degree = allDegreeOptions.value.find(
    (opt) => opt.value === formData.value.educational_qualification
  );
  return degree?.icon || "school";
};

const getSelectedDegreeColor = () => {
  if (!formData.value.educational_qualification) return "grey";
  const degree = allDegreeOptions.value.find(
    (opt) => opt.value === formData.value.educational_qualification
  );
  return getDegreeColor(degree?.category);
};

const getSelectedDegreeLabel = () => {
  if (!formData.value.educational_qualification) return "";
  const degree = allDegreeOptions.value.find(
    (opt) => opt.value === formData.value.educational_qualification
  );
  return degree?.label || "";
};

// Filter degrees
const filterDegrees = (val, update) => {
  update(() => {
    if (val === "") {
      filteredDegrees.value = allDegreeOptions.value;
    } else {
      const needle = val.toLowerCase();
      filteredDegrees.value = allDegreeOptions.value.filter(
        (v) =>
          v.label.toLowerCase().indexOf(needle) > -1 ||
          v.category.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};

// Load initial data
onMounted(async () => {
  try {
    await Promise.all([loadCommissionerates(), loadDistricts()]);
    // Initialize filtered degrees
    filteredDegrees.value = allDegreeOptions.value;
  } catch (err) {
    console.error("Failed to load initial data:", err);
    $q.notify({
      type: "negative",
      message: "Failed to load initial data. Please refresh the page.",
      timeout: 3000,
    });
  }
});

// Load commissionerates
const loadCommissionerates = async () => {
  commissionerateLoading.value = true;
  try {
    const response = await api.get(
      "/v1/categories?limit=0&search=type:commissionerate"
    );
    commissionerates.value = response.data.data;
    filteredCommissionerates.value = commissionerates.value;
  } catch (error) {
    console.error("Error loading commissionerates:", error);
  } finally {
    commissionerateLoading.value = false;
  }
};

// Load divisions for selected commissionerate
const loadDivisions = async () => {
  if (!formData.value.commissionerate_id) return;

  divisionLoading.value = true;
  try {
    const response = await api.get(
      `/v1/categories?limit=0&search=parent_id:${formData.value.commissionerate_id}`
    );
    divisions.value = response.data.data || [];
    filteredDivisions.value = divisions.value;
    formData.value.division_id = null;
    formData.value.circle_id = null;
  } catch (error) {
    console.error("Error loading divisions:", error);
  } finally {
    divisionLoading.value = false;
  }
};

// Load circles for selected division
const loadCircles = async () => {
  if (!formData.value.division_id) return;

  circleLoading.value = true;
  try {
    const response = await api.get(
      `/v1/categories?limit=0&search=parent_id:${formData.value.division_id}`
    );
    circles.value = response.data.data || [];
    filteredCircles.value = circles.value;
    formData.value.circle_id = null;
  } catch (error) {
    console.error("Error loading circles:", error);
  } finally {
    circleLoading.value = false;
  }
};

// Load all districts
const loadDistricts = async () => {
  districtLoading.value = true;
  try {
    const response = await api.get(
      "/v1/categories?limit=0&search=type:district"
    );
    districts.value = response.data.data;
    filteredDistricts.value = districts.value;
  } catch (error) {
    console.error("Error loading districts:", error);
  } finally {
    districtLoading.value = false;
  }
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

    // Validate required fields
    if (
      !formData.value.name ||
      !formData.value.email ||
      !formData.value.mobile ||
      !formData.value.password ||
      !formData.value.designation ||
      !formData.value.address ||
      !formData.value.dob
    ) {
      error.value = "Please fill all required fields marked with *";
      loading.value = false;
      return;
    }

    if (formData.value.password !== confirmPassword.value) {
      error.value = "Passwords do not match";
      loading.value = false;
      return;
    }

    if (!termsAccepted.value) {
      error.value = "You must accept the Terms & Conditions";
      loading.value = false;
      return;
    }

    const params = new URLSearchParams();

    // Required fields
    params.append("name", formData.value.name.trim());
    params.append("email", formData.value.email.trim());
    params.append("mobile", formData.value.mobile.trim());
    params.append("password", formData.value.password);
    params.append("designation", formData.value.designation);
    params.append("address", formData.value.address.trim());
    params.append("dob", formData.value.dob);
    params.append("role", "subadmin");

    // Optional fields - only append if they have value
    if (formData.value.name_bangla && formData.value.name_bangla.trim()) {
      params.append("name_bangla", formData.value.name_bangla.trim());
    }
    if (formData.value.officer_joining_date) {
      params.append(
        "officer_joining_date",
        formData.value.officer_joining_date
      );
    }
    if (formData.value.blood_group) {
      params.append("blood_group", formData.value.blood_group);
    }
    if (
      formData.value.social_media_link &&
      formData.value.social_media_link.trim()
    ) {
      params.append(
        "social_media_link",
        formData.value.social_media_link.trim()
      );
    }
    if (formData.value.educational_qualification) {
      params.append(
        "educational_qualification",
        formData.value.educational_qualification
      );
    }
    if (
      formData.value.last_education_institution &&
      formData.value.last_education_institution.trim()
    ) {
      params.append(
        "last_education_institution",
        formData.value.last_education_institution.trim()
      );
    }
    if (
      formData.value.spouse_profession &&
      formData.value.spouse_profession.trim()
    ) {
      params.append(
        "spouse_profession",
        formData.value.spouse_profession.trim()
      );
    }

    // Optional location fields
    if (formData.value.commissionerate_id) {
      params.append("commissionerate_id", formData.value.commissionerate_id);
    }
    if (formData.value.division_id) {
      params.append("division_id", formData.value.division_id);
    }
    if (formData.value.circle_id) {
      params.append("circle_id", formData.value.circle_id);
    }
    if (formData.value.district_id) {
      params.append("district_id", formData.value.district_id);
    }

    const response = await api.post("/v1/register", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    $q.notify({
      type: "positive",
      message: "Registration successful! Please login to continue.",
      icon: "check_circle",
      position: "top",
      timeout: 4000,
    });

    // Reset form
    formData.value = {
      name: "",
      name_bangla: "",
      email: "",
      mobile: "",
      password: "",
      designation: "",
      address: "",
      dob: "",
      officer_joining_date: "",
      blood_group: "",
      social_media_link: "",
      educational_qualification: "",
      last_education_institution: "",
      spouse_profession: "",
      role: "subadmin",
      commissionerate_id: null,
      division_id: null,
      circle_id: null,
      district_id: null,
    };
    confirmPassword.value = "";
    termsAccepted.value = false;

    // Redirect after a short delay
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (err) {
    console.error("Registration error:", err);

    const errorMsg =
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Registration failed. Please try again.";

    error.value = errorMsg;

    $q.notify({
      type: "negative",
      message: errorMsg,
      icon: "error",
      position: "top",
      timeout: 5000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #e0f2f1, #b2dfdb);
  min-height: 100vh;
  padding: 20px;
}

.registration-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.registration-card {
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
  margin-bottom: 24px;
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
  min-height: 56px;
}

.custom-input :deep(.q-field__control:hover) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-input.full-width {
  width: 100%;
}

.corporation-logo {
  max-width: 200px;
  height: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.text-size {
  font-size: x-large;
}

/* Custom dropdown styling */
.custom-input :deep(.q-menu) {
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-height: 400px;
}

.custom-input :deep(.q-item) {
  min-height: 56px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.custom-input :deep(.q-item--active) {
  background-color: #f0f7ff;
}

.custom-input :deep(.q-item__label) {
  font-size: 15px;
}

.custom-input :deep(.q-item__label--caption) {
  font-size: 12px;
}

/* Selected item styling */
.custom-input :deep(.q-field__native > div) {
  display: flex;
  align-items: center;
}

/* Action buttons styling */
.action-buttons {
  border-top: 1px solid #e0e0e0;
  padding-top: 24px;
}

.submit-btn {
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  color: white !important;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-btn {
  transition: all 0.3s ease;
}

.back-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Terms checkbox */
.terms-checkbox {
  padding: 12px;
  border-radius: 8px;
  background-color: #f8f9fa;
  border: 1px solid #e0e0e0;
}

.terms-checkbox :deep(.q-checkbox__inner) {
  font-size: 20px;
}

/* Responsive design */
@media (max-width: 1024px) {
  .registration-container {
    max-width: 900px;
    padding: 16px;
  }
}

@media (max-width: 768px) {
  .registration-container {
    max-width: 95%;
    padding: 12px;
  }

  .registration-card {
    border-radius: 16px;
  }

  .section-header {
    padding: 12px 0;
    margin-bottom: 20px;
  }

  .section-header .text-h6 {
    font-size: 1.1rem;
  }

  .custom-input :deep(.q-field__control) {
    min-height: 52px;
  }
}

@media (max-width: 600px) {
  .bg-gradient {
    padding: 12px;
  }

  .registration-container {
    padding: 8px;
  }

  .registration-card {
    margin: 0;
    border-radius: 12px;
    padding: 20px;
  }

  .corporation-logo {
    max-width: 150px;
  }

  .text-size {
    font-size: large;
  }

  .section-header {
    padding: 10px 0;
    margin-bottom: 16px;
  }

  .section-header .text-h6 {
    font-size: 1rem;
  }

  .section-header .q-icon {
    font-size: 20px;
  }

  .custom-input :deep(.q-field__control) {
    min-height: 48px;
  }

  .custom-input :deep(.q-field__native) {
    font-size: 14px;
  }

  .custom-input :deep(.q-item) {
    min-height: 48px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 16px;
  }

  .back-btn,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }

  .q-gutter-lg {
    gap: 16px !important;
  }

  .q-mt-xl {
    margin-top: 24px !important;
  }

  .q-pt-lg {
    padding-top: 20px !important;
  }
}

@media (max-width: 400px) {
  .registration-card {
    padding: 16px;
  }

  .corporation-logo {
    max-width: 120px;
  }

  .text-size {
    font-size: medium;
  }

  .custom-input :deep(.q-field__control) {
    min-height: 44px;
  }

  .custom-input :deep(.q-field__native) {
    font-size: 13px;
  }
}
</style>
