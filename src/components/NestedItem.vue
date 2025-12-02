<template>
  <div>
    <q-expansion-item
      v-if="hasChildren(parent)"
      dense
      expand-separator
      :default-opened="isOpen(parent)"
      :label="parent.name"
      @click="handleSelection(parent)"
    >
      <NestedItem
        v-for="child in parent.children?.data"
        :key="child.id"
        :parent="child"
        :open-items="openItems"
        @update:model="handleSelection"
        @toggle-open="toggleOpen"
      />
    </q-expansion-item>

    <q-item v-else @click="handleSelection(parent)" clickable  v-close-popup >
      {{ parent.name }}
    </q-item>
    <q-separator />
  </div>
</template>

<script>
export default {

  props: {
    parent: Object,
    openItems: Set
  },
  methods: {
    hasChildren(option) {
      return option.children?.data && option.children.data.length > 0;
    },
    isOpen(option) {
      return this.openItems.has(option.id);
    },
    toggleOpen(option) {
      if (this.openItems.has(option.id)) {
        this.openItems.delete(option.id);
      } else {
        this.openItems.add(option.id);
      }
    },
    handleSelection(option) {
      this.$emit('update:model', option);
      this.toggleOpen(option);
    }
  }
};
</script>
