<template>
  <q-page class="q-py-lg q-px-md bg-grey-1">
    <div class="row justify-center">
      <div class="col-xl-10 col-lg-11 col-md-12 col-sm-12 col-xs-12">
        <q-card class="employee-card q-mb-lg" bordered flat>
          <q-card-section class="bg-primary-1 q-pb-sm">
            <div class="flex items-center justify-center q-mb-md">
              <div class="text-h5 text-primary-10 text-weight-medium">
                <q-icon name="people" class="q-mr-sm" size="sm" />
               কর্মচারী তালিকা
              </div>
            </div>
            <q-separator color="primary-3" />
          </q-card-section>

          <q-card-section class="q-px-md q-pb-none">
            <div class="text-caption text-grey-8 text-center">
             আপনার প্রতিষ্ঠানের কর্মচারীদের ব্রাউজ এবং পরিচালনা করুন
            </div>
          </q-card-section>

          <q-card-section class="search-section q-pa-md">
            <div class="row items-center q-col-gutter-md">
              <div class="col-md-9 col-sm-12">
                <q-input
                  v-model="searchQuery"
                  outlined
                  dense
                  placeholder="নাম, পদবী, ফোন, রক্তের গ্রুপ, অফিস বা গ্রেড দিয়ে খুঁজুন..."
                  class="search-input"
                  clearable
                  bg-color="white"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" color="primary" />
                  </template>
                </q-input>
              </div>
              <div class="col-md-3 col-sm-12 text-right">
                <div class="text-subtitle2 text-grey-8 q-pt-sm">
                 মোট কর্মচারী: {{ filteredEmployees.length }}
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="table-section q-pa-md">
            <q-table
              :columns="columns"
              :rows="filteredEmployees"
              row-key="id"
              flat
              bordered
              class="employee-table"
              :loading="loading"
              hide-pagination
              :pagination="{
                rowsPerPage: 0,
              }"
            >
              <template v-slot:body-cell-serial="props">
                <q-td :props="props" class="serial-cell">
                  {{ props.rowIndex + 1 }}
                </q-td>
              </template>

              <template v-slot:body-cell-image="props">
                <q-td :props="props" class="image-cell">
                  <q-avatar size="48px">
                    <img :src="props.row.image" :alt="props.row.name" />
                  </q-avatar>
                </q-td>
              </template>

              <template v-slot:body-cell-name="props">
                <q-td :props="props" class="name-cell">
                  <div class="text-weight-bold">{{ props.row.name }}</div>
                </q-td>
              </template>

              <template v-slot:body-cell-designation="props">
                <q-td :props="props" class="designation-cell">
                  <div>{{ props.row.designation || "N/A" }}</div>
                </q-td>
              </template>

              <template v-slot:body-cell-office="props">
                <q-td :props="props" class="office-cell">
                  <div>{{ props.row.office || "N/A" }}</div>
                </q-td>
              </template>

              <template v-slot:body-cell-grade="props">
                <q-td :props="props" class="grade-cell">
                  <div>{{ props.row.grade || "N/A" }}</div>
                </q-td>
              </template>

              <template v-slot:body-cell-phone="props">
                <q-td :props="props" class="phone-cell">
                  <div>{{ props.row.phone || "N/A" }}</div>
                </q-td>
              </template>

              <template v-slot:body-cell-bloodGroup="props">
                <q-td :props="props" class="blood-group-cell">
                  <q-badge
                    :color="getBloodGroupColor(props.row.bloodGroup)"
                    class="q-px-sm"
                  >
                    {{ props.row.bloodGroup || "N/A" }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-action="props">
                <q-td :props="props" class="action-cell">
                  <q-btn
                    unelevated
                    color="primary"
                    @click="router.push(`/employees/${props.row.id}`)"
                    class="profile-btn"
                    size="sm"
                    dense
                    no-caps
                  >
                    <div class="btn-content">
                      <q-icon name="person" size="14px" />
                      <span>View Profile</span>
                    </div>
                  </q-btn>
                </q-td>
              </template>

              <template v-slot:no-data>
                <div
                  class="full-width row flex-center text-grey-7 q-gutter-sm q-py-lg"
                >
                  <q-icon name="people_outline" size="2em" />
                  <span>কোনো কর্মচারী পাওয়া যায়নি</span>
                </div>
              </template>

              <template v-slot:loading>
                <q-inner-loading showing color="primary" />
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();
const searchQuery = ref("");
const employees = ref([]);
const loading = ref(false);

const columns = [
  {
    name: "serial",
    label: "ক্রমিক",
    align: "center",
    field: "serial",
    sortable: false,
    style: "width: 50px",
  },
  {
    name: "image",
    label: "ছবি",
    align: "center",
    field: "image",
    sortable: false,
    style: "width: 80px",
  },
  {
    name: "name",
    label: "নাম",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "designation",
    label: "পদবী",
    align: "left",
    field: "designation",
    sortable: true,
  },
  {
    name: "office",
    label: "অফিস",
    align: "left",
    field: "office",
    sortable: true,
  },
  {
    name: "grade",
    label: "গ্রেড",
    align: "left",
    field: "grade",
    sortable: true,
    style: "width: 100px",
  },
  {
    name: "phone",
    label: "ফোন",
    align: "left",
    field: "phone",
    sortable: true,
    style: "width: 150px",
  },
  {
    name: "bloodGroup",
    label: "রক্তের গ্রুপ",
    align: "center",
    field: "bloodGroup",
    sortable: true,
    style: "width: 120px",
  },
  {
    name: "action",
    label: "কর্ম",
    align: "center",
    style: "width: 150px",
  },
];

const filteredEmployees = computed(() => {
  const query = searchQuery.value.toLowerCase();

  return employees.value.filter((employee) => {
    return (
      !query ||
      (employee.name && employee.name.toLowerCase().includes(query)) ||
      (employee.designation &&
        employee.designation.toLowerCase().includes(query)) ||
      (employee.office && employee.office.toLowerCase().includes(query)) ||
      (employee.grade && employee.grade.toLowerCase().includes(query)) ||
      (employee.phone && employee.phone.includes(query)) ||
      (employee.bloodGroup && employee.bloodGroup.toLowerCase().includes(query))
    );
  });
});

const getBloodGroupColor = (bloodGroup) => {
  if (!bloodGroup) return "grey";
  const baseGroup = bloodGroup.replace(/[+-]/g, "");
  const colors = {
    A: "red",
    B: "blue",
    AB: "purple",
    O: "green",
  };
  return colors[baseGroup] || "grey";
};

const fetchEmployeePhoto = async (employeeId) => {
  try {
    const { data } = await api.get(
      `/v1/files?searchJoin=and&search=owner_type:employee;owner_id:${employeeId}`
    );
    return data.data.length > 0
      ? `https://yshr_app.dyd-govbd.com/storage/${data.data[0].path}`
      : null;
  } catch (error) {
    return null;
  }
};

const fetchGrade = async (parentId) => {
  if (!parentId) return "N/A";
  try {
    const { data } = await api.get(`/v1/categories?search=id:${parentId}`);
    return data.data.length > 0 ? data.data[0].name : "N/A";
  } catch (error) {
    return "N/A";
  }
};

const fetchEmployees = async () => {
  loading.value = true;
  try {
    const { data } = await api.get(
      "/v1/employees?orderBy=id&sortedBy=desc&include=user,designation,currentSalary,currentSalary.salaryscale,currentOffice.office&limit=0"
    );

    employees.value = await Promise.all(
      data.data.map(async (employee) => {
        const photoUrl = await fetchEmployeePhoto(employee.id);
        const grade = employee.currentSalary?.data?.salaryscale?.data?.parent_id
          ? await fetchGrade(
              employee.currentSalary.data.salaryscale.data.parent_id
            )
          : "N/A";

        return {
          id: employee.id,
          name: employee.user?.data?.name || "N/A",
          designation: employee.designation?.data?.name || "N/A",
          office: employee.currentOffice?.data?.office?.data?.name || "N/A",
          grade: grade,
          phone: employee.user?.data?.mobile || "N/A",
          bloodGroup: employee.blood_group || "N/A",
          image: photoUrl || "https://cdn.quasar.dev/img/avatar.png",
          userId: employee.user?.data?.id,
        };
      })
    );
  } catch (error) {
    
    $q.notify({
      type: "negative",
      message: "কর্মচারীদের তথ্য লোড করতে সমস্যা হয়েছে"
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEmployees();
});
</script>

<style scoped lang="scss">
.employee-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.search-section {
  .search-input {
    border-radius: 4px;
    ::v-deep .q-field__control {
      background-color: white;
    }
  }
}

.table-section {
  min-height: 400px;
}

.employee-table {
  border-radius: 4px;

  thead tr {
    background-color: #f5f7fa;
  }

  th {
    font-weight: 600;
    font-size: 0.9rem;
    color: #1976d2;
    padding: 12px 16px;
  }

  td {
    padding: 12px 16px;
  }

  tbody tr:hover {
    background-color: #e8f0fe;
    transition: background-color 0.3s;
  }
}

.serial-cell {
  text-align: center;
  color: #555;
}

.image-cell {
  text-align: center;
}

.name-cell {
  font-weight: 500;
}

.designation-cell {
  color: #555;
}

.office-cell {
  color: #555;
}

.grade-cell {
  color: #555;
}

.phone-cell {
  color: #555;
}

.blood-group-cell {
  text-align: center;
}

.action-cell {
  text-align: center;
}

.profile-btn {
  padding: 2px 8px;
  min-height: 24px;
  
  .btn-content {
    display: flex;
    align-items: center;
    gap: 4px;
    line-height: 1;
    
    .q-icon {
      margin-right: 2px;
    }
    
    span {
      font-size: 0.7rem;
      letter-spacing: 0.2px;
    }
  }
}
@media (max-width: 600px) {
  .search-section,
  .table-section {
    padding: 12px !important;
  }

  .employee-table {
    th,
    td {
      padding: 8px 12px;
    }
  }

}
</style>
