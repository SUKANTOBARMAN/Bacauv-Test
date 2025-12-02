<template>
  <div>
    <!-- Awards Section -->
    <q-card class="q-pa-md q-mt-md">
      <div class="row items-center justify-between">
        <div class="text-h6">Awards</div>
        <q-btn label="Add" color="primary" class="q-mb-sm" icon="add" @click="openAwardModal()" />
      </div>
      <q-separator class="q-mb-md" />

      <q-table flat bordered :rows="awardHistory" :columns="awardColumns" row-key="id">
        <template v-slot:body-cell-Action="props">
          <q-td class="text-center">
            <q-btn dense flat icon="edit" color="primary" @click="openAwardModal(props.row)" />
            <q-btn dense flat icon="delete" color="negative" @click="$emit('deleteAward', props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Penalties Section -->
    <q-card class="q-pa-md q-mt-md">
      <div class="row items-center justify-between">
        <div class="text-h6">Penalties</div>
        <q-btn label="Add" color="primary" class="q-mb-sm" icon="add" @click="openPenaltyModal()" />
      </div>
      <q-separator class="q-mb-md" />

      <q-table flat bordered :rows="penaltyHistory" :columns="penaltyColumns" row-key="id">
        <template v-slot:body-cell-Action="props">
          <q-td class="text-center">
            <q-btn dense flat icon="edit" color="primary" @click="openPenaltyModal(props.row)" />
            <q-btn dense flat icon="delete" color="negative" @click="$emit('deletePenalty', props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Award Modal -->
    <q-dialog v-model="showAwardModal">
      <q-card class="q-pa-md" style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEditingAward ? 'Edit Award' : 'Add Award' }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="saveAward">
            <q-input v-model="awardData.award" label="Award Type" filled dense class="q-mb-md" required />
            <q-input v-model="awardData.date" label="Award Date" type="date" filled dense class="q-mb-md" required />
            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="negative" v-close-popup />
              <q-btn label="Save" type="submit" color="primary" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Penalty Modal -->
    <q-dialog v-model="showPenaltyModal">
      <q-card class="q-pa-md" style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEditingPenalty ? 'Edit Penalty' : 'Add Penalty' }}</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="savePenalty">
            <q-input v-model="penaltyData.penalty" label="Penalty Type" filled dense class="q-mb-md" required />
            <q-input v-model="penaltyData.date" label="Penalty Date" type="date" filled dense class="q-mb-md" required />
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
    awardHistory: Array,
    penaltyHistory: Array,
  },
  data() {
    return {
      showAwardModal: false,
      showPenaltyModal: false,
      isEditingAward: false,
      isEditingPenalty: false,
      awardData: { id: null, award: "", date: "" },
      penaltyData: { id: null, penalty: "", date: "" },
      awardColumns: [
        { name: "award", label: "Award Type", field: "award", sortable: true },
        { name: "date", label: "Award Date", field: "date", sortable: true },
        { name: "Action", label: "Actions", align: "center" },
      ],
      penaltyColumns: [
        { name: "penalty", label: "Penalty Type", field: "penalty", sortable: true },
        { name: "date", label: "Penalty Date", field: "date", sortable: true },
        { name: "Action", label: "Actions", align: "center" },
      ],
    };
  },
  methods: {
    openAwardModal(record = null) {
      if (record) {
        this.awardData = { ...record };
        this.isEditingAward = true;
      } else {
        this.awardData = { id: null, award: "", date: "" };
        this.isEditingAward = false;
      }
      this.showAwardModal = true;
    },
    openPenaltyModal(record = null) {
      if (record) {
        this.penaltyData = { ...record };
        this.isEditingPenalty = true;
      } else {
        this.penaltyData = { id: null, penalty: "", date: "" };
        this.isEditingPenalty = false;
      }
      this.showPenaltyModal = true;
    },
    saveAward() {
      if (this.isEditingAward) {
        this.$emit("updateAward", { ...this.awardData });
      } else {
        this.$emit("addAward", { ...this.awardData, id: Date.now() });
      }
      this.showAwardModal = false;
    },
    savePenalty() {
      if (this.isEditingPenalty) {
        this.$emit("updatePenalty", { ...this.penaltyData });
      } else {
        this.$emit("addPenalty", { ...this.penaltyData, id: Date.now() });
      }
      this.showPenaltyModal = false;
    },
  },
};
</script>
