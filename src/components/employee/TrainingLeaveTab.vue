<template>
  <div>
    <!-- Training History -->
    <q-card class="q-pa-md">
      <div class="row items-center justify-between">
        <div class="text-h6">Training History</div>
        <q-btn label="Add" color="primary" class="q-mb-sm" icon="add" @click="openTrainingModal()" />
      </div>
      <q-separator class="q-mb-md" />

      <q-table flat bordered :rows="trainingHistory" :columns="trainingColumns" row-key="id">
        <template v-slot:body-cell-Action="props">
          <q-td class="text-center">
            <q-btn dense flat icon="edit" color="primary" @click="openTrainingModal(props.row)" />
            <q-btn dense flat icon="delete" color="negative" @click="$emit('deleteTraining', props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Leave History -->
    <q-card class="q-pa-md q-mt-md">
      <div class="row items-center justify-between">
        <div class="text-h6">Leave History</div>
        <q-btn label="Add" color="primary" class="q-mb-sm" icon="add" @click="openLeaveModal()" />
      </div>
      <q-separator class="q-mb-md" />

      <q-table flat bordered :rows="leaveHistory" :columns="leaveColumns" row-key="id">
        <template v-slot:body-cell-Action="props">
          <q-td class="text-center">
            <q-btn dense flat icon="edit" color="primary" @click="openLeaveModal(props.row)" />
            <q-btn dense flat icon="delete" color="negative" @click="$emit('deleteLeave', props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Training Modal -->
    <q-dialog v-model="showTrainingModal">
      <q-card class="q-pa-md" style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEditingTraining ? 'Edit' : 'Add' }} Training</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="saveTraining">
            <q-input v-model="trainingRecord.training" label="Training Name" filled dense class="q-mb-md" required />
            <q-input v-model="trainingRecord.start" label="Start Date" type="date" filled dense class="q-mb-md" required />

            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="negative" v-close-popup />
              <q-btn label="Save" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Leave Modal -->
    <q-dialog v-model="showLeaveModal">
      <q-card class="q-pa-md" style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEditingLeave ? 'Edit' : 'Add' }} Leave</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="saveLeave">
            <q-input v-model="leaveRecord.type" label="Leave Type" filled dense class="q-mb-md" required />
            <q-input v-model="leaveRecord.days" label="Leave Days" type="number" filled dense class="q-mb-md" required />
            <q-input v-model="leaveRecord.start" label="Start Date" type="date" filled dense class="q-mb-md" required />

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
    trainingHistory: Array,
    leaveHistory: Array,
  },
  data() {
    return {
      // Training modal state
      showTrainingModal: false,
      isEditingTraining: false,
      trainingRecord: { id: null, training: "", start: "" },

      // Leave modal state
      showLeaveModal: false,
      isEditingLeave: false,
      leaveRecord: { id: null, type: "", days: "", start: "" },

      trainingColumns: [
        { name: "training", label: "Training Name", field: "training", sortable: true },
        { name: "start", label: "Start Date", field: "start", sortable: true },
        { name: "Action", label: "Actions", align: "center" },
      ],
      leaveColumns: [
        { name: "type", label: "Leave Type", field: "type", sortable: true },
        { name: "days", label: "Leave Days", field: "days", sortable: true },
        { name: "start", label: "Start Date", field: "start", sortable: true },
        { name: "Action", label: "Actions", align: "center" },
      ],
    };
  },
  methods: {
    // Open Training Modal
    openTrainingModal(record = null) {
      if (record) {
        this.trainingRecord = { ...record };
        this.isEditingTraining = true;
      } else {
        this.trainingRecord = { id: null, training: "", start: "" };
        this.isEditingTraining = false;
      }
      this.showTrainingModal = true;
    },

    // Save Training Record
    saveTraining() {
      if (this.isEditingTraining) {
        this.$emit("updateTraining", { ...this.trainingRecord });
      } else {
        this.$emit("addTraining", { ...this.trainingRecord, id: Date.now() });
      }
      this.showTrainingModal = false;
    },

    // Open Leave Modal
    openLeaveModal(record = null) {
      if (record) {
        this.leaveRecord = { ...record };
        this.isEditingLeave = true;
      } else {
        this.leaveRecord = { id: null, type: "", days: "", start: "" };
        this.isEditingLeave = false;
      }
      this.showLeaveModal = true;
    },

    // Save Leave Record
    saveLeave() {
      if (this.isEditingLeave) {
        this.$emit("updateLeave", { ...this.leaveRecord });
      } else {
        this.$emit("addLeave", { ...this.leaveRecord, id: Date.now() });
      }
      this.showLeaveModal = false;
    },
  },
};
</script>
