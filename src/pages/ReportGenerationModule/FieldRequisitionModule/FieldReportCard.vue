<template>
  <q-page class="q-pa-md">
    <q-card class="report-card">
      <q-card-section>
        <div class="text-h5 text-weight-bold q-mb-md">Generate Field Requisition Report</div>
        
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
            label="Select Office"
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
              label="Select Sub-Offices"
              color="primary"
              icon="arrow_downward"
              @click="goDeeper"
              class="q-mr-sm"
            />
            <q-btn
              v-if="canGoBack"
              label="Go Back"
              color="secondary"
              icon="arrow_upward"
              @click="goBack"
              class="q-mr-sm"
            />
            <q-btn
              v-if="selectedOffice"
              label="Load Salary Data"
              color="positive"
              icon="check"
              @click="confirmSelection"
              :loading="loadingEmployees"
            />
          </div>
          
          <!-- Selected Office Preview -->
          <q-card v-if="finalSelection" flat class="selected-office-preview q-mt-md">
            <q-card-section>
              <div class="text-subtitle1">Selected Office:</div>
              <div class="text-h6">{{ finalSelection.name }}</div>
              <div class="text-caption">
                Type: {{ formatOfficeType(finalSelection.type) }}
                <span v-if="finalSelection.additional_info?.city_corporation">
                  | City: {{ finalSelection.additional_info.city_corporation }}
                </span>
              </div>
            </q-card-section>
          </q-card>
          
          <!-- Report Generation Button -->
          <div v-if="salarySummary" class="report-generation-section q-mt-lg">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">Salary Summary Ready</div>
                <div class="text-caption q-mb-md">
                  For {{ employees.length }} employees in {{ finalSelection.name }}
                </div>
                
                <q-btn
                  label="Download Field Requisition Report"
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
import { vfs, fonts } from '../../../../my-file/custom_fonts'
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

// Employee and Salary Data
const employees = ref([])
const salarySummary = ref(null)

// Fetch office hierarchy
const fetchOfficeHierarchy = async () => {
  try {
    const response = await api.get(`/v1/categories?search=id:${officeStore.officeId}&include=children`)
    officeTree.value = response.data.data
    currentLevelNodes.value = officeTree.value
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to load office hierarchy'
    })
    console.error('Error fetching offices:', error)
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

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2
  }).format(amount)
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
  salarySummary.value = null
}

const confirmSelection = async () => {
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
    const response = await api.get(
      `/v1/transfer-histories/latest/${office.id}?include=employee,office,employee.user,employee.currentSalary,employee.currentSalary.salaryscale`
    )
    
    employees.value = response.data.data
    
    // Calculate salary summary
    calculateSalarySummary(employees.value, office)
    
    $q.notify({
      type: 'positive',
      message: `Loaded ${employees.value.length} employees for ${office.name}`
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch employee data'
    })
    console.error('Error fetching employees:', error)
  } finally {
    loadingEmployees.value = false
  }
}

const calculateSalarySummary = (employees, office) => {
  let totalBasic = 0
  let totalRent = 0
  let totalMedical = 0
  let totalEducation = 0
  let totalTiffin = 0
  let totalWashing = 0

  // Determine city corporation
  const cityCorporation = office.additional_info?.city_corporation?.toLowerCase()
  const otherCityCorporations = ['barisal', 'sylhet', 'gazipur', 'mymensingh', 'khulna', 'rajshahi', 'chittagong', 'naryanganj', 'rangpur', 'savar']

  employees.forEach(emp => {
    const salaryData = emp.employee?.data?.currentSalary?.data?.salaryscale?.data.additional_info?.payment_details
    
    if (salaryData) {
      const basic = salaryData.basic || 0
      let employee_rent_fee = 0
      
      // Calculate rent based on city and salary scale
      if (cityCorporation === 'dhaka') {
        if (basic <= 9700) {
          employee_rent_fee = Math.max(basic * 0.65, 5600)
        } else if (basic > 9700 && basic <= 16000) {
          employee_rent_fee = Math.max(basic * 0.6, 6400)
        } else if (basic > 16000 && basic <= 35500) {
          employee_rent_fee = Math.max(basic * 0.55, 9600)
        } else if (basic > 35500) {
          employee_rent_fee = Math.max(basic * 0.5, 19500)
        }
      } else if (otherCityCorporations.includes(cityCorporation)) {
        if (basic <= 9700) {
          employee_rent_fee = Math.max(basic * 0.55, 5000)
        } else if (basic > 9700 && basic <= 16000) {
          employee_rent_fee = Math.max(basic * 0.5, 5400)
        } else if (basic > 16000 && basic <= 35500) {
          employee_rent_fee = Math.max(basic * 0.45, 8000)
        } else if (basic > 35500) {
          employee_rent_fee = Math.max(basic * 0.4, 16000)
        }
      } else {
        if (basic <= 9700) {
          employee_rent_fee = Math.max(basic * 0.5, 4500)
        } else if (basic > 9700 && basic <= 16000) {
          employee_rent_fee = Math.max(basic * 0.45, 4800)
        } else if (basic > 16000 && basic <= 35500) {
          employee_rent_fee = Math.max(basic * 0.4, 7000)
        } else if (basic > 35500) {
          employee_rent_fee = Math.max(basic * 0.35, 13800)
        }
      }

      const rent = employee_rent_fee
      const medical = salaryData.medical_fee || 0
      const education = salaryData.education_fee || 0
      const tiffin = salaryData.tiffin_fee || 0
      const washing = salaryData.washing_fee || 0
      
      // Calculate yearly amounts (multiply by 12)
      totalBasic += basic * 12
      totalRent += rent * 12
      totalMedical += medical * 12
      totalEducation += education * 12
      totalTiffin += tiffin * 12
      totalWashing += washing * 12
    }
  })

  salarySummary.value = {
    totalBasic,
    totalRent,
    totalMedical,
    totalEducation,
    totalTiffin,
    totalWashing,
    totalSalary: totalBasic + totalRent + totalMedical + totalEducation + totalTiffin + totalWashing
  }
}

const generatePdf = async () => {
  if (!salarySummary.value || !finalSelection.value) return
  
  try {
    generatingPdf.value = true
    
    const currentDate = new Date().toLocaleDateString('en-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    
    // PDF document definition
    const documentDefinition = {
      info: {
        title: `Field Requisition Report - ${finalSelection.value.name}`,
        author: 'Office Management System',
        subject: 'Yearly Salary Summary Report',
        creator: 'PDFMake'
      },
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      // header: {
      //   // text: '',
      //   style: 'bengaliHeader',
      //   alignment: 'center',
      //   margin: [0, 20, 0, 0]
      // },
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
          text: 'Field Requisition Report',
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
          text: `For ${employees.value.length} employees`,
          fontSize: 10,
          italic: true,
          margin: [0, 0, 0, 20]
        },
        {
          style: 'salaryTable',
          table: {
            headerRows: 1,
            widths: ['*', 'auto'],
            body: [
              [{ text: 'Salary Component', style: 'tableHeader' }, { text: 'Amount', style: 'tableHeader' }],
              ['Total Basic Salary', formatCurrency(salarySummary.value.totalBasic)],
              ['Total Rent Fee', formatCurrency(salarySummary.value.totalRent)],
              ['Total Medical Fee', formatCurrency(salarySummary.value.totalMedical)],
              ['Total Education Fee', formatCurrency(salarySummary.value.totalEducation)],
              ['Total Tiffin Fee', formatCurrency(salarySummary.value.totalTiffin)],
              ['Total Washing Fee', formatCurrency(salarySummary.value.totalWashing)],
              [{ text: 'Total Yearly Salary', style: 'tableFooter' }, { text: formatCurrency(salarySummary.value.totalSalary), style: 'tableFooter' }]
            ]
          }
        },
        {
          text: 'Note: Rent fee is calculated based on city corporation and salary scale.',
          fontSize: 9,
          italics: true,
          margin: [0, 15, 0, 0]
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
        salaryTable: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
          fillColor: '#f5f5f5'
        },
        tableFooter: {
          bold: true,
          fontSize: 12,
          fillColor: '#e3f2fd'
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
    pdfDocGenerator.download(`field-requisition-${finalSelection.value.name}.pdf`)
    
    $q.notify({
      type: 'positive',
      message: 'Field Requisition Report generated successfully!'
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to generate report'
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