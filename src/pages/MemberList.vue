<template>
  <div class="q-pa-md member-directory-wrapper">
    <q-card bordered class="desktop-card no-shadow">
      <!-- Header Section - Visible on both desktop and mobile -->
      <!-- <q-card-section class="card-header bg-primary-gradient">
        <div class="header-content">
          <div class="header-title text-white">
            <q-icon name="group" class="q-mr-sm" /> Member Directory
          </div>
          <div class="header-subtitle text-white opacity-85">
            Browse and view all registered members
          </div>
        </div>
        <div class="total-members q-mt-md">
          <q-chip
            color="white"
            text-color="primary-dark"
            icon="people_alt"
            size="lg"
            class="total-chip shadow-4"
          >
            Total Members: {{ pagination.rowsNumber }}
          </q-chip>
        </div>
      </q-card-section> -->

      <q-separator class="header-separator"></q-separator>

      <q-expansion-item
        icon="search"
        label="Search & Filter"
        default-open
        class="search-expansion bg-blue-grey-1"
        expand-icon-class="text-primary-dark"
      >
        <div class="q-pa-md">
          <SearchMembers @search="onSearch"></SearchMembers>
        </div>
      </q-expansion-item>

      <!-- DESKTOP VIEW -->
      <q-card-section v-if="$q.screen.gt.sm" class="q-pa-none desktop-section">
        <q-table
          flat
          bordered
          wrap-cells
          no-data-label="No members found"
          ref="tableRef"
          :columns="columns"
          :rows="data"
          :wrap-cells="true"
          class="members-table"
          row-key="id"
          v-model:pagination="pagination"
          :loading="loading"
          @request="onRequest"
          square
          style="height: 700px"
          virtual-scroll
          :rows-per-page-options="[10, 15, 20, 50]"
          binary-state-sort
        >
          <template #top>
            <div class="table-top row items-center">
              <div class="text-h6 text-primary-dark text-weight-bold">
                Member List Overview
              </div>
              <q-space />
              <q-btn
                flat
                round
                icon="refresh"
                color="primary"
                @click="fetchData(pagination.page)"
              />
            </div>
          </template>

          <template #loading>
            <q-inner-loading showing color="primary" />
          </template>

          <template #no-data>
            <div
              class="full-width row flex-center text-blue-grey-6"
              style="height: 500px"
            >
              <div class="text-center">
                <q-icon name="group_off" size="48px" class="q-mb-md" />
                <div class="text-h5 q-mb-sm">No members found</div>
                <div class="text-body1">
                  Try adjusting your search or filter criteria
                </div>
              </div>
            </div>
          </template>
          <!-- Column 1: Member ID -->
          <template #body-cell-MemberID="props">
            <q-td :props="props" class="id-cell text-left">
              <div class="member-id-container">
                <q-icon
                  v-if="props.row.member_id"
                  name="vpn_key"
                  size="16px"
                  color="primary"
                  class="q-mr-sm"
                />
                <span class="member-id-text text-weight-bold text-primary-dark">
                  {{ props.row.member_id }}
                </span>
              </div>
            </q-td>
          </template>

          <!-- Column 2: Photo -->
          <template #body-cell-photo="props">
            <q-td :props="props" class="photo-cell text-center">
              <div class="photo-container-desktop">
                <q-avatar size="56px" class="member-photo-desktop">
                  <q-img
                    v-if="props.row.photo || photoPreview"
                    :src="photoPreview || `${baseUrl}${props.row.photo}`"
                    :ratio="1"
                    class="avatar-img"
                  />
                </q-avatar>
              </div>
            </q-td>
          </template>

          <!-- Column 3: Name -->
          <template #body-cell-name="props">
            <q-td :props="props" class="name-cell text-left">
              <div class="member-name">
                <div class="english-name text-weight-medium text-dark">
                  {{ props.row.name }}
                </div>
                <div class="bangla-name text-caption text-blue-grey-7">
                  {{ props.row.name_bangla }}
                </div>
              </div>
            </q-td>
          </template>

          <!-- Column 4: Contact -->
          <template #body-cell-contact="props">
            <q-td :props="props" class="contact-cell text-left">
              <div class="contact-info">
                <div class="contact-item row items-center">
                  <q-icon
                    name="phone_iphone"
                    size="14px"
                    class="q-mr-sm text-primary"
                  />
                  <span class="text-weight-medium text-dark">{{
                    props.row.mobile || "N/A"
                  }}</span>
                </div>
                <div class="contact-item row items-center q-mt-xs">
                  <q-icon
                    name="alternate_email"
                    size="14px"
                    class="q-mr-sm text-primary"
                  />
                  <span class="text-body2 text-blue-grey-8">{{
                    props.row.email || "N/A"
                  }}</span>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Column 5: Actions -->
          <template #body-cell-actions="props">
            <q-td :props="props" class="actions-cell text-center">
              <q-btn
                flat
                color="primary"
                icon="visibility"
                label="View Details"
                @click="viewMemberDetails(props.row)"
                class="action-btn"
                size="sm"
              />
            </q-td>
          </template>

          <template #bottom>
            <div class="table-bottom q-pa-sm bg-blue-grey-1">
              <div class="row items-center justify-between full-width">
                <div class="text-body2 text-primary-dark text-weight-medium">
                  Showing
                  {{ (pagination.page - 1) * pagination.rowsPerPage + 1 }} to
                  {{
                    Math.min(
                      pagination.page * pagination.rowsPerPage,
                      pagination.rowsNumber,
                    )
                  }}
                  of {{ pagination.rowsNumber }} members
                </div>

                <div class="pagination-wrapper">
                  <q-pagination
                    v-model="pagination.page"
                    :max="
                      Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)
                    "
                    :max-pages="6"
                    direction-links
                    boundary-numbers
                    @update:model-value="onPageChange"
                    color="primary"
                    active-color="white"
                    active-text-color="primary"
                    :disable="loading"
                  />
                </div>

                <div style="width: 200px"></div>
              </div>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <!-- MOBILE VIEW -->
      <q-card-section v-else class="q-pa-none mobile-section">
        <div class="mobile-card-container">
          <q-inner-loading :showing="loading">
            <q-spinner-cube size="50px" color="primary" />
          </q-inner-loading>

          <div
            v-if="!loading && data.length === 0"
            class="full-height row flex-center"
            style="min-height: 300px"
          >
            <div class="text-center q-pa-lg text-h6 text-blue-grey-6">
              <q-icon name="group_off" size="24px" class="q-mr-sm" /> No members
              found
            </div>
          </div>

          <div class="mobile-cards-list">
            <div
              v-for="row in data"
              :key="row.id"
              class="mobile-data-card"
              @click="viewMemberDetails(row)"
            >
              <!-- Photo Section -->
              <div class="mobile-photo-section">
                <q-avatar class="mobile-photo">
                  <q-img
                    v-if="row.photo || photoPreview"
                    :src="photoPreview || `${baseUrl}${row.photo}`"
                    :ratio="1"
                    class="avatar-img"
                  />
                </q-avatar>
              </div>

              <!-- Content Section -->
              <div class="mobile-content-section">
                <!-- Member ID -->
                <div class="mobile-id-row">
                  <q-icon
                    v-if="row.member_id"
                    name="vpn_key"
                    size="14px"
                    color="primary"
                    class="q-mr-xs"
                  />
                  <span class="mobile-id-text">{{ row.member_id }}</span>
                </div>

                <!-- Name -->
                <div class="mobile-name-row">
                  <div class="mobile-english-name">{{ row.name }}</div>
                  <div class="mobile-bangla-name">{{ row.name_bangla }}</div>
                </div>

                <!-- Contact Info -->
                <div class="mobile-contact-row">
                  <div class="mobile-contact-item">
                    <q-icon
                      name="phone_iphone"
                      size="14px"
                      color="primary"
                      class="q-mr-xs"
                    />
                    <span class="mobile-contact-text">{{
                      row.mobile || "N/A"
                    }}</span>
                  </div>
                  <div class="mobile-contact-item">
                    <q-icon
                      name="alternate_email"
                      size="14px"
                      color="primary"
                      class="q-mr-xs"
                    />
                    <span class="mobile-contact-text">{{
                      row.email || "N/A"
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Action Button -->
              <div class="mobile-action-row">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="chevron_right"
                  class="mobile-view-btn"
                />
              </div>
            </div>
          </div>

          <!-- Mobile Pagination -->
          <div
            class="mobile-pagination"
            v-if="pagination.rowsNumber > pagination.rowsPerPage"
          >
            <q-pagination
              v-model="pagination.page"
              :max="Math.ceil(pagination.rowsNumber / pagination.rowsPerPage)"
              boundary-numbers
              max-pages="5"
              @update:model-value="onPageChange"
              direction-links
              color="primary"
              size="sm"
              class="mobile-pagination-controls"
            />
            <div class="text-caption text-center q-mt-sm text-blue-grey-6">
              Page {{ pagination.page }} of
              {{ Math.ceil(pagination.rowsNumber / pagination.rowsPerPage) }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
// Script remains exactly the same as in your original code
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import SearchMembers from "components/SearchMembers.vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useStore } from "stores/store";

const router = useRouter();
const loading = ref(false);
const store = useStore();
const $q = useQuasar();
const baseUrl =
  process.env.DEV_WEB_URL ||
  process.env.BUILD_WEB_URL ||
  process.env.BUILD_API_URL ||
  process.env.BUILD_API_URL;

const pagination = ref({
  page: 1,
  rowsPerPage: 30,
  rowsNumber: 0,
});

const filter = ref({
  keywords: "",
  commissionerate_id: null,
  division_id: null,
  circle_id: null,
  district_id: null,
  blood_group: null,
});

const data = ref([]);
const columns = [
  {
    name: "MemberID",
    label: "Member ID",
    field: "member_id",
    sortable: true,
    align: "left",
    classes: "id-column",
    width: "150px",
  },
  {
    name: "photo",
    label: "Photo",
    field: "photo",
    sortable: false,
    align: "center",
    classes: "photo-column",
    width: "100px",
  },
  {
    name: "name",
    label: "Name",
    field: "name",
    sortable: true,
    align: "left",
    classes: "name-column",
    width: "250px",
  },
  {
    name: "contact",
    label: "Contact Info",
    field: "mobile",
    sortable: true,
    align: "left",
    classes: "contact-column",
    width: "250px",
  },
  {
    name: "actions",
    label: "Actions",
    field: "actions",
    sortable: false,
    align: "center",
    classes: "actions-column",
    width: "150px",
  },
];

const path = process.env.DEV
  ? process.env.WEB_DEV_URL
  : process.env.WEB_BUILD_URL;

function imageURL(url, defaultPATH) {
  if (!url) {
    return defaultPATH;
  } else {
    if (url.startsWith("http")) {
      return url;
    } else {
      return path + url;
    }
  }
}

const viewMemberDetails = (member) => {
  router.push({
    name: "MemberDetails",
    params: { id: member.id },
    state: { memberData: member },
  });
};

const onSearch = (search) => {
  filter.value = { ...search };
  pagination.value.page = 1;
  fetchData(1);
};

const onPageChange = (page) => {
  pagination.value.page = page;
  fetchData(page);
};

const buildSearchQuery = () => {
  const f = filter.value;
  const search = [];

  if (f.keywords?.trim()) {
    const k = f.keywords.trim();
    search.push(`name:${k}`);
    search.push(`mobile:${k}`);
    search.push(`member_id:${k}`);
    search.push(`email:${k}`);
  }

  if (f.commissionerate_id)
    search.push(`commissionerate_id:${f.commissionerate_id}`);
  if (f.division_id) search.push(`division_id:${f.division_id}`);
  if (f.circle_id) search.push(`circle_id:${f.circle_id}`);
  if (f.district_id) search.push(`district_id:${f.district_id}`);
  if (f.blood_group) search.push(`blood_group:${f.blood_group}`);

  return search.join(";");
};

const fetchData = async (page = 1) => {
  loading.value = true;
  try {
    const searchStr = buildSearchQuery();
    let url = `v1/users?verified=true&page=${page}&limit=30`;

    if (searchStr) {
      url = `v1/users?verified=true&search=${searchStr}&page=${page}&limit=30`;
    }

    const response = await api.get(url);
    data.value = response.data.data;

    const meta = response.data.meta?.pagination || {
      current_page: 1,
      per_page: 30,
      total: data.value.length,
    };

    pagination.value = {
      page: meta.current_page,
      rowsPerPage: meta.per_page,
      rowsNumber: meta.total,
    };
  } catch (err) {
    console.error("Error fetching members:", err);
    $q.notify({
      type: "negative",
      message: "Failed to load members",
      caption: err.response?.data?.message || err.message,
    });
  } finally {
    loading.value = false;
  }
};

const onRequest = (props) => {
  pagination.value = props.pagination;
  fetchData(props.pagination.page);
};

onMounted(async () => {
  try {
    await Promise.all([
      store.storeCommissionerate(),
      store.storeDivision(),
      store.storeCircle(),
    ]);

    await fetchData();
  } catch (err) {
    console.error("Error in onMounted:", err);
    $q.notify({
      type: "negative",
      message: "Failed to load initial data",
    });
  }
});
</script>

<style scoped>
.bg-primary-gradient {
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%) !important;
}

.text-primary-dark {
  color: #1565c0 !important;
}

.bg-blue-grey-1 {
  background-color: #eceff1 !important;
}

.text-blue-grey-7 {
  color: #455a64 !important;
}

.text-blue-grey-8 {
  color: #37474f !important;
}

/* --- 💻 Desktop Styles --- */
.member-directory-wrapper {
  background-color: #f5f7fa;
}

.desktop-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  background: white;
}

/* .card-header {
  padding: 20px;
  position: relative;
} */

.header-title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  line-height: 1.2;
}

.header-subtitle {
  font-size: 1rem;
  margin-top: 4px;
}

.header-separator {
  background: linear-gradient(to right, #1976d2, #42a5f5, #1976d2);
  height: 2px;
}

.total-chip {
  font-size: 15px !important;
  padding: 8px 16px;
  border-radius: 20px;
}

.search-expansion :deep(.q-item) {
  font-weight: 600;
  font-size: 16px;
  color: #1565c0;
  background: #f8fafc;
}

.search-expansion :deep(.q-item__section--avatar) {
  color: #1976d2;
}

.members-table {
  border: 1px solid #e0e0e0;
  background-color: white;
}

.members-table :deep(.q-table__top) {
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8fafc;
}

.members-table :deep(.q-th) {
  font-weight: 600;
  color: #37474f;
  background-color: #f8fafc;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 16px;
  vertical-align: middle;
}

.members-table :deep(.q-td) {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: middle !important;
  height: 80px;
}

.members-table :deep(.id-column .q-td) {
  text-align: left !important;
  padding-left: 16px !important;
}

.members-table :deep(.photo-column .q-td) {
  text-align: center !important;
  padding: 16px !important;
}

.members-table :deep(.name-column .q-td) {
  text-align: left !important;
  padding-left: 16px !important;
}

.members-table :deep(.contact-column .q-td) {
  text-align: left !important;
  padding-left: 16px !important;
}

.members-table :deep(.actions-column .q-td) {
  text-align: center !important;
  padding: 16px !important;
}

.members-table :deep(.q-table tbody tr:hover) {
  background-color: #f0f7ff !important;
}

.member-id-container {
  display: flex;
  align-items: center;
  height: 100%;
}

.member-id-text {
  font-size: 14px;
  line-height: 1.4;
}

.photo-container-desktop {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.member-photo-desktop {
  border: 3px solid #e3f2fd;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

.name-cell {
  height: 100%;
  display: flex;
  align-items: center;
}

.member-name {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.english-name {
  font-size: 15px;
  line-height: 1.4;
}

.bangla-name {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.3;
}

.contact-cell {
  height: 100%;
  display: flex;
  align-items: center;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}

.contact-item {
  display: flex;
  align-items: center;
  line-height: 1.4;
}

.actions-cell {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn {
  min-width: 140px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  color: white !important;
  transition: all 0.2s ease;
  font-weight: 500;
  padding: 8px 16px;
  font-size: 14px;
  white-space: nowrap;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

.table-bottom {
  border-top: 1px solid #e0e0e0;
  background: #f8fafc !important;
}

/* 📱 MOBILE VIEW - REDESIGNED */
.mobile-section {
  background: #f5f7fa;
  padding: 0 !important;
}

.mobile-card-container {
  min-height: 400px;
  position: relative;
}

.mobile-cards-list {
  max-width: 100%;
  margin: 0;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-data-card {
  border-radius: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin: 0 !important;
  display: flex;
  flex-direction: row;
  padding: 12px;
  align-items: center;
  height: 120px;
  cursor: pointer;
  position: relative;
}

.mobile-data-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-color: #1976d2;
  transform: translateY(-2px);
}

/* Mobile Card Layout - Compact Design */
.mobile-photo-section {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
}

.mobile-photo {
  width: 100% !important;
  height: 100% !important;
  border: 3px solid #e3f2fd;
  box-shadow: 0 2px 4px rgba(25, 118, 210, 0.1);
  border-radius: 10px;
}

.mobile-content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100%;
  overflow: hidden;
  padding: 0 12px;
}

/* Member ID - Top Row */
.mobile-id-row {
  display: flex;
  align-items: center;
  margin-bottom: 6px;
}

.mobile-id-text {
  font-size: 13px;
  font-weight: 600;
  color: #1565c0;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Member Name */
.mobile-name-row {
  margin-bottom: 8px;
}

.mobile-english-name {
  font-size: 15px;
  font-weight: 600;
  color: #37474f;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.mobile-bangla-name {
  font-size: 13px;
  color: #78909c;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Contact Info */
.mobile-contact-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-contact-item {
  display: flex;
  align-items: center;
  line-height: 1.2;
}

.mobile-contact-text {
  font-size: 12px;
  color: #546e7a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

/* View Button - Right */
.mobile-action-row {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.mobile-view-btn {
  height: 36px;
  min-height: 36px;
  width: 36px;
  min-width: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1976d2 0%, #2196f3 100%);
  color: white !important;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.mobile-view-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(25, 118, 210, 0.3);
}

.mobile-view-btn :deep(.q-icon) {
  font-size: 20px;
}

/* Mobile Pagination */
.mobile-pagination {
  padding: 16px 12px;
  border-top: 1px solid #e0e0e0;
  background: white;
  position: sticky;
  bottom: 0;
  z-index: 1;
}

.mobile-pagination-controls {
  display: flex;
  justify-content: center;
}

.mobile-pagination-controls :deep(.q-btn) {
  font-size: 14px;
  height: 32px;
  min-height: 32px;
  width: 32px;
  min-width: 32px;
  margin: 0 2px;
}

/* Loading and Empty States */
.mobile-card-container .q-inner-loading {
  min-height: 300px;
}

.mobile-card-container .text-center {
  padding: 40px 20px;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  /* .card-header {
    padding: 8px;
  } */
  .mobile-cards-list {
    gap: 10px;
    padding: 10px;
  }

  .mobile-data-card {
    height: 110px;
    padding: 10px;
  }

  .mobile-photo-section {
    width: 70px;
    height: 70px;
  }

  .mobile-content-section {
    padding: 0 10px;
  }

  .mobile-english-name {
    font-size: 14px;
  }

  .mobile-bangla-name {
    font-size: 12px;
  }

  .mobile-contact-text {
    font-size: 11px;
    max-width: 150px;
  }

  .mobile-id-text {
    font-size: 12px;
  }

  .mobile-view-btn {
    height: 32px;
    min-height: 32px;
    width: 32px;
    min-width: 32px;
  }

  .mobile-view-btn :deep(.q-icon) {
    font-size: 18px;
  }
}

@media (max-width: 380px) {
  /* .card-header {
    padding: 10px;
  } */
  .mobile-data-card {
    height: 100px;
    padding: 8px;
  }

  .mobile-photo-section {
    width: 60px;
    height: 60px;
  }

  .mobile-english-name {
    font-size: 13px;
  }

  .mobile-bangla-name {
    font-size: 11px;
  }

  .mobile-contact-text {
    font-size: 10px;
    max-width: 130px;
  }

  .mobile-id-text {
    font-size: 11px;
  }

  .mobile-view-btn {
    height: 30px;
    min-height: 30px;
    width: 30px;
    min-width: 30px;
  }

  .mobile-view-btn :deep(.q-icon) {
    font-size: 16px;
  }
}

@media (max-width: 320px) {
  /* .card-header {
    padding: 10px;
  } */
  .mobile-data-card {
    height: 90px;
    padding: 6px;
  }

  .mobile-photo-section {
    width: 50px;
    height: 50px;
  }

  .mobile-english-name {
    font-size: 12px;
  }

  .mobile-bangla-name {
    font-size: 10px;
  }

  .mobile-contact-text {
    font-size: 9px;
    max-width: 110px;
  }

  .mobile-id-text {
    font-size: 10px;
  }

  .mobile-view-btn {
    height: 28px;
    min-height: 28px;
    width: 28px;
    min-width: 28px;
  }
}

/* Ensure proper table styling */
:deep(.q-table) {
  border-collapse: collapse;
}

:deep(.q-table tbody tr) {
  height: 80px;
}

:deep(.q-table td) {
  vertical-align: middle !important;
}

:deep(.id-cell),
:deep(.photo-cell),
:deep(.name-cell),
:deep(.contact-cell),
:deep(.actions-cell) {
  display: table-cell !important;
  vertical-align: middle !important;
}

/* Avatar image styling */
.avatar-img {
  object-fit: cover;
}

/* Empty state styling */
.full-height.row.flex-center {
  background: white;
  border-radius: 12px;
  margin: 20px;
}
</style>
