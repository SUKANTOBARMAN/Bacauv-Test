<template>
  <q-card class="search-card q-pa-sm q-mb-md" flat bordered>
    <q-card-section class="q-pa-sm">
      <div class="row items-center q-col-gutter-sm">
        <!-- Search Input -->
        <div class="col-grow">
          <q-input
            dense
            filled
            v-model="searchData.keywords"
            placeholder="Search members by name, ID, phone..."
            class="search-input"
            @keyup.enter="onSearch"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-btn
                v-if="searchData.keywords"
                flat
                round
                dense
                icon="clear"
                size="sm"
                @click="searchData.keywords = ''; onSearch()"
              />
            </template>
          </q-input>
        </div>

        <!-- Action Buttons -->
        <div class="col-auto">
          <q-btn
            flat
            dense
            icon="search"
            color="primary"
            @click="onSearch"
            class="q-px-sm"
          >
            <q-tooltip>Search</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            icon="refresh"
            color="grey"
            @click="onReset"
            class="q-px-sm"
          >
            <q-tooltip>Reset All</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            :icon="expanded ? 'expand_less' : 'expand_more'"
            color="grey-7"
            @click="expanded = !expanded"
            class="q-px-sm"
          >
            <q-tooltip>Filter Options</q-tooltip>
          </q-btn>
        </div>
      </div>

      <!-- Filtering Options -->
      <q-slide-transition>
        <div v-show="expanded" class="q-mt-md">
          <div class="row q-col-gutter-sm items-center">
            <div class="col-12 col-md-3">
              <q-select
                dense
                filled
                v-model="searchData.commissionerate_id"
                :options="store.getCommissionerate"
                label="Commissionerate"
                map-options
                emit-value
                clearable
                @update:model-value="onCommissionerateChange"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                dense
                filled
                v-model="searchData.division_id"
                :options="filteredDivisions"
                label="Division"
                map-options
                emit-value
                clearable
                :disable="!searchData.commissionerate_id"
                @update:model-value="onDivisionChange"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                dense
                filled
                v-model="searchData.circle_id"
                :options="filteredCircles"
                label="Circle"
                map-options
                emit-value
                clearable
                :disable="!searchData.division_id"
              />
            </div>
            
            <!-- Filter Button (Shows when any filter is selected) -->
            <div class="col-12 col-md-3 text-center" v-if="hasActiveFilters">
              <q-btn
                color="primary"
                label="ফিল্টার করুন"
                icon="filter_alt"
                dense
                @click="applyFilters"
                class="full-width"
              />
            </div>
          </div>
        </div>
      </q-slide-transition>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useStore } from "src/stores/store"
import { ref, computed } from "vue"

const emit = defineEmits(['search'])
const store = useStore()
const expanded = ref(true)

const searchData = ref({
  keywords: "",
  commissionerate_id: null,
  division_id: null,
  circle_id: null,
  district_id: null,
})

// Computed properties for filtered options
const filteredDivisions = computed(() => {
  if (!searchData.value.commissionerate_id) {
    return []
  }
  return store.getDivision.filter(
    item => item.parent_id === searchData.value.commissionerate_id
  )
})

const filteredCircles = computed(() => {
  if (!searchData.value.division_id) {
    return []
  }
  return store.getCircle.filter(
    item => item.parent_id === searchData.value.division_id
  )
})

// Check if any filter is active (excluding keywords)
const hasActiveFilters = computed(() => {
  return (
    searchData.value.commissionerate_id ||
    searchData.value.division_id ||
    searchData.value.circle_id ||
    searchData.value.district_id
  )
})


// Handle cascading dropdown changes
const onCommissionerateChange = (value) => {
  if (!value) {
    searchData.value.division_id = null
    searchData.value.circle_id = null
  }
}

const onDivisionChange = (value) => {
  if (!value) {
    searchData.value.circle_id = null
  }
}

// Apply filters button click
const applyFilters = () => {
  console.log('Applying filters:', searchData.value)
  emit("search", { ...searchData.value })
}


const onSearch = () => {
  console.log('Searching with:', searchData.value)
  emit("search", { ...searchData.value })
}

const onReset = () => {
  searchData.value = {
    keywords: "",
    commissionerate_id: null,
    division_id: null,
    circle_id: null,
    district_id: null,
  }
  emit("search", { ...searchData.value })
}
</script>

