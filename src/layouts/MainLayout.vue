<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Enhanced Header -->
    <q-header class="bg-gradient-header">
      <q-toolbar class="glassy-toolbar">
        <q-btn
          flat
          dense
          round
          @click="toggleLeftDrawer"
          icon="menu"
          aria-label="Menu"
          class="q-mr-sm menu-btn"
        >
        </q-btn>

        <!-- App Logo & Title (Bangladesh Customs & VAT Officers' Association (BACUAV))-->
        <div class="row items-center">
          <q-toolbar-title class="app-title">
            <span class="app-title-text">
              BACAUV Association
            </span>
          </q-toolbar-title>
        </div>

        <q-space />

        <!-- Right Side Actions -->
        <div class="q-gutter-sm row items-center no-wrap">
          <!-- Fullscreen Toggle -->
          <q-btn
            round
            dense
            flat
            color="white"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="$q.fullscreen.toggle()"
            v-if="$q.screen.gt.sm"
            class="action-btn"
          >
            <q-tooltip>
              {{
                $q.fullscreen.isActive ? "Fullscreen বন্ধ করুন" : "Fullscreen"
              }}
            </q-tooltip>
          </q-btn>

          <!-- User Profile Dropdown -->
          <q-btn round flat class="profile-dropdown">
            <q-avatar size="32px" class="profile-avatar">
              <img :src="employeePhotoUrl" />
              <div class="online-indicator"></div>
            </q-avatar>

            <q-menu
              class="profile-menu"
              anchor="bottom right"
              self="top right"
              :offset="[10, 10]"
            >
              <q-list class="rounded-borders" style="min-width: 250px">
                <!-- User Info Header -->
                <q-item class="user-info-header">
                  <q-item-section avatar>
                    <q-avatar size="48px">
                      <img :src="employeePhotoUrl" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-body1">
                      {{ userProfile.name || "ব্যবহারকারী" }}
                    </q-item-label>
                    <q-item-label caption>
                      <!-- {{
                        getDesignationLabel(userProfile.designation) ||
                        "কর্মচারী"
                      }} -->
                    </q-item-label>
                    <q-item-label
                      caption
                      v-if="userProfile.email"
                      class="ellipsis"
                    >
                      <q-icon name="email" size="14px" class="q-mr-xs" />
                      {{ userProfile.email }}
                    </q-item-label>
                    <q-item-label caption v-if="userProfile.mobile">
                      <q-icon name="phone" size="14px" class="q-mr-xs" />
                      {{ userProfile.mobile }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-separator />

                <!-- View Profile -->
                <q-item
                  v-if="userStore.getHighestRole !== 'admin'"
                  clickable
                  v-ripple
                  @click="viewProfile"
                  class="menu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="person" color="primary" />
                  </q-item-section>
                  <q-item-section>See Profile</q-item-section>
                </q-item>

                <q-separator v-if="userStore.getHighestRole !== 'admin'" />

                <!-- Logout -->
                <q-item
                  clickable
                  v-ripple
                  @click="logout"
                  class="menu-item logout-item"
                >
                  <q-item-section avatar>
                    <q-icon name="logout" color="negative" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-negative">Logout</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Enhanced Sidebar -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="300"
      class="sidebar"
    >
      <!-- Sidebar Header with User Info -->
      <div class="sidebar-header">
        <div class="sidebar-avatar">
          <q-avatar size="64px">
            <img :src="employeePhotoUrl" />
          </q-avatar>
          <div class="sidebar-user-info">
            <div class="text-weight-bold text-body1">
              {{ userProfile.name || "" }}
            </div>
            <div class="text-caption text-blue-1">
              <!-- {{ getDesignationLabel(userProfile.designation) || "" }} -->
            </div>
            <div
              v-if="userProfile.email"
              class="text-caption text-blue-2 ellipsis q-mt-xs"
            >
              {{ userProfile.email }}
            </div>
          </div>
        </div>
      </div>

      <q-separator class="sidebar-separator" />

      <!-- Navigation List -->
      <q-scroll-area class="scroll-area">
        <q-list padding class="menu-list">
          <!-- Dashboard -->
          <q-item
            to="/"
            exact
            clickable
            v-ripple
            class="menu-item"
            active-class="active-menu-item"
          >
            <q-item-section avatar>
              <q-icon name="dashboard" class="menu-icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
            <q-tooltip anchor="center right" self="center left">
              ড্যাশবোর্ড
            </q-tooltip>
          </q-item>

          <!-- Member List -->
          <q-item
            to="/member-list"
            clickable
            v-ripple
            class="menu-item"
            active-class="active-menu-item"
          >
            <q-item-section avatar>
              <q-icon name="group" class="menu-icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Member List</q-item-label>
            </q-item-section>
            <q-tooltip anchor="center right" self="center left">
              Member List
            </q-tooltip>
          </q-item>

          <!-- My Profile Expansion -->
          <q-expansion-item
            icon="person"
            label="User Information"
            expand-icon-class="expansion-icon"
            class="expansion-item"
            :content-inset-level="0.5"
          >
            <q-list class="submenu">
              <q-item
                clickable
                to="/my-profile"
                v-ripple
                active-class="active-submenu-item"
                class="submenu-item"
              >
                <q-item-section avatar>
                  <q-icon name="info" size="18px" />
                </q-item-section>
                <q-item-section>My Profile</q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- Employees Menu -->
          <q-expansion-item
            v-if="['admin', 'subadmin'].includes(userStore.getHighestRole)"
            icon="people"
            label="কর্মচারী ব্যবস্থাপনা"
            expand-icon-class="expansion-icon"
            class="expansion-item"
            :content-inset-level="0.5"
          >
            <q-list class="submenu">
              <q-item
                v-if="userStore.getHighestRole === 'admin'"
                clickable
                to="/employees/add"
                v-ripple
                active-class="active-submenu-item"
                class="submenu-item"
              >
                <q-item-section avatar>
                  <q-icon name="person_add" size="18px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>কর্মচারী যোগ করুন</q-item-label>
                </q-item-section>
              </q-item>
              <q-item
                clickable
                to="/office/employees"
                v-ripple
                active-class="active-submenu-item"
                class="submenu-item"
              >
                <q-item-section avatar>
                  <q-icon name="emoji_people" size="18px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>কর্মচারীর তালিকা</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- Configuration Menu -->
          <q-expansion-item
            v-if="['admin', 'subadmin'].includes(userStore.getHighestRole)"
            icon="settings"
            label="সিস্টেম কনফিগারেশন"
            expand-icon-class="expansion-icon"
            class="expansion-item"
            :content-inset-level="0.5"
          >
            <q-list class="submenu">
              <q-item
                clickable
                to="/offices"
                v-ripple
                active-class="active-submenu-item"
                class="submenu-item"
              >
                <q-item-section avatar>
                  <q-icon name="apartment" size="18px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>অফিসের তালিকা</q-item-label>
                </q-item-section>
              </q-item>

              <template v-if="userStore.getHighestRole === 'admin'">
                <q-item
                  clickable
                  to="/designations"
                  v-ripple
                  active-class="active-submenu-item"
                  class="submenu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="work" size="18px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>পদবির তালিকা</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item
                  clickable
                  to="/salary"
                  v-ripple
                  active-class="active-submenu-item"
                  class="submenu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="money" size="18px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>বেতন স্কেল</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item
                  clickable
                  to="/trainings"
                  v-ripple
                  active-class="active-submenu-item"
                  class="submenu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="school" size="18px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>প্রশিক্ষণসমূহ</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item
                  clickable
                  to="/leave-types"
                  v-ripple
                  active-class="active-submenu-item"
                  class="submenu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="event_busy" size="18px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Leave Types</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item
                  clickable
                  to="/award-types"
                  v-ripple
                  active-class="active-submenu-item"
                  class="submenu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="military_tech" size="18px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Awards</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item
                  clickable
                  to="/punishment-types"
                  v-ripple
                  active-class="active-submenu-item"
                  class="submenu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="gavel" size="18px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Punishments</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-list>
          </q-expansion-item>

          <!-- Store Management Menu -->
          <q-expansion-item
            v-if="['admin', 'subadmin'].includes(userStore.getHighestRole)"
            icon="store"
            label="স্টোর ব্যবস্থাপনা"
            expand-icon-class="expansion-icon"
            class="expansion-item"
            :content-inset-level="0.5"
          >
            <q-list class="submenu">
              <template v-if="userStore.getHighestRole === 'admin'">
                <q-item
                  clickable
                  to="/products"
                  v-ripple
                  active-class="active-submenu-item"
                  class="submenu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="category" size="18px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>পণ্যসমূহ</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item
                  clickable
                  to="/add-stock"
                  v-ripple
                  active-class="active-submenu-item"
                  class="submenu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="add_box" size="18px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>স্টক যোগ করুন</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item
                  clickable
                  to="/stocks"
                  v-ripple
                  active-class="active-submenu-item"
                  class="submenu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="inventory" size="18px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>স্টকসমূহ</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item
                  clickable
                  to="/add-allocation"
                  v-ripple
                  active-class="active-submenu-item"
                  class="submenu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="assignment" size="18px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>বণ্টন যোগ করুন</q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <q-item
                clickable
                to="/allocations"
                v-ripple
                active-class="active-submenu-item"
                class="submenu-item"
              >
                <q-item-section avatar>
                  <q-icon name="list_alt" size="18px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>বণ্টনসমূহ</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- Notice Menu -->
          <q-expansion-item
            icon="assignment"
            label="Notice"
            expand-icon-class="expansion-icon"
            class="expansion-item"
            :content-inset-level="0.5"
          >
            <q-list class="submenu">
              <template v-if="userStore.getHighestRole === 'admin'">
                <q-item
                  clickable
                  to="/notices/add"
                  v-ripple
                  active-class="active-submenu-item"
                  class="submenu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="note_add" size="18px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>নোটিশ যোগ করুন</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item
                  clickable
                  to="/notices"
                  v-ripple
                  active-class="active-submenu-item"
                  class="submenu-item"
                >
                  <q-item-section avatar>
                    <q-icon name="list" size="18px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>নোটিশের তালিকা</q-item-label>
                  </q-item-section>
                </q-item>
              </template>

              <q-item
                v-if="userStore.getHighestRole !== 'admin'"
                clickable
                to="/notices/view"
                v-ripple
                active-class="active-submenu-item"
                class="submenu-item"
              >
                <q-item-section avatar>
                  <q-icon name="list" size="18px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>My Notices</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- Reports Menu -->
          <q-expansion-item
            v-if="['admin', 'subadmin'].includes(userStore.getHighestRole)"
            icon="assessment"
            label="প্রতিবেদন"
            expand-icon-class="expansion-icon"
            class="expansion-item"
            :content-inset-level="0.5"
          >
            <q-list class="submenu">
              <q-item
                clickable
                to="/reports/field-requisition"
                v-ripple
                active-class="active-submenu-item"
                class="submenu-item"
              >
                <q-item-section avatar>
                  <q-icon name="bar_chart" size="18px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>ফিল্ড রিকুইজিশন</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                v-if="userStore.getHighestRole === 'admin'"
                clickable
                to="/reports/stock-list"
                v-ripple
                active-class="active-submenu-item"
                class="submenu-item"
              >
                <q-item-section avatar>
                  <q-icon name="bar_chart" size="18px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>স্টকের তালিকা</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                to="/reports/employee-list"
                v-ripple
                active-class="active-submenu-item"
                class="submenu-item"
              >
                <q-item-section avatar>
                  <q-icon name="emoji_people" size="18px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>কর্মচারীর তালিকা</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                to="/reports/salary-details"
                v-ripple
                active-class="active-submenu-item"
                class="submenu-item"
              >
                <q-item-section avatar>
                  <q-icon name="payments" size="18px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>বেতন সংক্রান্ত তথ্য</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <q-separator class="q-mb-sm" />
        <div class="text-center text-caption text-grey-6">
          © {{ currentYear }} bacuav অ্যাপ
        </div>
      </div>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container class="main-content">
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
import { useEmployeeStore } from "src/stores/employeeStore";
import { api } from "boot/axios";

const userStore = useUserStore();
const officeStore = useOfficeStore();
const employeeStore = useEmployeeStore();

const $q = useQuasar();
const router = useRouter();

const userProfile = ref({
  id: null,
  name: "",
  name_bangla: "",
  email: "",
  mobile: "",
  designation: "",
  address: "",
  photo: null,
  dob: "",
  verified_at: "",
  commissionerate: null,
  division: null,
  circle: null,
  district: null,
});

const leftDrawerOpen = ref(false);
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const fetchUserProfile = async () => {
  try {
    const { data } = await api.get("/v1/profile", {
      params: {
        include: "commissionerate,division,circle,district",
      },
    });

    userProfile.value = data.data;

    console.log("PROFILE RESPONSE in MainLayout:", data.data);

    userProfile.value = {
      ...userProfile.value,
      id: data.data.id,
      name: data.data.name || "",
      name_bangla: data.data.name_bangla || "",
      email: data.data.email || "",
      mobile: data.data.mobile || "",
      designation: data.data.designation || "",
      address: data.data.address || "",
      photo: data.data.photo || null,
      dob: data.data.dob || "",
      verified_at: data.data.verified_at || "",
      commissionerate: data.data.commissionerate || null,
      division: data.data.division || null,
      circle: data.data.circle || null,
      district: data.data.district || null,
    };
  } catch (error) {
    console.error("Failed to load user profile in MainLayout:", error);
    $q.notify({
      type: "negative",
      message: "প্রোফাইল লোড করতে ব্যর্থ হয়েছে",
      caption: error.message,
    });
  }
};

const getDesignationLabel = (designationValue) => {
  const designationOptions = [
    {
      label: "RO (Revenue Officer)",
      value: "RO",
      icon: "badge",
      color: "blue",
    },
    {
      label: "ARO (Assistant Revenue Officer)",
      value: "ARO",
      icon: "assistant",
      color: "green",
    },
  ];

  const found = designationOptions.find(
    (opt) => opt.value === designationValue,
  );
  return found ? found.label : designationValue;
};

const viewProfile = async () => {
  try {
    await router.push("/my-profile");
  } catch (error) {
    console.error("Error navigating to profile:", error);
    $q.notify({
      type: "negative",
      message: "প্রোফাইলে যেতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
    });
  }
};

const logout = async () => {
  $q.dialog({
    title: "Logout Confirmation",
    message: "Are you sure you want to logout?",

    cancel: true,
    persistent: true,
    ok: {
      label: "Logout",
      color: "negative",
      flat: true,
    },
    cancel: {
      label: "Cancel",
      color: "primary",
      flat: true,
    },
  }).onOk(async () => {
    try {
      userStore.logout();
      officeStore.removeOfficeInfo();
      employeeStore.removeEmployeeDetails();

      $q.notify({
        type: "positive",
        message: "Successfully logged out",
        position: "top",
        timeout: 1500,
      });
      await router.push("/login");
    } catch (error) {
      console.error(error);
      $q.notify({
        type: "negative",
        message: "Logout failed. Please try again.",
        position: "top",
      });
    }
  });
};


const currentYear = computed(() => new Date().getFullYear());

const employeePhotoUrl = computed(() => {
  if (userProfile.value.photo) {
    const baseUrl = process.env.DEV_WEB_URL || process.env.BUILD_WEB_URL || process.env.DEV_API_URL|| process.env.BUILD_API_URL|| "https://yshr_app.dyd-govbd.com";
    return `${baseUrl}${userProfile.value.photo}`;
  }
  return "https://cdn.quasar.dev/img/boy-avatar.png";
});


onMounted(async () => {
  try {
    await fetchUserProfile();
  } catch (error) {
    console.error("Error in MainLayout mounted:", error);
  }
});

watch(
  () => router.currentRoute.value,
  () => {
    // You can add logic here if needed
  },
);
</script>

<style scoped>
/* Header Styles */
.bg-gradient-header {
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.glassy-toolbar {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(25, 118, 210, 0.95);
}

.app-logo {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(5px);
}

.user-info-badge {
  max-width: 150px;
  text-align: left;
}

/* Profile Menu Styles */
.profile-menu {
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.user-info-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  border-radius: 12px 12px 0 0;
  padding: 20px 16px;
  margin-bottom: 8px;
}

.admin-info {
  background: #f8f9fa;
  border-radius: 8px;
  margin: 8px;
}

.menu-item {
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
}

.menu-item:hover {
  background: rgba(25, 118, 210, 0.08);
}

.logout-item:hover {
  background: rgba(244, 67, 54, 0.08);
}

/* Sidebar Styles */
.sidebar {
  background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
  border-right: 1px solid #e0e0e0;
}

.sidebar-header {
  padding: 24px 20px;
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  color: white;
}

.sidebar-avatar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.sidebar-user-info {
  flex: 1;
}

.sidebar-admin-info {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 12px;
  border-radius: 8px;
  backdrop-filter: blur(5px);
  margin-top: 8px;
}

.sidebar-separator {
  background: rgba(255, 255, 255, 0.2);
}

.scroll-area {
  height: calc(100vh - 200px);
}

/* Fix for active route hover issue */
.menu-item {
  position: relative;
}

/* Active menu item - no hover effect when active */
.menu-item.active-menu-item:hover {
  background: linear-gradient(90deg, #1976d2 0%, #2196f3 100%) !important;
  transform: none !important;
}

/* Regular hover for non-active items */
.menu-item:not(.active-menu-item):hover {
  background: linear-gradient(
    90deg,
    rgba(25, 118, 210, 0.1) 0%,
    rgba(25, 118, 210, 0.05) 100%
  );
  transform: translateX(4px);
}

.active-menu-item {
  background: linear-gradient(90deg, #1976d2 0%, #2196f3 100%);
  color: white !important;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.active-menu-item .menu-icon {
  color: white !important;
}

/* Submenu items hover fix */
.submenu-item.active-submenu-item:hover {
  background: rgba(25, 118, 210, 0.1) !important;
}

.submenu-item:not(.active-submenu-item):hover {
  background: rgba(25, 118, 210, 0.08);
}

/* Expansion Items */
.expansion-item :deep(.q-item) {
  border-radius: 10px;
  margin: 4px 8px;
}

.expansion-item :deep(.q-item__section--avatar) {
  min-width: 40px;
}

/* Fix expansion item active state */
.expansion-item :deep(.q-item.q-router-link--active) {
  background: linear-gradient(90deg, #1976d2 0%, #2196f3 100%);
  color: white;
}

.expansion-item :deep(.q-item.q-router-link--active .q-icon) {
  color: white !important;
}

/* Submenu */
.submenu {
  padding-left: 8px;
}

.submenu-item {
  border-radius: 8px;
  margin: 2px 4px;
  padding: 8px 16px;
}

.active-submenu-item {
  background: rgba(25, 118, 210, 0.1);
  color: #1976d2;
  font-weight: 500;
  border-left: 3px solid #1976d2;
}

/* Sidebar Footer */
.sidebar-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: rgba(248, 249, 250, 0.8);
  backdrop-filter: blur(5px);
  border-top: 1px solid #e0e0e0;
}

/* Main Content */
.main-content {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  min-height: 100vh;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-list {
  animation: fadeIn 0.5s ease-out;
}

/* Scrollbar Styling */
:deep(.q-scrollarea__thumb) {
  background: rgba(0, 0, 0, 0.2);
  width: 4px;
  border-radius: 2px;
}

:deep(.q-scrollarea__thumb:hover) {
  background: rgba(0, 0, 0, 0.3);
}

/* Online Indicator */
.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #4caf50;
  border: 2px solid white;
  border-radius: 50%;
}

/* Tooltip styling */
:deep(.q-tooltip) {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 6px;
}

.app-title-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  font-weight: 700;
  line-height: 1.3;
  font-size: 20px;
}

/* Mobile responsive */
@media (max-width: 600px) {
  .app-title-text {
    font-size: 11px; 
  }
}
</style>
