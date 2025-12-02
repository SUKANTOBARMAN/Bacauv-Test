<template>
  <q-page class="q-pa-sm">
    <q-card class="no-shadow" bordered>
      <q-card-section>
         <div class="text-h6 text-indigo-8">পণ্যসমূহ</div>
        <div class="text-subtitle2">সকল পণ্যের তালিকা</div>
      </q-card-section>
    </q-card>
    <q-separator spaced />

    <div class="q-pa-none">
      <div class="row q-col-gutter-md">
        <div class="col-7">
          <q-card>
            <q-card-section>
              <q-table :rows="products" :columns="columns" row-key="id">
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn
                      size="sm"
                      color="primary"
                      icon="edit"
                      @click="editItem(props.row)"
                    />
                    <q-btn
                      size="sm"
                      color="negative"
                      icon="delete"
                      class="q-ml-sm"
                      @click="deleteItem(props.row)"
                    />
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-5">
          <q-card>
            <q-card-section>
              <div class="text-h6 text-indigo-8">
                {{ isEditing ? "পণ্য সম্পাদন করুন" : "নতুন পণ্য যুক্ত করুন" }}
              </div>
              <q-form
                @submit="onSubmit"
                @reset="onReset"
                class="q-gutter-md q-mt-lg"
              >
                <q-input
                  outlined
                  v-model="form.name"
                  label="পণ্যের নাম *"
                  :rules="[(val) => !!val || 'ঘরটি পূরণ করা আবশ্যক']"
                />

                <div>
                  <q-btn label="সংরক্ষণ করুন" type="submit" color="primary" />
                  <q-btn
                    label="রিসেট করুন"
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
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { handleApiError } from "src/utilities/apiErrorHandler.js";

const $q = useQuasar();

const form = ref({ category_id: null, name: "" });
const isEditing = ref(null);
const products = ref([]);

const columns = [
  { name: "name", label: "পণ্যের নাম", field: "name", align: "left" },
  { name: "actions", label: "কর্ম", field: "actions", align: "right" },
];

const fetchProducts = async () => {
  try {
    const { data } = await api.get("/v1/resources");
    products.value = Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    handleApiError(error, $q);
  }
};

const onSubmit = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/v1/resources/${isEditing.value.id}`, form.value);
    } else {
      await api.post("/v1/resources", form.value);
    }
    $q.notify({
      message: "পণ্য সফলভাবে সংরক্ষণ হয়েছে",
      color: "positive",
      icon: "check",
    });
    onReset();
    await fetchProducts();
  } catch (error) {
   $q.notify({
      message:
        error?.response?.data?.message ||
        "পণ্য সংরক্ষণ করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।",
      color: "negative",
      icon: "error",
    });
  }
};

const onReset = () => {
  form.value = { name: "", category_id: null };
  isEditing.value = null;
};

const editItem = (row) => {
  form.value = { name: row.name, category_id: row.category_id };
  isEditing.value = row;
};

const deleteItem = async (row) => {
  $q.dialog({
    title: "নিশ্চিত করুন",
    message: "আপনি কি নিশ্চিত?",
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await api.delete(`/v1/resources/${row.id}`);
      $q.notify({
        message: "পণ্য মুছে ফেলা হয়েছে",
        color: "negative",
        icon: "check",
      });
      await fetchProducts();
    } catch (error) {
      handleApiError(error, $q);
    }
  });
};

onMounted(() => {
  fetchProducts();
});
</script>
