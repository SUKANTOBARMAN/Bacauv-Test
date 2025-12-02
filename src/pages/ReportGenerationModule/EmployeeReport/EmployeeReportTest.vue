<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import pdfMake from 'pdfmake/build/pdfmake';
import { vfs, fonts } from '../../../../my-file/custom_fonts'; // Import custom font data
import {api} from 'boot/axios'; // Import axios instance

// Configure pdfMake with custom fonts
if (!pdfMake) {
  console.error('pdfMake is not defined. Check pdfmake import.');
} else {
  pdfMake.vfs = vfs; // Set virtual file system from custom_fonts.js
  pdfMake.fonts = {
    ...fonts, // Include Nikosh from custom_fonts.js
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    }
  };
}

const $q = useQuasar();
const employees = ref([]);
const loading = ref(false);

// Fetch employee data from Apiato backend
const fetchEmployees = async () => {
  try {
    loading.value = true;
    const officeId = 'rdz4eQ8gwK8YnZaM';
    const response = await api.get(
      `/v1/transfer-histories/latest/${officeId}?include=employee,employee.user,employee.user.roles,employee.designation&limit=0`
    );
    employees.value = Array.isArray(response.data.data) ? response.data.data : [];
    if (!employees.value.length) {
      $q.notify({
        type: 'warning',
        message: 'No employee data found.',
      });
    }
  } catch (error) {
    console.error('Fetch employees error:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to fetch employee data: ' + error.message,
    });
  } finally {
    loading.value = false;
  }
};

// Generate and download PDF report
const generatePdf = async () => {
  try {
    if (!pdfMake) {
      throw new Error('pdfMake is not available.');
    }

    // Define document definition with Bengali text
    const docDefinition = {
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
        { text: 'Employee Report', style: 'header', alignment: 'center', margin: [0, 0, 0, 15] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto'],
            body: [
              [
                { text: 'ID', style: 'tableHeader' },
                { text: 'Name', style: 'tableHeader' },
                { text: 'Mobile', style: 'tableHeader' },
                { text: 'Office ID', style: 'tableHeader' },
              ],
              ...employees.value.map((employee) => [
                employee.employee?.data?.id || 'N/A',
                employee.employee?.data?.user?.data?.name || 'N/A',
                employee.employee?.data?.user?.data?.mobile || 'N/A',
                employee.office_id || 'N/A',
              ]),
            ],
          },
          layout: {
            hLineWidth: function() { return 1; },
            vLineWidth: function() { return 1; },
            hLineColor: function() { return '#000'; },
            vLineColor: function() { return '#000'; },
            paddingLeft: function() { return 10; },
            paddingRight: function() { return 10; },
            paddingTop: function() { return 5; },
            paddingBottom: function() { return 5; },
          }
        },
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
          fillColor: '#f2f2f2',
        },
      },
      defaultStyle: {
        font: 'Nikosh', // Default to Nikosh for Bengali text
      },
    };

    // Generate and download the PDF
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.open();
    pdfDocGenerator.download('employee_report.pdf');
    
    $q.notify({
      type: 'positive',
      message: 'PDF report generated successfully!',
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to generate PDF: ' + error.message,
    });
  }
};

// Fetch employees when component is mounted
onMounted(fetchEmployees);
</script>

<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <div class="text-h6">Employee Report Generation</div>
      </q-card-section>
      <q-card-section>
        <q-btn
          color="primary"
          label="Generate PDF Report"
          :loading="loading"
          :disable="!employees.length"
          @click="generatePdf"
        />
      </q-card-section>
      <q-card-section v-if="employees.length">
        <q-table
          title="Employee List"
          :rows="employees"
          :columns="[
            {
              name: 'id',
              label: 'ID',
              field: (row) => row.employee?.data?.id || 'N/A',
              align: 'left',
            },
            {
              name: 'name',
              label: 'Name',
              field: (row) => row.employee?.data?.user?.data?.name || 'N/A',
              align: 'left',
            },
            {
              name: 'mobile',
              label: 'Mobile',
              field: (row) => row.employee?.data?.user?.data?.mobile || 'N/A',
              align: 'left',
            },
            {
              name: 'office_id',
              label: 'Office ID',
              field: 'office_id',
              align: 'left',
            },
          ]"
          row-key="id"
        />
      </q-card-section>
      <q-card-section v-else-if="!loading">
        <div class="text-subtitle1">No employees found.</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped>
/* Add any custom styles if needed */
</style>