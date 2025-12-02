<!-- <template>
  <q-layout view="hHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-md">
        <q-card class="shadow-6">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Member Verification Requests</div>
          </q-card-section>

          <q-card-section>
            <q-table
              :rows="users"
              :columns="columns"
              row-key="id"
              :loading="loading"
              :pagination="pagination"
              @request="onRequest"
            >
              <template v-slot:body-cell-photo="props">
                <q-td :props="props">
                  <q-avatar v-if="props.row.photo">
                    <img :src="props.row.photo" />
                  </q-avatar>
                  <q-avatar v-else color="grey" text-color="white" icon="person" />
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    label="Verify"
                    color="positive"
                    size="sm"
                    @click="verifyUser(props.row.id)"
                    :loading="verifyingId === props.row.id"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>

        <q-dialog v-model="showMessage" persistent>
          <q-card>
            <q-card-section>
              <div class="text-h6">{{ messageTitle }}</div>
            </q-card-section>

            <q-card-section>
              {{ messageContent }}
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const users = ref([]);
const loading = ref(false);
const verifyingId = ref(null);
const showMessage = ref(false);
const messageTitle = ref('');
const messageContent = ref('');

const pagination = ref({
  sortBy: 'created_at',
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const columns = [
  {
    name: 'serial',
    label: '#',
    field: 'serial',
    align: 'left',
  },
  {
    name: 'photo',
    label: 'Photo',
    field: 'photo',
    align: 'center',
  },
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'commissionerate',
    label: 'Commissionerate',
    field: (row) => row.commissionerate?.data?.name || 'N/A',
    align: 'left',
    sortable: true,
  },
  {
    name: 'division',
    label: 'Division',
    field: (row) => row.division?.data?.name || 'N/A',
    align: 'left',
    sortable: true,
  },
  {
    name: 'circle',
    label: 'Circle',
    field: (row) => row.circle?.data?.name || 'N/A',
    align: 'left',
    sortable: true,
  },
  {
    name: 'district',
    label: 'District',
    field: (row) => row.district?.data?.name || 'N/A',
    align: 'left',
    sortable: true,
  },
  {
    name: 'mobile',
    label: 'Phone',
    field: 'mobile',
    align: 'left',
  },
  {
    name: 'designation',
    label: 'Designation',
    field: 'designation',
    align: 'left',
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
  },
];

const fetchUsers = async () => {
  try {
    loading.value = true;
    const response = await api.get(
      '/v1/users?include=commissionerate,roles,division,circle,district'
    );

    users.value = response.data.data.map((user, index) => ({
      ...user,
      serial: (pagination.value.page - 1) * pagination.value.rowsPerPage + index + 1,
    }));

    pagination.value.rowsNumber = response.data.meta.pagination.total;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load users',
    });
  } finally {
    loading.value = false;
  }
};

const verifyUser = async (userId) => {
  try {
    verifyingId.value = userId;
    
    const params = new URLSearchParams();
    params.append('verified_at', new Date().toISOString().split('T')[0]);

    await api.patch(`/v1/users/${userId}`, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    showMessage.value = true;
    messageTitle.value = 'Success';
    messageContent.value = 'User verified successfully';
    
    users.value = users.value.filter(user => user.id !== userId);
    
    setTimeout(() => {
      showMessage.value = false;
    }, 5000);
  } catch (error) {
    showMessage.value = true;
    messageTitle.value = 'Error';
    messageContent.value = error.response?.data?.message || 'Failed to verify user';
    
    setTimeout(() => {
      showMessage.value = false;
    }, 5000);
  } finally {
    verifyingId.value = null;
  }
};

const onRequest = (props) => {
  pagination.value = props.pagination;
  fetchUsers();
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.q-table__top {
  background-color: #f5f5f5;
}
</style> -->





<!-- <template>
  <div class="q-pa-md">
    <q-card bordered class="no-shadow">
      <q-card-section>
        <div class="text-h6 text-grey-8">
          Member List
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-expansion-item
        icon="search"
        label="Search Members"
        default-open
        class="bg-grey-1"
      >
        <div class="q-pa-md">
          <SearchMembers @search="onSearch"></SearchMembers>
        </div>
      </q-expansion-item>
      <q-card-section class="q-pa-none">
        <q-table
          flat bordered
          wrap-cells
          no-data-label="No data available"
          ref="tableRef"
          :columns="columns"
          :rows="data"
          :wrap-cells="true"
          class="no-shadow"
          row-key="id"
          v-model:pagination="pagination"
          :loading="loading"
          @request="onRequest"
          square
          style="height: 700px"
          virtual-scroll>
          <template #body-cell-photo="props">
            <q-td :props="props">
              <q-img
                :src="imageURL(props.row.photo,'/src/assets/action.jpg')"
                :ratio="4/3"
                style="height: 100px; max-width: 100px"
              />
            </q-td>
          </template>
          <template #body-cell-name="props">
            <q-td :props="props">
              {{ props.row.name }} <br/>
              {{ props.row.name_bangla }}
            </q-td>
          </template>
          <template #body-cell-contact="props">
            <q-td :props="props">
              Mobile: {{ props.row.mobile }} <br/>
              Email: {{ props.row.email }}
            </q-td>
          </template>
          <template #body-cell-area="props">
            <q-td :props="props">
              Commissionerate: {{store.getCommissionerate.find((item)=> item.value ===props.row.commissionerate_id)?.label}} <br/>
              Division: {{store.getDivision.find((item)=> item.value=== props.row.division_id)?.label }} <br/>
              Circle: {{store.getCircle.find((item)=> item.value===props.row.circle_id)?.label }} <br>
              District: {{store.getDistrict.find((item)=> item.value===props.row.district_id)?.label }}
            </q-td>
          </template>
          <template #body-cell-Action="props">
          

          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import SearchMembers from "components/SearchMembers.vue";
import {useQuasar} from "quasar";
import {api} from "boot/axios";
import {useStore} from "stores/store";

const tableRef = ref(null)
const loading = ref(false)
const store=useStore()
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const filter = ref({
  keywords: "",
  commissionerate_id: "",
  division_id: "",
  circle_id: "",
});
const $q=useQuasar()
const data = ref([]);
const columns = [
  {
    name: "MemberID",
    label: "MemberID",
    field: "member_id",
    sortable: true,
    align: "left"
  },
  {
    name: "photo",
    label: "Photo",
    field: "photo",
    sortable: true,
    align: "left"
  },
  {
    name: "name",
    label: "Name",
    field: "",
    sortable: true,
    align: "left"
  },
  {
    name: "contact",
    label: "Contact",
    field: "",
    sortable: true,
    align: "left"
  },
  {
    name: "area",
    label: "Area",
    field: "",
    sortable: true,
    align: "left"
  },
]


const path =(process.env.DEV ? process.env.WEB_DEV_URL : process.env.WEB_BUILD_URL)
function imageURL(url,defaultPATH) {
  if (url === null) {
    return defaultPATH;
  } else {
    if (url.startsWith('http')) {
      return url;
    } else {
      return path + url;
    }
  }
}

// const onSearch = (search) => {
//   filter.value = search;
//   fetchData();
// };
const onSearch = (search) => {
  filter.value = { ...search }
  fetchData()
}

// const fetchData = async (page=1) => {
//   try {
//     loading.value=true
//     const response = await api
//       .get(
//         `v1/users?verified=true&search=${
//           filter.value.keywords && filter.value.keywords.length
//             ? "name:" + filter.value.keywords+';'
//             : ""
//         }${
//           filter.value.commissionerate_id && filter.value.commissionerate_id.length
//             ? "commissionerate_id:" + filter.value.commissionerate_id+';'
//             : ""
//         }${
//           filter.value.division_id && filter.value.division_id.length
//             ? "division_id:" + filter.value.division_id+';'
//             : ""
//         }${
//           filter.value.circle_id && filter.value.circle_id.length
//             ? "circle_id:" + filter.value.circle_id+';'
//             : ""
//         }&searchJoin=and&page=${page}`
//       )

//     data.value = response.data.data;
//     const meta = response.data.meta.pagination;
//     pagination.value = {
//       page: meta.current_page,
//       rowsPerPage: meta.per_page,
//       rowsNumber: meta.total,
//     };
//     loading.value=false
//   } catch (error) {
//     loading.value=false
//     console.error("Error loading elections:", error);
//   }
// };

const buildSearchQuery = () => {
  const f = filter.value
  const search = []

  if (f.keywords) search.push(`name:${f.keywords}`)
  if (f.commissionerate_id) search.push(`commissionerate_id:${f.commissionerate_id}`)
  if (f.division_id) search.push(`division_id:${f.division_id}`)
  if (f.circle_id) search.push(`circle_id:${f.circle_id}`)
  if (f.district_id) search.push(`district_id:${f.district_id}`)

  return search.join(";")
}

const fetchData = async (page = 1) => {
  loading.value = true
  try {
    const searchStr = buildSearchQuery()

    const response = await api.get(
      `v1/users?verified=true&search=${searchStr}&searchJoin=and&page=${page}`
    )

    data.value = response.data.data

    const meta = response.data.meta.pagination
    pagination.value = {
      page: meta.current_page,
      rowsPerPage: meta.per_page,
      rowsNumber: meta.total
    }

  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}


const onRequest = (props) => {
  fetchData(props.pagination.page)
};

onMounted(()=>fetchData());


</script>

<style scoped>

</style> -->


<template>
  <div class="q-pa-md">
    <q-card bordered class="no-shadow">
      <q-card-section>
        <div class="text-h6 text-grey-8">
          Member List
        </div>
      </q-card-section>
      <q-separator></q-separator>
      <q-expansion-item
        icon="search"
        label="Search Members"
        default-open
        class="bg-grey-1"
      >
        <div class="q-pa-md">
          <SearchMembers @search="onSearch"></SearchMembers>
        </div>
      </q-expansion-item>
      <q-card-section class="q-pa-none">
        <q-table
          flat bordered
          wrap-cells
          no-data-label="No data available"
          ref="tableRef"
          :columns="columns"
          :rows="data"
          :wrap-cells="true"
          class="no-shadow"
          row-key="id"
          v-model:pagination="pagination"
          :loading="loading"
          @request="onRequest"
          square
          style="height: 700px"
          virtual-scroll>
          <template #body-cell-photo="props">
            <q-td :props="props">
              <q-img
                :src="imageURL(props.row.photo,'/src/assets/action.jpg')"
                :ratio="4/3"
                style="height: 100px; max-width: 100px"
              />
            </q-td>
          </template>
          <template #body-cell-name="props">
            <q-td :props="props">
              {{ props.row.name }} <br/>
              {{ props.row.name_bangla }}
            </q-td>
          </template>
          <template #body-cell-contact="props">
            <q-td :props="props">
              Mobile: {{ props.row.mobile }} <br/>
              Email: {{ props.row.email }}
            </q-td>
          </template>
          <template #body-cell-area="props">
            <q-td :props="props">
              Commissionerate: {{store.getCommissionerate.find((item)=> item.value ===props.row.commissionerate_id)?.label || 'N/A'}} <br/>
              Division: {{store.getDivision.find((item)=> item.value=== props.row.division_id)?.label || 'N/A'}} <br/>
              Circle: {{store.getCircle.find((item)=> item.value===props.row.circle_id)?.label || 'N/A'}} <br>
              District: {{store.getDistrict.find((item)=> item.value===props.row.district_id)?.label || 'N/A'}}
            </q-td>
          </template>
          <template #body-cell-Action="props">
          

          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
import {onMounted, ref} from "vue";
import SearchMembers from "components/SearchMembers.vue";
import {useQuasar} from "quasar";
import {api} from "boot/axios";
import {useStore} from "stores/store";

const tableRef = ref(null)
const loading = ref(false)
const store=useStore()
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const filter = ref({
  keywords: "",
  commissionerate_id: null,
  division_id: null,
  circle_id: null,
  district_id: null,
});
const $q=useQuasar()
const data = ref([]);
const columns = [
  {
    name: "MemberID",
    label: "MemberID",
    field: "member_id",
    sortable: true,
    align: "left"
  },
  {
    name: "photo",
    label: "Photo",
    field: "photo",
    sortable: true,
    align: "left"
  },
  {
    name: "name",
    label: "Name",
    field: "",
    sortable: true,
    align: "left"
  },
  {
    name: "contact",
    label: "Contact",
    field: "",
    sortable: true,
    align: "left"
  },
  {
    name: "area",
    label: "Area",
    field: "",
    sortable: true,
    align: "left"
  },
]


const path =(process.env.DEV ? process.env.WEB_DEV_URL : process.env.WEB_BUILD_URL)
function imageURL(url,defaultPATH) {
  if (url === null) {
    return defaultPATH;
  } else {
    if (url.startsWith('http')) {
      return url;
    } else {
      return path + url;
    }
  }
}

const onSearch = (search) => {
  filter.value = { ...search }
  pagination.value.page = 1
  fetchData(1)
}

const buildSearchQuery = () => {
  const f = filter.value
  const search = []

  if (f.keywords?.trim()) search.push(`name:${f.keywords.trim()}`)
  if (f.commissionerate_id) search.push(`commissionerate_id:${f.commissionerate_id}`)
  if (f.division_id) search.push(`division_id:${f.division_id}`)
  if (f.circle_id) search.push(`circle_id:${f.circle_id}`)
  if (f.district_id) search.push(`district_id:${f.district_id}`)

  return search.join(";")
}

const fetchData = async (page = 1) => {
  loading.value = true
  try {
    const searchStr = buildSearchQuery()
    const url = searchStr 
      ? `v1/users?verified=true&search=${searchStr}&searchJoin=and&page=${page}`
      : `v1/users?verified=true&page=${page}`

    console.log('Fetching URL:', url)
    const response = await api.get(url)
    
    console.log('API Response:', response.data)
    data.value = response.data.data

    const meta = response.data.meta.pagination
    pagination.value = {
      page: meta.current_page,
      rowsPerPage: meta.per_page,
      rowsNumber: meta.total
    }
    
    console.log('Data loaded:', data.value.length, 'members')
    console.log('Pagination:', pagination.value)

  } catch (err) {
    console.error('Error fetching members:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to load members',
      caption: err.response?.data?.message || err.message
    })
  } finally {
    loading.value = false
  }
}


const onRequest = (props) => {
  fetchData(props.pagination.page)
};

onMounted(async ()=> {
  try {
    console.log('Component mounted - loading store data...')
    
    // Load all dropdown data from store
    await Promise.all([
      store.storeCommissionerate(),
      store.storeDivision(),
      store.storeCircle(),
      store.storeDistrict()
    ])
    
    console.log('Store data loaded:')
    console.log('Commissionerate:', store.getCommissionerate.length)
    console.log('Division:', store.getDivision.length)
    console.log('Circle:', store.getCircle.length)
    console.log('District:', store.getDistrict.length)
    
    // Then fetch member data
    await fetchData()
  } catch (err) {
    console.error('Error in onMounted:', err)
    $q.notify({
      type: 'negative',
      message: 'Failed to load initial data'
    })
  }
});


</script>

<style scoped>

</style>