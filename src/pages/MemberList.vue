<template>
  <div class="q-pa-md">
    <q-card bordered class="desktop-card no-shadow">
      <q-card-section class="card-header">
        <div class="header-content">
          <div class="text-h5 text-grey-9 q-mb-xs">Member Directory</div>
          <div class="text-caption text-grey-6">
            Browse and manage all registered members
          </div>
        </div>
        <q-space />
        <div class="total-members">
          <q-chip color="primary" text-color="white" icon="people">
            Total: {{ pagination.rowsNumber }}
          </q-chip>
        </div>
      </q-card-section>

      <q-separator class="header-separator"></q-separator>

      <!-- Search Expansion -->
      <q-expansion-item
        icon="search"
        label="Search Members"
        default-open
        class="search-expansion bg-grey-1"
        expand-icon-class="text-primary"
      >
        <div class="q-pa-md">
          <SearchMembers @search="onSearch"></SearchMembers>
        </div>
      </q-expansion-item>

      <!-- Desktop Table View -->
      <q-card-section v-if="$q.screen.gt.sm" class="q-pa-none">
        <q-table
          flat
          bordered
          wrap-cells
          no-data-label="No members found"
          ref="tableRef"
          :columns="columns"
          :rows="data"
          :wrap-cells="true"
          class="members-table no-shadow"
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
          <!-- Top Slot: Custom Header -->
          <template #top>
            <div class="table-top row items-center q-pb-md">
              <div class="text-h6 text-grey-8">Member List</div>
              <q-space />
            </div>
          </template>

          <!-- Loading State -->
          <template #loading>
            <q-inner-loading showing color="primary" />
          </template>

          <!-- Photo Column -->
          <template #body-cell-photo="props">
            <q-td :props="props" class="photo-cell">
              <div class="photo-container">
                <q-avatar size="60px" class="member-photo">
                  <q-img
                    :src="imageURL(props.row.photo, '/src/assets/action.jpg')"
                    :ratio="1"
                    class="avatar-img"
                  />
                </q-avatar>
              </div>
            </q-td>
          </template>

          <!-- Name Column -->
          <template #body-cell-name="props">
            <q-td :props="props" class="name-cell">
              <div class="member-name">
                <div class="english-name text-weight-medium">
                  {{ props.row.name }}
                </div>
                <div class="bangla-name text-caption text-grey-7">
                  {{ props.row.name_bangla }}
                </div>
              </div>
            </q-td>
          </template>

          <!-- Member ID Column -->
          <template #body-cell-MemberID="props">
            <q-td :props="props" class="id-cell">
              <q-chip
                size="sm"
                color="blue-grey-1"
                text-color="blue-grey-9"
                class="member-id-chip"
              >
                <q-avatar
                  size="20px"
                  icon="badge"
                  color="primary"
                  text-color="white"
                />
                {{ props.row.member_id }}
              </q-chip>
            </q-td>
          </template>

          <!-- Contact Column -->
          <template #body-cell-contact="props">
            <q-td :props="props" class="contact-cell">
              <div class="contact-info">
                <div class="contact-item">
                  <q-icon
                    name="phone"
                    size="14px"
                    class="q-mr-xs text-primary"
                  />
                  <span class="text-weight-medium">{{
                    props.row.mobile || "N/A"
                  }}</span>
                </div>
                <div class="contact-item">
                  <q-icon
                    name="email"
                    size="14px"
                    class="q-mr-xs text-primary"
                  />
                  <span class="text-caption text-grey-8">{{
                    props.row.email || "N/A"
                  }}</span>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Area Column -->
          <template #body-cell-area="props">
            <q-td :props="props" class="area-cell">
              <div class="area-info">
                <div class="area-item">
                  <span class="area-label">Commissionerate:</span>
                  <span class="area-value">
                    {{
                      store.getCommissionerate.find(
                        (item) => item.value === props.row.commissionerate_id
                      )?.label || "N/A"
                    }}
                  </span>
                </div>
                <div class="area-item">
                  <span class="area-label">Division:</span>
                  <span class="area-value">
                    {{
                      store.getDivision.find(
                        (item) => item.value === props.row.division_id
                      )?.label || "N/A"
                    }}
                  </span>
                </div>
                <div class="area-item">
                  <span class="area-label">Circle:</span>
                  <span class="area-value">
                    {{
                      store.getCircle.find(
                        (item) => item.value === props.row.circle_id
                      )?.label || "N/A"
                    }}
                  </span>
                </div>
                <div class="area-item">
                  <span class="area-label">District:</span>
                  <span class="area-value">
                    {{
                      store.getDistrict.find(
                        (item) => item.value === props.row.district_id
                      )?.label || "N/A"
                    }}
                  </span>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Bottom Slot: Custom Pagination -->
          <template #bottom>
            <div class="table-bottom q-pa-sm">
              <div class="row items-center justify-between">
                <div class="text-caption text-grey-7">
                  Showing
                  {{ (pagination.page - 1) * pagination.rowsPerPage + 1 }} to
                  {{
                    Math.min(
                      pagination.page * pagination.rowsPerPage,
                      pagination.rowsNumber
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
                    :disable="loading"
                  />
                </div>

                <div style="width: 200px"></div>
                <!-- Right spacer for balance -->
              </div>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <!-- Mobile Card View -->
      <q-card-section v-else class="q-pa-none">
        <div class="mobile-card-container">
          <q-inner-loading :showing="loading">
            <q-spinner-dots size="50px" color="primary" />
          </q-inner-loading>

          <div
            v-if="!loading && data.length === 0"
            class="text-center q-pa-lg text-grey-6"
          >
            No data available
          </div>

          <q-card
            v-for="row in data"
            :key="row.id"
            class="mobile-data-card q-mb-md"
            bordered
            flat
          >
            <!-- Main Content: Photo and Info Side by Side -->
            <div class="card-main-content">
              <!-- Left: Rounded Photo -->
              <div class="photo-container">
                <q-img
                  :src="imageURL(row.photo, '/src/assets/action.jpg')"
                  class="card-photo-rounded"
                  :ratio="1"
                />
              </div>

              <!-- Right: Name, Contact Info -->
              <div class="info-container">
                <!-- English Name -->
                <div class="name-english">{{ row.name }}</div>

                <!-- Bangla Name with Member ID -->
                <div class="name-bangla-with-id">
                  {{ row.name_bangla }}
                  <span class="member-id"
                    >(Member ID: {{ row.member_id }})</span
                  >
                </div>

                <!-- Email -->
                <div class="contact-item">
                  <q-icon name="email" size="16px" color="primary" />
                  <span class="contact-text">{{ row.email || "N/A" }}</span>
                </div>

                <!-- Phone -->
                <div class="contact-item">
                  <q-icon name="phone" size="16px" color="primary" />
                  <span class="contact-text">{{ row.mobile || "N/A" }}</span>
                </div>
              </div>
            </div>

            <!-- Expandable Area Information -->
            <q-expansion-item
              class="area-expansion"
              expand-separator
              icon="location_on"
              label="Area Information"
              header-class="area-header"
            >
              <q-card class="area-content">
                <q-card-section>
                  <div class="area-row">
                    <span class="area-label">Commissionerate:</span>
                    <span class="area-value">
                      {{
                        store.getCommissionerate.find(
                          (item) => item.value === row.commissionerate_id
                        )?.label || "N/A"
                      }}
                    </span>
                  </div>
                  <div class="area-row">
                    <span class="area-label">Division:</span>
                    <span class="area-value">
                      {{
                        store.getDivision.find(
                          (item) => item.value === row.division_id
                        )?.label || "N/A"
                      }}
                    </span>
                  </div>
                  <div class="area-row">
                    <span class="area-label">Circle:</span>
                    <span class="area-value">
                      {{
                        store.getCircle.find(
                          (item) => item.value === row.circle_id
                        )?.label || "N/A"
                      }}
                    </span>
                  </div>
                  <div class="area-row">
                    <span class="area-label">District:</span>
                    <span class="area-value">
                      {{
                        store.getDistrict.find(
                          (item) => item.value === row.district_id
                        )?.label || "N/A"
                      }}
                    </span>
                  </div>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-card>

          <!-- Mobile Pagination -->
          <div
            class="mobile-pagination q-mt-md q-mb-lg"
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
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import SearchMembers from "components/SearchMembers.vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useStore } from "stores/store";

const tableRef = ref(null);
const loading = ref(false);
const store = useStore();
const $q = useQuasar();

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const filter = ref({
  keywords: "",
  commissionerate_id: null,
  division_id: null,
  circle_id: null,
  district_id: null,
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
  },
  {
    name: "photo",
    label: "Photo",
    field: "photo",
    sortable: false,
    align: "center",
    classes: "photo-column",
  },
  {
    name: "name",
    label: "Name",
    field: "name",
    sortable: true,
    align: "left",
    classes: "name-column",
  },
  {
    name: "contact",
    label: "Contact Info",
    field: "mobile",
    sortable: true,
    align: "left",
    classes: "contact-column",
  },
  {
    name: "area",
    label: "Area Details",
    field: "commissionerate_id",
    sortable: true,
    align: "left",
    classes: "area-column",
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

const onSearch = (search) => {
  filter.value = { ...search };
  pagination.value.page = 1;
  fetchData(1);
};

const onPageChange = (page) => {
  pagination.value.page = page;
  fetchData(page);
};

const onRowsPerPageChange = (value) => {
  pagination.value.rowsPerPage = value;
  pagination.value.page = 1;
  fetchData(1);
};

const buildSearchQuery = () => {
  const f = filter.value;
  const search = [];

  // Keyword search - search in multiple fields with OR
  if (f.keywords?.trim()) {
    const k = f.keywords.trim();
    search.push(`name:${k}`);
    search.push(`mobile:${k}`);
    search.push(`member_id:${k}`);
    search.push(`email:${k}`);
  }

  // Filter search - these should use AND
  if (f.commissionerate_id)
    search.push(`commissionerate_id:${f.commissionerate_id}`);
  if (f.division_id) search.push(`division_id:${f.division_id}`);
  if (f.circle_id) search.push(`circle_id:${f.circle_id}`);
  if (f.district_id) search.push(`district_id:${f.district_id}`);

  return search.join(";");
};

const fetchData = async (page = 1) => {
  loading.value = true;
  try {
    const searchStr = buildSearchQuery();
    console.log("Search String:", searchStr);

    // Determine searchJoin parameter
    const hasKeywords = filter.value.keywords?.trim();
    const hasFilters =
      filter.value.commissionerate_id ||
      filter.value.division_id ||
      filter.value.circle_id ||
      filter.value.district_id;

    let url = `v1/users?verified=true&page=${page}`;

    if (searchStr) {
      // If we have both keywords and filters, we need complex logic
      if (hasKeywords && hasFilters) {
        // For complex searches, you might need to handle it differently
        // This depends on your backend API structure
        url = `v1/users?verified=true&search=${searchStr}&page=${page}`;
      } else {
        url = `v1/users?verified=true&search=${searchStr}&page=${page}`;
      }
    }

    console.log("Fetching URL:", url);
    const response = await api.get(url);

    console.log("API Response:", response.data);
    data.value = response.data.data;

    const meta = response.data.meta?.pagination || {
      current_page: 1,
      per_page: 10,
      total: data.value.length,
    };

    pagination.value = {
      page: meta.current_page,
      rowsPerPage: meta.per_page,
      rowsNumber: meta.total,
    };

    console.log("Data loaded:", data.value.length, "members");
    console.log("Pagination:", pagination.value);
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
    console.log("Component mounted - loading store data...");

    // Load all dropdown data from store
    await Promise.all([
      store.storeCommissionerate(),
      store.storeDivision(),
      store.storeCircle(),
      store.storeDistrict(),
    ]);

    console.log("Store data loaded:");
    console.log("Commissionerate:", store.getCommissionerate?.length || 0);
    console.log("Division:", store.getDivision?.length || 0);
    console.log("Circle:", store.getCircle?.length || 0);
    console.log("District:", store.getDistrict?.length || 0);

    // Then fetch member data
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
/* Desktop Styles */
.desktop-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
}

.header-content {
  color: white;
}

.header-content .text-h5 {
  font-weight: 700;
  letter-spacing: -0.5px;
}

.header-content .text-caption {
  opacity: 0.9;
}

.header-separator {
  margin: 0;
}

.search-expansion {
  border-bottom: 1px solid #e0e0e0;
}

.search-expansion :deep(.q-item) {
  font-weight: 600;
  color: #333;
}

.members-table {
  border: none;
}

.members-table :deep(.q-table__top) {
  padding: 20px 24px 0;
  border-bottom: 1px solid #e0e0e0;
}

.table-top {
  padding: 8px 0;
}

/* Photo Cell */
.photo-cell {
  padding: 8px 16px;
}

.photo-container {
  display: flex;
  justify-content: center;
}

.member-photo {
  border: 3px solid #e3f2fd;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.2);
  transition: all 0.3s ease;
}

.member-photo:hover {
  transform: scale(1.05);
  border-color: #2196f3;
}

.avatar-img {
  border-radius: 50%;
}

/* Name Cell */
.name-cell {
  padding: 16px;
}

.member-name {
  line-height: 1.4;
}

.english-name {
  font-size: 15px;
  margin-bottom: 4px;
}

.bangla-name {
  font-size: 13px;
  font-style: italic;
}

/* ID Cell */
.id-cell {
  padding: 16px;
}

.member-id-chip {
  font-weight: 600;
  border-radius: 16px;
}

/* Contact Cell */
.contact-cell {
  padding: 16px;
}

.contact-info {
  line-height: 1.6;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

/* Area Cell */
.area-cell {
  padding: 16px;
}

.area-info {
  font-size: 12px;
  line-height: 1.6;
}

.area-item {
  display: flex;
  margin-bottom: 4px;
}

.area-label {
  font-weight: 600;
  color: #666;
  min-width: 120px;
}

.area-value {
  color: #333;
  flex: 1;
}

/* Table Bottom */
.table-bottom {
  background-color: #fafafa;
  border-top: 1px solid #e0e0e0;
  min-height: 64px;
}

.pagination-wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

/* Table Row Hover Effect */
.members-table :deep(.q-table tbody tr) {
  transition: background-color 0.2s;
}

.members-table :deep(.q-table tbody tr:hover) {
  background-color: #f5f9ff !important;
}

/* Table Header */
.members-table :deep(.q-th) {
  font-weight: 700;
  color: #424242;
  background-color: #f8f9fa;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Column Specific Styles */
.members-table :deep(.id-column) {
  min-width: 150px;
}

.members-table :deep(.photo-column) {
  min-width: 100px;
}

.members-table :deep(.name-column) {
  min-width: 200px;
}

.members-table :deep(.contact-column) {
  min-width: 180px;
}

.members-table :deep(.area-column) {
  min-width: 300px;
}

/* Loading State */
:deep(.q-inner-loading) {
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 1000;
}

/* Responsive adjustments for medium screens */
@media (max-width: 1200px) {
  .desktop-card {
    margin: 0 -8px;
  }

  .members-table :deep(.q-table__container) {
    min-width: 100%;
  }
}

/* Mobile Styles */
.mobile-card-container {
  padding: 16px;
  background: #f8f9fa;
  min-height: 400px;
  position: relative;
}

.mobile-pagination {
  display: flex;
  justify-content: center;
}

.mobile-data-card {
  border-radius: 16px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.mobile-data-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

/* Main Content Layout */
.card-main-content {
  display: flex;
  gap: 16px;
  padding: 20px;
  align-items: flex-start;
}

/* Photo Section */
.photo-container {
  flex-shrink: 0;
}

.card-photo-rounded {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #f0f0f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

/* Info Section */
.info-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.name-english {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
  margin-bottom: 2px;
}

.name-bangla-with-id {
  font-size: 14px;
  color: #555;
  font-weight: 500;
  margin-bottom: 8px;
  line-height: 1.4;
}

.member-id {
  color: #1976d2;
  font-weight: 600;
  font-size: 12px;
  margin-left: 4px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.contact-text {
  font-size: 13px;
  color: #333;
  word-break: break-word;
}

/* Area Expansion */
.area-expansion {
  border-top: 1px solid #e0e0e0;
}

.area-expansion :deep(.area-header) {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  padding: 12px 20px;
}

.area-expansion :deep(.q-item__label) {
  font-weight: 600;
  color: #333;
}

.area-content {
  background: #fafafa;
  box-shadow: none;
}

.area-content .q-card-section {
  padding: 16px 20px;
}

.area-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #e8e8e8;
}

.area-row:last-child {
  border-bottom: none;
}

.area-label {
  font-weight: 600;
  color: #666;
  min-width: 130px;
  font-size: 13px;
}

.area-value {
  color: #333;
  flex: 1;
  font-size: 13px;
}

/* Responsive Adjustments */
@media (max-width: 400px) {
  .card-main-content {
    gap: 12px;
    padding: 16px;
  }

  .card-photo-rounded {
    width: 80px;
    height: 80px;
  }

  .name-english {
    font-size: 16px;
  }

  .name-bangla-with-id {
    font-size: 13px;
  }

  .contact-text {
    font-size: 12px;
  }

  .area-label {
    min-width: 110px;
    font-size: 12px;
  }

  .area-value {
    font-size: 12px;
  }
}
</style>
