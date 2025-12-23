<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-gradient">
        <div class="login-container">
          <q-card class="login-card" flat>

            <!-- Header -->
            <q-card-section class="text-center q-pb-sm">
              <img
                src="../assets/logo.jpg"
                alt="Logo"
                class="corporation-logo"
              />

              <div class="text-subtitle1 text-weight-bold text-primary q-mt-sm">
                Bangladesh Customs & VAT Officers' Association
              </div>

              <div class="text-caption text-grey-7 q-mt-xs">
                Sign in to your account
              </div>
            </q-card-section>

            <q-separator />

            <!-- Login Form -->
            <q-card-section class="q-pt-md">
              <q-form
                ref="loginForm"
                class="q-gutter-md"
                @submit.prevent="handleLogin"
              >

                <!-- Phone -->
                <q-input
                  filled
                  v-model="formData.phone"
                  label="Phone Number"
                  mask="###########"
                  class="custom-input"
                  lazy-rules
                  :rules="[
                    val => !!val || 'Phone is required',
                    val => val.length === 11 || 'Must be 11 digits'
                  ]"
                >
                  <template #prepend>
                    <q-icon name="phone" color="primary" />
                  </template>
                </q-input>

                <!-- Password -->
                <q-input
                  filled
                  v-model="formData.password"
                  label="Password"
                  class="custom-input"
                  :type="showPassword ? 'text' : 'password'"
                  lazy-rules
                  :rules="[val => !!val || 'Password is required']"
                >
                  <template #prepend>
                    <q-icon name="lock" color="primary" />
                  </template>
                  <template #append>
                    <q-icon
                      :name="showPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>

                <!-- Submit Button - Centered -->
                <div class="flex justify-center q-mt-md">
                  <q-btn
                    label="Sign In"
                    type="submit"
                    class="custom-submit-btn"
                    icon-right="login"
                    no-caps
                    style="min-width: 365px;"
                  />
                </div>

                <!-- Forgot Password - Also Centered -->
                <div class="flex justify-center q-mt-sm">
                  <q-btn
                    to="/forgot-password"
                    label="Forgot password?"
                    flat
                    dense
                    no-caps
                    color="secondary"
                  />
                </div>

              </q-form>
            </q-card-section>

            <q-separator />

            <!-- Footer -->
            <q-card-section class="text-center q-pt-sm">
              <div class="text-caption text-grey-7">
                Don't have an account?
              </div>
              <q-btn
                to="/register"
                label="Create Account"
                flat
                no-caps
                icon="person_add"
                color="primary"
                class="text-weight-bold"
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

const handleLogin = async () => {
  const isValid = await loginForm.value.validate();
  if (!isValid) return;

  try {
    const params = new URLSearchParams();
    params.append("mobile", formData.value.phone);
    params.append("password", formData.value.password);

    const response = await api.post(
      "v1/clients/web/login",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    userStore.login({
      name: "User",
      accessToken: response.data.access_token,
    });

    $q.notify({
      type: "positive",
      message: "Login successful",
      position: "top",
    });

    router.push("/");
  } catch (err) {
    $q.notify({
      type: "negative",
      message:
        err.response?.data?.message ||
        "Invalid phone or password",
      position: "top",
    });
  }
};
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #e0f2f1, #b2dfdb);
  min-height: 100vh;
}

.login-container {
  width: 100%;
  max-width: 470px;
  padding: 16px;
}

.login-card {
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 77, 64, 0.2);
}

.corporation-logo {
  max-width: 150px;
}

.custom-input :deep(.q-field__control) {
  background: #f7f9f9 !important;
  border-radius: 10px;
}

.custom-submit-btn {
  background: #004d40 !important;
  color: white;
  font-weight: 600;
  border-radius: 10px;
  height: 48px;
  box-shadow: 0 6px 15px rgba(0, 77, 64, 0.4);
  transition: 0.2s;
}

.custom-submit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(0, 77, 64, 0.5);
}
</style>