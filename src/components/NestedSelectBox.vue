<template>
  <q-select
    filled
    options-dense
    v-model="model"
    :options="options"
    :label="label"
    color="teal"
    option-value="id"
    option-label="name"
    clearable
    @clear="model = null"
    options-selected-class="text-deep-orange"
  >
    <template v-slot:option="scope">
      <NestedItem
        :parent="scope.opt"
        :open-items="openItems"
        @update:model="handleSelection"
        @toggle-open="toggleOpen"
      />
    </template>
  </q-select>
</template>

<script>
import NestedItem from './NestedItem.vue';

export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    initialValue: {
      default: null
    }
  },
  data() {
    return {
      model: this.initialValue,
      openItems: new Set()
    };
  },
  watch: {
    model(newValue) {
      this.$emit("change", newValue);
    },
    initialValue(nVal) {
      if (nVal === null) {
        this.model = null;
        return;
      }
      const category = this.findCategoryById(nVal, this.options);
      this.model = category || null;
    }
  },
  methods: {
    findCategoryById(id, categories) {
      for (const category of categories) {
        if (category.id === id) {
          return category;
        }

        if (category.children?.data?.length > 0) {
          const found = this.findCategoryById(id, category.children.data);
          if (found) {
            return found;
          }
        }
      }
      return null;
    },
    handleSelection(option) {
      this.model = option;
      // this.emitChange();
    },
    emitChange() {
      this.$emit('change', this.model);
    },
    toggleOpen(option) {
      if (this.openItems.has(option.id)) {
        this.openItems.delete(option.id);
      } else {
        this.openItems.add(option.id);
      }
    }
  },
  components: {
    NestedItem
  }
};
</script>
