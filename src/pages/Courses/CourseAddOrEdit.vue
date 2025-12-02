<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6 text-grey-8 text-center">
         {{isEditMode?'Edit Course':'Add Course'}}
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
                  <q-input
                    filled
                    class="full-width q-pl-sm"
                    v-model="formData.last_date"
                    :label="`Last Date of Registration`"
                    :rules="[(val) => !!val || 'Date is required']"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer q-ma-md">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="formData.last_date"
                            mask="YYYY-MM-DD"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                                size="sm"
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-item>
              </div>
              <div class="col-12">
                <q-item>
                  <NestedSelectBox class="full-width" :initial-value="formData.category_id" label="Category" :options="categoryStore.getHierarchicalCategories" @change="(option)=>{
                          formData.category_id=option?.id
                              }">
                  </NestedSelectBox>
                  <q-input
                    dense
                    autogrow
                    outlined
                    v-model="formData.price"
                    class="full-width q-pl-sm"
                    label="Course Price"
                    :error="!!errors && !!errors.price"
                    :error-message="
                    errors && errors.price ? errors.price[0] : ''
                  "
                  />
                </q-item>
              </div>
              <div class="col-12">
                <q-item>
                  <q-input
                    dense
                    autogrow
                    outlined
                    v-model="formData.number_of_classes"
                    class="full-width"
                    label="Number of Classes"
                    :rules="[(val) => !!val || 'Number of Classes is required']"
                    lazy-rules
                    :error="!!errors && !!errors.number_of_classes"
                    :error-message="
                    errors && errors.course_des ? errors.course_des[0] : ''
                  "
                  />
                  <q-input
                    dense
                    autogrow
                    outlined
                    v-model="formData.number_of_exams"
                    class="full-width q-pl-sm"
                    label="Number of Exams"
                    :rules="[(val) => !!val || 'Number of Exams is required']"
                    lazy-rules
                    :error="!!errors && !!errors.number_of_exams"
                    :error-message="
                    errors && errors.number_of_exams ? errors.number_of_exams[0] : ''
                  "
                  />
                </q-item>
              </div>
              <div class="col-12">
                <q-item>
                  <q-input
                    dense
                    autogrow
                    outlined
                    v-model="formData.mentor"
                    class="full-width"
                    label="Course Instructor"
                    :rules="[(val) => !!val || 'Instructor is required']"
                    lazy-rules
                    :error="!!errors && !!errors.mentor"
                    :error-message="
                    errors && errors.mentor ? errors.mentor[0] : ''
                  "
                  />
                  <q-input
                    dense
                    autogrow
                    outlined
                    v-model="formData.duration"
                    class="full-width q-pl-sm"
                    label="Course Duration"
                    :rules="[(val) => !!val || 'Duration is required']"
                    lazy-rules
                    :error="!!errors && !!errors.duration"
                    :error-message="
                    errors && errors.duration ? errors.duration[0] : ''
                  "
                  />
                </q-item>
              </div>
              <!-- Bullet Points -->
              <div class="col-10 q-mx-auto">
                <q-item>
                  <q-list bordered  class="full-width">
                    <q-item
                      v-for="(point, index) in formData.bulletPoints"
                      :key="index"
                    >
                      <q-input
                        dense
                        autogrow
                        outlined
                        class="full-width"
                        :rules="[(val) => !!val || 'Bullet Point is required']"
                        lazy-rules
                        v-model="formData.bulletPoints[index]"
                        label="Bullet Point"
                      />
                      <q-btn
                        class="q-ml-sm"
                        icon="close"
                        color="negative"
                        @click="removeBulletPoint(index)"
                      />
                    </q-item>
                    <q-item class="justify-center">
                      <q-btn
                        color="primary"
                        icon="add"
                        label="Add Bullet Point"
                        @click="addBulletPoint"
                      />
                    </q-item>
                  </q-list>
                </q-item>
              </div>
              <div class="col-12">
                <q-item>
                  <q-file
                    outlined
                    label="Upload Course Banner"
                    class="full-width"
                    v-model="formData.image"
                    :rules="[validateImage]"
                    lazy-rules
                    :error="!!errors.image"
                    :error-message="errors.image || ''"
                    accept="image/*"
                  >
                    <template v-slot:prepend>
                      <q-icon name="cloud_upload" @click.stop.prevent />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click.stop.prevent="formData.image = null"
                        class="cursor-pointer"
                      />
                    </template>
                    <template v-slot:hint>
                      Image dimension: 3000px X 1500px. Size:1mb
                    </template>
                  </q-file>
                </q-item>
              </div>
              <!-- Content Title & Description -->
              <div class="col-12">
                <q-item>
                  <q-list bordered class="full-width">
                    <q-item
                      v-for="(content, index) in formData.contents"
                      :key="index"
                    >
                      <q-input
                        dense
                        autogrow
                        outlined
                        class="full-width"
                        :rules="[(val) => !!val || 'Content title is required']"
                        v-model="content.title"
                        label="Content Title"
                      />
                      <q-input
                        filled

                        class="q-pl-sm full-width"
                        v-model="content.description"
                        :label="`Course Description`"
                        @click="openCourseDescriptionTinyMceModal"
                        readonly
                      >
                        <template v-slot:append>
                          <tiny-mce-modal
                            ref="courseDescriptionTinyMceModal"
                            :content="content.description"
                            :index="index"
                            @save="onDescriptionChange"
                          />
                        </template>
                      </q-input>
                      <q-btn
                        icon="close"
                        class="q-ml-sm"
                        color="negative"
                        @click="removeContent(index)"
                      />
                    </q-item>
                    <q-item class="justify-center">
                      <q-btn
                        color="primary"
                        icon="add"
                        label="Add Content"
                        @click="addContent"
                      />
                    </q-item>
                  </q-list>
                </q-item>
              </div>

              <q-separator></q-separator>
              <!-- Submit Button -->
              <div class="col-12">
                <q-item class="justify-center">
                  <q-btn
                    color="secondary"
                    type="submit"
                    :label="isEditMode?'Edit Course':'Add Course'"
                  ></q-btn>
                </q-item>
              </div>
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import {defineAsyncComponent} from "vue";
import {api} from "boot/axios";
import NestedSelectBox from "components/NestedSelectBox.vue";
import {useCategoryStore} from "stores/category";
import axios from "axios";
import {showErrorMsg, showSuccessMsg} from "src/utilities/helpers";

export default {
  components: {
    NestedSelectBox,
    TinyMceModal: defineAsyncComponent(() =>
      import("components/TinyMceModal.vue")
    ),
  },
  setup(){
    const categoryStore=useCategoryStore()
    return {
      categoryStore
    }
  },
  data() {
    return {
      isEditMode:false,
      formData: {
        course_title: "",
        course_des: "",
        number_of_classes: "",
        number_of_exams: "",
        mentor: "",
        duration: "",
        price: 0,
        bulletPoints: [],
        category_id:'',
        contents: [],
      },
      errors: {},
    };
  },
  methods: {
    validateImage(val) {
      if (!this.formData.id && !val) {
        return "Image is required";
      }
      return true;
    },
    async submitForm() {
      const payload = {
        title: this.formData.course_title,
        type: "course",
        category_id: this.formData.category_id,
        attributes: [
          {
            order:1,
            key: "image",
            value:
              this.formData.image instanceof File
                ? this.formData.image
                : null,
          },
          ...this.formData.bulletPoints.map((point, index) => ({
            order:index+1,
            key: `bullet_point`,
            value: point,
          })),
          ...this.formData.contents.map((content, index) => ({
            order:index+1,
            key: `content_title`,
            value:content.title,
          })),
          ...this.formData.contents.map((content, index) => ({
            order:index+1,
            key: `content_description`,
            value:content.description || 'Demo',
          })),
          {
            order:1,
            key: "course_description",
            value: this.formData.course_des,
          },
          {
            order:1,
            key: "price",
            value: this.formData.price,
          },
          {
            order:1,
            key: "number_of_exams",
            value: this.formData.number_of_exams,
          },
          {
            order:1,
            key: "last_date",
            value: this.formData.last_date,
          },
          {
            order:1,
            key: "duration",
            value: this.formData.duration,
          },
          {
            order:1,
            key: "mentor",
            value: this.formData.mentor,
          },
          {
            order:1,
            key: "number_of_classes",
            value: this.formData.number_of_classes,
          },
        ],
      };
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("type", payload.type);
      formData.append("category_id", payload.category_id);
      payload.attributes.forEach((attr, index) => {
        formData.append(`attributes[${index}][key]`, attr.key);
        formData.append(`attributes[${index}][order]`, attr.order);
        if (attr.key === "image" && attr.value instanceof File) {
          formData.append(`attributes[${index}][value]`, attr.value);
        }  else {
          formData.append(`attributes[${index}][value]`, attr.value);
        }
      });
      const endpoint = this.isEditMode
        ? `/ui-sections/course/${this.formData.id}`
        : "/ui-sections/course";

     try {
       await api({
         method: "post",
         url: endpoint,
         data: formData,
       });
       showSuccessMsg(`Course ${this.isEditMode?'Update':'Add'} successfully`)
       await this.$router.push('/courses')
     }catch (e){
       showErrorMsg(`Course ${this.isEditMode?'Update':'Add'} failed`)
     }


    },

    resetForm() {
      this.isEdit = false;
      this.formData = {
        course_title: "",
        course_des: "",
        number_of_classes: "",
        number_of_exams: "",
        last_date: "",
        mentor: "",
        duration: "",
        price: 0,
        bulletPoints: [],
        category_id:'',
        contents: [],
      };
      this.errors = {};
      this.$refs.courseFormRef.resetValidation();
    },

    addBulletPoint() {
      this.formData.bulletPoints.push("");
    },
    removeBulletPoint(index) {
      this.formData.bulletPoints.splice(index, 1);
    },
    addContent() {
      this.formData.contents.push({ title: "", description: "" });
    },
    removeContent(index) {
      this.formData.contents.splice(index, 1);
    },

    clearValidationErrors() {
      Object.keys(this.errors).forEach((key) => {
        this.errors[key] = null;
      });
    },
    openCourseDescriptionTinyMceModal() {
      this.$refs.courseDescriptionTinyMceModal.show = true;
    },
    onDescriptionChange(value, index, parentIndex) {
      this.formData.contents[index].description = value;
    },

    async fetchCourseDetails(id) {
      try {
        const response = await  api.get(`/ui-sections/course/${id}`);
        const course = response.data;
        this.formData = {
          ...course,
          course_title: course.title,
          course_des: course.course_description,
          category_id: course.category?.id,
          image:null
        };
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    },
  },
  created() {
    const courseId = this.$route.query.id;
    if (courseId) {
      this.isEditMode = true;
      this.fetchCourseDetails(courseId);
    }
  },
  mounted() {
  }
};
</script>
