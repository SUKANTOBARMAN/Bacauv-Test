<template>
  <q-page class="q-py-lg bg-grey-1">
    <div class="row justify-center">
      <div class="col-lg-10 col-md-11 col-sm-12 col-xs-12">
        <q-card class="q-mb-xl" flat bordered>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6 text-center">
              <q-icon name="person_add" size="sm" class="q-mr-sm" />
              কর্মচারী যোগ করুন
            </div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="submitForm" class="q-gutter-y-md">
              <!-- Personal Information -->
              <q-expansion-item
                default-opened
                expand-icon-toggle
                header-class="bg-blue-1"
                expand-separator
              >
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-icon name="person" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle1 text-weight-medium"
                      >ব্যক্তিগত তথ্যাবলী</q-item-label
                    >
                  </q-item-section>
                </template>

                <div class="row q-pa-md q-col-gutter-md">
                  <div class="col-md-6 col-sm-12">
                    <q-input
                      outlined
                      v-model="name"
                      label="নাম"
                      required
                      lazy-rules
                      :rules="[(val) => !!val || 'আপনার নাম লিখুন']"
                      stack-label
                    >
                      <template v-slot:prepend>
                        <q-icon name="badge" color="primary" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <q-input
                      outlined
                      v-model="dob"
                      label="জন্ম তারিখ"
                      mask="####-##-##"
                      hint="বছর-মাস-দিন"
                      required
                      lazy-rules
                      :rules="[(val) => !!val || 'আপনার জন্ম তারিখ লিখুন']"
                      stack-label
                    >
                      <template v-slot:prepend>
                        <q-icon name="event" color="primary" />
                      </template>
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              v-model="dob"
                              mask="YYYY-MM-DD"
                              today-btn
                              navigation-min-year-month="1940/01"
                              :navigation-max-year-month="`${new Date().getFullYear()}/${String(
                                new Date().getMonth() + 1
                              ).padStart(2, '0')}`"
                              color="primary"
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
                  <div class="col-md-6 col-sm-12">
                    <q-input
                      outlined
                      v-model="additionalInfo.fatherName"
                      label="বাবার নাম"
                      required
                      lazy-rules
                      :rules="[(val) => !!val || 'আপনার বাবার নাম লিখুন']"
                      stack-label
                    >
                      <template v-slot:prepend>
                        <q-icon name="man" color="primary" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <q-input
                      outlined
                      v-model="additionalInfo.motherName"
                      label="মায়ের নাম"
                      required
                      lazy-rules
                      :rules="[(val) => !!val || 'আপনার মায়ের নাম লিখুন']"
                      stack-label
                    >
                      <template v-slot:prepend>
                        <q-icon name="woman" color="primary" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <q-input
                      outlined
                      v-model="additionalInfo.wifeName"
                      label="স্বামী বা স্ত্রীর নাম "
                      stack-label
                    >
                      <template v-slot:prepend>
                        <q-icon name="favorite" color="primary" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <q-select
                      outlined
                      v-model="religion"
                      :options="[
                        'ইসলাম',
                        'হিন্দুধর্ম',
                        'খ্রিস্টান',
                        'বৌদ্ধ'
                      ]"
                      label="ধর্ম"
                      required
                      lazy-rules
                      :rules="[(val) => !!val || 'ধর্ম নির্বাচন করুন']"
                      emit-value
                      map-options
                      stack-label
                    >
                      <template v-slot:prepend>
                        <q-icon name="church" color="primary" />
                      </template>
                    </q-select>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <q-select
                      outlined
                      v-model="gender"
                     :options="[
  { label: 'পুরুষ', value: 'male' },
  { label: 'মহিলা', value: 'female' },
  { label: 'অন্যান্য', value: 'others' }
]"

                      label="লিঙ্গ"
                      required
                      lazy-rules
                      :rules="[(val) => !!val || 'লিঙ্গ নির্বাচন করুন']"
                      emit-value
                      map-options
                      option-label="label"
                      option-value="value"
                      stack-label
                    >
                      <template v-slot:prepend>
                        <q-icon name="wc" color="primary" />
                      </template>
                    </q-select>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <q-input
                      outlined
                      v-model="additionalInfo.address"
                      label="ঠিকানা *"
                      stack-label
                      required
                      lazy-rules
                      :rules="[(val) => !!val || 'ঠিকানা আবশ্যক']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="home" color="primary" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <q-input
                      outlined
                      v-model="nid"
                      label="জাতীয় পরিচয়পত্র নম্বর *"
                      type="number"
                      stack-label
                      required
                      lazy-rules
                      :rules="[
                        (val) => !!val || 'জাতীয় পরিচয়পত্র নম্বর আবশ্যক',
                        validateNID,
                      ]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="credit_card" color="primary" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <q-select
                      outlined
                      v-model="blood_group"
                      label="রক্তের গ্রুপ"
                      :options="[
                        'A+',
                        'A-',
                        'O+',
                        'O-',
                        'B+',
                        'B-',
                        'AB+',
                        'AB-',
                      ]"
                      required
                      lazy-rules
                      :rules="[(val) => !!val || 'রক্তের গ্রুপ নির্বাচন করুন']"
                      emit-value
                      map-options
                      stack-label
                    >
                      <template v-slot:prepend>
                        <q-icon name="bloodtype" color="red" />
                      </template>
                    </q-select>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <q-input
                      outlined
                      v-model="mobile"
                      label="মোবাইল নম্বর"
                      type="tel"
                      stack-label
                      required
                      lazy-rules
                      :rules="[validatePhoneNumber]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="phone" color="primary" />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <q-input
                      outlined
                      v-model="password"
                      label="পাসওয়ার্ড"
                      :type="isPwdVisible ? 'text' : 'password'"
                      stack-label
                      :rules="[validatePassword]"
                    >
                      <template v-slot:prepend>
                        <q-icon name="vpn_key" color="primary" />
                      </template>
                      <template v-slot:append>
                        <q-icon
                          :name="isPwdVisible ? 'visibility_off' : 'visibility'"
                          class="cursor-pointer"
                          @click="isPwdVisible = !isPwdVisible"
                        />
                      </template>
                    </q-input>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <q-select
                      outlined
                      v-model="additionalInfo.designationId"
                      :options="designationOptions"
                      label="পদবী"
                      option-label="name"
                      option-value="id"
                      emit-value
                      map-options
                      required
                      lazy-rules
                      :rules="[(val) => !!val || 'পদবী নির্বাচন করুন']"
                      stack-label
                    >
                      <template v-slot:prepend>
                        <q-icon name="work" color="primary" />
                      </template>
                    </q-select>
                  </div>
                  <div class="col-md-6 col-sm-12">
                    <q-file
                      outlined
                     label="ছবি আপলোড করুন"
                      v-model="additionalInfo.image"
                      accept="image/*"
                      stack-label
                      use-chips
                      counter
                    >
                      <template v-slot:prepend>
                        <q-icon name="add_photo_alternate" color="primary" />
                      </template>
                      <template v-slot:append v-if="additionalInfo.image">
                        <q-avatar size="md">
                          <img :src="imagePreviewUrl" v-if="imagePreviewUrl" />
                        </q-avatar>
                      </template>
                    </q-file>
                  </div>
                </div>
              </q-expansion-item>

              <!-- Workplace Information -->
              <q-expansion-item
                default-opened
                expand-icon-toggle
                header-class="bg-blue-1"
                expand-separator
              >
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-icon name="business" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle1 text-weight-medium"
                      >কর্মস্থলের তথ্য</q-item-label
                    >
                  </q-item-section>
                </template>

                <div class="q-pa-md">
                  <div class="text-subtitle2 q-mb-sm text-primary">
                    কর্মস্থল নির্বাচন করুন
                  </div>

                  <!-- Breadcrumb navigation -->
                  <!-- <q-card flat bordered class="q-mb-md q-pa-sm bg-blue-1">
                    <q-breadcrumbs separator="" class="text-primary">
                      <q-breadcrumbs-el
                        label="Root"
                        icon="home"
                        @click="resetWorkplaceSelection"
                        class="cursor-pointer"
                      />
                      <q-breadcrumbs-el
                        v-for="(item, index) in pathStack"
                        :key="index"
                        :label="item.name"
                        @click="goBackTo(index)"
                        class="cursor-pointer"
                      />
                      <q-breadcrumbs-el
                        v-if="selectedOffice"
                        :label="selectedOffice.name"
                        class="text-weight-bold"
                      />
                    </q-breadcrumbs>
                  </q-card> -->

                  <div class="row q-col-gutter-md">
                    <div class="col-md-8 col-sm-12">
                      <q-select
                        v-model="selectedOfficeId"
                        :options="currentLevelOptions"
                        option-label="name"
                        option-value="id"
                       label="অফিস নির্বাচন করুন"
                        outlined
                        emit-value
                        map-options
                        clearable
                        use-input
                        fill-input
                        hide-selected
                        input-debounce="300"
                        @filter="filterOffices"
                        @update:model-value="handleOfficeSelection"
                        stack-label
                      >
                        <template v-slot:prepend>
                          <q-icon name="location_city" color="primary" />
                        </template>
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              কোনো অফিস পাওয়া যায়নি
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
                    </div>

                    <div class="col-md-4 col-sm-12">
                      <q-btn
                        v-if="canGoDeeper"
                        :label="`View Sub-offices`"
                        color="secondary"
                        class="full-width"
                        icon="account_tree"
                        @click="goDeeper"
                        :disabled="!selectedOfficeId"
                      />
                      <q-btn
                        v-else
                        label="Reset Selection"
                        color="negative"
                        class="full-width"
                        icon="restart_alt"
                        @click="resetWorkplaceSelection"
                        outline
                      />
                    </div>
                  </div>

                  <q-card
                    v-if="selectedWorkplace"
                    class="q-mt-md bg-green-1 q-pa-md"
                    flat
                    bordered
                  >
                    <div class="row items-center">
                      <q-icon
                        name="check_circle"
                        color="positive"
                        size="md"
                        class="q-mr-sm"
                      />
                      <div class="text-subtitle1 text-weight-medium">
                        Selected Office: {{ selectedWorkplace.name }}
                      </div>
                    </div>
                    <div class="q-pl-xl text-grey-8">
                      Type: {{ selectedWorkplace.type }}
                    </div>
                  </q-card>

                  <q-input
                    outlined
                    v-model="additionalInfo.joiningDate"
                   label="যোগদানের তারিখ"
                    stack-label
                    required
                    lazy-rules
                    :rules="[(val) => !!val || 'যোগদানের তারিখ আবশ্যক']"
                    class="q-mt-md"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" color="primary" />
                    </template>
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="additionalInfo.joiningDate"
                            mask="YYYY-MM-DD"
                            today-btn
                            color="primary"
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
              </q-expansion-item>

              <!--salary info-->
              <q-expansion-item
                default-opened
                expand-icon-toggle
                header-class="bg-blue-1"
                expand-separator
              >
                <template v-slot:header>
                  <q-item-section avatar>
                    <q-icon name="attach_money" color="green" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle1 text-weight-medium"
                      >বেতন সম্পর্কিত তথ্য</q-item-label
                    >
                  </q-item-section>
                </template>

                <div class="q-pa-md">
                  <q-card bordered flat class="q-pa-md bg-green-1">
                    <!-- Grade Selection -->
                    <q-select
                      v-model="selectedGradeId"
                      :options="gradeOptions"
                      label="বেতন গ্রেড নির্বাচন করুন"
                      option-label="name"
                      option-value="id"
                      emit-value
                      map-options
                      outlined
                      @update:model-value="onGradeChange"
                      class="q-mb-md"
                      :loading="loadingSalaryScales"
                      stack-label
                      required
                      lazy-rules
                      :rules="[(val) => !!val || 'বেতন গ্রেড নির্বাচন করুন']"
                    >
                      <template v-slot:prepend>
                        <q-icon name="payments" color="green" />
                      </template>
                      <template v-slot:loading>
                        <q-spinner-dots color="primary" />
                      </template>
                    </q-select>

                    <!-- Increment Selection with Basic Salary -->
                    <q-select
                      v-if="incrementOptions.length > 0"
                      v-model="selectedIncrementId"
                      :options="incrementOptions"
                      label="ইনক্রিমেন্ট নির্বাচন করুন"
                      option-label="incrementLabel"
                      option-value="id"
                      emit-value
                      map-options
                      outlined
                      @update:model-value="onIncrementChange"
                      class="q-mb-md"
                      stack-label
                    >
                      <template v-slot:prepend>
                        <q-icon name="trending_up" color="green" />
                      </template>
                    </q-select>

                    <q-card
                      v-if="basicSalary"
                      flat
                      bordered
                      class="bg-white q-pa-sm q-mt-sm"
                    >
                      <div class="row items-center">
                        <q-icon
                          name="money"
                          color="positive"
                          size="sm"
                          class="q-mr-sm"
                        />
                        <div class="text-subtitle2">
                           মূল বেতন:
                          <span class="text-weight-bold">{{
                            basicSalary
                          }}</span>
                        </div>
                      </div>
                    </q-card>
                    <q-card
                      v-if="basicSalary"
                      flat
                      bordered
                      class="q-mt-md q-pa-md bg-blue-1"
                    >
                      <div class="text-subtitle2 q-mb-sm text-primary">
                        অতিরিক্ত ফি
                      </div>

                      <div class="row q-col-gutter-md">
                        <div class="col-md-4 col-sm-6 col-xs-12">
                          <q-toggle
                            v-model="additionalFees.washing_fee"
                            label="লন্ড্রির ফি"
                            :color="
                              additionalFees.washing_fee ? 'positive' : 'grey'
                            "
                            left-label
                          />
                        </div>
                        <div class="col-md-4 col-sm-6 col-xs-12">
                          <q-toggle
                            v-model="additionalFees.tiffin_fee"
                            label=" টিফিন ফি"
                            :color="
                              additionalFees.tiffin_fee ? 'positive' : 'grey'
                            "
                            left-label
                          />
                        </div>
                        <div class="col-md-4 col-sm-6 col-xs-12">
                          <q-toggle
                            v-model="additionalFees.education_fee"
                            label="শিক্ষা ফি"
                            :color="
                              additionalFees.education_fee ? 'positive' : 'grey'
                            "
                            left-label
                          />
                          <q-select
                            v-if="additionalFees.education_fee"
                            v-model="educationFeeOption"
                            :options="educationFeeOptions"
                            label="শিক্ষা ফি নির্বাচন করুন"
                            outlined
                            dense
                            class="q-mt-sm"
                            emit-value
                            map-options
                            :rules="[
                              (val) =>
                                !!val ||
                                'শিক্ষা ফি নির্বাচন করুন',
                            ]"
                            required
                          />
                        </div>
                      </div>
                    </q-card>
                  </q-card>
                </div>
              </q-expansion-item>

              <div class="row justify-center q-mt-lg q-mb-md">
                <q-btn
                  label="জমা দিন"
                  type="submit"
                  color="primary"
                  icon="save"
                  size="lg"
                  class="q-px-xl"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();

// Workplace Selection State
const pathStack = ref([]);
const currentLevelNodes = ref([]);
const selectedOfficeId = ref(null);
const selectedWorkplace = ref(null);
const officeFilter = ref("");

// Original state
const officeTreeData = ref(null);
const designations = ref([]);
const selectedScale = ref(null);
const mobile = ref("");
const password = ref("");
const name = ref("");
const nid = ref("");
const gender = ref("");
const religion = ref("");
const blood_group = ref("");
const dob = ref("");
const isPwdVisible = ref(false);
const originalCurrentLevelOptions = ref([]);

// Additional Info
const additionalInfo = reactive({
  fatherName: "",
  motherName: "",
  wifeName: "",
  address: "",
  joiningDate: "",
  image: null,
  designationId: null,
});
const educationFeeOption = ref(null);
const educationFeeOptions = ref([
  { label: "500 (For 1 child)", value: 500 },
  { label: "1000 (For 2+ children)", value: 1000 },
]);

const additionalFees = reactive({
  washing_fee: true,
  tiffin_fee: true,
  education_fee: false,
  education_fee_amount: 0,
});
// Watch education fee toggle and option changes
watch(
  () => additionalFees.education_fee,
  (newVal) => {
    if (!newVal) {
      educationFeeOption.value = null;
      additionalFees.education_fee_amount = 0;
    }
  }
);

watch(educationFeeOption, (newVal) => {
  additionalFees.education_fee_amount = newVal || 0;
});
const validatePassword = (val) => {
  const hasMinLength = val.length >= 8;
  const hasLetters = /[a-zA-Z]/.test(val);
  const hasMixedCase = /[a-z]/.test(val) && /[A-Z]/.test(val);
  const hasNumber = /[0-9]/.test(val);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(val);

  if (!hasMinLength) return "অন্তত ৮ অক্ষরের পাসওয়ার্ড দিতে হবে";
  if (!hasLetters) return "অক্ষর থাকতে হবে";
  if (!hasMixedCase) return "বড় হাতের এবং ছোট হাতের অক্ষর উভয়ই থাকতে হবে";
  if (!hasNumber) return "কমপক্ষে একটি সংখ্যা থাকতে হবে";
  if (!hasSpecialChar) return "কমপক্ষে একটি বিশেষ চিহ্ন থাকতে হবে";
  return true;

};
const validatePhoneNumber = (val) => {
  if (!val) return "ফোন নম্বর আবশ্যক";
  if (!/^01[3-9]\d{8}$/.test(val))
    return "০১৩-০১৯ দিয়ে শুরু হতে হবে এবং মোট ১১ সংখ্যার হতে হবে";
  return true;
};

const validateNID = (val) => {
  if (val && !/^\d+$/.test(val)) return "জাতীয় পরিচয়পত্র নম্বর শুধুমাত্র সংখ্যা থাকতে হবে";
  return true;
};

// Image preview
const imagePreviewUrl = ref(null);

// Watch for image changes to create preview
watch(
  () => additionalInfo.image,
  (newImage) => {
    if (newImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviewUrl.value = e.target.result;
      };
      reader.readAsDataURL(newImage);
    } else {
      imagePreviewUrl.value = null;
    }
  }
);

// Designation Options
const designationOptions = computed(() =>
  designations.value.map((d) => ({
    id: d.id,
    name: d.name,
  }))
);

// Office filtering function
const filterOffices = (val, update) => {
  if (val === "") {
    update(() => {
      currentLevelNodes.value = originalCurrentLevelOptions.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    currentLevelNodes.value = originalCurrentLevelOptions.value.filter(
      (v) => v.name.toLowerCase().indexOf(needle) > -1
    );
  });
};

// Workplace Selection Computed Properties
const currentLevelOptions = computed(() =>
  currentLevelNodes.value.map((node) => ({
    id: node.id,
    name: node.name,
    type: node.type,
  }))
);

const selectedOffice = computed(() =>
  currentLevelNodes.value.find((node) => node.id === selectedOfficeId.value)
);

const canGoDeeper = computed(
  () => selectedOffice.value && selectedOffice.value.children?.data?.length > 0
);

// Workplace Selection Methods
const goDeeper = () => {
  if (selectedOffice.value) {
    pathStack.value.push(selectedOffice.value);
    currentLevelNodes.value = selectedOffice.value.children?.data || [];
    originalCurrentLevelOptions.value = [...currentLevelNodes.value];
    selectedOfficeId.value = null;
    selectedWorkplace.value = null;
  }
};

const goBackTo = (index) => {
  pathStack.value = pathStack.value.slice(0, index + 1);
  if (index === -1) {
    resetWorkplaceSelection();
  } else {
    currentLevelNodes.value = pathStack.value[index].children?.data || [];
    originalCurrentLevelOptions.value = [...currentLevelNodes.value];
    selectedOfficeId.value = null;
    selectedWorkplace.value = null;
  }
};

const handleOfficeSelection = (officeId) => {
  if (!officeId) {
    selectedWorkplace.value = null;
    return;
  }

  const selected = currentLevelNodes.value.find((node) => node.id === officeId);
  if (selected) {
    selectedWorkplace.value = {
      id: selected.id,
      name: selected.name,
      type: selected.type,
      additional_info: selected.additional_info,
    };
  }
};

const resetWorkplaceSelection = () => {
  pathStack.value = [];
  currentLevelNodes.value =
    officeTreeData.value?.filter((item) => item.type === "head_office") || [];
  originalCurrentLevelOptions.value = [...currentLevelNodes.value];
  selectedOfficeId.value = null;
  selectedWorkplace.value = null;
};

// Salary Information State
const salaryScales = ref([]);
const loadingSalaryScales = ref(false);
const selectedGradeId = ref(null);
const selectedIncrementId = ref(null);
const basicSalary = ref(null);

// Salary Computed Properties
const gradeOptions = computed(() =>
  salaryScales.value.map((g) => ({ id: g.id, name: g.name }))
);

const selectedGrade = computed(() =>
  salaryScales.value.find((g) => g.id === selectedGradeId.value)
);

const incrementOptions = computed(() => {
  if (!selectedGrade.value?.children?.data) return [];

  return selectedGrade.value.children.data.map((increment) => ({
    id: increment.id,
    name: increment.name,
    basic: increment.additional_info?.payment_details?.basic || 0,
    incrementLabel: `${increment.name} (${
      increment.additional_info?.payment_details?.basic || 0
    })`,
    incrementPaymentDetails: increment.additional_info?.payment_details,
  }));
});

// Salary Methods
const onGradeChange = () => {
  selectedIncrementId.value = null;
  basicSalary.value = null;

  // Set the first increment as default if available
  if (incrementOptions.value.length > 0) {
    selectedIncrementId.value = incrementOptions.value[0].id;
    basicSalary.value = incrementOptions.value[0].basic;
  }
};

const onIncrementChange = () => {
  const selectedIncrement = incrementOptions.value.find(
    (c) => c.id === selectedIncrementId.value
  );
  basicSalary.value = selectedIncrement?.basic || null;
};

// Upload photo to backend
const uploadPhoto = async (employeeId) => {
  if (!additionalInfo.image) return null;

  try {
    const formData = new FormData();
    formData.append("title", "Employee Profile Picture");
    formData.append("file", additionalInfo.image);
    formData.append("owner_id", employeeId);
    formData.append("owner_type", "employee");

    const response = await api.post("/v1/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data.id;
  } catch (error) {
    console.error("Error uploading photo:", error);
    $q.notify({
      type: "negative",
      message: "Failed to upload employee photo",
    });
    return null;
  }
};

// Fetch salary scales from backend
const fetchSalaryScales = async () => {
  loadingSalaryScales.value = true;
  try {
    const response = await api.get(
      "/v1/categories?search=type:salary_scale&include=children"
    );
    salaryScales.value = response.data.data;
  } catch (error) {
    console.error("Error fetching salary scales:", error);
    $q.notify({
      type: "negative",
      message: "Failed to load salary scales",
    });
  } finally {
    loadingSalaryScales.value = false;
  }
};

// Fetch Data Methods
const fetchDesignations = async () => {
  try {
    const { data } = await api.get("/v1/categories?search=type:designation");
    designations.value = data.data;
  } catch (error) {
    console.error("Failed to fetch designations", error);
    $q.notify({
      type: "negative",
      message: "Failed to load designations",
    });
  }
};
onMounted(async () => {
  try {
    const response = await api.get(
      `/v1/categories?search=type:head_office&include=children`
    );
    officeTreeData.value = response.data.data;
    resetWorkplaceSelection();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    $q.notify({
      type: "negative",
      message: "Failed to load office data",
    });
  }

  fetchDesignations();
  fetchSalaryScales();
});

// Form Submission
const submitForm = async () => {
  // Validate form before submission
  const validateForm = () => {
    const errors = [];

    // Personal Information
    if (!name.value?.trim()) errors.push("Name is required");
    if (!dob.value) errors.push("Date of Birth is required");
    if (!additionalInfo.fatherName?.trim())
      errors.push("Father's Name is required");
    if (!additionalInfo.motherName?.trim())
      errors.push("Mother's Name is required");
    if (!gender.value) errors.push("Gender is required");
    if (!religion.value) errors.push("Religion is required");
    if (!blood_group.value) errors.push("Blood Group is required");
    if (!nid.value) errors.push("NID Number is required");
    if (!additionalInfo.address?.trim()) errors.push("Address is required");

    // Contact Information
    const phoneError = validatePhoneNumber(mobile.value);
    if (phoneError !== true) errors.push(phoneError);

    // Workplace Information
    if (!selectedWorkplace.value) errors.push("Please select a workplace");
    if (!additionalInfo.joiningDate) errors.push("Joining Date is required");
    if (!additionalInfo.designationId) errors.push("Designation is required");

    // Salary Information
    if (!selectedGradeId.value) errors.push("Salary Grade is required");
    if (additionalFees.education_fee && !educationFeeOption.value) {
      errors.push("Please select an education fee amount");
    }

    return errors;
  };

  // Check for validation errors
  const validationErrors = validateForm();
  if (validationErrors.length > 0) {
    $q.notify({
      type: "negative",
      message: validationErrors.join("\n"), // Show all errors separated by new lines
      position: "top",
      timeout: 5000,
      multiLine: true, // Allow multiple lines in notification
      actions: [{ label: "Dismiss", color: "white" }],
    });
    return;
  }
  // Show loading
  // $q.loading.show({
  //   message: 'Adding employee data...'
  // });

  try {
    // Prepare additional info payload
    const additionalInfoPayload = {
      fatherName: additionalInfo.fatherName || "",
      motherName: additionalInfo.motherName || "",
      wifeName: additionalInfo.wifeName || "",
      address: additionalInfo.address || "",
      joiningDate: additionalInfo.joiningDate || "",
    };

    // Prepare form data
    const formData = {
      mobile: mobile.value || "",
      password: password.value || "",
      name: name.value || "",
      nid: nid.value || "",
      gender: gender.value || "",
      religion: religion.value || "",
      blood_group: blood_group.value || "",
      dob: dob.value || "",
      designation_id: additionalInfo.designationId,
      additional_info: additionalInfoPayload,
    };

    // Submit employee data
    const employeeResponse = await api.post("/v1/employees", formData);

    const employee_id = employeeResponse.data.data.id;

    // Upload photo if provided
    if (additionalInfo.image) {
      await uploadPhoto(employee_id);
    }

    // Salary payload
    const additionalPaymentIncrement = incrementOptions.value.find(
      (inc) => inc.id === selectedIncrementId.value
    )?.incrementPaymentDetails;

    const salaryPayload = {
      employee_id: employee_id,
      salaryscale_id: selectedIncrementId.value || selectedGradeId.value,
      start_date: additionalInfo.joiningDate,
      additional_info: {
        education_fee: additionalFees.education_fee_amount,
        tiffin_fee: additionalFees.tiffin_fee
          ? additionalPaymentIncrement.tiffin_fee
          : 0,
        washing_fee: additionalFees.washing_fee
          ? additionalPaymentIncrement.washing_fee
          : 0,
      },
    };

    // Submit salary information

    await api.post("/v1/salaries", salaryPayload);

    // Transfer history payload
    const transferPayload = {
      employee_id: employee_id,
      office_id: selectedWorkplace.value.id,
      start_date: additionalInfo.joiningDate,
      end_date: "",
      additional_info: null,
    };

    // Submit transfer history
    await api.post("/v1/transfer-histories", transferPayload);

    // Hide loading
    //$q.loading.hide();

    // Success notification
    $q.notify({
      type: "positive",
      message: "Employee added successfully!",
      position: "top",
      timeout: 2000,
      actions: [{ label: "Dismiss", color: "white" }],
    });

    // Navigate to home or employee list
    router.push(`/employees_office/${selectedWorkplace.value.id}`);
  } catch (err) {
    // Hide loading
    $q.loading.hide();

    // Detailed error logging and notification
    console.error("Submission Error:", err);

    const errorMessage =
      err.response?.data?.message ||
      err.message ||
      "Something went wrong during submission";

    $q.notify({
      type: "negative",
      message: errorMessage,
      position: "top",
      timeout: 5000,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};
</script>
