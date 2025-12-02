<template>
  <q-page class="q-pa-sm">
    <q-card class="no-shadow" bordered>
      <q-card-section>
        <div class="text-h6 text-indigo-8">Categories</div>
        <div class="text-subtitle2">List of all categories</div>
      </q-card-section>
    </q-card>
    <q-separator spaced />

    <div class="q-pa-none">
      <div class="row q-col-gutter-md">
        <div class="col-7">
          <q-card>
            <q-card-section>
              <simple-hierarchy
                :page="pageName"
                :tableData="buildCategoryHierarchy(allCategories)"
                @editItem="editItem"
                @deleteItem="deleteItem"
              ></simple-hierarchy>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-5">
          <div class="row ">
            <div class="col-12">
              <q-card>
                <q-card-section>
                  <div class="text-h6 text-indigo-8">
                    {{ isEditing ? "Edit" : "Add" }} Category
                  </div>

                  <q-form
                    @submit="onSubmit"
                    @reset="onReset"
                    class="q-gutter-md q-mt-lg"
                  >
                    <q-input
                      outlined
                      v-model="name"
                      :label="`Category name *`"
                      :hint="`Category name must be unique`"
                      :rules="[(val) => !!val || 'Field is required']"
                    />

                    <q-select
                      outlined
                      option-label="name"
                      option-value="id"
                      v-model="selectedParentCategory"
                      :options="allCategories"
                      :label="`Parent Category`"
                      map-options
                      clearable
                      emit-value
                    />
                    <div>
                      <q-btn label="Submit" type="submit" color="primary" />
                      <q-btn
                        label="Reset"
                        type="reset"
                        color="primary"
                        flat
                        class="q-ml-sm"
                      />
                    </div>
                  </q-form>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 q-mt-lg">
              <q-card>
                <q-card-section>
                  <div class="text-h6 text-grey-8">
                    Top Tags
                    <q-btn
                      class="float-right text-capitalize text-indigo-8 shadow-3"
                      icon="bookmark"
                      @click="updateTags"
                      label="Update Tags"
                    />
                  </div>
                </q-card-section>
                <q-card-section>
                  <q-select
                    v-model="tagIds"
                    :options="allCategories"
                    label="Select Tag"
                    option-label="name"
                    option-value="id"
                    outlined
                    use-input
                    multiple
                    use-chips
                    emit-value
                    map-options
                    clearable
                    @clear="
                            (val) => {
                              tagIds = [];
                            }
                          "
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>

        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { api } from "src/boot/axios";
import { defineComponent, defineAsyncComponent, ref } from "vue";
import { useQuasar } from "quasar";

import {useCategoryStore} from "stores/category";

import {buildCategoryHierarchy} from "src/utilities/helpers";

export default defineComponent({
  name: "Category",
  setup() {
    const categoryStore=useCategoryStore()
    const { $q } = useQuasar();
    return {
      $q,
      categoryStore
    };
  },
  data() {
    return {
      name: ref(""),
      pageName: "Category",
      tagIds:ref([]),
      allCategories: [],
      selectedParentCategory: ref(null),
      isEditing: ref(null),
    };
  },
  components: {
    SimpleHierarchy: defineAsyncComponent(() =>
      import("components/tree-table/SimpleHierarchy.vue")
    )
  },
  methods: {
    buildCategoryHierarchy,
    getCategories() {
      api
        .get("/categories")
        .then((response) => {
          this.allCategories = response.data;
          console.log(this.allCategories )
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async updateTags(){
      try {
        console.log(this.tagIds)
        const response=await api.post(`/categories/top`,{
          category_ids:this.tagIds
        });
        this.$q.notify({
          message: "Top Categories Updated",
          color: "positive",
          icon: "check",
        });
      }catch (error){

      }
    },
    async getTopTags(){
      try {
        const response=await api.get(`/top-categories`);
        if(response.data.length>0){
          response.data.map(item=>{
            this.tagIds.push(item.id)
          })
        }

      }catch (error){

      }
    },
    onSubmit(evt) {
      evt.preventDefault();

      if (this.isEditing) {
        api
          .put(`/categories/${this.isEditing.id}`, {
            name: this.name,
            parent_id: this.selectedParentCategory,
          })
          .then((res) => {
            this.$q.notify({
              message: "Category Updated Successfully",
              color: "positive",
              icon: "check",
            });
            this.name = "";
            this.selectedParentCategory = null;
            this.isEditing = null;
            this.categoryStore.loadCategories();
            this.getCategories();
          });
      } else {
        api
          .post("/categories", {
            name: this.name,
            parent_id: this.selectedParentCategory,
          })
          .then((res) => {
            this.$q.notify({
              message: "Category Added Successfully",
              color: "positive",
              icon: "check",
            });
            this.name = "";
            this.selectedParentCategory = null;
            this.getCategories();
            this.categoryStore.loadCategories();
          });
      }
    },
    onReset(evt) {
      this.name = "";
      this.selectedParentCategory = null;
      this.isEditing = null;
    },
    editItem(row) {
      this.name = row.name;
      this.selectedParentCategory = row.parent_id !== "" ? row.parent_id : null;
      this.isEditing = { status: true, id: row.id };
    },
    deleteItem(row) {
      // confirm
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure you want to delete this category?",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          api.delete(`/categories/${row.id}`).then((res) => {
            this.$q.notify({
              message: "Category Deleted Successfully",
              color: "negative",
              icon: "check",
            });

            this.getCategories();
          });
        });
    },
  },
  mounted() {
    this.getCategories();
    this.getTopTags()
  },
});
</script>

<style></style>
