<template>
  <q-dialog v-model="data.show">
    <q-card>
      <q-toolbar>
        <q-btn flat round dense icon="close" @click="close" />
      </q-toolbar>
      <q-card-section>
        <div class="text-h6 text-grey-8 text-center">
          {{ isEditMode ? 'Update Course' : 'Add Course' }}
        </div>
        <div class="row q-pa-md">
          <q-form
            @submit.prevent="submitForm"
            ref="courseFormRef"
            @input="clearValidationErrors"
          >
            <div class="row q-pa-md">
              <!-- Course Title Input -->
              <div class="col-12">
                <q-item>
                  <q-input
                    dense
                    outlined
                    class="full-width"
                    v-model="formData.course_title"
                    label="Course Title"
                    :rules="[(val) => !!val || 'Course Title is required']"
                    lazy-rules
                    :error="!!errors && !!errors.course_title"
                    :error-message="
                      errors && errors.course_title ? errors.course_title[0] : ''
                    "
                  />
                </q-item>
              </div>
              <!-- Course Description Input -->
              <div class="col-12">
                <q-item>
                  <q-input
                    dense
                    autogrow
                    outlined
                    v-model="formData.course_des"
                    class="full-width"
                    label="Course Description"
                    :rules="[(val) => !!val || 'Course Description is required']"
                    lazy-rules
                    :error="!!errors && !!errors.course_des"
                    :error-message="
                      errors && errors.course_des ? errors.course_des[0] : ''
                    "
                  />
                </q-item>
              </div>
              <!-- Course Image Input -->
              <div class="col-8">
                <q-item>
                  <q-file
                    filled
                    v-model="formData.image"
                    bottom-slots
                    label="Course Image"
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
                    <template v-slot:hint> Upload course image </template>
                  </q-file>
                </q-item>
              </div>
              <!-- Sheet Amount Input -->
              <div class="col-4">
                <q-item>
                  <q-input
                    dense
                    outlined
                    class="full-width"
                    v-model="formData.sheet_amount"
                    label="Total Seats"
                    :rules="[(val) => !!val || 'Total Seats Amount is required']"
                    lazy-rules
                    :error="!!errors && !!errors.sheet_amount"
                    :error-message="
                      errors && errors.sheet_amount ? errors.sheet_amount[0] : ''
                    "
                  />
                </q-item>
              </div>
              <!-- Course Type Select -->
              <div class="col-6">
                <q-select
                  outlined
                  v-model="formData.type"
                  :options="typeOptions"
                  label="Course Type"
                  :rules="[(val) => !!val || 'Course Type is required']"
                  lazy-rules
                  :error="!!errors && !!errors.type"
                  :error-message="errors && errors.type ? errors.type[0] : ''"
                />
              </div>
              <!-- Duration Input -->
              <div class="col-6">
                <q-item>
                  <q-input
                    dense
                    outlined
                    class="full-width"
                    v-model="formData.duration"
                    label="Duration"
                    :rules="[(val) => !!val || 'Duration is required']"
                    lazy-rules
                    :error="!!errors && !!errors.duration"
                    :error-message="
                      errors && errors.duration ? errors.duration[0] : ''
                    "
                  />
                </q-item>
              </div>

              <div class="col-12">
                <q-item class="justify-center">
                  <q-btn
                    color="primary"
                    type="submit"
                    :label="isEditMode ? 'Update Course' : 'Add Course'"
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
import {api} from "boot/axios";
import {showErrorMsg, showSuccessMsg} from "src/utilities/helpers";

export default {
  name: 'AddOrEditCourseDialog',

  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      formData: {
        course_title: '',
        course_des: '',
        image: null,
        type: '',
        sheet_amount: null,
        duration: null,
      },
      errors: null,
      typeOptions: [
        { label: 'Online', value: 'online' },
        { label: 'Offline', value: 'offline' },
      ],
    };
  },

  computed: {
    isEditMode() {
      return this.data.course !== null;
    },
  },

  watch: {
    data: {
      immediate: true,
      deep:true,
      handler(newVal) {
        if (newVal.course) {
          this.formData = { ...this.formData, ...newVal.course , image:null};
        }
        else{
          this.data.course=null
        }
      },
    },
  },

  methods: {
    submitForm() {
      if (this.isEditMode) {
        this.updateCourse();
      } else {
        this.addCourse();
      }
    },

    async addCourse() {
      try {
        if (this.$refs.courseFormRef.validate()) {
          const formDataToSend = this.prepareFormData();

          const response = await api.post("/courses", formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          showSuccessMsg("Course added successfully")
          this.resetForm();
          this.$refs.courseFormRef.resetValidation();
          this.$emit("reload");
          this.close();
        }
      } catch (error) {
        showErrorMsg("Course failed to add")
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        }
      }
    },

    async updateCourse() {
      try {
        if (this.$refs.courseFormRef.validate()) {
          const formDataToSend = this.prepareFormData();
          const response = await api.post(`/courses/${this.data.course.id}`, formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          showSuccessMsg("Course updated successfully")
          this.resetForm();
          this.$refs.courseFormRef.resetValidation();
          this.$emit("reload");
          this.close();
        }
      } catch (error) {
        showErrorMsg("Course failed to update")
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        }
      }
    },

    prepareFormData() {
      const formData = new FormData();
      formData.append("course_title", this.formData.course_title);
      formData.append("course_des", this.formData.course_des);
      formData.append("type", this.formData.type);
      formData.append("sheet_amount", this.formData.sheet_amount);
      formData.append("duration", this.formData.duration);
      if (this.formData.image) {
        formData.append("image", this.formData.image);
      }
      return formData;
    },

    handleFileChange(event) {
      this.formData.image = event.target.files[0];
    },


    close() {
      this.$emit('closeDialog');
      this.resetForm();
    },

    clearValidationErrors() {
      this.errors = null;
    },

    resetForm() {
      this.formData = {
        blog_title: '',
        course_des: '',
        image: null,
        type: '',
        sheet_amount: null,
        duration: null,
      };
      this.errors = null;
    },
  },
};
</script>
