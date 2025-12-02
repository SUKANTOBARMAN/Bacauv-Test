<template>
  <q-card bordered class="no-shadow">
    <q-card-section>
      <div class="text-h6 text-grey-8">
        Course List

        <q-btn
          class="float-right text-capitalize text-indigo-8 shadow-3"
          icon="add"
          @click="()=>{
            this.$router.push('add-course')
          }"
          label="Add Course"
        >

        </q-btn>
      </div>
    </q-card-section>

    <q-separator></q-separator>

    <q-card-section class="q-pa-none">
      <q-table
        :columns="columns"
        :filter="filter"
        :rows="courses"
        :rows-per-page-options="[20]"
        :title="'Courses'"
        :wrap-cells="true"
        class="no-shadow"
        row-key="course_title"
        square
        virtual-scroll
      >
        <!-- Course Title Column -->
        <template v-slot:body-cell-course_title="props">
          <q-td :props="props">
            <q-item>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="path + props.row.image" />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ props.row.course_title }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
        </template>

        <!-- Action Column for Edit/Delete -->
        <template v-slot:body-cell-Action="props">
          <q-td :props="props" class="text-no-wrap">
            <q-btn
              class="q-ml-sm"
              dense
              flat
              icon="edit"
              size="sm"
              @click="() => {
                    this.$router.push({
                      name: 'add-course',
                      query: {
                        id: props.row.id
                      }
                    });
                  }"
            />
            <q-btn
              class="q-ml-sm"
              dense
              flat
              icon="delete"
              size="sm"
              @click="openDeleteDialogue(props.row.id)"
            />
          </q-td>
        </template>

        <!-- Filter Input for Searching Courses -->
        <template v-slot:top-right>
          <q-input
            v-if="show_filter"
            v-model="filter"
            borderless
            debounce="300"
            dense
            filled
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            class="q-ml-sm"
            flat
            icon="filter_list"
            @click="show_filter = !show_filter"
          />
        </template>
      </q-table>
    </q-card-section>
  </q-card>



</template>

<script>

import {api} from "boot/axios";
import AddOrEditCourseDialog from "components/course/AddOrEditCourse.vue";
import {showErrorMsg, showSuccessMsg} from "src/utilities/helpers";

export default {
  name: 'CourseList',
  components: {AddOrEditCourseDialog},

  data() {
    return {
      filter: '',
      modalData:{
        show:false,
        courses:{}
      },
      show_filter: false,
      type: 'course',
      courses: [],
      columns: [
        { name: 'title', label: 'Course Title', align: 'left', field: 'title', sortable: true },
        { name: 'course_des', label: 'Description', align: 'left', field: 'course_description', sortable: true },
        { name: 'Action', label: 'Actions', align: 'center' },
      ],
      path:process.env.DEV ? process.env.WEB_DEV_URL : process.env.WEB_BUILD_URL,
    };
  },

  methods: {
    async fetchCourses() {
      try {
        const response = await api.get("/ui-sections/course");
        this.courses= response.data
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message: "Failed to fetch sliders",
        });
      }
    },
    openDeleteDialogue(id) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Would you like to delete this course?',
        cancel: true,
        persistent: true
      })
        .onOk(async () => {
          try {
            const response = await api.delete(`ui-sections/course/${id}`);
           showSuccessMsg(response.data.message || 'Course deleted successfully')
            await this.fetchData()

          } catch (error) {

            showErrorMsg(error.response?.data?.message || 'Failed to delete course')
          }
        })
        .onCancel(() => {
          console.log('Delete action was canceled');
        });
    },
  },
  mounted() {
    this.fetchCourses()
  }
};
</script>


