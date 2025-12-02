import { defineStore } from "pinia";
import {buildCategoryHierarchy} from "src/utilities/helpers";
import {api} from "boot/axios";

const defaultStore = () => {
  return {
    categories: [],
    hierarchicalCategories: [],
  };
};

export const useCategoryStore = defineStore("category", {
  state: () => defaultStore(),

  getters: {
    getCategories: (state) => state.categories,

    getCategoryOptions: (state) =>
      state.categories.map((d) => ({
        label: d.name,
        value: d.id,
      })),
    getHierarchicalCategories: (state) => state.hierarchicalCategories,
    getHierarchicalCategoryOptions: (state) =>
      state.hierarchicalCategories.map((d) => ({
        label: d.name,
        value: d.id,
      })),

    getCategoryNameById: (state) => (id) => {
      const category = state.categories.find((d) => d.id === id);
      return category ? category.name : null;
    },
  },

  actions: {
    setCategory(newCategories) {
      this.categories = newCategories;
    },

    setHierarchicalCategories(newHierarchicalCategories) {
      this.hierarchicalCategories = newHierarchicalCategories;
    },


    async loadCategories() {
      try {
        const response = await api.get(`/categories`);
        this.setCategory(response.data);
        const hierarchicalData = buildCategoryHierarchy(response.data);
        this.setHierarchicalCategories(hierarchicalData);
      } catch (error) {
        console.error("Error loading Categories:", error);
      }

    },

  },
});
