<template>
  <q-page class="q-pa-md">
    <q-card class="report-card">
      <q-card-section>
        <div class="text-h5 text-weight-bold q-mb-md">বেতন রিপোর্ট তৈরি করুন</div>
        
        <!-- Report Type Selection -->
        <div class="row q-mb-md">
          <div class="col-12">
            <q-radio v-model="reportType" val="monthly" label="মাসিক রিপোর্ট" />
            <q-radio v-model="reportType" val="yearly" label="বাৎসরিক রিপোর্ট" class="q-ml-md" />
          </div>
        </div>
        
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
            label="নির্বাচিত অফিস"
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
                <div class="text-h6">বেতন রিপোর্ট প্রস্তুত</div>
                <div class="text-caption q-mb-md">
                  {{ finalSelection.name }}-এ {{ employees.length }} জন কর্মচারী খুঁজে পাওয়া গেছে
                </div>
                
                <q-btn
                  label="বেতন রিপোর্ট ডাউনলোড করুন"
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

// Report Type
const reportType = ref('monthly') // 'monthly' or 'yearly'

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

// Calculate total salary amounts
const totalMonthlySalary = computed(() => {
  return employees.value.reduce((total, emp) => total + (emp.totalSalary || 0), 0)
})

const totalYearlySalary = computed(() => {
  return totalMonthlySalary.value * 12
})

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

// Fetch employee salary data
const fetchEmployeeSalary = async (employeeId,cityCorporation) => {
  try {
    const response = await api.get(
      `/v1/salaries?search=employee_id:${employeeId}&limit=1&orderBy=start_date&sortedBy=desc&include=salaryscale`
    )
    
    if (response.data.data.length === 0) {
      return { basicSalary: 0, totalSalary: 0 }
    }
    
    const salaryData = response.data.data[0]
    const salaryScale = salaryData.salaryscale?.data
    
    if (!salaryScale) {
      return { basicSalary: 0, totalSalary: 0 }
    }
    
    const paymentDetails = response.data?.data[0]?.additional_info|| {};
    const basicSalary = salaryScale.additional_info?.payment_details.basic || 0;
    const medical_fee=salaryScale.additional_info?.payment_details.medical_fee || 0;
    const basic=basicSalary;
    //rent fee calculation
    let employee_rent_fee = 0
     const otherCityCorporations = ['barisal', 'sylhet', 'gazipur', 'mymensingh', 'khulna', 'rajshahi', 'chittagong', 'naryanganj', 'rangpur', 'savar'] 
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

    
    // Calculate total salary by summing all non-null fees
    let  totalSalary = Object.values(paymentDetails).reduce((sum, value) => {
      return sum + (value !== null ? Number(value) : 0)
    }, 0)
    totalSalary+=employee_rent_fee;
    totalSalary+=basicSalary;
    totalSalary+=medical_fee;
    return {
      basicSalary,
      totalSalary,
      salaryScaleName: salaryScale.name
    }
  } catch (error) {
    console.error('Error fetching salary data:', error)
    return { basicSalary: 0, totalSalary: 0 }
  }
}

// Fetch employees for selected office with their salary data
const fetchEmployees = async () => {
  if (!selectedOffice.value) return
  
  const office = currentLevelNodes.value.find(o => o.id === selectedOffice.value)
  finalSelection.value = {
    id: office.id,
    name: office.name,
    type: office.type,
    additional_info: office.additional_info || null
  }
  const city_corporation = office.additional_info?.city_corporation?.toLowerCase()
  try {
    loadingEmployees.value = true
    employees.value = []
    
    // First fetch transfer histories to get employee IDs
    const transferResponse = await api.get(
      `/v1/transfer-histories/latest/${finalSelection.value.id}?include=employee,employee.user,office&limit=0`
    )
    
    if (!Array.isArray(transferResponse.data.data)) {
      $q.notify({
        type: 'warning',
        message: 'এই অফিসে কোনো কর্মচারী পাওয়া যায়নি'

      })
      return
    }
    
    // Fetch salary data for each employee
    const enrichedEmployees = await Promise.all(
      transferResponse.data.data.map(async (transfer, index) => {
        const empId = transfer.employee?.data?.id
        let empDetails = {}
        
        if (empId) {
          // Fetch employee details
          const empResponse = await api.get(`/v1/employees/${empId}`)
          empDetails = empResponse.data.data || {}
          
          // Fetch salary data
          const salaryData = await fetchEmployeeSalary(empId,city_corporation)
          
          return {
            serial: index + 1,
            nid: empDetails.nid || 'N/A',
            name: transfer.employee?.data?.user?.data?.name || 'N/A',
            basicSalary: salaryData.basicSalary,
            totalSalary: salaryData.totalSalary,
            salaryScale: salaryData.salaryScaleName || 'N/A'
          }
        }
        
        return {
          serial: index + 1,
          nid: 'N/A',
          name: transfer.employee?.data?.user?.data?.name || 'N/A',
          basicSalary: 0,
          totalSalary: 0,
          salaryScale: 'N/A'
        }
      })
    )
    
    employees.value = enrichedEmployees
    
    $q.notify({
      type: 'positive',
      message: `${office.name} অফিসের জন্য মোট ${employees.value.length} জন কর্মচারী লোড হয়েছে`

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

const generatePdf = async () => {
  if (employees.value.length === 0 || !finalSelection.value) return
  
  try {
    generatingPdf.value = true
    
    const currentDate = new Date().toLocaleDateString('en-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    
    // Prepare table body based on report type
    const tableBody = [
      [
        { text: 'SL', style: 'tableHeader' },
        { text: 'NID', style: 'tableHeader' },
        { text: 'Name', style: 'tableHeader' },
        { text: 'Basic Salary', style: 'tableHeader' },
        { text: 'Total Salary', style: 'tableHeader' },
        ...(reportType.value === 'yearly' ? [{ text: 'Yearly Salary', style: 'tableHeader' }] : [])
      ]
    ]
    
    // Add employee rows
    employees.value.forEach(employee => {
      const row = [
        employee.serial,
        employee.nid,
        employee.name,
        { text: employee.basicSalary.toLocaleString('en-BD'), alignment: 'right' },
        { text: employee.totalSalary.toLocaleString('en-BD'), alignment: 'right' }
      ]
      
      if (reportType.value === 'yearly') {
        const yearlySalary = employee.totalSalary * 12
        row.push({ text: yearlySalary.toLocaleString('en-BD'), alignment: 'right' })
      }
      
      tableBody.push(row)
    })
    
    // Add total row
    const totalRow = [
      { text: 'Total', colSpan: 3, style: 'totalRow' },
      {}, // Empty cell for colSpan
      {}, // Empty cell for colSpan
      { 
        text: employees.value.reduce((sum, emp) => sum + emp.basicSalary, 0).toLocaleString('en-BD'), 
        style: 'totalRow', 
        alignment: 'right' 
      },
      { 
        text: totalMonthlySalary.value.toLocaleString('en-BD'), 
        style: 'totalRow', 
        alignment: 'right' 
      }
    ]
    
    if (reportType.value === 'yearly') {
      totalRow.push({ 
        text: totalYearlySalary.value.toLocaleString('en-BD'), 
        style: 'totalRow', 
        alignment: 'right' 
      })
    }
    
    tableBody.push(totalRow)
    
    // PDF document definition
    const documentDefinition = {
      info: {
        title: `${reportType.value === 'monthly' ? 'Monthly' : 'Yearly'} Salary Report - ${finalSelection.value.name}`,
        author: 'Office Management System',
        subject: 'Salary Report',
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
          text: `${reportType.value === 'monthly' ? 'Monthly' : 'Yearly'} Salary Report`,
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
            widths: reportType.value === 'monthly' 
              ? ['auto', 'auto', '*', 'auto', 'auto'] 
              : ['auto', 'auto', '*', 'auto', 'auto', 'auto'],
            body: tableBody,
          },
          layout: {
            hLineWidth: function(i, node) { return (i === 0 || i === node.table.body.length - 1) ? 1.5 : 1; },
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
        totalRow: {
          bold: true,
          fontSize: 12,
          fillColor: '#e8f5e9'
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
    pdfDocGenerator.download(
      `${reportType.value}-salary-report-${finalSelection.value.name}.pdf`
    )
    
    $q.notify({
      type: 'positive',
      message: 'বেতন রিপোর্ট সফলভাবে তৈরি হয়েছে!'
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