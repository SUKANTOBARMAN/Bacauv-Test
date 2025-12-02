<template>
  <q-card bordered class="q-pa-md">
    <q-card-section>
      <div class="text-h6 text-grey-8 text-center">Update Contact Information</div>
    </q-card-section>

    <q-form ref="contactFormRef" @submit.prevent="submitForm">
      <q-card-section>
        <div class="row justify-center q-gutter-md">
          <div class="col-8">
            <q-input
              v-model="formData.email"
              label="Email"
              dense
              outlined
              :rules="[
                (val) => !!val || 'Email is required',
                (val) => /.+@.+\..+/.test(val) || 'Invalid email format',
              ]"
              lazy-rules
              :error="!!errors.email"
              :error-message="errors.email ? errors.email[0] : ''"
            />
          </div>
          <div class="col-8">
            <q-input
              v-model="formData.phone"
              label="Phone"
              dense
              outlined
              :rules="[
                (val) => !!val || 'Phone is required',
                (val) => val.length <= 20 || 'Phone must be 20 characters or less',
              ]"
              lazy-rules
              :error="!!errors.phone"
              :error-message="errors.phone ? errors.phone[0] : ''"
            />
          </div>
          <div class="col-8">
            <q-input
              v-model="formData.address"
              label="Address"
              dense
              outlined
              :rules="[(val) => !!val || 'Address is required']"
              lazy-rules
              :error="!!errors.address"
              :error-message="errors.address ? errors.address[0] : ''"
            />
          </div>
          <div class="col-8">
            <q-input
              v-model="formData.facebook"
              label="Facebook (URL)"
              dense
              outlined
              :rules="[
                (val) => !val || /^https?:\/\/.+/.test(val) || 'Invalid URL format',
              ]"
              lazy-rules
              :error="!!errors.facebook"
              :error-message="errors.facebook ? errors.facebook[0] : ''"
            />
          </div>
          <div class="col-8">
            <q-input
              v-model="formData.instagram"
              label="Instagram (URL)"
              dense
              outlined
              :rules="[
                (val) => !val || /^https?:\/\/.+/.test(val) || 'Invalid URL format',
              ]"
              lazy-rules
              :error="!!errors.instagram"
              :error-message="errors.instagram ? errors.instagram[0] : ''"
            />
          </div>
          <div class="col-8">
            <q-input
              v-model="formData.youtube"
              label="YouTube (URL)"
              dense
              outlined
              :rules="[
                (val) => !val || /^https?:\/\/.+/.test(val) || 'Invalid URL format',
              ]"
              lazy-rules
              :error="!!errors.youtube"
              :error-message="errors.youtube ? errors.youtube[0] : ''"
            />
          </div>
          <div class="col-8">
            <q-input
              v-model="formData.whatsapp"
              label="WhatsApp"
              dense
              outlined
              :rules="[
                (val) => !val || val.length <= 20 || 'WhatsApp must be 20 characters or less',
              ]"
              lazy-rules
              :error="!!errors.whatsapp"
              :error-message="errors.whatsapp ? errors.whatsapp[0] : ''"
            />
          </div>
          <div class="col-8">
            <q-input
              v-model="formData.twitter"
              label="Twitter (URL)"
              dense
              outlined
              :rules="[
                (val) => !val || /^https?:\/\/.+/.test(val) || 'Invalid URL format',
              ]"
              lazy-rules
              :error="!!errors.twitter"
              :error-message="errors.twitter ? errors.twitter[0] : ''"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="q-pa-md">
        <div class="row justify-center">
          <q-btn class="q-mr-sm" label="Update" color="primary" type="submit" />
        </div>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { api } from "boot/axios";
import { showErrorMsg, showSuccessMsg } from "src/utilities/helpers";

export default {
  name: "UpdateContactForm",

  data() {
    return {
      formData: {
        email: "",
        phone: "",
        address: "",
        facebook: "",
        instagram: "",
        youtube: "",
        whatsapp: "",
        twitter: "",
      },
      errors: {},
    };
  },

  methods: {
    async fetchData() {
      try {
        const response = await api.get("/site-contact");
        this.formData = { ...response.data };
      } catch (error) {
        showErrorMsg("Failed to load contact information");
        console.error("Error fetching contact information:", error);
      }
    },

    async submitForm() {
      try {
        const response = await api.post("/site-contact", this.formData);
        showSuccessMsg("Contact information updated successfully");
      } catch (error) {
        showErrorMsg("Failed to update contact information");
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        }
      }
    },

    resetForm() {
      this.fetchData();
      this.errors = {};
    },
  },

  mounted() {
    this.fetchData();
  },
};
</script>
