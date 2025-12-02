<template>
  <q-page class="flex flex-center bg-grey-1">
    <div class="text-center q-pa-md">
      <div class="error-container">
        <q-icon name="block" size="xl" color="negative" class="q-mb-md" />
        <div class="text-h4 text-weight-bold q-mb-sm text-negative">
          Unauthorized Access
        </div>
        <div class="text-subtitle1 text-grey-8 q-mb-lg">
          You don't have permission to view this page
        </div>
        <q-separator class="q-mb-lg" />
        <div class="text-body1 q-mb-xl">
          Please contact your administrator if you believe this is an error
        </div>
        <q-btn
          color="primary"
          label="Return to Dashboard"
          icon="home"
          @click="goToDashboard"
          size="lg"
          unelevated
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToDashboard = () => {
  router.push('/'); // Adjust this to your dashboard route
};
</script>

<style scoped>
.error-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.q-icon {
  font-size: 5rem;
}
</style>