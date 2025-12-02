<template>
  <q-page class="q-pa-md bg-white">
    <!-- Profile Section -->
    <q-card class="no-shadow text-center q-pa-md">
      <q-avatar size="100px">
        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" alt="Profile Picture" />
      </q-avatar>
      <div class="text-h6 q-mt-md">{{ employee.name }}</div>
      <div class="text-subtitle1 text-grey-7">{{ employee.designation }}</div>
    </q-card>

    <q-separator class="q-my-md" />

    <PersonalInfoTab :personalInfo="employee.personalInfo" />
    <q-separator />
    <JobInfoTab :jobInfo="employee.jobInfo" />
    <q-separator />
    <WorkplaceHistoryTab :workplaceHistory="employee.workplaceHistory" />
    <q-separator />
    <TrainingLeaveTab
      :trainingHistory="employee.trainingHistory"
      :leaveHistory="employee.leaveHistory"
    />
    <q-separator />
    <AwardsPenaltiesTab
      :awardHistory="employee.awardHistory"
      :penaltyHistory="employee.penaltyHistory"
    />
  </q-page>
</template>

<script>
import PersonalInfoTab from "components/employee/PersonalInfoTab.vue";
import JobInfoTab from "components/employee/JobInfoTab.vue";
import WorkplaceHistoryTab from "components/employee/WorkplaceHistoryTab.vue";
import TrainingLeaveTab from "components/employee/TrainingLeaveTab.vue";
import AwardsPenaltiesTab from "components/employee/AwardsPenaltiesTab.vue";

export default {
  components: {AwardsPenaltiesTab, TrainingLeaveTab, WorkplaceHistoryTab, JobInfoTab, PersonalInfoTab},
  data() {
    return {
      activeTab: "personal",
      employee: {
        profilePic: "https://via.placeholder.com/100",
        name: "John Doe",
        designation: "Software Engineer",
        personalInfo: {
          dateOfBirth: "1990-05-10",
          fatherName: "Robert Doe",
          motherName: "Sarah Doe",
          religion: "Christian",
          gender: "Male",
          spouseName: "Jane Doe",
        },
        jobInfo: {
          designation: "Software Engineer",
          joiningDate: "2020-06-15",
          salary: "$5000",
          basicSalary: "$4000",
        },
        workplaceHistory: [
          { id: 1, workplace: "Company A", start: "2015-01-01", end: "2018-12-31" },
          { id: 2, workplace: "Company B", start: "2019-01-01", end: "2020-05-30" },
          { id: 3, workplace: "Company C (Current)", start: "2020-06-15" },
        ],
        trainingHistory: [
          { id: 1, training: "React Training", start: "2021-01-10", end: "2021-01-20" },
          { id: 2, training: "Leadership Workshop", start: "2022-03-05", end: "2022-03-10" },
        ],
        leaveHistory: [
          { id: 1, type: "Sick Leave", days: "5", start: "2022-05-01", end: "2022-05-06" },
          { id: 2, type: "Vacation", days: "10", start: "2023-07-15", end: "2023-07-25" },
        ],
        awardHistory: [
          { id: 1, award: "Best Employee", date: "2021-12-25" },
          { id: 2, award: "Excellence in Leadership", date: "2022-11-10" },
        ],
        penaltyHistory: [
          { id: 1, penalty: "Late Submission", date: "2023-02-20" },
        ],
      },
      workplaceColumns: [
        { name: "workplace", label: "Workplace", field: "workplace", sortable: true },
        { name: "start", label: "Start Date", field: "start", sortable: true },
        { name: "end", label: "End Date", field: "end", sortable: true },
        { name: 'Action', label: 'Actions', align: 'center' },
      ],
      trainingColumns: [
        { name: "training", label: "Training Name", field: "training", sortable: true },
        { name: "start", label: "Start Date", field: "start", sortable: true },
        { name: 'Action', label: 'Actions', align: 'center' },
      ],
      leaveColumns: [
        { name: "type", label: "Leave Type", field: "type", sortable: true },
        { name: "days", label: "Leave Days", field: "days", sortable: true },
        { name: "start", label: "Start Date", field: "start", sortable: true },
        { name: 'Action', label: 'Actions', align: 'center' },
      ],
      awardColumns: [
        { name: "award", label: "Award Type", field: "award", sortable: true },
        { name: "date", label: "Award Date", field: "date", sortable: true },
        { name: 'Action', label: 'Actions', align: 'center' },
      ],
      penaltyColumns: [
        { name: "penalty", label: "Penalty Type", field: "penalty", sortable: true },
        { name: "date", label: "Penalty Date", field: "date", sortable: true },
        { name: 'Action', label: 'Actions', align: 'center' },
      ],
    };
  },
  computed: {
    personalInfo() {
      return this.employee.personalInfo;
    },
    jobInfo() {
      return this.employee.jobInfo;
    },
  },
};
</script>
