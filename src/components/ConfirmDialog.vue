<template>
  <q-dialog v-model="dialogVisible" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <!--        <q-icon name="delete" />-->
        <span class="q-ml-sm">{{ props.title }}</span>
      </q-card-section>
      <q-card-actions class="text-center" align="right">
        <q-btn flat label="Cancel" color="primary" @click="closeAction" />
        <q-btn flat label="Confirm" color="primary" @click="confirmAction" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps(["title"]);
const dialogVisible = true;
const emit = defineEmits(["confirm", "cancel"]);

const closeAction = () => {
  emit("cancel");
};

const confirmAction = () => {
  emit("confirm");
};
</script>

<style></style>
