<template>
  <q-page class="q-pa-md">
    <q-card class="report-card">
      <q-card-section>
        <div class="text-h5 text-weight-bold q-mb-md">কর্মচারী তালিকা রিপোর্ট তৈরি করুন</div>
        
        <!-- Office Selection Section -->
        <div class="office-selection-container">
          <!-- Current Selection Path -->
          <div v-if="selectedPath.length > 0" class="selection-path q-mb-sm">
            <q-breadcrumbs>
              <q-breadcrumbs-el 
                v-for="(office, index) in selectedPath" 
                :key="office.id"
                :label="office.name"
                @click="goToLevel(index)"
                class="cursor-pointer"
              />
            </q-breadcrumbs>
          </div>
          
          <!-- Current Level Offices -->
          <q-select
            v-model="selectedOffice"
            :options="currentLevelOffices"
            option-label="name"
            option-value="id"
            label="অফিস নির্বাচন করুন"
            outlined
            dense
            emit-value
            map-options
            class="q-mb-md"
            @update:model-value="handleOfficeSelect"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-icon :name="getOfficeIcon(scope.opt.type)" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                  <q-item-label caption>{{ formatOfficeType(scope.opt.type) }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          
          <!-- Action Buttons -->
          <div class="action-buttons">
            <q-btn
              v-if="canGoDeeper"
              label="সাব-অফিস নির্বাচন করুন"
              color="primary"
              icon="arrow_downward"
              @click="goDeeper"
              class="q-mr-sm"
            />
            <q-btn
              v-if="canGoBack"
              label="পেছনে যান"
              color="secondary"
              icon="arrow_upward"
              @click="goBack"
              class="q-mr-sm"
            />
            <q-btn
              v-if="selectedOffice"
              label="কর্মচারীদের লোড করুন"
              color="positive"
              icon="check"
              @click="fetchEmployees"
              :loading="loadingEmployees"
            />
          </div>
          
          <!-- Selected Office Preview -->
          <q-card v-if="finalSelection" flat class="selected-office-preview q-mt-md">
            <q-card-section>
              <div class="text-subtitle1">নির্বাচিত অফিস:</div>
              <div class="text-h6">{{ finalSelection.name }}</div>
              <div class="text-caption">
                ধরন: {{ formatOfficeType(finalSelection.type) }}
                <span v-if="finalSelection.additional_info?.city_corporation">
                  | শহর: {{ finalSelection.additional_info.city_corporation }}
                </span>
              </div>
            </q-card-section>
          </q-card>
          
          <!-- Report Generation Button -->
          <div v-if="employees.length > 0" class="report-generation-section q-mt-lg">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">কর্মচারী তালিকা প্রস্তুত</div>
                <div class="text-caption q-mb-md">
                  {{ finalSelection.name }}-এ {{ employees.length }} জন কর্মচারী পাওয়া গেছে
                </div>
                
                <q-btn
                  label="কর্মচারী তালিকা রিপোর্ট ডাউনলোড করুন"
                  color="primary"
                  icon="picture_as_pdf"
                  @click="generatePdf"
                  :loading="generatingPdf"
                  class="full-width"
                  size="lg"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import pdfMake from 'pdfmake/build/pdfmake'
import { vfs, fonts } from '../../../my-file/custom_fonts'
import { useOfficeStore } from 'src/stores/officeStore'

// Configure pdfMake with custom fonts
pdfMake.vfs = vfs
pdfMake.fonts = {
  ...fonts,
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
}

const $q = useQuasar()
const officeStore = useOfficeStore()

// Office Data
const officeTree = ref([])
const currentLevelNodes = ref([])
const pathStack = ref([])
const selectedOffice = ref(null)
const finalSelection = ref(null)
const loadingEmployees = ref(false)
const generatingPdf = ref(false)

// Employee Data
const employees = ref([])
const baseStorageUrl = 'https://yshr_app.dyd-govbd.com/storage/'

// Fetch office hierarchy
const fetchOfficeHierarchy = async () => {
  try {
    const response = await api.get(`/v1/categories?search=id:${officeStore.officeId}&include=children`)
    officeTree.value = response.data.data
    currentLevelNodes.value = officeTree.value
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'অফিসের স্তরভিত্তিক তথ্য লোড করতে ব্যর্থ হয়েছে'

    })
    
  }
}

// Computed properties
const currentLevelOffices = computed(() => {
  return currentLevelNodes.value.map(office => ({
    ...office,
    label: office.name,
    value: office.id
  }))
})

const selectedPath = computed(() => {
  return [...pathStack.value, currentLevelNodes.value.find(o => o.id === selectedOffice.value)].filter(Boolean)
})

const canGoDeeper = computed(() => {
  if (!selectedOffice.value) return false
  const office = currentLevelNodes.value.find(o => o.id === selectedOffice.value)
  return office?.children?.data?.length > 0
})

const canGoBack = computed(() => pathStack.value.length > 0)

// Office type formatting
const formatOfficeType = (type) => {
  const types = {
    head_office: 'Head Office',
    district_office: 'District Office',
    thana_office: 'Thana Office',
    metrothana_office: 'Metro Thana',
    training_center: 'Training Center'
  }
  return types[type] || type
}

// Get icon for office type
const getOfficeIcon = (type) => {
  const icons = {
    head_office: 'apartment',
    district_office: 'location_city',
    thana_office: 'maps_home_work',
    metrothana_office: 'maps_home_work',
    training_center: 'school'
  }
  return icons[type] || 'business'
}

// Navigation methods
const goDeeper = () => {
  if (!selectedOffice.value) return
  
  const office = currentLevelNodes.value.find(o => o.id === selectedOffice.value)
  if (office?.children?.data) {
    pathStack.value.push(office)
    currentLevelNodes.value = office.children.data
    selectedOffice.value = null
  }
}

const goBack = () => {
  if (pathStack.value.length === 0) return
  
  const previousLevel = pathStack.value.pop()
  currentLevelNodes.value = pathStack.value.length > 0 
    ? pathStack.value[pathStack.value.length - 1].children.data 
    : officeTree.value
  selectedOffice.value = previousLevel.id
}

const goToLevel = (index) => {
  pathStack.value = pathStack.value.slice(0, index)
  currentLevelNodes.value = index === 0 
    ? officeTree.value 
    : pathStack.value[index - 1].children.data
  selectedOffice.value = index === 0 ? null : pathStack.value[index - 1].id
}

// Selection handling
const handleOfficeSelect = (officeId) => {
  finalSelection.value = null
  employees.value = []
}

// Fetch employee photo
const fetchEmployeePhoto = async (employeeId) => {
  try {
    if (!employeeId) return null;
    
    const { data } = await api.get(
      `/v1/files?searchJoin=and&search=owner_type:employee;owner_id:${employeeId}`
    );
    
    if (data.data && data.data.length > 0) {
      return `${baseStorageUrl}${data.data[0].path}`;
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Fetch employees for selected office
const fetchEmployees = async () => {
  if (!selectedOffice.value) return
  
  const office = currentLevelNodes.value.find(o => o.id === selectedOffice.value)
  finalSelection.value = {
    id: office.id,
    name: office.name,
    type: office.type,
    additional_info: office.additional_info || null
  }

  try {
    loadingEmployees.value = true
    employees.value = []
    
    // First fetch transfer histories to get employee IDs
    const transferResponse = await api.get(
      `/v1/transfer-histories/latest/${finalSelection.value.id}?include=employee,employee.user&limit=0`
    )
    
    if (!Array.isArray(transferResponse.data.data)) {
      $q.notify({
        type: 'warning',
       message: 'এই অফিসে কোনো কর্মচারী পাওয়া যায়নি'
      })
      return
    }
    
    // Fetch additional details for each employee
    const enrichedEmployees = await Promise.all(
      transferResponse.data.data.map(async (transfer, index) => {
        try {
          const empId = transfer.employee?.data?.id
          let empDetails = {}
          let photoUrl = null
          
          if (empId) {
            // Fetch employee details
            const empResponse = await api.get(`/v1/employees/${empId}`)
            empDetails = empResponse.data.data || {}
            
            // Fetch employee photo
            photoUrl = await fetchEmployeePhoto(empId)
          }
          
          return {
            ...transfer,
            serial: index + 1,
            employee_details: empDetails,
            photo_url: photoUrl
          }
        } catch (error) {
          return {
            ...transfer,
            serial: index + 1,
            employee_details: {},
            photo_url: null
          }
        }
      })
    )
    
    employees.value = enrichedEmployees
    
    $q.notify({
      type: 'positive',
      message: `${office.name} অফিসের জন্য ${employees.value.length} জন কর্মচারী লোড হয়েছে`

    })
  } catch (error) {
    $q.notify({
      type: 'negative',
     message: 'কর্মচারীর তথ্য আনতে ব্যর্থ হয়েছে'

    })
  } finally {
    loadingEmployees.value = false
  }
}



// Add this function to your script
const getBase64ImageFromUrl = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    return null
  }
}

const generatePdf = async () => {
  if (employees.value.length === 0 || !finalSelection.value) return
  
  try {
    generatingPdf.value = true
    
    const currentDate = new Date().toLocaleDateString('en-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    
    // Prepare table body
    const tableBody = [
      [
        { text: 'SL', style: 'tableHeader' },
        { text: 'NID', style: 'tableHeader' },
        { text: 'Name', style: 'tableHeader' },
        { text: 'Mobile', style: 'tableHeader' },
        // { text: 'Office', style: 'tableHeader' },
        // { text: 'Photo', style: 'tableHeader' },
      ]
    ]
    
    // Add employee rows
    for (const employee of employees.value) {
      let imageDefinition = { text: 'No photo', style: 'noPhoto' }
      
      if (employee.photo_url) {
        try {
          const imageData = await getBase64ImageFromUrl(employee.photo_url)
          if (imageData) {
            imageDefinition = {
              image: imageData,
              width: 30,
              height: 30,
              alignment: 'center'
            }
          }
        } catch (error) {
          console.error('Error processing image:', error)
        }
      }
      
      tableBody.push([
        employee.serial || 'N/A',
        employee.employee_details?.nid || 'N/A',
        employee.employee?.data?.user?.data?.name || 'N/A',
        employee.employee?.data?.user?.data?.mobile || 'N/A',
        // finalSelection.value.name,
        // imageDefinition
      ])
    }
    // PDF document definition
    const documentDefinition = {
      info: {
        title: `Employee List Report - ${finalSelection.value.name}`,
        author: 'Office Management System',
        subject: 'Employee List Report',
        creator: 'PDFMake'
      },
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        {
          stack: [
            { text: 'গণপ্রজাতন্ত্রী বাংলাদেশ সরকার', style: 'bengaliHeader', alignment: 'center' },
            { text: 'মহাপরিচালকের কার্যালয়', style: 'bengaliSubHeader', alignment: 'center' },
            { text: 'যুবউন্নয়ন অধিদপ্তর', style: 'bengaliSubHeader', alignment: 'center' },
            { text: 'যুব ভবন', style: 'bengaliSubHeader', alignment: 'center' },
            { text: '১০৮, মতিঝিল বা/এ, ঢাকা-১০০০', style: 'bengaliSubHeader', alignment: 'center' },
            { text: 'www.dyd.gov.bd', style: 'link', alignment: 'center', decoration: 'underline', margin: [0, 0, 0, 20] },
          ],
        },
        {
          text: 'Employee List Report',
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 15]
        },
        {
          text: `Generated on: ${currentDate}`,
          fontSize: 10,
          alignment: 'right',
          margin: [0, 0, 0, 20]
        },
        {
          text: `Office: ${finalSelection.value.name}`,
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 5]
        },
        {
          text: `Type: ${formatOfficeType(finalSelection.value.type)}${finalSelection.value.additional_info?.city_corporation ? ` | City: ${finalSelection.value.additional_info.city_corporation}` : ''}`,
          fontSize: 12,
          margin: [0, 0, 0, 10]
        },
        {
          text: `Total Employees: ${employees.value.length}`,
          fontSize: 10,
          italic: true,
          margin: [0, 0, 0, 20]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*', 'auto'],//, 'auto'],//'*', 'auto'],
            body: tableBody,
          },
          layout: {
            hLineWidth: function() { return 1; },
            vLineWidth: function() { return 1; },
            hLineColor: function() { return '#000'; },
            vLineColor: function() { return '#000'; },
            paddingLeft: function() { return 5; },
            paddingRight: function() { return 5; },
            paddingTop: function() { return 2; },
            paddingBottom: function() { return 2; },
          }
        }
      ],
      styles: {
        bengaliHeader: {
          font: 'Nikosh',
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 5],
        },
        bengaliSubHeader: {
          font: 'Nikosh',
          fontSize: 14,
          margin: [0, 0, 0, 5],
        },
        link: {
          fontSize: 14,
          color: 'blue',
          margin: [0, 0, 0, 5],
        },
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
          fillColor: '#f5f5f5',
          alignment: 'center'
        },
        noPhoto: {
          fontSize: 10,
          color: '#999',
          alignment: 'center'
        }
      },
      defaultStyle: {
        font: 'Nikosh'
      },
      footer: function(currentPage, pageCount) {
        return {
          text: `Page ${currentPage} of ${pageCount}`,
          alignment: 'center',
          fontSize: 9
        }
      }
    }
    
   // Generate and download the PDF
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition)
    pdfDocGenerator.open()
    pdfDocGenerator.download(`employee-list-${finalSelection.value.name}.pdf`)
    
    $q.notify({
      type: 'positive',
      message: 'Employee List Report generated successfully!'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
     message: 'রিপোর্ট তৈরি করতে ব্যর্থ হয়েছে'
    })
  } finally {
    generatingPdf.value = false
  }
}

// Initialize
onMounted(() => {
  fetchOfficeHierarchy()
})
</script>

<style scoped lang="scss">
.report-card {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.office-selection-container {
  padding: 16px;
}

.selection-path {
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 8px;
  
  :deep(.q-breadcrumbs__el) {
    color: #1976d2;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.action-buttons {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-office-preview {
  border-left: 4px solid #1976d2;
  background-color: #f8fafc;
  
  .text-h6 {
    color: #1976d2;
    margin-top: 4px;
  }
}

.report-generation-section {
  .q-card {
    border-radius: 8px;
    background-color: #f8fafc;
  }
  
  .q-btn {
    border-radius: 8px;
    padding: 12px;
    
    .q-icon {
      margin-right: 8px;
    }
  }
}

.q-select {
  :deep(.q-field__control) {
    height: 48px;
    border-radius: 8px;
  }
  
  :deep(.q-field__native) {
    padding-top: 12px;
  }
}

@media (max-width: 600px) {
  .report-card {
    border-radius: 0;
  }
  
  .action-buttons {
    flex-direction: column;
    
    .q-btn {
      width: 100%;
      margin-right: 0;
      margin-bottom: 8px;
    }
  }
}
</style>