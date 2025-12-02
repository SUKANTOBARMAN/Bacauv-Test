<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-verify">
        <q-card class="q-pa-lg shadow-2" style="width: 100%; max-width: 400px">
          <q-card-section>
            <div class="text-h5 text-center">OTP and password</div>
            <div class="text-subtitle2 text-center q-mb-md">
              Enter the OTP and set a new password
            </div>
          </q-card-section>

          <q-form @submit.prevent="submitOtp">
            <q-card-section class="q-gutter-md">
              <q-input
                v-model="code"
                label="OTP"
                filled
                type="text"
                maxlength="6"
                :rules="[(val) => !!val || 'OTP is required']"
              />

              <q-input
                v-model="password"
                label="Password"
                filled
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                @focus="showRequirements = true"
                @blur="handlePasswordBlur"
              >
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <!-- Password Requirements - Show conditionally -->
              <div
                v-if="showRequirements"
                class="password-requirements q-mt-sm"
              >
                <div class="text-caption text-grey-7 q-mb-xs">
                  Password must contain:
                </div>
                <div class="requirement-list">
                  <div
                    :class="['requirement-item', { valid: hasMinLength }]"
                    class="text-caption"
                  >
                    <q-icon
                      :name="
                        hasMinLength ? 'check_circle' : 'radio_button_unchecked'
                      "
                      :color="hasMinLength ? 'positive' : 'grey-5'"
                      size="xs"
                    />
                    Minimum 8 characters
                  </div>
                  <div
                    :class="['requirement-item', { valid: hasLetters }]"
                    class="text-caption"
                  >
                    <q-icon
                      :name="
                        hasLetters ? 'check_circle' : 'radio_button_unchecked'
                      "
                      :color="hasLetters ? 'positive' : 'grey-5'"
                      size="xs"
                    />
                    Contains letters
                  </div>
                  <div
                    :class="['requirement-item', { valid: hasMixedCase }]"
                    class="text-caption"
                  >
                    <q-icon
                      :name="
                        hasMixedCase ? 'check_circle' : 'radio_button_unchecked'
                      "
                      :color="hasMixedCase ? 'positive' : 'grey-5'"
                      size="xs"
                    />
                    Mixed case (A-z)
                  </div>
                  <div
                    :class="['requirement-item', { valid: hasNumber }]"
                    class="text-caption"
                  >
                    <q-icon
                      :name="
                        hasNumber ? 'check_circle' : 'radio_button_unchecked'
                      "
                      :color="hasNumber ? 'positive' : 'grey-5'"
                      size="xs"
                    />
                    Contains number
                  </div>
                  <div
                    :class="['requirement-item', { valid: hasSpecialChar }]"
                    class="text-caption"
                  >
                    <q-icon
                      :name="
                        hasSpecialChar
                          ? 'check_circle'
                          : 'radio_button_unchecked'
                      "
                      :color="hasSpecialChar ? 'positive' : 'grey-5'"
                      size="xs"
                    />
                    Special character (!@#$%^&*)
                  </div>
                </div>
              </div>

              <q-input
                v-model="password_confirmation"
                label="Confirm Password"
                filled
                :type="showConfirmPassword ? 'text' : 'password'"
                :rules="[
                  (val) => !!val || 'Confirmation is required',
                  (val) => val === password || 'Passwords do not match',
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="
                      showConfirmPassword ? 'visibility_off' : 'visibility'
                    "
                    class="cursor-pointer"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </q-input>

              <q-btn
                label="Confirm"
                type="submit"
                color="primary"
                class="full-width"
                :disable="!isPasswordValid"
              />
            </q-card-section>
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed } from "vue";
import { api } from "boot/axios";
import { useRoute, useRouter } from "vue-router";
import { showSuccessMsg, showErrorMsg } from "../utilities/helpers";

export default {
  name: "OtpVerification",

  setup() {
    const code = ref("");
    const route = useRoute();
    const router = useRouter();
    const identifier = ref("");
    identifier.value = String(route.query.phone);
    const password = ref("");
    const password_confirmation = ref("");
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const showRequirements = ref(false);

    console.log("Identifier:", identifier);

    // Password validation computed properties
    const hasMinLength = computed(() => password.value.length >= 8);
    const hasLetters = computed(() => /[a-zA-Z]/.test(password.value));
    const hasMixedCase = computed(
      () => /[a-z]/.test(password.value) && /[A-Z]/.test(password.value)
    );
    const hasNumber = computed(() => /\d/.test(password.value));
    const hasSpecialChar = computed(() =>
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password.value)
    );

    const isPasswordValid = computed(() => {
      return (
        hasMinLength.value &&
        hasLetters.value &&
        hasMixedCase.value &&
        hasNumber.value &&
        hasSpecialChar.value
      );
    });

    // Password validation rules
    const passwordRules = [
      (val) => !!val || "Password is required",
      (val) => val.length >= 8 || "Password must be at least 8 characters",
      (val) => /[a-zA-Z]/.test(val) || "Password must contain letters",
      (val) =>
        (/[a-z]/.test(val) && /[A-Z]/.test(val)) ||
        "Password must contain both uppercase and lowercase letters",
      (val) => /\d/.test(val) || "Password must contain at least one number",
      (val) =>
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val) ||
        "Password must contain at least one special character",
    ];

    // Handle password field blur
    const handlePasswordBlur = () => {
      // Hide requirements only if password is valid or empty
      if (isPasswordValid.value || password.value === "") {
        showRequirements.value = false;
      }
      // Keep showing if there are validation issues
    };

    const submitOtp = async () => {
      if (!code.value || !isPasswordValid.value) return;

      try {
        const payload = {
          code: code.value,
          identifier: identifier.value,
          password: password.value,
          password_confirmation: password_confirmation.value,
        };

        const response = await api.patch("/v1/password/reset/mobile", payload);
        showSuccessMsg("Password reset successfully!");
        router.push({ name: "Login" });
      } catch (err) {
        showErrorMsg(err.response?.data?.message || "Otp did not match");
      }
    };

    return {
      code,
      submitOtp,
      identifier,
      password,
      password_confirmation,
      showPassword,
      showConfirmPassword,
      showRequirements,
      passwordRules,
      hasMinLength,
      hasLetters,
      hasMixedCase,
      hasNumber,
      hasSpecialChar,
      isPasswordValid,
      handlePasswordBlur,
    };
  },
};
</script>

<style scoped>
.bg-verify {
  background: linear-gradient(to bottom right, #ff512f, #dd2476);
  min-height: 100vh;
}

.password-requirements {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  animation: slideDown 0.3s ease-out;
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

.requirement-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.requirement-item {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease;
}

.requirement-item.valid {
  color: #4caf50;
}

.requirement-item:not(.valid) {
  color: #9e9e9e;
}
</style>
