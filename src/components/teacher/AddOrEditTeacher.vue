<template>
  <q-dialog v-model="data.show">
    <q-card>
      <q-toolbar>
        <q-btn flat round dense icon="close" @click="close" />
      </q-toolbar>
      <q-card-section>
        <div class="text-h6 text-grey-8 text-center">
          {{ isEditMode ? 'Update Teacher' : 'Add Teacher' }}
        </div>
        <div class="row q-pa-md">
          <q-form
            @submit.prevent="submitForm"
            ref="teacherFormRef"
            @input="clearValidationErrors"
          >
            <div class="row q-pa-md">
              <!-- Teacher Name Input -->
              <div class="col-12">
                <q-item>
                  <q-input
                    dense
                    outlined
                    class="full-width"
                    v-model="formData.name"
                    label="Teacher Name"
                    :rules="[(val) => !!val || 'Teacher Name is required']"
                    lazy-rules
                    :error="!!errors && !!errors.name"
                    :error-message="
                      errors && errors.name ? errors.name[0] : ''
                    "
                  />
                </q-item>
              </div>

              <!-- Teacher Designation Input -->
              <div class="col-12">
                <q-item>
                  <q-input
                    dense
                    outlined
                    class="full-width"
                    v-model="formData.designation"
                    label="Designation"
                    :rules="[(val) => !!val || 'Designation is required']"
                    lazy-rules
                    :error="!!errors && !!errors.designation"
                    :error-message="
                      errors && errors.designation ? errors.designation[0] : ''
                    "
                  />
                </q-item>
              </div>

              <!-- Teacher Image Input -->
              <div class="col-8">
                <q-item>
                  <q-file
                    filled
                    v-model="formData.image"
                    bottom-slots
                    label="Teacher Image"
                    counter
                    @change="handleFileChange"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="formData.image = null"
                        class="cursor-pointer"
                      />
                    </template>
                    <template v-slot:hint> Upload teacher image </template>
                  </q-file>
                </q-item>
              </div>

              <!-- Teacher Course Input -->
              <div class="col-12">
                <q-item>
                  <q-input
                    dense
                    outlined
                    class="full-width"
                    v-model="formData.course"
                    label="Course"
                    :rules="[(val) => !!val || 'Course is required']"
                    lazy-rules
                    :error="!!errors && !!errors.course"
                    :error-message="
                      errors && errors.course ? errors.course[0] : ''
                    "
                  />
                </q-item>
              </div>

              <div class="col-12">
                <q-item class="justify-center">
                  <q-btn
                    color="primary"
                    type="submit"
                    :label="isEditMode ? 'Update Teacher' : 'Add Teacher'"
                  ></q-btn>
                </q-item>
              </div>
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { api } from "boot/axios";
import {showErrorMsg, showSuccessMsg} from "src/utilities/helpers";

export default {
  name: "AddOrEditTeacherDialog",

  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      formData: {
        name: "",
        image: null,
        designation: "",
        course: "",
      },
      errors: null,
    };
  },

  computed: {
    isEditMode() {
      return this.data.teacher !== null;
    },
  },

  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal.teacher) {
          this.formData = { ...this.formData, ...newVal.teacher, image: null };
        } else {
          this.data.teacher = null;
        }
      },
    },
  },

  methods: {
    submitForm() {
      if (this.isEditMode) {
        this.updateTeacher();
      } else {
        this.addTeacher();
      }
    },

    async addTeacher() {
      try {
        if (this.$refs.teacherFormRef.validate()) {
          const formDataToSend = this.prepareFormData();

          const response = await api.post("/teachers", formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          showSuccessMsg("Teacher added successfully")
          this.resetForm();
          this.$refs.teacherFormRef.resetValidation();
          this.$emit("reload");
          this.close();
        }
      } catch (error) {
        showErrorMsg("Teacher failed to add")
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        }
      }
    },

    async updateTeacher() {
      try {
        if (this.$refs.teacherFormRef.validate()) {
          const formDataToSend = this.prepareFormData();
          const response = await api.post(
            `/teachers/${this.data.teacher.id}`,
            formDataToSend,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          showSuccessMsg("Teacher updated successfully")
          this.resetForm();
          this.$refs.teacherFormRef.resetValidation();
          this.$emit("reload");
          this.close();
        }
      } catch (error) {
        showErrorMsg("Teacher failed to update")
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        }
      }
    },

    prepareFormData() {
      const formData = new FormData();
      formData.append("name", this.formData.name);
      formData.append("designation", this.formData.designation);
      formData.append("course", this.formData.course);
      if (this.formData.image) {
        formData.append("image", this.formData.image);
      }
      return formData;
    },

    handleFileChange(event) {
      this.formData.image = event.target.files[0];
    },

    close() {
      this.$emit("closeDialog");
      this.resetForm();
    },

    clearValidationErrors() {
      this.errors = null;
    },

    resetForm() {
      this.formData = {
        name: "",
        image: null,
        designation: "",
        course: "",
      };
      this.errors = null;
    },
  },
};
</script>
