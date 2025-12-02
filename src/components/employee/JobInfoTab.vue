<template>
  <div>
    <q-card class="q-pa-md q-my-md">
      <div class="row items-center justify-between">
        <div class="text-h6">Job Information</div>
        <q-btn flat icon="edit" color="primary" @click="showEditDialog = true" />
      </div>
      <q-separator class="q-mb-md" />
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-item dense>
            <q-item-section>
              <q-item-label caption class="text-grey-7 text-bold">Designation</q-item-label>
              <q-item-label class="text-weight-bold">{{ jobInfo.designation }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-12 col-md-6">
          <q-item dense>
            <q-item-section>
              <q-item-label caption class="text-grey-7 text-bold">Joining Date</q-item-label>
              <q-item-label class="text-weight-bold">{{ jobInfo.joiningDate }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-12 col-md-6">
          <q-item dense>
            <q-item-section>
              <q-item-label caption class="text-grey-7 text-bold">Salary</q-item-label>
              <q-item-label class="text-weight-bold">{{ jobInfo.salary }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
        <div class="col-12 col-md-6">
          <q-item dense>
            <q-item-section>
              <q-item-label caption class="text-grey-7 text-bold">Basic Salary</q-item-label>
              <q-item-label class="text-weight-bold">{{ jobInfo.basicSalary }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card>

    <q-dialog v-model="showEditDialog">
      <q-card class="q-pa-md" style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Edit Job Information</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="saveChanges">
            <q-input v-model="editableJobInfo.designation" label="Designation" filled dense class="q-mb-md" />
            <q-input v-model="editableJobInfo.joiningDate" label="Joining Date" type="date" filled dense class="q-mb-md" />
            <q-input v-model="editableJobInfo.salary" label="Salary" filled dense class="q-mb-md" />
            <q-input v-model="editableJobInfo.basicSalary" label="Basic Salary" filled dense class="q-mb-md" />
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
    jobInfo: Object,
  },
  data() {
    return {
      showEditDialog: false,
      editableJobInfo: { ...this.jobInfo },
    };
  },
  watch: {
    jobInfo: {
      handler(newVal) {
        this.editableJobInfo = { ...newVal };
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    saveChanges() {
      this.$emit("update:jobInfo", { ...this.editableJobInfo });
      this.showEditDialog = false;
    },
  },
};
</script>
