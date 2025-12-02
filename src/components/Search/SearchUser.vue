<template>
  <div class="row items-center q-mb-md">
    <div class="col-6 q-pa-sm">
      <q-input
        outlined
        dense
        v-model="filters.userName"
        label="User Name"
        clearable
        @update:model-value="emitFilters"
        debounce="300"
      />
    </div>
    <div class="col-6 q-pa-sm">
      <q-select
        outlined
        dense
        v-model="filters.designation"
        :options="designationOptions"
        label="Designation"
        emit-value
        map-options
        @update:model-value="emitFilters"
        clearable
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "SearchUsers",
  data() {
    return {
      filters: {
        userName: "",
        designation: null,
      },
      designationOptions: ["Manager", "Engineer", "Technician", "Clerk", "Other"],
    };
  },
  methods: {
    emitFilters() {
      this.$emit("search", { ...this.filters });
    },
  },
});
</script>

<style scoped>
/* Add any specific styles if needed */
</style>
