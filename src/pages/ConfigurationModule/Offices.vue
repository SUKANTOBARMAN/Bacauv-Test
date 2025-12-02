<template>
  <q-page class="q-pa-md">
    <!-- Filter Section -->
    <q-card class="q-mt-md q-mb-md">
      <q-card-section>
        <div class="text-subtitle1">অফিস ফিল্টার করুন</div>
        <div class="row q-gutter-md items-center">
          <q-select
            v-model="filter.type"
            :options="allTypeOptions"
            label="অফিসের ধরণ"
            outlined
            dense
            emit-value
            map-options
            clearable
            style="min-width: 200px"
          />
          <q-input
            v-model="filter.name"
            label="অফিসের নাম অনুসন্ধান করুন"
            outlined
            dense
            clearable
          />
          <q-btn
            label="ফিল্টার করুন"
            color="primary"
            @click="applyFilter"
          />
          <q-btn
            label="মুছে ফেলুন"
            color="secondary"
            @click="clearFilter"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-tree
      class="q-mt-md office-tree"
      :nodes="filteredOffices"
      node-key="id"
      label-key="name"
      children-key="children"
      no-connectors
      default-expand-all
      v-if="!loading"
    >
      <template v-slot:default-header="prop">
        <div class="row items-center full-width">
          <div class="row items-center office-header">
            <q-btn
              v-if="prop.node.children && prop.node.children.length > 0"
              @click="prop.expanded = !prop.expanded"
              dense
              flat
              round
              :icon="prop.expanded ? 'remove' : 'add'"
              size="sm"
              class="q-mr-sm"
            />
            <div>
              <div class="text-weight-bold">{{ prop.node.name }}</div>
              <div class="text-caption text-grey-7">{{ prop.node.type }}</div>
              <div v-if="prop.node.additional_info?.city_corporation" class="text-caption text-grey-7">
                City: {{ prop.node.additional_info.city_corporation }}
              </div>
            </div>
          </div>
          
          <q-space />
          
          <div class="row q-gutter-sm">
            <q-btn
              size="sm"
              color="secondary"
              label="কর্মচারী দেখুন"
              @click="viewEmployees(prop.node)"
              class="view-employees-btn"
              icon="people"
            />
            <q-btn
              v-if="(prop.node.type === 'Head Office' || prop.node.type === 'District Office') && userStore.getHighestRole==='admin'"
              size="sm"
              color="primary"
              label="অফিস যোগ করুন"
              @click="openAddModal(prop.node)"
              class="add-office-btn"
              icon="add"
            />
          </div>
        </div>
      </template>
    </q-tree>

    <!-- Modal for Adding Office -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">অফিস যোগ করুন</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input 
            v-model="newOffice.name" 
            label="অফিসের নাম" 
            outlined 
            :rules="[val => !!val || 'এই ক্ষেত্রটি বাধ্যতামূলক']"
          />
          <q-select
            v-model="newOffice.type"
            :options="typeOptions"
            label="অফিসের ধরণ"
            outlined
            emit-value
            map-options
            :rules="[val => !!val || 'এই ক্ষেত্রটি বাধ্যতামূলক']"
          />
          <q-select
            v-model="newOffice.city_corporation"
            :options="cityCorporationOptions"
            label="সিটি কর্পোরেশন"
            outlined
            emit-value
            map-options
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="বাতিল করুন" color="negative" v-close-popup />
          <q-btn flat label="যোগ করুন" color="primary" @click="submitOffice" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-inner-loading :showing="loading">
      <q-spinner-dots size="40px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from 'boot/axios'
import { useOfficeStore } from 'src/stores/officeStore'
import { useUserStore } from 'src/stores/userStore'

const router = useRouter()
const offices = ref([])
const loading = ref(true)
const officeStore=useOfficeStore();
const userStore=useUserStore();

const showModal = ref(false)
const parentNode = ref(null)

const newOffice = ref({
  name: '',
  type: '',
  city_corporation: null
})

const cityCorporationOptions = [
  { label: 'নেই', value: null },
  { label: 'ঢাকা', value: 'dhaka' },
  { label: 'চট্টগ্রাম', value: 'chittagong' },
  { label: 'সিলেট', value: 'sylhet' },
  { label: 'গাজীপুর', value: 'gazipur' },
  { label: 'বরিশাল', value: 'barisal' },
  { label: 'খুলনা', value: 'khulna' },
  { label: 'রাজশাহী', value: 'rajshahi' },
  { label: 'ময়মনসিংহ', value: 'mymensingh' },
  { label: 'সাভার', value:'savar'},
]


const typeOptions = ref([])

// Filter variables
const filter = ref({
  type: null,
  name: ''
})

// All possible office types for filter dropdown
const allTypeOptions = [
  { label: 'হেড অফিস', value: 'Head Office' },
  { label: 'জেলা অফিস', value: 'District Office' },
  { label: 'প্রশিক্ষণ কেন্দ্র', value: 'Training Center' },
  { label: 'থানা অফিস', value: 'Thana Office' },
  { label: 'মেট্রো থানা', value: 'Metro Thana' }
]


// Mapping types
function formatOfficeType(type) {
  const map = {
    head_office: 'Head Office',
    district_office: 'District Office',
    training_center: 'Training Center',
    thana_office: 'Thana Office',
    metrothana_office: 'Metro Thana'
  }
  return map[type] || type
}

// Recursive transformer
function transformHierarchy(node) {
  return {
    id: node.id,
    name: node.name,
    type: formatOfficeType(node.type),
    parent_id: node.parent_id || null,
    additional_info: node.additional_info || null,
    children: (node.children?.data || []).map(transformHierarchy)
  }
}

// Filter offices recursively
function filterOffices(nodes) {
  return nodes.filter(node => {
    const matchesType = !filter.value.type || node.type === filter.value.type
    const searchText = filter.value.name ? filter.value.name.toLowerCase() : ''
    const nodeName = node.name.toLowerCase()
    
    const matchesName = !searchText || nodeName.includes(searchText)
    
    // Filter children first
    if (node.children && node.children.length > 0) {
      node.children = filterOffices(node.children)
    }
    
    // Include node if it matches or has matching children
    return matchesType && matchesName || 
      (node.children && node.children.length > 0)
  })
}

// Computed property for filtered offices
const filteredOffices = computed(() => {
  if (!filter.value.type && !filter.value.name) {
    return offices.value
  }
  return filterOffices(JSON.parse(JSON.stringify(offices.value)))
})

// Apply filter
function applyFilter() {
  // The computed property will automatically update
}

// Clear filter
function clearFilter() {
  filter.value = {
    type: null,
    name: ''
  }
}

// Fetch data on page load
onMounted(async () => {
  try {
    const response = await api.get(`/v1/categories?search=id:${officeStore.getOfficeId}&include=children&limit=0`);
    const data = response.data.data
    offices.value = Array.isArray(data)
      ? data.map(transformHierarchy)
      : [transformHierarchy(data)]
  } catch (error) {
    console.error('Failed to fetch office hierarchy:', error)
  } finally {
    loading.value = false
  }
})

// Open modal with proper dropdown options
function openAddModal(node) {
  parentNode.value = node
  newOffice.value = { name: '', type: '', city_corporation: null }

  if (node.type === 'Head Office') {
    typeOptions.value = [
      { label: 'District Office', value: 'district_office' },
      { label: 'Training Center', value: 'training_center' }
    ]
  } else if (node.type === 'District Office') {
    typeOptions.value = [
      { label: 'Thana Office', value: 'thana_office' },
      { label: 'Metro Thana', value: 'metrothana_office' }
    ]
  } else {
    typeOptions.value = []
  }

  showModal.value = true
}

// View employees for the selected office
function viewEmployees(node) {
  router.push({
    name: 'employee-list',
    params: {
    officeId: node.id
  }
  })
}

// Submit new office
async function submitOffice() {
  const payload = {
    name: newOffice.value.name,
    type: newOffice.value.type,
    parent_id: parentNode.value.id,
    additional_info: {
      city_corporation: newOffice.value.city_corporation
    }
  }

  try {
    const response = await api.post('/v1/categories', payload);

    const newNode = {
      id: response.data.data.id,
      name: payload.name,
      type: formatOfficeType(payload.type),
      parent_id: payload.parent_id,
      additional_info: payload.additional_info,
      children: []
    }

    parentNode.value.children.push(newNode)
    showModal.value = false
  } catch (error) {
    console.error("Failed to add office:", error)
  }
}
</script>

<style scoped>
.office-tree {
  max-width: 800px;
  margin: 0 auto;
}

.office-tree :deep(.q-tree__node-header) {
  padding: 12px 16px;
  border-radius: 8px;
  margin: 4px 0;
  background-color: #f8f9fa;
  border-left: 4px solid #5c6bc0;
  transition: all 0.3s ease;
}

.office-tree :deep(.q-tree__node-header:hover) {
  background-color: #e8eaf6;
  transform: translateX(2px);
}

.office-tree :deep(.q-tree__node--child) .q-tree__node-header {
  border-left-color: #7986cb;
  margin-left: 24px;
}

.office-tree :deep(.q-tree__node--child .q-tree__node--child) .q-tree__node-header {
  border-left-color: #9fa8da;
  margin-left: 48px;
}

.office-header {
  flex-grow: 1;
}

.add-office-btn {
  margin-right: 8px;
}

.view-employees-btn {
  margin-right: 8px;
}

.text-h6 {
  color: #3f51b5;
  font-weight: 600;
}

.text-subtitle2 {
  color: #757575;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .office-tree :deep(.q-tree__node-header) {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .office-tree :deep(.q-btn) {
    margin-top: 8px;
    width: 100%;
  }
  
  .q-gutter-sm {
    width: 100%;
  }
}
</style>