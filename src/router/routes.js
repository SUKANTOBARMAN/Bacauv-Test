import { adminPermission } from './adminRole'
import { allPermission } from './allRole'
import { bothPermission } from './bothRole'
import { employeePermission } from './employeeRole'
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [

      {path: '', component: () => import('pages/Dashboard.vue')},
        {
    path:'/member-list',
    name:'MemberList',
    component: () => import('src/pages/MemberList.vue'),
    meta: { requiresAuth: false }
  },
  // {
  //   path:'/commissionerate',
  //   name:'Commissionerate',
  //   component: () => import('src/pages/Commissionerate.vue'),
  //   meta: { requiresAuth: false }

  // },
  // {
  //   path:'/commissionerate-hierarchy',
  //   name:'CommissionerateHierarchy',
  //   component: () => import('src/pages/CommissionerateHierarchy.vue'),
  //   meta: { requiresAuth: false }
  // },
  // {
  //   path:'/district',
  //   name:'District',
  //   component: () => import('src/pages/District.vue'),
  //   meta: { requiresAuth: false }
  // },
  {
    path:'/my-profile',
    name:'Profile',
    component: () => import('src/pages/Profile.vue'),
    meta: { requiresAuth: false }
  },

      // {path: '/Dashboard2', component: () => import('pages/Dashboard2.vue')},
      // {path: '/Profile', component: () => import('pages/UserProfile.vue')},
      // {path: '/Map', component: () => import('pages/Map.vue')},
      // {path: '/MapMarker', component: () => import('pages/MapMarker.vue')},
      // {path: '/TreeTable', component: () => import('pages/TreeTable.vue')},
      // {path: '/StreetView', component: () => import('pages/StreetView.vue')},
      // {path: '/Cards', component: () => import('pages/Cards.vue')},
      // {path: '/Tables', component: () => import('pages/Tables.vue')},
      // {path: '/Contact', component: () => import('pages/Contact.vue')},
      // {path: '/Checkout', component: () => import('pages/Checkout.vue')},
      // {path: '/Ecommerce', component: () => import('pages/ProductCatalogues.vue')},
      // {path: '/Pagination', component: () => import('pages/Pagination.vue')},
      // {path: '/Charts', component: () => import('pages/Charts.vue')},
      // {path: '/Calendar', component: () => import('pages/Calendar.vue')},
      // {path: '/Directory', component: () => import('pages/Directory.vue')},
      // {path: '/Footer', component: () => import('pages/Footer.vue')},
      // {path: '/CardHeader', component: () => import('pages/CardHeader.vue')},



      { path: '/employees_office/:officeId', name: 'employee-list', component: () => import('pages/EmployeeModule/EmployeeList.vue'),meta:bothPermission},
      { path: '/employees/add', name: 'add-employee', component: () => import('pages/EmployeeModule/EmployeeAddOrEdit.vue'),meta:adminPermission },
      { path: '/employees/edit/:id', name: 'edit-employee', component: () => import('pages/EmployeeModule/EmployeeAddOrEdit.vue')},
      // { path: "/employees/:id", name: "employee-details", component: () => import("pages/EmployeeModule/EmployeeDetails.vue") },
      { path: "/employees/id-card", name: "employee-id-card", component: () => import("pages/EmployeeModule/EmployeeIDCard.vue") },
      { path: "/employees/:id", name: "employee-profile", component: () => import("pages/EmployeeModule/profile/EmployeeProfile.vue"),meta:allPermission },
      {path: "/office/employees", name:"office-employee-list" , component:()=>import("pages/EmployeeModule/EmployeeListOffice.vue")},
      {path:"/profile", name:"personal-profile", component:()=>import("pages/EmployeeModule/profile/EmployeePersonalProfile.vue"),meta:employeePermission},





      { path: '/offices', name: 'office-list', component: () => import('pages/ConfigurationModule/Offices.vue'),meta:bothPermission },
      
      
      // configuration module routes
      { path: '/designations', name: 'designation-list', component: () => import('pages/ConfigurationModule/Designations.vue'),meta:adminPermission },
      { path: '/salary', name: 'salry-scale', component: () => import('pages/ConfigurationModule/SalaryScale.vue'),meta:adminPermission },

      { path: '/trainings', name: 'trainings-list', component: () => import('pages/ConfigurationModule/Trainings.vue'),meta:adminPermission },
      { path: '/leave-types', name: 'leave-types-list', component: () => import('pages/ConfigurationModule/LeaveTypes.vue'),meta:adminPermission },
      { path: '/punishment-types', name: 'punishment-types-list', component: () => import('pages/ConfigurationModule/PunishmentTypes.vue'),meta:adminPermission },
      { path: '/award-types', name: 'award-types-list', component: () => import('pages/ConfigurationModule/AwardTypes.vue'),meta:adminPermission },


      { path: '/products', name: 'product-list', component: () => import('pages/StoreManagementModule/Products.vue'),meta:adminPermission},
      { path: '/products/:resource_id', name: 'product-view', component: () => import('pages/StoreManagementModule/ProductStock.vue'),meta:adminPermission },
      { path: '/add-stock', name: 'add-stock', component: () => import('pages/StoreManagementModule/AddStocks.vue'),meta:adminPermission },
      { path: '/stocks', name: 'stock-list', component: () => import('pages/StoreManagementModule/StocksList.vue') ,meta:adminPermission},
      { path: '/add-allocation', name: 'add-allocation', component: () => import('pages/StoreManagementModule/AllocateProduct.vue'),meta:adminPermission },
      { path: '/allocations', name: 'allocation-list', component: () => import('pages/StoreManagementModule/AllocationList.vue'),meta:bothPermission },
      { path: '/allocations/office/allocation-view', name: 'allocation-office-view', component: () => import('pages/StoreManagementModule/OfficeAllocation.vue'),meta:bothPermission },

      { path: '/notices/add', name: 'add-notice', component: () => import('pages/NoticeManagementModule/AddOrEditNotice.vue'),meta:adminPermission },
      { path: '/notices', name: 'notice-list', component: () => import('pages/NoticeManagementModule/NoticeList.vue'),meta:adminPermission },   
      {path:'/notices/view', name:'view-notices', component: () => import('pages/NoticeManagementModule/ViewNotices.vue'),meta:employeePermission},//this is for the employees,its temporary

     


      // {path:'/field-requisition', name:'field-requisition', component: () => import('pages/FieldRequisitionModule/FieldRequisition.vue'),meta:bothPermission},
      {path:'/edit-notice/:id', name:'edit-notice', component: () => import('pages/NoticeManagementModule/EditNotice.vue'),meta:adminPermission},

      {path:'/report-employee',name:'report-employee', component: () => import('pages/ReportGenerationModule/EmployeeReport/EmployeeReportTest.vue'),meta:bothPermission},
      { path: '/reports/field-requisition', name: 'field-requisition-report', component: () => import('pages/ReportModule/FieldReportCard.vue'),meta:bothPermission },
      { path: '/reports/stock-list', name: 'stock-list-report', component: () => import('pages/ReportModule/StockListReport.vue'),meta:adminPermission },

      { path: '/reports/employee-list', name: 'employee-list-report', component: () => import('pages/ReportModule/EmployeeListReport.vue'),meta:bothPermission},
      { path: '/reports/salary-details', name: 'salary-details-report', component: () => import('pages/ReportModule/SalaryDetailsReport.vue'),meta:bothPermission},
      {
    path:'/unauthorized',
    component:()=>import ('pages/UnauthorizedPage.vue')
  }


    ]
  },
   {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('src/pages/ForgotPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/match-otp',
    name: 'MatchOtp',
    component: () => import('src/pages/MatchOtp.vue'),
    meta: { requiresAuth: false }
  },
  {
    path:'/register',
    name:'Register',
    component: () => import('src/pages/Registration.vue'),
    meta: { requiresAuth: false }

  },
  // {
  //   path:'/member-request',
  //   name:'MemberRequest',
  //   component: () => import('src/pages/MemberRequest.vue'),
  //   meta: { requiresAuth: false }
  // },
  // {
  //   path:'/commissionerate',
  //   name:'Commissionerate',
  //   component: () => import('src/pages/Commissionerate.vue'),
  //   meta: { requiresAuth: false }

  // },
  // {
  //   path:'/commissionerate-hierarchy',
  //   name:'CommissionerateHierarchy',
  //   component: () => import('src/pages/CommissionerateHierarchy.vue'),
  //   meta: { requiresAuth: false }
  // },
  // {
  //   path:'/district',
  //   name:'District',
  //   component: () => import('src/pages/District.vue'),
  //   meta: { requiresAuth: false }
  // },
  // {
  //   path:'/my-profile',
  //   name:'Profile',
  //   component: () => import('src/pages/Profile.vue'),
  //   meta: { requiresAuth: false }
  // },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  },
  { path: "/reset-password", name: "reset-password", component: () => import("src/pages/ResetPassword.vue") },

  {
    path: '/Mail',
    component: () => import('layouts/Mail.vue')
  },
  {
    path: '/Maintenance',
    component: () => import('pages/Maintenance.vue')
  },
  {
    path: '/Pricing',
    component: () => import('pages/Pricing.vue')
  },
  {
    path: '/login',
    name:'Login',
    component: () => import('pages/Login.vue'),
    meta: { requiresAuth: false },
  },
  // {
  //   path: '/logout',
  //   name: 'Logout',
  //   component: () => import('pages/Logout.vue')
  // },
  {
    path: '/Lock',

    component: () => import('pages/LockScreen.vue')
  },
  {
    path: '/Lock-2',
    component: () => import('pages/LockScreen-2.vue')
  },
]

export default routes
