<template>
  <div class="q-pa-md member-directory-wrapper">
    <q-card bordered class="desktop-card no-shadow">
      <q-card-section class="card-header bg-primary-gradient">
        <div class="header-content">
          <div class="text-h4 text-white q-mb-xs q-mt-sm">
            <q-icon name="group" class="q-mr-sm" /> Member Directory
          </div>
          <div class="text-subtitle1 text-white opacity-8">
            Browse and manage all registered members
          </div>
        </div>
        <q-space />
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
      </q-card-section>

      <q-separator class="header-separator"></q-separator>

      <q-expansion-item
        icon="search"
        label="Search & Filter"
        default-open
        class="search-expansion bg-accent-light"
        expand-icon-class="text-primary-dark"
      >
        <div class="q-pa-md">
          <SearchMembers @search="onSearch"></SearchMembers>
        </div>
      </q-expansion-item>

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
          class="members-table elevation-2"
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
            <div class="table-top row items-center q-pb-md">
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
            <q-inner-loading showing color="accent" />
          </template>

          <template #body-cell-photo="props">
            <q-td :props="props" class="photo-cell">
              <div class="photo-container-desktop">
                <q-avatar size="68px" class="member-photo-desktop shadow-0">
                  <q-img
                    :src="imageURL(props.row.photo, '/src/assets/action.jpg')"
                    :ratio="1"
                    class="avatar-img"
                  />
                </q-avatar>
              </div>
            </q-td>
          </template>

          <template #body-cell-name="props">
            <q-td :props="props" class="name-cell">
              <div class="member-name">
                <div class="english-name text-weight-bolder text-primary-dark">
                  {{ props.row.name }}
                </div>
                <div class="bangla-name text-caption text-secondary-dark">
                  {{ props.row.name_bangla }}
                </div>
              </div>
            </q-td>
          </template>

          <template #body-cell-MemberID="props">
            <q-td :props="props" class="id-cell">
              <q-chip
                size="md"
                color="accent-faded"
                text-color="accent-dark"
                class="member-id-chip text-weight-bold"
              >
                <q-avatar
                  size="24px"
                  icon="vpn_key"
                  color="accent-dark"
                  text-color="white"
                />
                {{ props.row.member_id }}
              </q-chip>
            </q-td>
          </template>

          <template #body-cell-contact="props">
            <q-td :props="props" class="contact-cell">
              <div class="contact-info">
                <div class="contact-item">
                  <q-icon
                    name="phone_iphone"
                    size="16px"
                    class="q-mr-xs text-accent-dark"
                  />
                  <span class="text-weight-bold text-dark">{{
                    props.row.mobile || "N/A"
                  }}</span>
                </div>
                <div class="contact-item">
                  <q-icon
                    name="alternate_email"
                    size="16px"
                    class="q-mr-xs text-accent-dark"
                  />
                  <span class="text-body2 text-grey-8 text-xxl">{{
                    props.row.email || "N/A"
                  }}</span>
                </div>
              </div>
            </q-td>
          </template>

          <template #body-cell-area="props">
            <q-td :props="props" class="area-cell">
              <div class="area-info">
                <div class="area-item">
                  <span class="area-label">Commissionerate:&nbsp;</span>
                  <span class="area-value text-weight-medium">
                    {{
                      store.getCommissionerate.find(
                        (item) => item.value === props.row.commissionerate_id
                      )?.label || "N/A"
                    }}
                  </span>
                </div>
                <div class="area-item">
                  <span class="area-label">Division:&nbsp;</span>
                  <span class="area-value">
                    {{
                      store.getDivision.find(
                        (item) => item.value === props.row.division_id
                      )?.label || "N/A"
                    }}
                  </span>
                </div>
                <div class="area-item">
                  <span class="area-label">Circle:&nbsp;</span>
                  <span class="area-value">
                    {{
                      store.getCircle.find(
                        (item) => item.value === props.row.circle_id
                      )?.label || "N/A"
                    }}
                  </span>
                </div>
                <div class="area-item">
                  <span class="area-label">District:&nbsp;</span>
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

          <template #bottom>
            <div class="table-bottom q-pa-sm bg-blue-grey-1">
              <div class="row items-center justify-between">
                <div class="text-body2 text-primary-dark text-weight-medium">
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
                    color="accent-dark"
                    active-color="primary-dark"
                    :disable="loading"
                  />
                </div>

                <div style="width: 200px"></div>
                </div>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <q-card-section v-else class="q-pa-none">
        <div class="mobile-card-container">
          <q-inner-loading :showing="loading">
            <q-spinner-cube size="50px" color="accent" />
          </q-inner-loading>

          <div
            v-if="!loading && data.length === 0"
            class="text-center q-pa-lg text-h6 text-grey-6"
          >
            <q-icon name="info" size="24px" class="q-mr-sm" /> No data available
          </div>

          <q-card
            v-for="row in data"
            :key="row.id"
            class="mobile-data-card q-mb-md"
            bordered
            flat
          >
            <div class="card-main-content-mobile">
              <div class="photo-container-mobile">
                <q-img
                  :src="imageURL(row.photo, '/src/assets/action.jpg')"
                  class="card-photo-rounded-mobile"
                  :ratio="1"
                />
              </div>

              <div class="info-container-mobile">
                <div class="name-english-mobile">
                  {{ row.name }}
                </div>

                <div class="name-bangla-with-id-mobile">
                  {{ row.name_bangla }}
                  <span class="member-id-mobile"
                    >(ID: {{ row.member_id }})</span
                  >
                </div>

                <div class="contact-details-mobile q-mt-sm">
                  <div class="contact-item-mobile">
                    <q-icon
                      name="alternate_email"
                      size="16px"
                      color="primary"
                    />
                    <span class="contact-text-mobile text-grey-8">{{
                      row.email || "N/A"
                    }}</span>
                  </div>

                  <div class="contact-item-mobile">
                    <q-icon name="phone" size="16px" color="primary" />
                    <span class="contact-text-mobile text-weight-medium">{{
                      row.mobile || "N/A"
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <q-expansion-item
              class="area-expansion-mobile"
              expand-separator
              icon="location_on"
              label="Area Information"
              header-class="area-header-mobile"
            >
              <q-card class="area-content-mobile">
                <q-card-section>
                  <div class="area-row-mobile">
                    <span class="area-label-mobile">Commissionerate:</span>
                    <span class="area-value-mobile">
                      {{
                        store.getCommissionerate.find(
                          (item) => item.value === row.commissionerate_id
                        )?.label || "N/A"
                      }}
                    </span>
                  </div>
                  <div class="area-row-mobile">
                    <span class="area-label-mobile">Division:</span>
                    <span class="area-value-mobile">
                      {{
                        store.getDivision.find(
                          (item) => item.value === row.division_id
                        )?.label || "N/A"
                      }}
                    </span>
                  </div>
                  <div class="area-row-mobile">
                    <span class="area-label-mobile">Circle:</span>
                    <span class="area-value-mobile">
                      {{
                        store.getCircle.find(
                          (item) => item.value === row.circle_id
                        )?.label || "N/A"
                      }}
                    </span>
                  </div>
                  <div class="area-row-mobile">
                    <span class="area-label-mobile">District:</span>
                    <span class="area-value-mobile">
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
/* --- 🎨 Custom Color Palette --- */
/* Primary: Deep Blue/Navy */
.bg-primary-gradient {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%) !important;
}
.text-primary-dark {
  color: #1e3c72 !important;
}

/* Accent: Vibrant Teal/Cyan */
.bg-accent-light {
  background-color: #e0f7fa !important; /* Light Cyan for search background */
}
.text-accent-dark {
  color: #00838f !important; /* Deep Teal */
}
.bg-accent-faded {
  background-color: #b2ebf2 !important; /* Faded Teal for chips */
}
.text-secondary-dark {
  color: #607d8b;
}

/* --- 💻 Desktop Styles --- */
.member-directory-wrapper {
  background-color: #f4f7f6; /* Light, clean background */
}
.desktop-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 32px 24px;
}

.header-content .text-h4 {
  font-weight: 800;
  letter-spacing: 0.5px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.total-chip {
  font-size: 16px !important;
  padding: 8px 16px;
}

.search-expansion {
  border-bottom: 2px solid #00838f;
}

.search-expansion :deep(.q-item) {
  font-weight: 700;
  font-size: 16px;
  color: #1e3c72;
}

.members-table {
  border: none;
  background-color: white;
  border-radius: 0 0 12px 12px;
}

/* Table Header */
.members-table :deep(.q-th) {
  font-weight: 700;
  color: #424242;
  background-color: #f8f9fa;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

/* Table Row Hover Effect */
.members-table :deep(.q-table tbody tr) {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  border-bottom: 1px solid #eee;
}

.members-table :deep(.q-table tbody tr:hover) {
  background-color: #e0f7fa !important;
  transform: scale(1.005);
  box-shadow: 0 4px 10px rgba(0, 131, 143, 0.1);
}

/* Photo Cell - FIX APPLIED HERE */
.photo-container-desktop {
  display: flex;
  justify-content: center;
  /* Make container relative for proper centering/stacking */
  position: relative; 
}

.member-photo-desktop {
  /* This is the q-avatar that holds the image */
  border: 4px solid #f7fafb; 
  box-shadow: 0 4px 12px rgba(0, 131, 143, 0.3);
  transition: all 0.3s ease;
  z-index: 2; /* Ensure image is on top of any potential background effects */
}

/* .member-photo-desktop:hover {
  transform: scale(1.1);
  border-color: #00838f;
  box-shadow: 0 6px 15px rgba(0, 131, 143, 0.5);
} */

/* Name Cell */
.english-name {
  font-size: 20px;
  margin-bottom: 2px;
}
.bangla-name{
  font-size:18px;
}

/* ID Chip */
.member-id-chip {
  border-radius: 8px;
}

/* Area Cell */
.area-info {
  font-size: 20px;
  line-height: 1.5;
  padding-left: 8px;
  border-left: 3px solid #b2ebf2;
}

.area-label {
  font-weight: 600;
  font-size: 20px;
  color: #455a64;
  min-width: 100px;
}

.area-value {
  color: #1e3c72;
  font-size: 16px;
}

/* Table Bottom (Pagination) */
.table-bottom {
  border-top: 1px solid #d4d4d4;
}

.pagination-wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.contact-item{
font-size: 20px;
}

/* --- 📱 Mobile Styles (Reverted to Original Simplicity) --- */
.mobile-card-container {
  padding: 16px;
  background: #f8f9fa; /* Light grey background */
  min-height: 400px;
  position: relative;
}

.mobile-data-card {
  border-radius: 12px; /* Smoother edges */
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); /* Lighter shadow */
  transition: all 0.3s ease;
}

/* Main Content Layout - Mobile */
.card-main-content-mobile {
  display: flex;
  gap: 16px;
  padding: 20px;
  align-items: flex-start;
}

/* Photo Section - Mobile */
.photo-container-mobile {
  flex-shrink: 0;
}

.card-photo-rounded-mobile {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 2px solid #e0e0e0; /* Simple border */
  box-shadow: none; /* No strong shadow */
  object-fit: cover;
}

/* Info Section - Mobile */
.info-container-mobile {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px; /* Closer gaps */
  min-width: 0;
}

.name-english-mobile {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
}

.name-bangla-with-id-mobile {
  font-size: 14px;
  color: #555;
  font-weight: 500;
  margin-bottom: 4px;
  line-height: 1.4;
}

.member-id-mobile {
  color: #1976d2; /* Original Blue */
  font-weight: 600;
  font-size: 13px;
  margin-left: 4px;
}

.contact-details-mobile {
  margin-top: 8px;
}

.contact-item-mobile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0;
}

.contact-text-mobile {
  font-size: 16px;
  color: #333;
  word-break: break-word;
}

/* Area Expansion - Mobile */
.area-expansion-mobile {
  border-top: 1px solid #e0e0e0;
}

.area-expansion-mobile :deep(.area-header-mobile) {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  padding: 12px 20px;
}

.area-content-mobile {
  background: #fafafa;
  box-shadow: none;
}

.area-row-mobile {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #e8e8e8;
}

.area-label-mobile {
  font-weight: 600;
  color: #666;
  min-width: 120px;
  font-size: 13px;
}

.area-value-mobile {
  color: #333;
  flex: 1;
  font-size: 13px;
}

.mobile-pagination {
  display: flex;
  justify-content: center;
}
</style>