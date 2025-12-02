<template>
  <q-page class="q-pa-sm bg-white">
    <div class="row q-col-gutter-sm">
      <div class="col-lg-7 col-md-7 col-sm-12 col-xs-12" style="margin: auto">
        <q-card class="no-shadow" bordered style="margin-top: 30px">
          <q-card-section>
            <div class="text-h6 text-grey-8 text-center">
              {{ isEdit ? "Edit Banner" : "Add Banner" }}
            </div>
            <q-form ref="bannerForm" @submit.prevent="submitForm">
              <div class="row">
                <!-- Title Field -->
                <div class="col-12">
                  <q-item>
                    <q-input
                      dense
                      outlined
                      v-model="formData.title"
                      class="full-width"
                      label="Video Title"
                      :error="!!errors.title"
                      :error-message="errors.title || ''"
                    />
                  </q-item>
                </div>
                <!-- Video URL Field -->
                <div class="col-12">
                  <q-item>
                    <q-input
                      dense
                      outlined
                      v-model="formData.video_url"
                      class="full-width"
                      label="Video URL"
                      :error="!!errors.video_url"
                      :error-message="errors.video_url || ''"
                    />
                  </q-item>
                </div>
                <!-- Submit Button -->
                <div class="col-12">
                  <q-item class="justify-center">
                    <q-btn
                      color="primary"
                      :label="isEdit ? 'Update' : 'Add'"
                      type="submit"
                    />
                  </q-item>
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12">
        <!-- Banners Table -->
        <q-card class="no-shadow" bordered style="margin-top: 30px">
          <q-card-section>
            <div class="text-h6 text-grey-8 text-center">Current Banners</div>
            <q-table dense :rows="banners" :columns="columns" row-key="id">
              <template v-slot:body-cell-actions="props">
                <q-td align="center">
                  <q-btn
                    flat
                    icon="delete"
                    color="negative"
                    @click="deleteBanner(props.row.id)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { api } from "boot/axios";

export default {
  data() {
    return {
      isEdit: false,
      formData: {
        id: "",
        title: "",
        video_url: "",
      },
      banners: [],
      errors: {},
      columns: [
        { name: "title", label: "Title", align: "left", field: "title" },
        { name: "video_url", label: "Video URL", align: "left", field: "video_url" },
        { name: "actions", label: "Actions", align: "center" },
      ],
    };
  },
  methods: {
    async fetchBanners() {
      try {
        const response = await api.get("/ui-sections/video");
        this.banners = response.data || [];
      } catch (error) {
        this.$q.notify({ type: "negative", message: "Failed to fetch banners" });
      }
    },
    async submitForm() {
      try {
        const payload = {
          title: this.formData.title,
          type: "video",
          attributes: [{ key: "link",order:1, value: this.formData.video_url }],
        };

        const endpoint = this.isEdit
          ? `/ui-sections/video/${this.formData.id}`
          : "/ui-sections/video";

        await api.post(endpoint, payload);
        await this.fetchBanners();
        this.$q.notify({
          type: "positive",
          message: this.isEdit ? "Banner updated successfully!" : "Banner added successfully!",
        });
      } catch (error) {
        this.errors = error.response?.data?.errors || {};
        this.$q.notify({ type: "negative", message: "Something went wrong!" });
      }
    },
    async deleteBanner(id) {
      try {
        await api.delete(`/ui-sections/${id}`);
        this.$q.notify({ type: "positive", message: "Banner deleted successfully!" });
        await this.fetchBanners();
      } catch (error) {
        this.$q.notify({ type: "negative", message: "Failed to delete banner" });
      }
    },
  },
  mounted() {
    this.fetchBanners();
  },
};
</script>
