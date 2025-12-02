<template>
  <q-page class="q-pa-md bg-grey-2 su">
    <div ref="idCard" class="row q-gutter-xs">
      <!-- Front Side of ID Card -->
      <div ref="frontCard" class="col-md-4 col-sm-6 q-pa-sm">
        <q-card class="id-card front-side">
          <q-card-section class="text-center">
            <q-img
              src="data:image/png;base64,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"
              class="company-logo"
          /></q-card-section>
          <div class="text-center">
            <div class="text-bold">
              বাংলাদেশ গণপ্রজাতন্ত্রী সরকার
            </div>
            <div class="text-bold">যুব উন্নয়ন বিভাগ</div>
          </div>
          <q-card-section class="text-center">
            <q-img
              :src="employeePhotoUrl"
              @load="handleImageLoaded"
              class="employee-photo"
            />
            <div class="text-h6 text-bold">{{ employee.name }}</div>
            <div class="text-subtitle1 text-grey-7">
              {{ employee.designation }}
            </div>
          </q-card-section>
          <q-card-section class="text-center bg-green card-footer">
            <!-- <div class="text-bold">ID: {{ employee.id }}</div> -->
          </q-card-section>
        </q-card>
      </div>

      <!-- Back Side of ID Card -->
      <div ref="backCard" class="col-md-4 col-sm-6 q-pa-sm">
        <q-card class="id-card back-side">
          <div class="q-mt-md q-ml-md text-red">
            <div class="q-mb-md text-bold text-center">Instructions</div>
            <q-separator />
            <ul class="q-list">
              <li>এই আইডি নিরাপদে রাখুন</li>
              <li>হারানো বা ক্ষতিগ্রস্ত হলে মানবসম্পদ বিভাগে যোগাযোগ করুন</li>
              <li>শুধুমাত্র অফিসের কাজে বৈধ</li>
            </ul>
          </div>
          <q-separator />

          <div class="suku">
            <div class="q-my-md q-ml-md fbasis">
              <div><strong>জাতীয় পরিচয়পত্র:</strong> {{ employee.nid }}</div>
              <div><strong>রক্তের গ্রুপ:</strong> {{ employee.bloodGroup }}</div>
              <div><strong>ফোন নম্বর:</strong> {{ employee.phone }}</div>
              <div><strong>জারি তারিখ:</strong> {{ employee.issuedDate }}</div>
            </div>

            <div class="qr-wrapper">
              <div class="qr-small">
                <QrCodeVue
                  :value="qrCodeValue"
                  :size="30"
                  :level="'L'"
                  :margin="0"
                  render-as="svg"
                />
              </div>
            </div>
          </div>
          <q-card-section class="text-center bg-green card-footer1">
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="q-pa-md">
      <q-btn label="আইডি কার্ড ডাউনলোড করুন" @click="saveAsJpg" />
    </div>
  </q-page>
</template>

<script setup>
import { reactive, computed, onMounted, ref } from "vue";
import QrCodeVue from "vue-qrcode";
import { useRoute } from "vue-router";
import html2pdf from "html2pdf.js";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import html2canvas from "html2canvas";

const route = useRoute();
const userId = route.query.id;
const personalLoading = ref(false);
const $q = useQuasar();
const idCard = ref(null);
const frontCard = ref(null);
const backCard = ref(null);
const imageLoaded = ref(false);

// Configure pdfMake with custom fonts

const handleImageLoaded = () => {
  imageLoaded.value = true;
};

const saveAsJpg = async () => {
  try {
    // Front Side
    const frontCanvas = await html2canvas(frontCard.value, {
      useCORS: true,
      scale: 2,
    });
    const frontImgData = frontCanvas.toDataURL("image/jpeg", 1.0);
    downloadImage(frontImgData, "id-card-front.jpg");

    // Back Side
    const backCanvas = await html2canvas(backCard.value, {
      useCORS: true,
      scale: 2,
    });
    const backImgData = backCanvas.toDataURL("image/jpeg", 1.0);
    downloadImage(backImgData, "id-card-back.jpg");
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "আইডি কার্ড JPG হিসেবে সংরক্ষণ করতে ব্যর্থ হয়েছে",
    });
  }
};

const downloadImage = (dataUrl, filename) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const employee = reactive({
  name: "",
  designation: "",
  // id: "EMP-123456",
  // department: "",
  phone: "",
  nid: "",
  bloodGroup: "O+",
  issuedDate: "2025-03-17",
});

const fetchEmployeeData = async () => {
  try {
    personalLoading.value = true;
    const response = await api.get(`/v1/employees/${userId}?include=user`);

    const apiData = response.data.data;

    const userData = apiData.user.data;

    // Handle additionalInfo safely
    const additionalInfo =
      typeof apiData.additional_info === "string"
        ? JSON.parse(apiData.additional_info || "{}")
        : apiData.additional_info || {};

    // Get designation name if available
    let designationName = "";
    if (apiData.designation_id) {
      try {
        const designationResponse = await api.get(
          `/v1/categories/?search=id:${apiData.designation_id}`
        );
        if (
          designationResponse.data.data &&
          designationResponse.data.data.length > 0
        ) {
          designationName = designationResponse.data.data[0].name;
        }
      } catch (designationError) {
        console.error("Error fetching designation:", designationError);
      }
    }

    employee.name = userData.name || "";
    employee.phone = userData.mobile || "";
    employee.nid = apiData.nid || "";
    employee.bloodGroup = apiData.blood_group || "";
    employee.designation = designationName || "";
    employee.issuedDate = new Date().toISOString().slice(0, 10);
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error.response?.data?.message || "কর্মচারীর তথ্য লোড করতে ব্যর্থ হয়েছে",
    });
  } finally {
    personalLoading.value = false;
  }
};

const employeePhotoUrl = ref("https://cdn.quasar.dev/img/boy-avatar.png");

// Modify your fetchEmployeePhoto function to update the ref
const fetchEmployeePhoto = async () => {
  try {
    const { data } = await api.get(
      `/v1/files?searchJoin=and&search=owner_type:employee;owner_id:${userId}`
    );

    if (data.data.length > 0) {
      employeePhotoUrl.value = `https://yshr_app.dyd-govbd.com/storage/${data.data[0].path}`;
      const fullUrl = employeePhotoUrl.value;
      const base64Img = await convertImageUrlToBase64(fullUrl);
      employeePhotoUrl.value = base64Img;
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error.response?.data?.message || "ছবি লোড করতে ব্যর্থ হয়েছে",
    });
  }
};

async function convertImageUrlToBase64(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // prevent CORS issues
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/jpeg"); // or image/png
      resolve(dataURL);
    };
    img.onerror = reject;
    img.src = url;
  });
}

onMounted(() => {
  fetchEmployeeData();
  fetchEmployeePhoto();
});

const qrCodeValue = computed(() => {
  return `নাম: ${employee.name}\nপদবী: ${employee.designation}\nমোবাইল: ${employee.phone}`;
});
</script>

<style scoped>
.qr-small {
  margin-top: 20px;
  margin-right: -45px;
  transform: scale(0.7);
  transform-origin: top left;
}
.id-card {
  width: 300px;
  height: 416px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.suku {
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 0px;
  padding-bottom: 0px;
}

.fbasis {
  flex-basis: 53%;
}

.qr-wrapper {
  padding: 0;
  margin: 0;
}

.su {
  align-items: center;
}

.company-logo {
  width: 60px;
  height: 60px;
  margin: auto;
  border-radius: 50%;
}

.card-footer {
  height: 60px;
  margin-top: 10px;
}

.card-footer1 {
  height: 60px;
  margin-top: 21px;
}
.employee-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #1976d2;
  margin: auto;
}

.qr-code {
  width: 80px;
  height: 80px;
  margin: auto;
}

.text-bold {
  font-weight: bold;
}

.signature-line {
  border-top: 1px solid #000;
  width: 80%;
  margin: 10px auto;
}

.q-list {
  padding-left: 10px;
}

.q-list li {
  margin-bottom: 8px;
}
</style>
