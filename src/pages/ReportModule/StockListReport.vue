<template>
  <q-page class="q-pa-md">
    <q-card class="report-card">
      <q-card-section>
        <div class="text-h5 text-weight-bold q-mb-md">স্টক তালিকা রিপোর্ট তৈরি করুন</div>
        
        <!-- তারিখ ফিল্টার সেকশন -->
        <div class="filter-section q-mb-lg">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-5">
              <q-input
                v-model="dateFrom"
                outlined
                label="শুরু তারিখ"
                mask="date"
                placeholder="YYYY/MM/DD"
                :rules="['date']"
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="dateFrom" mask="YYYY/MM/DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="বন্ধ করুন" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-5">
              <q-input
                v-model="dateTo"
                outlined
                label="শেষ তারিখ"
                mask="date"
                placeholder="YYYY/MM/DD"
                :rules="['date']"
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="dateTo" mask="YYYY/MM/DD">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="বন্ধ করুন" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-sm-2">
              <q-btn
                color="primary"
                icon="filter_alt"
                label="ফিল্টার করুন"
                class="full-width"
                @click="applyDateFilter"
                :loading="loading"
              />
            </div>
          </div>
          
          <div class="q-mt-sm" v-if="isFilterActive">
            <q-chip 
              removable 
              color="primary" 
              text-color="white" 
              icon="filter_alt"
              @remove="clearDateFilter"
              class="q-ml-sm"
            >
              {{ formatDateForDisplay(dateFrom) }} থেকে {{ formatDateForDisplay(dateTo) }} পর্যন্ত স্টক দেখাচ্ছে
            </q-chip>
          </div>
        </div>
        
        <!-- স্টক তালিকা প্রিভিউ -->
        <div v-if="filteredStocks.length > 0" class="stock-preview q-mb-lg">
          <q-table
            :rows="filteredStocks"
            :columns="previewColumns"
            row-key="id"
            flat
            bordered
            :pagination="{rowsPerPage: 10}"
            hide-pagination
          >
            <template v-slot:top>
              <div class="text-h6">স্টক তালিকা প্রিভিউ</div>
              <q-space />
              <div class="text-caption text-grey-7">
                মোট {{ filteredStocks.length }} আইটেম দেখাচ্ছে
              </div>
            </template>
          </q-table>
        </div>
        
        <!-- রিপোর্ট তৈরি সেকশন -->
        <div v-if="filteredStocks.length > 0" class="report-generation-section">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-h6">রিপোর্ট প্রস্তুত</div>
              <div class="text-caption q-mb-md">
                {{ filteredStocks.length }} টি স্টক আইটেম {{ formatDateForDisplay(dateFrom) }} থেকে {{ formatDateForDisplay(dateTo) }} পর্যন্ত
              </div>
              
              <q-btn
                label="স্টক তালিকা রিপোর্ট ডাউনলোড করুন"
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
        
        <!-- খালি অবস্থা -->
        <div v-else-if="!loading" class="empty-state text-center q-pa-lg">
          <q-icon name="inventory_2" size="xl" color="grey-5" />
          <div class="text-h6 q-mt-md">কোনো স্টক আইটেম পাওয়া যায়নি</div>
          <div class="text-caption text-grey-7">
            ফিল্টারগুলো পরিবর্তন করুন অথবা পরে আবার চেক করুন
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import pdfMake from 'pdfmake/build/pdfmake'
import { vfs, fonts } from '../../../my-file/custom_fonts'
import { useOfficeStore } from 'src/stores/officeStore'

const officeStore = useOfficeStore()
const officeId=officeStore.getOfficeId
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

// Reactive state
const stocks = ref([])
const filteredStocks = ref([])
const loading = ref(false)
const generatingPdf = ref(false)

// Date filter states
const dateFrom = ref('')
const dateTo = ref('')
const isFilterActive = ref(false)

// Columns for the preview table
const previewColumns = [
  {
    name: 'product',
    label: 'পণ্য',
    align: 'left',
    field: 'product',
    sortable: true
  },
  {
    name: 'quantity',
    label: 'পরিমাণ',
    align: 'left',
    field: 'quantity',
    sortable: true
  },
  { 
    name: 'date', 
    label: 'তারিখ', 
    align: 'left', 
    field: 'date', 
    sortable: true 
  }
]


// Fetch stock data
const fetchStocks = async () => {
  try {
    loading.value = true
    
    // Fetch stock data
    const stockResponse = await api.get(
      `/v1/resource-stocks?search=type:restock;office_id:${officeId}&searchJoin=and&limit=0`
    )
    
    // Fetch resource data
    const resourceResponse = await api.get('/v1/resources')
    
    if (resourceResponse.data && Array.isArray(resourceResponse.data.data)) {
      const resourceMap = resourceResponse.data.data.reduce((map, resource) => {
        map[resource.id] = resource.name
        return map
      }, {})
      
      // Map stock data and add product name
      stocks.value = stockResponse.data.data.map((item) => {
        const product = resourceMap[item.resource_id] // Lookup product name
        return {
          id: item.id,
          product: product || 'অজানা পণ্য',
          resource_id: item.resource_id,
          quantity: item.quantity,
          date: new Date(item.date).toISOString().split('T')[0],
          rawDate: new Date(item.date) // Store Date object for filtering
        }
      })
      
      // Initialize filtered stocks with all stocks
      filteredStocks.value = [...stocks.value]
    }
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'স্টক ডেটা লোড করতে ব্যর্থ হয়েছে'
    })
  } finally {
    loading.value = false
  }
}

// Format date for display in UI
const formatDateForDisplay = (dateString) => {
  if (!dateString) return ''
  
  // Convert YYYY/MM/DD to a more readable format
  const parts = dateString.split('/')
  if (parts.length === 3) {
    return `${parts[0]}-${parts[1]}-${parts[2]}`
  }
  return dateString
}

// Apply date filter to the stock list
const applyDateFilter = () => {
  if (!dateFrom.value && !dateTo.value) {
    // If both dates are empty, show all stocks
    filteredStocks.value = [...stocks.value]
    isFilterActive.value = false
    return
  }
  
  let fromDate = null
  let toDate = null
  
  if (dateFrom.value) {
    // Convert YYYY/MM/DD to YYYY-MM-DD for comparison
    fromDate = new Date(dateFrom.value.replace(/\//g, '-'))
  }
  
  if (dateTo.value) {
    // Convert YYYY/MM/DD to YYYY-MM-DD for comparison
    toDate = new Date(dateTo.value.replace(/\//g, '-'))
    // Set time to end of day for inclusive comparison
    toDate.setHours(23, 59, 59, 999)
  }
  
  filteredStocks.value = stocks.value.filter(stock => {
    const stockDate = stock.rawDate
    
    // Filter by both dates if both are provided
    if (fromDate && toDate) {
      return stockDate >= fromDate && stockDate <= toDate
    }
    // Filter by from date only
    else if (fromDate) {
      return stockDate >= fromDate
    }
    // Filter by to date only
    else if (toDate) {
      return stockDate <= toDate
    }
    
    return true
  })
  
  isFilterActive.value = true
  
  // Show notification about filter results
  $q.notify({
    message: `মোট ${stocks.value.length} আইটেমের মধ্যে ${filteredStocks.value.length}টি দেখানো হচ্ছে`,
    color: 'info',
    icon: 'filter_alt',
    position: 'top',
    timeout: 2000
  })
}

// Clear date filters
const clearDateFilter = () => {
  dateFrom.value = ''
  dateTo.value = ''
  filteredStocks.value = [...stocks.value]
  isFilterActive.value = false
  
  $q.notify({
    message: 'তারিখ ফিল্টারগুলো মুছে ফেলা হয়েছে',
    color: 'positive',
    icon: 'clear_all',
    position: 'top',
    timeout: 2000
  })
}

// Generate PDF report
const generatePdf = async () => {
  if (filteredStocks.value.length === 0) return
  
  try {
    generatingPdf.value = true
    
    const currentDate = new Date().toLocaleDateString('en-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    
    // Prepare table rows for PDF
    const tableBody = [
      [
        { text: 'Product', style: 'tableHeader' },
        { text: 'Quantity', style: 'tableHeader' },
        { text: 'Date', style: 'tableHeader' }
      ],
      ...filteredStocks.value.map(stock => [
        stock.product,
        stock.quantity.toString(),
        stock.date
      ])
    ]
    
    // PDF document definition
    const documentDefinition = {
      info: {
        title: `Stock List Report`,
        author: 'Inventory Management System',
        subject: 'Stock List Report',
        creator: 'PDFMake'
      },
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      header: {
        text: '',//can be added image later.
        style: 'bengaliHeader',
        alignment: 'center',
        margin: [0, 20, 0, 0]
      },
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
          text: 'Stock List Report',
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
        // {
        //   text: `Date Range: ${formatDateForDisplay(dateFrom.value)} - ${formatDateForDisplay(dateTo.value)}`,
        //   fontSize: 12,
        //   bold: true,
        //   margin: [0, 0, 0, 5]
        // },
        {
          text: `Total Items: ${filteredStocks.value.length}`,
          fontSize: 12,
          margin: [0, 0, 0, 20]
        },
        {
          style: 'stockTable',
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto'],
            body: tableBody
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
        stockTable: {
          margin: [0, 5, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: 'black',
          fillColor: '#f5f5f5'
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
    pdfDocGenerator.download(`stock-list-report-${new Date().toISOString().split('T')[0]}.pdf`)
    
    $q.notify({
      type: 'positive',
      message: 'স্টক তালিকা রিপোর্ট সফলভাবে তৈরি হয়েছে!'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'রিপোর্ট তৈরি করা যায়নি'
    })
  } finally {
    generatingPdf.value = false
  }
}

// Initialize
onMounted(() => {
  fetchStocks()
})
</script>

<style scoped lang="scss">
.report-card {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.filter-section {
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stock-preview {
  .q-table {
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    
    :deep(thead tr) {
      background-color: #f5f7fa;
    }
    
    :deep(tbody tr:hover) {
      background-color: #f8fafc;
    }
  }
}

.report-generation-section {
  .q-card {
    border-radius: 8px;
    background-color: #f8fafc;
    border-left: 4px solid #1976d2;
  }
  
  .q-btn {
    border-radius: 8px;
    padding: 12px;
    
    .q-icon {
      margin-right: 8px;
    }
  }
}

.empty-state {
  border: 1px dashed #e2e8f0;
  border-radius: 8px;
  background-color: #f8fafc;
}

@media (max-width: 600px) {
  .report-card {
    border-radius: 0;
  }
  
  .filter-section {
    padding: 12px;
  }
}
</style>