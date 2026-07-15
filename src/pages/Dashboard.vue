<template>
  <q-page class="app-dashboard">
    <!-- Main Content Container -->
    <div class="dashboard-wrapper">
      
      <!-- Premium Welcome Banner -->
      <div class="welcome-banner">
        <div class="banner-bg-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
        </div>
        <div class="banner-content">
          <div class="greeting-box">
            <h1 class="welcome-title">Welcome to BACUAV</h1>
            <p class="welcome-subtitle">{{ getCurrentGreeting() }}</p>
          </div>
          <div class="date-chip">
            <q-icon name="event" size="14px" />
            <span>{{ getCurrentDate() }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions (Compact Mobile Grid) -->
      <div class="section-container">
        <div class="section-header">
          <q-icon name="bolt" size="20px" color="primary" class="section-icon" />
          <h2 class="section-title">Quick Actions</h2>
        </div>
        <div class="quick-actions-grid">
          <div
            v-for="(card, index) in actionCards"
            :key="index"
            class="action-card"
            v-ripple
            @click="navigateTo(card.route)"
          >
            <div class="action-icon-wrapper" :style="{ background: card.gradient }">
              <q-icon :name="card.icon" size="22px" color="white" />
            </div>
            <span class="action-label">{{ card.title }}</span>
          </div>
        </div>
      </div>

      <!-- Overview Stats -->
      <div class="section-container">
        <div class="section-header">
          <q-icon name="pie_chart_outline" size="20px" color="primary" class="section-icon" />
          <h2 class="section-title">Overview Information</h2>
        </div>
        
        <div class="stats-grid">
          <!-- Total User -->
          <q-card class="stat-card" flat>
            <div class="stat-header">
              <div class="stat-icon-box bg-gradient-blue">
                <q-icon name="groups" size="16px" color="white" />
              </div>
              <div class="stat-trend positive">
                <q-icon name="trending_up" size="10px" /> Active
              </div>
            </div>
            <div class="stat-body">
              <div class="stat-value">{{ animatedStats.totalMembers }}</div>
              <div class="stat-label">Total User</div>
            </div>
          </q-card>

          <!-- Member Area -->
          <q-card class="stat-card" flat>
            <div class="stat-header">
              <div class="stat-icon-box bg-gradient-orange">
                <q-icon name="business" size="16px" color="white" />
              </div>
            </div>
            <div class="stat-body">
              <div class="stat-value">{{ animatedStats.totalCommissionerates }}</div>
              <div class="stat-label">Member Area</div>
            </div>
          </q-card>

          <!-- District -->
          <q-card class="stat-card" flat>
            <div class="stat-header">
              <div class="stat-icon-box bg-gradient-purple">
                <q-icon name="map" size="16px" color="white" />
              </div>
            </div>
            <div class="stat-body">
              <div class="stat-value">{{ animatedStats.totalDistricts }}</div>
              <div class="stat-label">Districts</div>
            </div>
          </q-card>

          <!-- Verified User -->
          <q-card class="stat-card" flat>
            <div class="stat-header">
              <div class="stat-icon-box bg-gradient-green">
                <q-icon name="verified_user" size="16px" color="white" />
              </div>
              <div class="stat-trend positive">
                <q-icon name="check_circle" size="10px" /> {{ verificationPercentage }}%
              </div>
            </div>
            <div class="stat-body">
              <div class="stat-value">{{ animatedStats.verifiedMembers }}</div>
              <div class="stat-label">Verified Users</div>
            </div>
          </q-card>

          <!-- Division -->
          <q-card class="stat-card" flat>
            <div class="stat-header">
              <div class="stat-icon-box bg-gradient-teal">
                <q-icon name="account_tree" size="16px" color="white" />
              </div>
            </div>
            <div class="stat-body">
              <div class="stat-value">{{ animatedStats.totalDivisions }}</div>
              <div class="stat-label">Divisions</div>
            </div>
          </q-card>

          <!-- Circle -->
          <q-card class="stat-card" flat>
            <div class="stat-header">
              <div class="stat-icon-box bg-gradient-pink">
                <q-icon name="workspaces" size="16px" color="white" />
              </div>
            </div>
            <div class="stat-body">
              <div class="stat-value">{{ animatedStats.totalCircles }}</div>
              <div class="stat-label">Circles</div>
            </div>
          </q-card>
        </div>
      </div>

      <!-- Analytics Section -->
      <div class="section-container">
        <div class="section-header">
          <q-icon name="analytics" size="20px" color="primary" class="section-icon" />
          <h2 class="section-title">Analytics</h2>
        </div>
        
        <div class="charts-container">
          
          <!-- Designation Breakdown (Bar Chart) -->
          <q-card class="chart-card" flat>
            <div class="card-title-row">
              <span class="card-title">Designation Breakdown</span>
            </div>
            <div class="bar-chart-wrapper">
              <div class="bar-container" v-for="(bar, index) in barChartData" :key="bar.label">
                <div class="bar-value">{{ bar.value }}</div>
                <div class="bar-track">
                  <div 
                    class="bar-fill" 
                    :style="{ height: animatedBars[index] + '%', background: bar.gradient }"
                  ></div>
                </div>
                <div class="bar-label">{{ bar.label }}</div>
              </div>
            </div>
          </q-card>

          <!-- Member Distribution (Pie Chart) -->
          <q-card class="chart-card" flat>
            <div class="card-title-row">
              <span class="card-title">Member Distribution</span>
            </div>
            <div class="pie-chart-wrapper">
              <div class="pie-svg-container">
                <svg viewBox="0 0 200 200" class="pie-svg">
                  <circle
                    v-for="(segment, idx) in pieSegments"
                    :key="'segment-' + idx"
                    :cx="100"
                    :cy="100"
                    :r="70"
                    fill="transparent"
                    :stroke="segment.color"
                    :stroke-width="30"
                    :stroke-dasharray="`${segment.dashArray} ${circumference}`"
                    :stroke-dashoffset="segment.dashOffset"
                    transform="rotate(-90 100 100)"
                    class="pie-segment"
                  />
                  <!-- Inner text -->
                  <text x="100" y="94" text-anchor="middle" class="pie-center-label">Total</text>
                  <text x="100" y="118" text-anchor="middle" class="pie-center-value">
                    {{ distributionData.reduce((sum, item) => sum + item.value, 0) }}
                  </text>
                </svg>
              </div>
              
              <div class="pie-legend-grid">
                <div class="legend-item" v-for="(item, idx) in distributionData" :key="item.label">
                  <div class="legend-dot" :style="{ backgroundColor: item.color }"></div>
                  <div class="legend-info">
                    <span class="l-label">{{ item.label }}</span>
                    <span class="l-value">{{ item.value }} <span class="l-percent">({{ getPercentage(item.value) }}%)</span></span>
                  </div>
                </div>
              </div>
            </div>
          </q-card>

          <!-- Growth Overview -->
          <q-card class="chart-card" flat>
            <div class="card-title-row">
              <span class="card-title">Growth Overview</span>
            </div>
            <div class="growth-list">
              <div class="growth-item">
                <div class="g-icon-wrapper bg-light-green">
                  <q-icon name="person_add" color="positive" size="20px" />
                </div>
                <div class="g-details">
                  <span class="g-title">New Users</span>
                  <span class="g-subtitle">This Month</span>
                </div>
                <div class="g-amount text-positive">+{{ stats.newMembers || 45 }}</div>
              </div>

              <div class="growth-item">
                <div class="g-icon-wrapper bg-light-blue">
                  <q-icon name="speed" color="primary" size="20px" />
                </div>
                <div class="g-details">
                  <span class="g-title">Growth Rate</span>
                  <span class="g-subtitle">Compared to Last Month</span>
                </div>
                <div class="g-amount text-primary">{{ stats.growthRate || 12.5 }}%</div>
              </div>

              <div class="growth-item">
                <div class="g-icon-wrapper bg-light-orange">
                  <q-icon name="workspace_premium" color="warning" size="20px" />
                </div>
                <div class="g-details">
                  <span class="g-title">Active Rate</span>
                  <span class="g-subtitle">Of Total Users</span>
                </div>
                <div class="g-amount text-warning">{{ stats.activeRate || 94.6 }}%</div>
              </div>
            </div>
          </q-card>

        </div>
      </div>
      
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

const router = useRouter();
const $q = useQuasar();

const loading = ref(true);

const stats = ref({
  totalMembers: 0,
  totalRO: 0,
  totalARO: 0,
  totalCommissionerates: 0,
  totalDistricts: 0,
  totalDivisions: 0,
  totalCircles: 0,
  verifiedMembers: 0,
  newMembers: 0,
  growthRate: 0,
  activeRate: 0,
});

const animatedStats = ref({
  totalMembers: 0,
  totalRO: 0,
  totalARO: 0,
  totalCommissionerates: 0,
  totalDistricts: 0,
  totalDivisions: 0,
  totalCircles: 0,
  verifiedMembers: 0,
});

const activeSegment = ref(null);
const activeBar = ref(null);
const animatedBars = ref([]);

const actionCards = ref([
  {
    title: "Member List",
    icon: "people",
    route: "/member-list",
    description: "View Total Members",
    gradient: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
  },
  {
    title: "My Profile",
    icon: "person",
    route: "/my-profile",
    description: "View User Details",
    gradient: "linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)",
  },
  {
    title: "Notice",
    icon: "notifications",
    route: "/notices",
    description: "View Notice",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #EA580C 100%)",
  },
]);

const verificationPercentage = computed(() => {
  if (stats.value.totalMembers === 0) return 0;
  return Math.round(
    (stats.value.verifiedMembers / stats.value.totalMembers) * 100
  );
});

const distributionData = ref([
  { label: "Dhaka", value: 450, color: "#3B82F6" },
  { label: "Chittagong", value: 320, color: "#8B5CF6" },
  { label: "Rajshahi", value: 180, color: "#EF4444" },
  { label: "Khulna", value: 150, color: "#F59E0B" },
  { label: "Others", value: 147, color: "#10B981" },
]);

const circumference = 2 * Math.PI * 70;

const pieSegments = computed(() => {
  const total = distributionData.value.reduce(
    (sum, item) => sum + item.value,
    0
  );
  let currentOffset = 0;

  return distributionData.value.map((item) => {
    const percentage = item.value / total;
    const dashArray = percentage * circumference;
    const segment = {
      ...item,
      dashArray,
      dashOffset: -currentOffset,
      percentage: (percentage * 100).toFixed(1),
    };
    currentOffset += dashArray;
    return segment;
  });
});

const barChartData = computed(() => {
  const maxValue = Math.max(stats.value.totalRO, stats.value.totalARO, 1);
  return [
    {
      label: "RO",
      value: stats.value.totalRO,
      gradient: "linear-gradient(180deg, #3B82F6 0%, #60A5FA 100%)",
      percentage: (stats.value.totalRO / maxValue) * 100,
    },
    {
      label: "ARO",
      value: stats.value.totalARO,
      gradient: "linear-gradient(180deg, #EC4899 0%, #F472B6 100%)",
      percentage: (stats.value.totalARO / maxValue) * 100,
    },
  ];
});

const fetchDashboardData = async () => {
  loading.value = true;
  try {
    const membersResponse = await api.get("/v1/users?verified=true&limit=1");
    const totalMembers = membersResponse.data.meta?.pagination?.total || 0;

    const roResponse = await api.get("/v1/users?verified=true&search=role:RO&limit=1");
    const totalRO = roResponse.data.meta?.pagination?.total || 0;

    const aroResponse = await api.get("/v1/users?verified=true&search=role:ARO&limit=1");
    const totalARO = aroResponse.data.meta?.pagination?.total || 0;

    const commissionerateResponse = await api.get("/v1/categories?search=type:commissionerate&limit=1");
    const totalCommissionerates = commissionerateResponse.data.meta?.pagination?.total || 0;

    const districtResponse = await api.get("/v1/categories?search=type:district&limit=1");
    const totalDistricts = districtResponse.data.meta?.pagination?.total || 0;

    const divisionResponse = await api.get("/v1/categories?search=type:division&limit=1");
    const totalDivisions = divisionResponse.data.meta?.pagination?.total || 0;

    const circleResponse = await api.get("/v1/categories?search=type:circle&limit=1");
    const totalCircles = circleResponse.data.meta?.pagination?.total || 0;

    stats.value = {
      totalMembers,
      totalRO,
      totalARO,
      totalCommissionerates,
      totalDistricts,
      totalDivisions,
      totalCircles,
      verifiedMembers: totalMembers,
      newMembers: Math.round(totalMembers * 0.036),
      growthRate: 12.5,
      activeRate: 94.6,
    };

    animateNumbers();
    animateBars();
  } catch (error) {
    console.error("Dashboard load error:", error);
    stats.value = {
      totalMembers: 1247,
      totalRO: 17, 
      totalARO: 17, 
      totalCommissionerates: 52, 
      totalDistricts: 65,        
      totalDivisions: 139,       
      totalCircles: 223,         
      verifiedMembers: 17,       
      newMembers: 1, 
      growthRate: 12.5,
      activeRate: 94.6,
    };

    animateNumbers();
    animateBars();

    $q.notify({
      type: "warning",
      message: "ডেমো ডেটা দেখানো হচ্ছে",
      caption: "API সংযোগ ব্যর্থ হয়েছে",
      timeout: 2500,
    });
  } finally {
    loading.value = false;
  }
};

const animateNumbers = () => {
  const duration = 1500;
  const steps = 60;
  const interval = duration / steps;
  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;

    animatedStats.value = {
      totalMembers: Math.round(stats.value.totalMembers * progress),
      totalRO: Math.round(stats.value.totalRO * progress),
      totalARO: Math.round(stats.value.totalARO * progress),
      totalCommissionerates: Math.round(stats.value.totalCommissionerates * progress),
      totalDistricts: Math.round(stats.value.totalDistricts * progress),
      totalDivisions: Math.round(stats.value.totalDivisions * progress),
      totalCircles: Math.round(stats.value.totalCircles * progress),
      verifiedMembers: Math.round(stats.value.verifiedMembers * progress),
    };

    if (currentStep >= steps) {
      clearInterval(timer);
      animatedStats.value = { ...stats.value };
    }
  }, interval);
};

const animateBars = () => {
  animatedBars.value = [];
  barChartData.value.forEach((bar, index) => {
    setTimeout(() => {
      animatedBars.value[index] = bar.percentage;
    }, index * 200);
  });
};

const getPercentage = (value) => {
  const pieTotal = distributionData.value.reduce((sum, item) => sum + item.value, 0);
  return Math.round((value / pieTotal) * 100);
};

const navigateTo = (route) => {
  router.push(route);
};

const getCurrentGreeting = () => {
  const hour = new Date().getHours();

  // From midnight to 4:59 AM
  if (hour < 5) return "Wow, you're up late! Wishing you a restful night.";
  
  // From 5:00 AM to 11:59 AM
  if (hour < 12) return "Good morning! Wishing you a great day.";
  
  // From 12:00 PM to 4:59 PM
  if (hour < 17) return "Good afternoon! Hope your day is going well.";
  
  // From 5:00 PM to 8:59 PM
  if (hour < 21) return "Good evening! Hope you had a pleasant day.";
  
  // From 9:00 PM to 11:59 PM
  return "Good night! Sleep well and recharge for tomorrow.";
};
const getCurrentDate = () => {
  const date = new Date();
  return date.toLocaleDateString("eng", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
/* =========================================
   Base Variables & Mobile First Layout 
========================================= */
.app-dashboard {
  background-color: #F8FAFC; 
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.dashboard-wrapper {
  padding: 12px; 
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 1. Premium Welcome Banner */
.welcome-banner {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
  border-radius: 20px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.15);
  color: white;
  margin-top: 4px;
}
.banner-bg-shapes {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 0;
  pointer-events: none;
}
.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  filter: blur(24px);
}
.shape-1 { width: 120px; height: 120px; top: -30px; right: -20px; }
.shape-2 { width: 100px; height: 100px; bottom: -40px; left: 10%; }

.banner-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.welcome-title {
  font-size: 20px; 
  font-weight: 800;
  margin: 0 0 4px 0;
  line-height: 1.2;
  letter-spacing: -0.5px;
}
.welcome-subtitle {
  font-size: 13px;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
}
.date-chip {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 6px 12px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 2. Section Headers */
.section-container {
  display: flex;
  flex-direction: column;
  gap: 12px; 
}
.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
}
.section-icon {
  background: #E0E7FF;
  padding: 4px;
  border-radius: 8px;
}
.section-title {
  font-size: 16px; 
  font-weight: 700;
  color: #0F172A;
  margin: 0;
  letter-spacing: -0.2px;
}

/* 3. Quick Actions Grid */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px; 
}
.action-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 14px 8px; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0,0,0,0.02);
  cursor: pointer;
  transition: transform 0.2s;
}
.action-card:active { transform: scale(0.95); }
.action-icon-wrapper {
  width: 44px; 
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.action-label {
  font-size: 11px; 
  font-weight: 600;
  color: #334155;
  text-align: center;
}

/* 4. Stats Grid - MOBILE (2 columns) */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); 
  gap: 10px; 
}
.stat-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 12px; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.stat-icon-box {
  width: 32px; 
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}
.bg-gradient-blue { background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); }
.bg-gradient-orange { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); }
.bg-gradient-purple { background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); }
.bg-gradient-green { background: linear-gradient(135deg, #10B981 0%, #059669 100%); }
.bg-gradient-teal { background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); }
.bg-gradient-pink { background: linear-gradient(135deg, #EC4899 0%, #BE185D 100%); }

.stat-trend {
  font-size: 9px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
  background: #F0FDF4;
  padding: 2px 6px;
  border-radius: 6px;
}
.stat-trend.positive { color: #10B981; }

.stat-body {
  display: flex;
  flex-direction: column;
}
.stat-value {
  font-size: 18px; 
  font-weight: 800;
  color: #0F172A;
  line-height: 1.1;
  letter-spacing: -0.3px;
}
.stat-label {
  font-size: 11px; 
  font-weight: 500;
  color: #64748B;
  margin-top: 4px;
}

/* 5. Analytics / Charts Section (Mobile - 1 column) */
.charts-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.chart-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 16px; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0,0,0,0.02);
}
.card-title-row {
  margin-bottom: 16px;
}
.card-title {
  font-size: 14px;
  font-weight: 700;
  color: #1E293B;
}

/* Bar Chart */
.bar-chart-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 140px; 
  padding: 0 10px;
}
.bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
}
.bar-value {
  font-size: 14px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 6px;
}
.bar-track {
  width: 100%;
  max-width: 32px; 
  height: 90px;
  background: #F1F5F9;
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}
.bar-fill {
  width: 100%;
  border-radius: 8px;
  transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.bar-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  margin-top: 8px;
}

/* Pie Chart */
.pie-chart-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.pie-svg-container {
  width: 150px; 
  height: 150px;
  position: relative;
}
.pie-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
.pie-segment { transition: stroke-dashoffset 1s ease-out, opacity 0.3s; }
.pie-center-label {
  font-size: 12px;
  fill: #64748B;
  font-weight: 500;
}
.pie-center-value {
  font-size: 22px; 
  fill: #0F172A;
  font-weight: 800;
}
.pie-legend-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.legend-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  margin-top: 3px;
  flex-shrink: 0;
}
.legend-info { display: flex; flex-direction: column; }
.l-label { font-size: 11px; color: #64748B; font-weight: 500; }
.l-value { font-size: 12px; color: #1E293B; font-weight: 700; }
.l-percent { font-weight: 500; color: #94A3B8; font-size: 10px; }

/* Growth List */
.growth-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.growth-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #F8FAFC;
  border-radius: 12px;
  border: 1px solid #F1F5F9;
}
.g-icon-wrapper {
  width: 38px; 
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.bg-light-green { background: #DCFCE7; }
.bg-light-blue { background: #DBEAFE; }
.bg-light-orange { background: #FEF3C7; }

.g-details { flex: 1; display: flex; flex-direction: column; }
.g-title { font-size: 13px; font-weight: 700; color: #1E293B; }
.g-subtitle { font-size: 11px; color: #64748B; margin-top: 2px; }
.g-amount { font-size: 15px; font-weight: 800; }
.text-positive { color: #10B981; }
.text-primary { color: #3B82F6; }
.text-warning { color: #F59E0B; }

/* =========================================
   Responsive Scaling (Tablet & Desktop)
========================================= */

/* Tablet (min-width: 768px) */
@media (min-width: 768px) {
  .dashboard-wrapper { padding: 24px; gap: 24px; }
  .welcome-banner { padding: 24px; }
  .welcome-title { font-size: 24px; }
  .section-title { font-size: 18px; }

  .quick-actions-grid { gap: 16px; }
  .action-card { padding: 20px 16px; }
  .action-icon-wrapper { width: 52px; height: 52px; }
  .action-label { font-size: 13px; }

  .stats-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .stat-card { padding: 16px; gap: 16px; }
  .stat-icon-box { width: 40px; height: 40px; }
  .stat-value { font-size: 22px; }
  .stat-label { font-size: 13px; }
  
  /* Tablet Analytics: 2 in a row, growth overview takes full width */
  .charts-container { grid-template-columns: repeat(2, 1fr); display: grid; gap: 16px; }
  .chart-card:nth-child(3) { grid-column: span 2; }
}

/* Desktop (min-width: 1024px) */
@media (min-width: 1024px) {
  .dashboard-wrapper { padding: 32px; gap: 32px; }
  .welcome-banner { padding: 32px 40px; }
  .welcome-title { font-size: 28px; }
  .section-title { font-size: 20px; }

  .quick-actions-grid { gap: 24px; }
  .action-card { padding: 24px; }
  .action-icon-wrapper { width: 56px; height: 56px; }
  .action-label { font-size: 14px; }

  .stats-grid { gap: 24px; }
  .stat-card { padding: 24px; }
  .stat-icon-box { width: 48px; height: 48px; }
  .stat-value { font-size: 28px; }
  
  /* Desktop Analytics: All 3 charts side-by-side in one row! */
  .charts-container { grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .chart-card:nth-child(3) { grid-column: span 1; } /* Reset from tablet */
  
  .card-title { font-size: 16px; }

  /* Desktop Bar Chart Enhancements */
  .bar-chart-wrapper { height: 180px; }
  .bar-track { max-width: 48px; height: 130px; } /* Thicker and taller bars */
  .bar-container { width: 80px; }
  .bar-value { font-size: 16px; }
  .bar-label { font-size: 14px; }

  /* Desktop Pie Chart Enhancements */
  .pie-svg-container { width: 180px; height: 180px; }
  .pie-center-value { font-size: 26px; }
  .pie-legend-grid { grid-template-columns: repeat(2, 1fr); gap: 16px 12px; }
  .l-label { font-size: 12px; }
  .l-value { font-size: 14px; }

  /* Desktop Growth Enhancements */
  .growth-list { gap: 16px; }
  .growth-item { padding: 16px; gap: 16px; }
  .g-icon-wrapper { width: 44px; height: 44px; }
  .g-title { font-size: 14px; }
  .g-subtitle { font-size: 12px; }
  .g-amount { font-size: 18px; }
}

/* Very Small Mobile Devices Layout Adjustments */
@media (max-width: 350px) {
  .quick-actions-grid { gap: 6px; }
  .action-card { padding: 10px 4px; }
  .stat-card { padding: 10px; gap: 8px; }
  .stat-icon-box { width: 28px; height: 28px; }
  .stat-value { font-size: 16px; }
  .stat-label { font-size: 10px; }
}
</style>