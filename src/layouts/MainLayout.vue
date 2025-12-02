<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          icon="menu"
          aria-label="Menu"
        />
        <q-toolbar-title>
          <span class="text-h6">bacuav অ্যাপ</span>
          <!-- <span class="text-h6">YHSR অ্যাপ</span> --- IGNORE -->
        </q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn
            round
            dense
            flat
            color="white"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="$q.fullscreen.toggle()"
            v-if="$q.screen.gt.sm"
          >
          </q-btn>
          <q-btn round flat>
            <q-avatar size="26px">
              <img :src="employeePhotoUrl" />
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 150px">
                <q-item
                  v-if="userStore.getHighestRole !== 'admin'"
                  clickable
                  @click="viewProfile"
                >
                  <q-item-section>View Profile</q-item-section>
                </q-item>
                <q-item clickable @click="logout">
                  <q-item-section>লগআউট</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-primary text-white"
    >
      <q-list>
        <q-item to="/" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>ড্যাশবোর্ড</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/member-list" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="group" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Member List</q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          to="/commissionerate"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="group" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Commissionerate</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/district" active-class="q-item-no-link-highlighting">
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>জেলা</q-item-label>
          </q-item-section>
        </q-item>
        <q-expansion-item icon="person" label="My Profile" expand-separator>
          <q-list class="q-pl-md">
            <q-item
              clickable
              to="/my-profile"
              active-class="q-item-no-link-highlighting"
            >
              <q-item-section avatar>
                <q-icon name="info" />
              </q-item-section>
              <q-item-section>User Information</q-item-section>
            </q-item>

            <q-item
              clickable
              to="/my-profile/payment"
              active-class="q-item-no-link-highlighting"
            >
              <q-item-section avatar>
                <q-icon name="payments" />
              </q-item-section>
              <q-item-section>Payment</q-item-section>
            </q-item>

            <q-item
              clickable
              to="/my-profile/update"
              active-class="q-item-no-link-highlighting"
            >
              <q-item-section avatar>
                <q-icon name="edit" />
              </q-item-section>
              <q-item-section>Update</q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
  
        <q-expansion-item
          label="কর্মচারী"
          icon="people"
          v-if="
            userStore.getHighestRole === 'admin' ||
            userStore.getHighestRole === 'subadmin'
          "
        >
          <q-item
            to="/employees/add"
            class="q-ml-xl"
            v-if="userStore.getHighestRole === 'admin'"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="person_add" />
            </q-item-section>
            <q-item-section>
              <q-item-label>কর্মচারী যোগ করুন</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            to="/office/employees"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="emoji_people" />
            </q-item-section>
            <q-item-section>
              <q-item-label>কর্মচারীর তালিকা</q-item-label>
            </q-item-section>
          </q-item>
          <!-- <q-item
            to="/employees/id-card"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="badge" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Employee Id card</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            to="/employees/reset-password"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="badge" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Reset password</q-item-label>
            </q-item-section>
          </q-item> -->
        </q-expansion-item>
        <q-expansion-item
          v-if="['admin', 'subadmin'].includes(userStore.getHighestRole)"
          label="কনফিগারেশন "
          icon="settings"
        >
          <q-item
            to="/offices"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar><q-icon name="apartment" /></q-item-section>
            <q-item-section
              ><q-item-label>অফিসের তালিকা</q-item-label></q-item-section
            >
          </q-item>
          <q-item
            to="/designations"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
            v-if="userStore.getHighestRole === 'admin'"
          >
            <q-item-section avatar><q-icon name="work" /></q-item-section>
            <q-item-section
              ><q-item-label>পদবির তালিকা</q-item-label></q-item-section
            >
          </q-item>
          <q-item
            to="/salary"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
            v-if="userStore.getHighestRole === 'admin'"
          >
            <q-item-section avatar><q-icon name="money" /></q-item-section>
            <q-item-section
              ><q-item-label>বেতন স্কেল</q-item-label></q-item-section
            >
          </q-item>
          <q-item
            to="/trainings"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
            v-if="userStore.getHighestRole === 'admin'"
          >
            <q-item-section avatar><q-icon name="school" /></q-item-section>
            <q-item-section
              ><q-item-label>প্রশিক্ষণসমূহ</q-item-label></q-item-section
            >
          </q-item>
          <q-item
            to="/leave-types"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
            v-if="userStore.getHighestRole === 'admin'"
          >
            <q-item-section avatar><q-icon name="event_busy" /></q-item-section>
            <q-item-section
              ><q-item-label>Leave Types</q-item-label></q-item-section
            >
          </q-item>

          <q-item
            to="/award-types"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
            v-if="userStore.getHighestRole === 'admin'"
          >
            <q-item-section avatar
              ><q-icon name="military_tech"
            /></q-item-section>
            <q-item-section><q-item-label>Awards</q-item-label></q-item-section>
          </q-item>

          <q-item
            to="/punishment-types"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
            v-if="userStore.getHighestRole === 'admin'"
          >
            <q-item-section avatar><q-icon name="gavel" /></q-item-section>
            <q-item-section
              ><q-item-label>Punishments</q-item-label></q-item-section
            >
          </q-item>
        </q-expansion-item>
        <!-- <q-item
          v-if="
            userStore.getHighestRole === 'admin' ||
            userStore.getHighestRole === 'subadmin'
          "
          to="/field-requisition"
          active-class="q-item-no-link-highlighting"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Field Requisition</q-item-label>
          </q-item-section>
        </q-item> -->
        <q-expansion-item
          v-if="['admin', 'subadmin'].includes(userStore.getHighestRole)"
          label="স্টোর ব্যবস্থাপনা"
          icon="store"
        >
          <q-item
            to="/products"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
            v-if="userStore.getHighestRole === 'admin'"
          >
            <q-item-section avatar>
              <q-icon name="category" />
            </q-item-section>
            <q-item-section>
              <q-item-label>পণ্যসমূহ</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            to="/add-stock"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
            v-if="userStore.getHighestRole === 'admin'"
          >
            <q-item-section avatar>
              <q-icon name="add_box" />
            </q-item-section>
            <q-item-section>
              <q-item-label>স্টক যোগ করুন</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            to="/stocks"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
            v-if="userStore.getHighestRole === 'admin'"
          >
            <q-item-section avatar>
              <q-icon name="inventory" />
            </q-item-section>
            <q-item-section>
              <q-item-label>স্টকসমূহ</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            to="/add-allocation"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
            v-if="userStore.getHighestRole === 'admin'"
          >
            <q-item-section avatar>
              <q-icon name="assignment" />
            </q-item-section>
            <q-item-section>
              <q-item-label>বণ্টন যোগ করুন</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            to="/allocations"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
            v-if="
              userStore.getHighestRole === 'admin' ||
              userStore.getHighestRole === 'subadmin'
            "
          >
            <q-item-section avatar>
              <q-icon name="list_alt" />
            </q-item-section>
            <q-item-section>
              <q-item-label>বণ্টনসমূহ</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <q-expansion-item label="নোটিশ " icon="assignment">
          <q-item
            to="/notices/add"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
            v-if="userStore.getHighestRole === 'admin'"
          >
            <q-item-section avatar>
              <q-icon name="note_add" />
            </q-item-section>
            <q-item-section>
              <q-item-label>নোটিশ যোগ করুন</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            to="/notices"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
            v-if="userStore.getHighestRole === 'admin'"
          >
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              <q-item-label>নোটিশের তালিকা</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            to="/notices/view"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
            v-if="userStore.getHighestRole !== 'admin'"
          >
            <q-item-section avatar>
              <q-icon name="list" />
            </q-item-section>
            <q-item-section>
              <q-item-label>নোটিশ দেখুন</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
        <q-expansion-item
          v-if="
            userStore.getHighestRole === 'admin' ||
            userStore.getHighestRole === 'subadmin'
          "
          label="প্রতিবেদন"
          icon="assessment"
        >
          <q-item
            to="/reports/field-requisition"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="bar_chart" />
            </q-item-section>
            <q-item-section>
              <q-item-label>ফিল্ড রিকুইজিশন</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            to="/reports/stock-list"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
            v-if="userStore.getHighestRole === 'admin'"
          >
            <q-item-section avatar>
              <q-icon name="bar_chart" />
            </q-item-section>
            <q-item-section>
              <q-item-label>স্টকের তালিকা</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            to="/reports/employee-list"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="emoji_people" />
            </q-item-section>
            <q-item-section>
              <q-item-label>কর্মচারীর তালিকা</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            to="/reports/salary-details"
            class="q-ml-xl"
            active-class="q-item-no-link-highlighting"
          >
            <q-item-section avatar>
              <q-icon name="payments" />
            </q-item-section>
            <q-item-section>
              <q-item-label>বেতন সংক্রান্ত তথ্য</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useOfficeStore } from "src/stores/officeStore";
import { useUserStore } from "stores/userStore";
import { useCategoryStore } from "stores/category";
import { useEmployeeStore } from "src/stores/employeeStore";
import { api } from "boot/axios";

// Stores
const userStore = useUserStore();
const categoryStore = useCategoryStore();
const officeStore = useOfficeStore();
const employeeStore = useEmployeeStore();

// Quasar + Router
const $q = useQuasar();
const router = useRouter();
const profileUrl = computed(() => {
  return `/employees/${employeeStore.getEmployeeId}`;
});

// Drawer control
const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

// View Profile
const viewProfile = async () => {
  try {
    const employeeId = employeeStore.getEmployeeId;
    if (!employeeId) {
      $q.notify({ type: "negative", message: "Employee ID not found." });
      return;
    }
    await router.push(`/employees/${employeeId}`);
  } catch (error) {
    console.error("Error navigating to profile:", error);
    $q.notify({
      type: "negative",
      message: "Failed to load profile. Try again.",
    });
  }
};

// Logout
const logout = async () => {
  try {
    userStore.logout();
    officeStore.removeOfficeInfo();
    employeeStore.removeEmployeeDetails();

    $q.notify({ type: "positive", message: "Logged out successfully" });
    await router.push("/login");
  } catch (error) {
    console.error(error);
    $q.notify({ type: "negative", message: "Logout failed. Try again." });
  }
};

// Add this reactive reference
const employeePhotoUrl = ref("https://cdn.quasar.dev/img/boy-avatar.png");

// Modify your fetchEmployeePhoto function to update the ref
const fetchEmployeePhoto = async () => {
  try {
    // Get the employeeId from the store instead of using employeeId.value
    const employeeId = employeeStore.employeeId;

    if (!employeeId) {
      return;
    }

    const { data } = await api.get(
      `/v1/files?searchJoin=and&search=owner_type:employee;owner_id:${employeeId}`
    );

    if (data.data && data.data.length > 0) {
      employeePhotoUrl.value = `https://yshr_app.dyd-govbd.com/storage/${data.data[0].path}`;
    }
  } catch (error) {
    console.error("Error fetching employee photo:", error);
  }
};

onMounted(async () => {
  // Only fetch the photo if we have an employee ID
  if (employeeStore.employeeId) {
    fetchEmployeePhoto();
  }
});

// Add a watcher for when the employee ID changes
watch(
  () => employeeStore.employeeId,
  (newId) => {
    if (newId) {
      fetchEmployeePhoto();
    }
  }
);
</script>

<style>
/* FONT AWESOME GENERIC BEAT */
.fa-beat {
  animation: fa-beat 5s ease infinite;
}

@keyframes fa-beat {
  0% {
    transform: scale(1);
  }
  5% {
    transform: scale(1.25);
  }
  20% {
    transform: scale(1);
  }
  30% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.25);
  }
  50% {
    transform: scale(1);
  }
  55% {
    transform: scale(1.25);
  }
  70% {
    transform: scale(1);
  }
}
</style>
