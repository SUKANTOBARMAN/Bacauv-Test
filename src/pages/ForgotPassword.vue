<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-forgot">
        <q-card class="q-pa-lg shadow-2" style="width: 100%; max-width: 400px">
          <q-card-section>
            <div class="text-h5 text-center">Forgot Password</div>
            <div class="text-subtitle2 text-center q-mb-md">
              Enter your phone number to reset your password
            </div>
          </q-card-section>

          <q-form @submit.prevent="submitPhoneNumber">
            <q-card-section class="q-gutter-md">
              <q-input
                v-model="phoneNumber"
                label="Phone Number"
                filled
                type="tel"
                :rules="[(val) => !!val || 'Phone number is required']"
                hint="e.g. +8801XXXXXXXXX"
              />

              <q-btn
                label="Submit"
                type="submit"
                color="primary"
                class="full-width"
              />
            </q-card-section>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { showSuccessMsg, showErrorMsg } from "../utilities/helpers";

export default defineComponent({
  name: "ForgotPassword",
  setup() {
    const phoneNumber = ref("");
    const router = useRouter();

    const submitPhoneNumber = async () => {
      if (phoneNumber.value) {
        try {
          const response = await api.post("/v1/otps/generate", {
            identifier: phoneNumber.value,
          });

          if (response.data) {
            showSuccessMsg(response.data.message || "Otp sent successfully");
            router.push({
              name: "MatchOtp",
              query: {
                phone: phoneNumber.value,
              },
            });
          } else {
            showErrorMsg(error.response?.data?.message || "Otp sent failed");
          }
        } catch (error) {
          showErrorMsg(error.response?.data?.message || "Otp sent failed");
        }
      }
    };

    return {
      phoneNumber,
      submitPhoneNumber,
    };
  },
});
</script>

<style>
.bg-forgot {
  background: linear-gradient(to bottom right, #6a11cb, #2575fc);
  min-height: 100vh;
}
</style>
