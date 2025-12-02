<template>
  <div class="flex flex-center q-pa-md">
    <q-card
      class="q-pa-md"
      style="min-width: 350px; width: 100%; max-width: 500px"
    >
      <q-card-section>
        <div class="text-h6">Reset Your Password</div>
        <div class="text-subtitle2 text-grey">Enter your new password</div>
      </q-card-section>

      <q-form @submit.prevent="handleSubmit">
        <q-card-section>
          <q-input
            filled
            v-model="password"
            label="New Password"
            :type="showPassword ? 'text' : 'password'"
            :rules="[(val) => val.length >= 6 || 'Min 6 characters']"
            class="q-mb-md"
          >
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-input
            filled
            v-model="confirmPassword"
            label="Confirm Password"
            :type="showPassword ? 'text' : 'password'"
            :rules="[
              (val) => val.length >= 6 || 'Min 6 characters',
              (val) => val === password || 'Passwords do not match',
            ]"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Reset Password" type="submit" color="primary" />
        </q-card-actions>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);

const handleSubmit = () => {
  if (password.value === confirmPassword.value && password.value.length >= 6) {
    $q.notify({
      type: "positive",
      message: "Password reset successful!",
    });
    // Here you can add API call logic
  } else {
    $q.notify({
      type: "negative",
      message: "Please fix the errors before submitting",
    });
  }
};
</script>
