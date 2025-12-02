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
                <q-btn
                  round
                  color="positive"
                  icon="add"
                  class="float-right"
                  @click="router.push({ name: 'add-employee' })"
                >
                  <q-tooltip>নতুন কর্মচারী যোগ করুন</q-tooltip>
                </q-btn>
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
                  v-model="filter"
                  outlined
                  dense
                  placeholder="নাম, পদবী বা ফোন নম্বর দিয়ে খুঁজুন..."
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
              <template v-slot:body-cell-image="props">
                <q-td :props="props" class="image-cell">
                  <q-avatar size="48px">
                    <img :src="props.row.image" :alt="props.row.name" />
                    <q-badge
                      v-if="props.row.highestRole"
                      floating
                      :color="getRoleColor(props.row.highestRole.name)"
                      :label="props.row.highestRole.name"
                    />
                  </q-avatar>
                </q-td>
              </template>

              <template v-slot:body-cell-name="props">
                <q-td :props="props" class="name-cell">
                  <div class="text-weight-bold">{{ props.row.name }}</div>
                </q-td>
              </template>

              <template v-slot:body-cell-phone="props">
                <q-td :props="props" class="phone-cell">
                  <div>{{ props.row.phone || "N/A" }}</div>
                </q-td>
              </template>

              <template v-slot:body-cell-designation="props">
                <q-td :props="props" class="designation-cell">
                  <div class="text-grey-8">{{ props.row.designation }}</div>
                </q-td>
              </template>

              <template v-slot:body-cell-id="props">
                <q-td :props="props" class="id-cell">
                  <q-btn
                    unelevated
                    color="primary"
                    label="আইডি কার্ড ডাউনলোড"
                    icon="download"
                    @click="openIdCardDownloadPage(props.row.id)"
                    size="sm"
                    class="id-btn q-px-sm"
                    dense
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-roles="props">
                <q-td :props="props" class="roles-cell">
                  <q-btn
                    unelevated
                    color="primary"
                    label="ভূমিকা সম্পাদনা"
                    icon="edit"
                    @click="openRoleModal(props.row)"
                    class="roles-btn q-px-sm"
                    size="sm"
                    dense
                  />
                </q-td>
              </template>

              <template v-slot:body-cell-action="props">
                <q-td :props="props" class="action-cell">
                  <q-btn
                    unelevated
                    color="primary"
                    label="প্রোফাইল দেখুন"
                    icon="person"
                    @click="router.push(`/employees/${props.row.id}`)"
                    class="profile-btn q-px-sm"
                    size="sm"
                    dense
                  />
                </q-td>
              </template>
              <template v-slot:no-data>
                <div
                  class="full-width row flex-center text-grey-7 q-gutter-sm q-py-lg"
                >
                  <q-icon name="people_outline" size="2em" />
                  <span>কোনো কর্মচারী পাওয়া যায়নি</span>
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

    <!-- Role Management Modal -->
    <q-dialog v-model="roleModal" persistent>
      <q-card style="min-width: 400px" class="role-management-card">
        <q-card-section class="bg-primary-1 q-pb-sm">
          <div class="flex items-center justify-between">
            <div class="text-h6 text-primary-10">
              <q-icon name="badge" class="q-mr-xs" size="xs" />
               {{ selectedEmployee?.name }} এর জন্য ভূমিকা পরিচালনা করুন
            </div>
            <q-btn
              icon="close"
              flat
              round
              dense
              v-close-popup
              color="primary"
            />
          </div>
          <q-separator color="primary-3" class="q-mt-sm" />
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md">
            <div class="text-subtitle2 text-primary-10 q-mb-sm">
              বর্তমান ভূমিকা:
            </div>
            <div
              v-if="selectedEmployeeRoles.length > 0"
              class="selected-roles q-py-sm"
            >
              <q-chip
                v-for="role in selectedEmployeeRoles"
                :key="role.id"
                :color="getRoleColor(role.name)"
                text-color="white"
                class="q-ma-xs"
                square
              >
                {{ role.name }}
                <q-tooltip>অপসারণ করতে ক্লিক করুন</q-tooltip>
                <q-btn
                  dense
                  flat
                  round
                  icon="close"
                  size="xs"
                  @click="removeRole(role)"
                />
              </q-chip>
            </div>
            <div v-else class="text-grey-7 text-center text-caption">
              <q-icon name="info" size="xs" class="q-mr-xs" />
             এই কর্মচারীর কোনো ভূমিকা নির্ধারিত নেই
            </div>
          </div>

          <div
            v-if="availableRoles.length > 0"
            class="q-pa-sm bg-primary-1"
            style="border-radius: 4px"
          >
            <div class="text-subtitle2 text-primary-10 q-mb-sm">
              <q-icon name="add_circle" class="q-mr-xs" size="xs" />
            ভূমিকা যোগ করুন:
            </div>
            <div class="row items-center q-col-gutter-sm">
              <div class="col">
                <q-select
                  v-model="newRole"
                  :options="availableRoles"
                  label="যোগ করার জন্য ভূমিকা নির্বাচন করুন"
                  outlined
                  dense
                  emit-value
                  map-options
                  class="q-mb-md"
                  bg-color="white"
                >
                  <template v-slot:prepend>
                    <q-icon name="assignment_ind" color="primary" />
                  </template>
                </q-select>
              </div>
              <div class="col-auto">
                <q-btn
                  unelevated
                  color="positive"
                  label="ভূমিকা যোগ করুন"
                  icon="add"
                  @click="addRole"
                  :disable="!newRole"
                  :loading="loading"
                  class="q-px-md"
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="বন্ধ করুন" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useUserStore } from "src/stores/userStore";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const officeId = route.params.officeId;
const filter = ref("");
const employees = ref([]);
const loading = ref(false);
const allRoles = ref([]);

// Role management state
const roleModal = ref(false);
const selectedEmployee = ref(null);
const selectedEmployeeRoles = ref([]);
const newRole = ref(null);

// Define role hierarchy
const roleHierarchy = {
  admin: 4,
  subadmin: 3,
  staff: 1,
  employee: 2,
};

const columns = computed(() => {
  const baseColumns = [
    {
      name: "image",
      label: "Photo",
      align: "center",
      field: "image",
      sortable: false,
      style: "width: 100px",
    },
    {
      name: "name",
      label: "Name",
      align: "left",
      field: "name",
      sortable: true,
      style: "width: 200px",
    },
    {
      name: "phone",
      label: "Phone",
      align: "left",
      field: "phone",
      sortable: true,
      style: "width: 150px",
    },
    {
      name: "designation",
      label: "Designation",
      align: "left",
      field: "designation",
      sortable: true,
      style: "width: 200px",
    },
    {
      name: "id",
      label: "ID Card",
      align: "center",
      field: "id",
      sortable: true,
      style: "width: 150px",
    },
    {
      name: "action",
      label: "Actions",
      align: "center",
      style: "width: 150px",
    },
  ];

  // Add roles column only for admin
  if (userStore.getHighestRole === "admin") {
    baseColumns.splice(4, 0, {
      name: "roles",
      label: "Roles",
      align: "center",
      style: "width: 150px",
    });
  }

  return baseColumns;
});

const filteredEmployees = computed(() => {
  if (!filter.value) return employees.value;

  const query = filter.value.toLowerCase();
  return employees.value.filter((employee) => {
    return (
      (employee.name && employee.name.toLowerCase().includes(query)) ||
      (employee.designation &&
        employee.designation.toLowerCase().includes(query)) ||
      (employee.phone && employee.phone.includes(query))
    );
  });
});

// redirect to id card download page
const openIdCardDownloadPage = (id) => {
  router.push({ path: "/employees/id-card", query: { id } });
};

const getRoleColor = (roleName) => {
  const colors = {
    admin: "red",
    subadmin: "orange",
    staff: "blue",
    employee: "green",
  };
  return colors[roleName] || "grey";
};

const getHighestRole = (roles) => {
  if (!roles || roles.length === 0) return null;

  let highestRole = roles[0];
  let highestValue = roleHierarchy[highestRole.name] || 0;

  for (const role of roles) {
    const currentValue = roleHierarchy[role.name] || 0;
    if (currentValue > highestValue) {
      highestValue = currentValue;
      highestRole = role;
    }
  }

  return highestRole;
};

const fetchRoles = async () => {
  try {
    const response = await api.get("/v1/roles");
    allRoles.value = response.data.data.filter(
      (role) =>
        role.guard_name === "api" &&
        role.name !== "admin" &&
        role.name !== "employee"
    );
  } catch (error) {
    console.error("Error fetching roles:", error);
    $q.notify({
      type: "negative",
      message: "ভূমিকা লোড করতে ব্যর্থ",
    });
  }
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
    console.error("Error fetching employee photo:", error);
    return null;
  }
};

const fetchEmployees = async () => {
  loading.value = true;
  try {
    const { data } = await api.get(
      `/v1/transfer-histories/latest/${officeId}?include=employee,employee.user,employee.user.roles,employee.designation&limit=0`
    );

    // Process employees in parallel
    employees.value = await Promise.all(
      data.data.map(async (transferHistory) => {
        const photoUrl = await fetchEmployeePhoto(
          transferHistory.employee?.data?.id
        );
        const roles =
          transferHistory.employee?.data?.user?.data?.roles?.data || [];
        const highestRole = getHighestRole(roles);

        return {
          id: transferHistory.employee?.data?.id,
          name: transferHistory.employee?.data?.user?.data?.name || "N/A",
          designation:
            transferHistory.employee?.data?.designation?.data?.name || "N/A",
          phone: transferHistory.employee?.data?.user?.data?.mobile || "N/A",
          image: photoUrl || "https://cdn.quasar.dev/img/avatar.png",
          userId: transferHistory.employee?.data?.user?.data?.id || "N/A",
          roles,
          highestRole,
          created_at: transferHistory.employee?.data?.created_at,
        };
      })
    );
  } catch (error) {

    $q.notify({
      type: "negative",
      message: "কর্মচারী তথ্য লোড করতে ব্যর্থ",
    });
  } finally {
    loading.value = false;
  }
};

const openRoleModal = (employee) => {
  selectedEmployee.value = employee;
  selectedEmployeeRoles.value = [...employee.roles];
  roleModal.value = true;
};

const availableRoles = computed(() => {
  if (!selectedEmployee.value) return [];

  const currentHighestRole = getHighestRole(selectedEmployeeRoles.value);
  const currentHighestValue = currentHighestRole
    ? roleHierarchy[currentHighestRole.name]
    : 0;

  return allRoles.value
    .filter(
      (role) =>
        roleHierarchy[role.name] > currentHighestValue &&
        role.name !== "employee"
    )
    .map((role) => ({
      label: role.name.charAt(0).toUpperCase() + role.name.slice(1),
      value: role,
    }));
});

const addRole = async () => {
  if (!newRole.value) return;
  try {
    loading.value = true;
    const response = await api.post("/v1/roles/assign", {
      user_id: selectedEmployee.value.userId,
      roles_ids: [newRole.value.id],
    });

    // Update local state
    selectedEmployeeRoles.value.push(newRole.value);

    // Update the employee in the list
    const employeeIndex = employees.value.findIndex(
      (e) => e.id === selectedEmployee.value.id
    );
    if (employeeIndex !== -1) {
      employees.value[employeeIndex].roles = [...selectedEmployeeRoles.value];
      employees.value[employeeIndex].highestRole = getHighestRole(
        selectedEmployeeRoles.value
      );
    }

    // Reset selection
    newRole.value = null;

    $q.notify({
      type: "positive",
      message: "ভূমিকা সফলভাবে যোগ করা হয়েছে",
    });
  } catch (error) {
    console.error("Failed to add role:", error);
    $q.notify({
      type: "negative",
      message: error.response?.data?.message || "ভূমিকা যোগ করতে ব্যর্থ",
    });
  } finally {
    loading.value = false;
  }
};

const removeRole = async (role) => {
  if (role.name === "employee") {
    $q.notify({
      type: "warning",
      message: "কর্মচারী ভূমিকা অপসারণ করা যাবে না",
    });
    return;
  }

  try {
    loading.value = true;
    const response = await api.post("/v1/roles/revoke", {
      user_id: selectedEmployee.value.userId,
      roles_ids: [role.id],
    });

    // Update local state
    selectedEmployeeRoles.value = selectedEmployeeRoles.value.filter(
      (r) => r.id !== role.id
    );

    // Update the employee in the list
    const employeeIndex = employees.value.findIndex(
      (e) => e.id === selectedEmployee.value.id
    );
    if (employeeIndex !== -1) {
      employees.value[employeeIndex].roles = [...selectedEmployeeRoles.value];
      employees.value[employeeIndex].highestRole = getHighestRole(
        selectedEmployeeRoles.value
      );
    }

    $q.notify({
      type: "positive",
      message: "ভূমিকা সফলভাবে অপসারণ করা হয়েছে",
    });
  } catch (error) {
    console.error("ভূমিকা অপসারণ করতে ব্যর্থ", error);
    $q.notify({
      type: "negative",
      message: error.response?.data?.message || "ভূমিকা অপসারণ করতে ব্যর্থ",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (userStore.getHighestRole === "admin") await fetchRoles();
  await fetchEmployees();
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

.image-cell {
  text-align: center;
}

.name-cell {
  font-weight: 500;
}

.designation-cell {
  color: #555;
}

.phone-cell {
  color: #555;
}

.id-cell,
.roles-cell,
.action-cell {
  text-align: center;
}

.id-btn,
.profile-btn,
.roles-btn {
  border-radius: 4px;
  padding: 4px 8px;
  text-transform: none;
  font-weight: 500;
  font-size: 0.8rem;
  min-height: 28px;
}

.role-management-card {
  border-radius: 8px;

  .q-card__section {
    padding: 16px;
  }
}

.selected-roles {
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
  min-height: 60px;
  padding: 8px;
  border: 1px dashed rgba(25, 118, 210, 0.3);
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

  .id-btn,
  .profile-btn,
  .roles-btn {
    padding: 6px 8px;
    font-size: 0.8rem;
  }
}
</style>
