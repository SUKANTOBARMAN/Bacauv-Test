<template>
  <div>
    <q-card class="q-pa-md">
      <div class="row items-center justify-between">
        <div class="text-h6">Personal Information</div>
        <q-btn flat icon="edit" color="primary" @click="showEditDialog = true" />
      </div>
      <q-separator class="q-mb-md" />
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-item dense>
            <q-item-section>
              <q-item-label caption class="text-grey-7 text-bold">Date of Birth</q-item-label>
              <q-item-label class="text-weight-bold">{{ personalInfo.dateOfBirth }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-12 col-md-6">
          <q-item dense>
            <q-item-section>
              <q-item-label caption class="text-grey-7 text-bold">Father's Name</q-item-label>
              <q-item-label class="text-weight-bold">{{ personalInfo.fatherName }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-12 col-md-6">
          <q-item dense>
            <q-item-section>
              <q-item-label caption class="text-grey-7 text-bold">Mother's Name</q-item-label>
              <q-item-label class="text-weight-bold">{{ personalInfo.motherName }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-12 col-md-6">
          <q-item dense>
            <q-item-section>
              <q-item-label caption class="text-grey-7 text-bold">Religion</q-item-label>
              <q-item-label class="text-weight-bold">{{ personalInfo.religion }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-12 col-md-6">
          <q-item dense>
            <q-item-section>
              <q-item-label caption class="text-grey-7 text-bold">Gender</q-item-label>
              <q-item-label class="text-weight-bold">{{ personalInfo.gender }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-12 col-md-6">
          <q-item dense>
            <q-item-section>
              <q-item-label caption class="text-grey-7 text-bold">Spouse Name</q-item-label>
              <q-item-label class="text-weight-bold">{{ personalInfo.spouseName }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card>

    <q-dialog v-model="showEditDialog">
      <q-card class="q-pa-md" style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit Personal Information</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="saveChanges">
            <q-input v-model="editablePersonalInfo.dateOfBirth" label="Date of Birth" filled dense class="q-mb-md" />
            <q-input v-model="editablePersonalInfo.fatherName" label="Father's Name" filled dense class="q-mb-md" />
            <q-input v-model="editablePersonalInfo.motherName" label="Mother's Name" filled dense class="q-mb-md" />
            <q-input v-model="editablePersonalInfo.religion" label="Religion" filled dense class="q-mb-md" />
            <q-input v-model="editablePersonalInfo.gender" label="Gender" filled dense class="q-mb-md" />
            <q-input v-model="editablePersonalInfo.spouseName" label="Spouse Name" filled dense class="q-mb-md" />
            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="negative" v-close-popup />
              <q-btn label="Save" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  props: {
    personalInfo: Object,
  },
  data() {
    return {
      showEditDialog: false,
      editablePersonalInfo: { ...this.personalInfo },
    };
  },
  watch: {
    personalInfo: {
      handler(newVal) {
        this.editablePersonalInfo = { ...newVal };
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    saveChanges() {
      this.$emit('update:personalInfo', { ...this.editablePersonalInfo });
      this.showEditDialog = false;
    },
  },
};
</script>
