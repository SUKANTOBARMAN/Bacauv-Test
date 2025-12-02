<template>
  <div>
    <q-card class="q-pa-md q-my-md ">
      <div class="row items-center justify-between">
        <div class="text-h6">Workplace History</div>
        <q-btn label="Add" color="primary" class="q-mb-sm" icon="add" @click="openModal()" />
      </div>
      <q-separator class="q-mb-md" />
      <q-table flat bordered :rows="workplaceHistory" :columns="workplaceColumns" row-key="id">
        <template v-slot:body-cell-Action="props">
          <q-td class="text-center">
            <q-btn dense flat icon="edit" color="primary" @click="openModal(props.row)" />
            <q-btn dense flat icon="delete" color="negative" @click="$emit('deleteWorkplace', props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Add/Edit Workplace Modal -->
    <q-dialog v-model="showModal">
      <q-card class="q-pa-md" style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? "Edit Workplace" : "Add Workplace" }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="saveWorkplace">
            <q-input v-model="workplaceData.workplace" label="Workplace" filled dense class="q-mb-md" required />
            <q-input v-model="workplaceData.start" label="Start Date" type="date" filled dense class="q-mb-md" required />
            <q-input v-model="workplaceData.end" label="End Date" type="date" filled dense class="q-mb-md" />
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
    workplaceHistory: Array,
  },
  data() {
    return {
      showModal: false,
      isEditing: false,
      workplaceData: { id: null, workplace: "", start: "", end: "" },
      workplaceColumns: [
        { name: "workplace", label: "Workplace", field: "workplace", sortable: true },
        { name: "start", label: "Start Date", field: "start", sortable: true },
        { name: "end", label: "End Date", field: "end", sortable: true },
        { name: "Action", label: "Actions", align: "center" },
      ],
    };
  },
  methods: {
    openModal(workplace = null) {
      if (workplace) {
        this.workplaceData = { ...workplace };
        this.isEditing = true;
      } else {
        this.workplaceData = { id: null, workplace: "", start: "", end: "" };
        this.isEditing = false;
      }
      this.showModal = true;
    },
    saveWorkplace() {
      if (this.isEditing) {
        this.$emit("updateWorkplace", { ...this.workplaceData });
      } else {
        this.$emit("addWorkplace", { ...this.workplaceData, id: Date.now() });
      }
      this.showModal = false;
    },
  },
};
</script>
