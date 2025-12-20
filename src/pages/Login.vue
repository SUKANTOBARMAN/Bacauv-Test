<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-gradient flex-center">
        <div class="login-container">
          <q-card class="login-card shadow-15 q-pa-lg" flat bordered>
            
            <q-card-section class="text-center q-pb-md">
              <div class="logo-container q-mb-md">
                <img src="../assets/logo.jpg" alt="Corporation Logo" class="corporation-logo">
              </div>
              <div class="text-h6 text-weight-bolder text-primary q-mb-xs">
                Bangladesh Customs & VAT Officers' Association
              </div>
            </q-card-section>
            
            <q-card-section class="text-center q-pt-md q-pb-none">
              <div class="login-avatar-container q-mb-lg">
              </div>
              <div class="text-subtitle2 text-grey-7">Sign in to your account</div>
            </q-card-section>

            <q-card-section class="q-pt-lg">
              <q-form
                class="q-gutter-md"
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

                <div class="q-mt-lg">
                  <q-btn
                    label="Sign In"
                    type="submit"
                    color="primary"
                    size="lg"
                    class="full-width q-mb-sm custom-submit-btn"
                    rounded
                    no-caps
                    icon-right="login"
                  />

                  <div class="text-center">
                    <q-btn
                      to="/forgot-password"
                      label="Forgot Password?"
                      type="button"
                      color="secondary"
                      flat
                      no-caps
                      icon="help_outline"
                      class="text-weight-medium"
                    />
                  </div>
                </div>
              </q-form>
            </q-card-section>

            <q-card-section class="text-center q-pt-md">
              <q-separator class="q-mb-md" />
              <div class="text-body2 text-grey-7">
                Don't have an account?
              </div>
              <q-btn
                to="/register"
                label="Create Account"
                color="primary"
                flat
                no-caps
                icon="person_add"
                class="text-weight-bold q-mt-sm"
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
    
      const params = new URLSearchParams();
      params.append("mobile", formData.value.phone);
      params.append("password", formData.value.password);
      const response = await api.post("v1/clients/web/login", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      loginForm.value.resetValidation();
      
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
:root {
  --color-primary: #004d40; 
  --color-secondary: #ffb300; 
  --color-background-start: #e0f2f1; 
  --color-background-end: #b2dfdb; 
}

.text-primary { color: var(--color-primary) !important; }
.text-secondary { color: var(--color-secondary) !important; }
.bg-primary { background: var(--color-primary) !important; }
.bg-secondary { background: var(--color-secondary) !important; }

.bg-gradient {
  background: linear-gradient(135deg, var(--color-background-start) 0%, var(--color-background-end) 100%);
  min-height: 100vh;
}

.login-container {
  width: 100%;
  max-width: 450px; 
  margin: 0 auto;
}

.login-card {
  background: #ffffff;
  border-radius: 12px;
  border: none;
  box-shadow: 0 10px 30px rgba(0, 77, 64, 0.15); 
}

/* Logo Styles */
.logo-container {
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
}
.corporation-logo {
    max-width: 200px;
    height: auto;
}

/* Avatar Style */
.login-avatar-container {
  position: relative;
}

.login-avatar {
  background: var(--color-primary); 
  border: 4px solid var(--color-secondary); 
}

.custom-input :deep(.q-field__control) {
  border-radius: 8px;
  background: #f8f8f8 !important; 
}

.custom-submit-btn {
  font-weight: bold;
  border-radius: 8px; 
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 10px rgba(0, 77, 64, 0.3); 
  background: #00382e !important;
  color: white !important;
}

.custom-submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 77, 64, 0.5);
}

.custom-submit-btn.q-btn--primary {
  background: var(--color-primary) !important;
}

.custom-submit-btn.q-btn--primary:hover {
  background: #00382e !important;
}

@media (max-width: 600px) {
  .login-container {
    padding: 20px;
  }
  
  .login-card {
    margin: 0;
  }
}

</style>
