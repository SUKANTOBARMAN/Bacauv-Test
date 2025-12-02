<template>
  <div class="row items-center q-mb-md">
    <div class="col-4 q-pa-sm">
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
    <div class="col-4 q-pa-sm">
      <q-input
        outlined
        dense
        v-model="filters.roomNo"
        label="Room No"
        clearable
        @update:model-value="emitFilters"
        debounce="300"
      />
    </div>
    <div class="col-4 q-pa-sm">
      <q-input
        outlined
        dense
        v-model="filters.resourceName"
        label="Resource Name"
        clearable
        @update:model-value="emitFilters"
        debounce="300"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "SearchAllocations",
  data() {
    return {
      filters: {
        userName: "",
        roomNo: "",
        resourceName: "",
      },
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
