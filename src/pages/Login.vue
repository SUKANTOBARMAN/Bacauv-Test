<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-gradient flex-center">
        <div class="login-container">
          <q-card class="login-card shadow-24 q-pa-lg" flat bordered>
            <!-- Header Section -->
            <q-card-section class="text-center q-pb-none">
              <div class="login-avatar-container q-mb-lg">
                <q-avatar size="120px" class="login-avatar shadow-10">
                  <q-icon name="account_circle" size="80px" color="primary" />
                </q-avatar>
              </div>
              <div class="text-h4 text-weight-light text-primary q-mb-sm">Welcome Back</div>
              <div class="text-subtitle1 text-grey-7">Sign in to your account</div>
            </q-card-section>

            <!-- Error Banner -->
            <q-card-section v-if="errors" class="q-pt-md">
              <q-banner class="bg-negative text-white rounded-borders" dense>
                <template v-slot:avatar>
                  <q-icon name="error" />
                </template>
                {{ errors }}
              </q-banner>
            </q-card-section>

            <!-- Login Form -->
            <q-card-section class="q-pt-lg">
              <q-form
                class="q-gutter-lg"
                ref="loginForm"
                @input="clearValidationErrors"
                @submit.prevent="handleLogin"
              >
                <div class="input-group">
                  <q-input
                    filled
                    v-model="formData.phone"
                    label="Phone Number"
                    lazy-rules
                    mask="###########"
                    class="custom-input"
                    :rules="[
                      (val) => !!val || 'Phone is required',
                      (val) => val.length === 11 || 'Phone must be 11 digits',
                    ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="phone" color="primary" />
                    </template>
                    <template v-slot:append>
                      <q-icon name="info" color="grey-5">
                        <q-tooltip class="bg-primary">Enter your 11-digit mobile number</q-tooltip>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="input-group">
                  <q-input
                    filled
                    v-model="formData.password"
                    label="Password"
                    lazy-rules
                    class="custom-input"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="[(val) => !!val || 'Password is required']"
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

                <!-- Action Buttons -->
                <div class="q-mt-xl">
                  <q-btn
                    label="Sign In"
                    type="submit"
                    color="primary"
                    size="lg"
                    class="full-width q-mb-md"
                    rounded
                    no-caps
                    icon="login"
                  />

                  <div class="text-center">
                    <q-btn
                      to="/forgot-password"
                      label="Forgot Password?"
                      type="button"
                      color="primary"
                      flat
                      no-caps
                      icon="help_outline"
                      class="text-weight-medium"
                    />
                  </div>
                </div>
              </q-form>
            </q-card-section>

            <!-- Register Link -->
            <q-card-section class="text-center q-pt-lg">
              <q-separator class="q-mb-lg" />
              <div class="text-body2 text-grey-7">
                Don't have an account?
              </div>
              <q-btn
                to="/register"
                label="Create Account"
                color="secondary"
                flat
                no-caps
                icon="person_add"
                class="text-weight-medium q-mt-sm"
              />
            </q-card-section>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useUserStore } from "stores/userStore";
import { api } from "boot/axios";

const $q = useQuasar();
const router = useRouter();
const userStore = useUserStore();

const loginForm = ref(null);
const showPassword = ref(false);
const formData = ref({
  phone: "",
  password: "",
});
const errors = ref(null);

const handleLogin = async () => {
  try {
    errors.value = null;
    const isValid = await loginForm.value.validate();

    if (isValid) {
      // Create URLSearchParams for x-www-form-urlencoded
      const params = new URLSearchParams();
      params.append("mobile", formData.value.phone);
      params.append("password", formData.value.password);
      const response = await api.post("v1/clients/web/login", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      loginForm.value.resetValidation();
      // Only set the token in the user store
       userStore.login({
        name: "User",
        accessToken: response.data.access_token,
      });
      
      await router.push("/");
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        errors.value =
          error.response.data.message || "Invalid phone or password";
      } else {
        errors.value =
          error.response.data.message || "An error occurred. Please try again.";
      }
    } else {
      errors.value = "Network error. Please check your connection.";
    }
  }
};

const clearValidationErrors = () => {
  errors.value = null;
};
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.login-container {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-avatar-container {
  position: relative;
}

.login-avatar {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: 4px solid white;
}

.custom-input {
  border-radius: 12px;
}

.custom-input :deep(.q-field__control) {
  border-radius: 12px;
}

.input-group {
  position: relative;
}

.text-red {
  color: red;
}

@media (max-width: 600px) {
  .login-container {
    padding: 16px;
  }
  
  .login-card {
    margin: 0;
  }
}
</style>