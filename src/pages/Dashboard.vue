<template>
  <q-page class="dashboard-page">
    <!-- Animated Background -->
    <div class="animated-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <!-- Welcome Header -->
    <div class="welcome-header">
      <div class="welcome-content">
        <div class="welcome-icon-animated">
          <q-icon name="dashboard" size="40px" color="white" />
          <div class="icon-pulse"></div>
        </div>
        <div class="welcome-text">
          <h1 class="welcome-title">আপনাকে BACUAV অ্যাপে স্বাগতম</h1>
          <p class="welcome-subtitle">{{ getCurrentGreeting() }}</p>
        </div>
      </div>
      <div class="welcome-date">
        <q-icon name="calendar_today" size="20px" />
        <span>{{ getCurrentDate() }}</span>
      </div>
    </div>

    <!-- Stats Cards with Real Data -->
    <div class="stats-section">
      <div class="row q-col-gutter-md">
        <!-- Total Members Card -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card members-card" flat>
            <q-card-section>
              <div class="stat-icon-wrapper">
                <q-icon name="groups" size="40px" color="white" />
                <div class="icon-bg-circle"></div>
              </div>
              <div class="stat-content">
                <div class="stat-label">মোট সদস্য</div>
                <div class="stat-value">
                  <span class="counting-number">{{ animatedStats.totalMembers }}</span>
                </div>
                <div class="stat-change positive">
                  <q-icon name="trending_up" size="16px" />
                  সক্রিয় সদস্য
                </div>
              </div>
              <div class="card-glow members-glow"></div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Commissionerates Count Card -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card commissionerate-card" flat>
            <q-card-section>
              <div class="stat-icon-wrapper">
                <q-icon name="business" size="40px" color="white" />
                <div class="icon-bg-circle"></div>
              </div>
              <div class="stat-content">
                <div class="stat-label">কমিশনারেট</div>
                <div class="stat-value">
                  <span class="counting-number">{{ animatedStats.totalCommissionerates }}</span>
                </div>
                <div class="stat-info">
                  <q-icon name="location_city" size="16px" />
                  সক্রিয় অঞ্চল
                </div>
              </div>
              <div class="card-glow commissionerate-glow"></div>
            </q-card-section>
          </q-card>
        </div> 
        <!-- <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card ro-card" flat>
            <q-card-section>
              <div class="stat-icon-wrapper">
                <q-icon name="admin_panel_settings" size="40px" color="white" />
                <div class="icon-bg-circle"></div>
              </div>
              <div class="stat-content">
                <div class="stat-label">মোট RO</div>
                <div class="stat-value">
                  <span class="counting-number">{{ animatedStats.totalRO }}</span>
                </div>
                <div class="stat-info">
                  <q-icon name="verified" size="16px" />
                  নিবন্ধিত অফিসার
                </div>
              </div>
              <div class="card-glow ro-glow"></div>
            </q-card-section>
          </q-card>
        </div> -->

        <!-- Districts Count Card -->
         <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card district-card" flat>
            <q-card-section>
              <div class="stat-icon-wrapper">
                <q-icon name="map" size="40px" color="white" />
                <div class="icon-bg-circle"></div>
              </div>
              <div class="stat-content">
                <div class="stat-label">জেলা</div>
                <div class="stat-value">
                  <span class="counting-number">{{ animatedStats.totalDistricts }}</span>
                </div>
                <div class="stat-info">
                  <q-icon name="location_on" size="16px" />
                  কভারেজ এলাকা
                </div>
              </div>
              <div class="card-glow district-glow"></div>
            </q-card-section>
          </q-card>
        </div>
        <!-- <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card aro-card" flat>
            <q-card-section>
              <div class="stat-icon-wrapper">
                <q-icon name="people_alt" size="40px" color="white" />
                <div class="icon-bg-circle"></div>
              </div>
              <div class="stat-content">
                <div class="stat-label">মোট ARO</div>
                <div class="stat-value">
                  <span class="counting-number">{{ animatedStats.totalARO }}</span>
                </div>
                <div class="stat-info">
                  <q-icon name="badge" size="16px" />
                  সহকারী অফিসার
                </div>
              </div>
              <div class="card-glow aro-glow"></div>
            </q-card-section>
          </q-card>
        </div> -->

        <!-- Verified Members Card -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card verified-card" flat>
            <q-card-section>
              <div class="stat-icon-wrapper">
                <q-icon name="verified_user" size="40px" color="white" />
                <div class="icon-bg-circle"></div>
              </div>
              <div class="stat-content">
                <div class="stat-label">যাচাইকৃত সদস্য</div>
                <div class="stat-value">
                  <span class="counting-number">{{ animatedStats.verifiedMembers }}</span>
                </div>
                <div class="stat-change positive">
                  <q-icon name="check_circle" size="16px" />
                  {{ verificationPercentage }}% যাচাইকৃত
                </div>
              </div>
              <div class="card-glow verified-glow"></div>
            </q-card-section>
          </q-card>
        </div>


        <!-- Division Card -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card division-card" flat>
            <q-card-section>
              <div class="stat-icon-wrapper">
                <q-icon name="account_tree" size="40px" color="white" />
                <div class="icon-bg-circle"></div>
              </div>
              <div class="stat-content">
                <div class="stat-label">বিভাগ</div>
                <div class="stat-value">
                  <span class="counting-number">{{ animatedStats.totalDivisions }}</span>
                </div>
                <div class="stat-info">
                  <q-icon name="hub" size="16px" />
                  প্রশাসনিক এলাকা
                </div>
              </div>
              <div class="card-glow division-glow"></div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Circle Card -->
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="stat-card circle-card" flat>
            <q-card-section>
              <div class="stat-icon-wrapper">
                <q-icon name="workspaces" size="40px" color="white" />
                <div class="icon-bg-circle"></div>
              </div>
              <div class="stat-content">
                <div class="stat-label">সার্কেল</div>
                <div class="stat-value">
                  <span class="counting-number">{{ animatedStats.totalCircles }}</span>
                </div>
                <div class="stat-info">
                  <q-icon name="donut_small" size="16px" />
                  কর্ম এলাকা
                </div>
              </div>
              <div class="card-glow circle-glow"></div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
      <div class="row q-col-gutter-md">
        <!-- RO vs ARO Bar Chart -->
        <div class="col-12 col-md-4">
          <q-card class="chart-card glassmorphism" flat>
            <div class="chart-header">
              <div class="chart-title">
                <q-icon name="bar_chart" size="24px" color="primary" />
                <span>পদবি অনুযায়ী বিভাজন</span>
              </div>
            </div>
            <q-separator />
            <q-card-section>
              <div class="simple-bar-chart">
                <div class="bar-chart-container">
                  <div v-for="(bar, index) in barChartData" :key="bar.label" class="bar-wrapper">
                    <div class="bar-column">
                      <div class="bar-value-label">{{ bar.value }}</div>
                      <div 
                        class="bar" 
                        :style="{
                          height: animatedBars[index] + '%', 
                          background: bar.gradient,
                          '--target-height': bar.percentage + '%'
                        }"
                        @mouseenter="activeBar = index"
                        @mouseleave="activeBar = null"
                      >
                        <div class="bar-shine"></div>
                      </div>
                      <transition name="fade">
                        <div v-if="activeBar === index" class="bar-hover-tooltip">
                          {{ bar.percentage }}% মোট সদস্যের
                        </div>
                      </transition>
                    </div>
                    <div class="bar-label">{{ bar.label }}</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Member Distribution Pie Chart -->
        <div class="col-12 col-md-4">
          <q-card class="chart-card glassmorphism" flat>
            <div class="chart-header">
              <div class="chart-title">
                <q-icon name="pie_chart" size="24px" color="primary" />
                <span>সদস্য বিতরণ</span>
              </div>
            </div>
            <q-separator />
            <q-card-section>
              <div class="simple-pie-chart">
                <svg viewBox="0 0 200 200" class="pie-svg">
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <circle v-for="(segment, idx) in pieSegments" :key="'segment-'+idx"
                          :cx="100" :cy="100" :r="80"
                          :fill="segment.color"
                          :stroke="segment.color"
                          :stroke-width="80"
                          :stroke-dasharray="`${segment.dashArray} ${circumference}`"
                          :stroke-dashoffset="segment.dashOffset"
                          transform="rotate(-90 100 100)"
                          class="pie-segment"
                          :class="{ 'active': activeSegment === idx }"
                          @mouseenter="activeSegment = idx"
                          @mouseleave="activeSegment = null"
                          filter="url(#glow)"/>
                  <circle cx="100" cy="100" r="50" fill="white"/>
                  <text x="100" y="95" text-anchor="middle" class="pie-total-label">মোট</text>
                  <text x="100" y="115" text-anchor="middle" class="pie-total-value">{{ animatedStats.totalMembers }}</text>
                </svg>
              </div>
              <div class="pie-legend">
                <div class="legend-item" v-for="(item, idx) in distributionData" :key="item.label"
                     @mouseenter="activeSegment = idx"
                     @mouseleave="activeSegment = null"
                     :class="{ 'active': activeSegment === idx }">
                  <div class="legend-color" :style="{background: item.color}"></div>
                  <div class="legend-text">
                    <span class="legend-label">{{ item.label }}</span>
                    <span class="legend-value">{{ item.value }} ({{ getPercentage(item.value) }}%)</span>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Growth Trend Chart -->
        <div class="col-12 col-md-4">
          <q-card class="chart-card glassmorphism" flat>
            <div class="chart-header">
              <div class="chart-title">
                <q-icon name="trending_up" size="24px" color="primary" />
                <span>বৃদ্ধির ধারা</span>
              </div>
            </div>
            <q-separator />
            <q-card-section>
              <div class="growth-stats">
                <div class="growth-item">
                  <div class="growth-icon">
                    <q-icon name="person_add" size="32px" color="positive" />
                  </div>
                  <div class="growth-info">
                    <div class="growth-label">নতুন সদস্য</div>
                    <div class="growth-value">+{{ stats.newMembers || 45 }}</div>
                    <div class="growth-period">এই মাসে</div>
                  </div>
                </div>
                <div class="growth-item">
                  <div class="growth-icon">
                    <q-icon name="speed" size="32px" color="info" />
                  </div>
                  <div class="growth-info">
                    <div class="growth-label">বৃদ্ধির হার</div>
                    <div class="growth-value">{{ stats.growthRate || 12.5 }}%</div>
                    <div class="growth-period">গত মাসের তুলনায়</div>
                  </div>
                </div>
                <div class="growth-item">
                  <div class="growth-icon">
                    <q-icon name="workspace_premium" size="32px" color="warning" />
                  </div>
                  <div class="growth-info">
                    <div class="growth-label">সক্রিয় হার</div>
                    <div class="growth-value">{{ stats.activeRate || 94.6 }}%</div>
                    <div class="growth-period">সর্বমোট সদস্য</div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Quick Actions with Enhanced Design -->
    <div class="actions-section">
      <div class="section-title">
        <div class="title-icon-wrapper">
          <q-icon name="bolt" size="28px" />
        </div>
        <span>দ্রুত কার্যক্রম</span>
      </div>
      <div class="row q-col-gutter-md">
        <div 
          v-for="(card, index) in actionCards" 
          :key="index"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <q-card 
            class="action-card glassmorphism" 
            flat
            clickable
            @click="navigateTo(card.route)"
          >
            <q-card-section>
              <div class="action-icon" :style="{ background: card.gradient }">
                <q-icon :name="card.icon" size="36px" />
                <div class="action-icon-pulse"></div>
              </div>
              <div class="action-title">{{ card.title }}</div>
              <div class="action-description">{{ card.description }}</div>
              <div class="action-arrow">
                <q-icon name="arrow_forward" size="20px" />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <transition name="fade">
      <div v-if="loading" class="loading-overlay">
        <div class="loading-content">
          <div class="loading-spinner">
            <q-spinner-cube color="primary" size="60px" />
          </div>
          <div class="loading-text">ডেটা লোড হচ্ছে...</div>
        </div>
      </div>
    </transition>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

const router = useRouter();
const $q = useQuasar();

// Loading state
const loading = ref(true);

// Stats data with real values
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
  activeRate: 0
});

// Animated stats for counting effect
const animatedStats = ref({
  totalMembers: 0,
  totalRO: 0,
  totalARO: 0,
  totalCommissionerates: 0,
  totalDistricts: 0,
  totalDivisions: 0,
  totalCircles: 0,
  verifiedMembers: 0
});

// Chart state
const activeSegment = ref(null);
const activeBar = ref(null);
const animatedBars = ref([]);

// Enhanced action cards
const actionCards = ref([
  { 
    title: "সদস্য তালিকা", 
    icon: "people", 
    route: "/members",
    description: "সকল সদস্যদের দেখুন",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  { 
    title: "নতুন সদস্য যোগ করুন", 
    icon: "person_add", 
    route: "/members/create",
    description: "নতুন সদস্য নিবন্ধন",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  { 
    title: "রিপোর্ট", 
    icon: "assessment", 
    route: "/reports",
    description: "বিস্তারিত রিপোর্ট দেখুন",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  },
  { 
    title: "কমিশনারেট", 
    icon: "business", 
    route: "/commissionerates",
    description: "কমিশনারেট ব্যবস্থাপনা",
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
  },
  { 
    title: "জেলা", 
    icon: "map", 
    route: "/districts",
    description: "জেলা ব্যবস্থাপনা",
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
  },
  { 
    title: "বিভাগ", 
    icon: "account_tree", 
    route: "/divisions",
    description: "বিভাগ ব্যবস্থাপনা",
    gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
  },
  { 
    title: "সার্কেল", 
    icon: "workspaces", 
    route: "/circles",
    description: "সার্কেল ব্যবস্থাপনা",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  },
  { 
    title: "সেটিংস", 
    icon: "settings", 
    route: "/settings",
    description: "সিস্টেম কনফিগারেশন",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
  }
]);

// Computed properties
const verificationPercentage = computed(() => {
  if (stats.value.totalMembers === 0) return 0;
  return Math.round((stats.value.verifiedMembers / stats.value.totalMembers) * 100);
});

// Distribution data for pie chart
const distributionData = ref([
  { label: 'ঢাকা', value: 450, color: '#3b82f6' },
  { label: 'চট্টগ্রাম', value: 320, color: '#8b5cf6' },
  { label: 'রাজশাহী', value: 180, color: '#ef4444' },
  { label: 'খুলনা', value: 150, color: '#f59e0b' },
  { label: 'অন্যান্য', value: 147, color: '#10b981' }
]);

const circumference = 2 * Math.PI * 80;

const pieSegments = computed(() => {
  const total = distributionData.value.reduce((sum, item) => sum + item.value, 0);
  let currentOffset = 0;
  
  return distributionData.value.map(item => {
    const percentage = item.value / total;
    const dashArray = percentage * circumference;
    const segment = {
      ...item,
      dashArray,
      dashOffset: -currentOffset,
      percentage: (percentage * 100).toFixed(1)
    };
    currentOffset += dashArray;
    return segment;
  });
});

// Bar chart data - will be updated with real RO/ARO counts
const barChartData = computed(() => {
  const maxValue = Math.max(stats.value.totalRO, stats.value.totalARO, 1);
  return [
    { 
      label: 'RO', 
      value: stats.value.totalRO, 
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      percentage: (stats.value.totalRO / maxValue) * 100 
    },
    { 
      label: 'ARO', 
      value: stats.value.totalARO, 
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
      percentage: (stats.value.totalARO / maxValue) * 100 
    },
  ];
});

// Methods
const fetchDashboardData = async () => {
  loading.value = true;
  try {
    // Fetch total members count
    const membersResponse = await api.get('/v1/users?verified=true&limit=1');
    const totalMembers = membersResponse.data.meta?.pagination?.total || 0;
    
    // Fetch RO count
    const roResponse = await api.get('/v1/users?verified=true&search=role:RO&limit=1');
    const totalRO = roResponse.data.meta?.pagination?.total || 0;
    
    // Fetch ARO count
    const aroResponse = await api.get('/v1/users?verified=true&search=role:ARO&limit=1');
    const totalARO = aroResponse.data.meta?.pagination?.total || 0;
    
    // Fetch commissionerate count
    const commissionerateResponse = await api.get('/v1/categories?search=type:commissionerate&limit=1');
    const totalCommissionerates = commissionerateResponse.data.meta?.pagination?.total || 0;
    
    // Fetch district count
    const districtResponse = await api.get('/v1/categories?search=type:district&limit=1');
    const totalDistricts = districtResponse.data.meta?.pagination?.total || 0;
    
    // Fetch division count
    const divisionResponse = await api.get('/v1/categories?search=type:division&limit=1');
    const totalDivisions = divisionResponse.data.meta?.pagination?.total || 0;
    
    // Fetch circle count
    const circleResponse = await api.get('/v1/categories?search=type:circle&limit=1');
    const totalCircles = circleResponse.data.meta?.pagination?.total || 0;
    
    // Update stats
    stats.value = {
      totalMembers,
      totalRO,
      totalARO,
      totalCommissionerates,
      totalDistricts,
      totalDivisions,
      totalCircles,
      verifiedMembers: totalMembers, // Assuming all fetched members are verified
      newMembers: Math.round(totalMembers * 0.036), // 3.6% estimate
      growthRate: 12.5,
      activeRate: 94.6
    };
    
    // Animate counting
    animateNumbers();
    animateBars();
    
    $q.notify({
      type: 'positive',
      message: 'ড্যাশবোর্ড সফলভাবে লোড হয়েছে',
      timeout: 1500,
      position: 'top'
    });
    
  } catch (error) {
    console.error('Dashboard load error:', error);
    
    // Fallback demo data
    stats.value = {
      totalMembers: 1247,
      totalRO: 420,
      totalARO: 380,
      totalCommissionerates: 8,
      totalDistricts: 64,
      totalDivisions: 8,
      totalCircles: 45,
      verifiedMembers: 1180,
      newMembers: 45,
      growthRate: 12.5,
      activeRate: 94.6
    };
    
    animateNumbers();
    animateBars();
    
    $q.notify({
      type: 'warning',
      message: 'ডেমো ডেটা দেখানো হচ্ছে',
      caption: 'API সংযোগ ব্যর্থ হয়েছে',
      timeout: 2500
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
      verifiedMembers: Math.round(stats.value.verifiedMembers * progress)
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
  const total = animatedStats.value.totalMembers || 1;
  return Math.round((value / total) * 100);
};

const navigateTo = (route) => {
  router.push(route);
};

const getCurrentGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "সুপ্রভাত! আজকের দিনটি শুভ হোক";
  if (hour < 17) return "শুভ অপরাহ্ন! কাজ ভালো চলছে তো?";
  return "শুভ সন্ধ্যা! দিনটি কেমন কাটলো?";
};

const getCurrentDate = () => {
  const date = new Date();
  return date.toLocaleDateString('bn-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Lifecycle hooks
onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
/* Animated Background */
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -150px;
  right: -150px;
  animation-delay: 5s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* Dashboard Page */
.dashboard-page {
  background: #f8fafc;
  min-height: 100vh;
  padding: 24px;
  position: relative;
  overflow-x: hidden;
}

/* Glassmorphism Effect */
.glassmorphism {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Welcome Header */
.welcome-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.welcome-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.welcome-content {
  display: flex;
  align-items: center;
  gap: 24px;
  z-index: 1;
}

.welcome-icon-animated {
  position: relative;
  background: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.welcome-subtitle {
  font-size: 16px;
  margin: 8px 0 0 0;
  opacity: 0.95;
}

.welcome-date {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  z-index: 1;
}

/* Stats Section */
.stats-section {
  margin-bottom: 32px;
  z-index: 1;
  position: relative;
}

.stat-card {
  border-radius: 20px;
  overflow: visible;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  height: 100%;
  background: white;
  position: relative;
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.stat-card .q-card-section {
  padding: 28px !important;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.stat-icon-wrapper {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  padding: 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.icon-bg-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: ripple 2s infinite;
}

@keyframes ripple {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.members-card .stat-icon-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.ro-card .stat-icon-wrapper {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.aro-card .stat-icon-wrapper {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.verified-card .stat-icon-wrapper {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.commissionerate-card .stat-icon-wrapper {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.district-card .stat-icon-wrapper {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
}

.division-card .stat-icon-wrapper {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.circle-card .stat-icon-wrapper {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  line-height: 1;
}

.counting-number {
  display: inline-block;
  animation: countUp 0.5s ease-out;
}

@keyframes countUp {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.stat-change,
.stat-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
}

.stat-change.positive {
  color: #10b981;
}

.stat-info {
  color: #64748b;
}

.card-glow {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}

.stat-card:hover .card-glow {
  opacity: 1;
}

.members-glow { background: linear-gradient(90deg, #667eea, #764ba2); }
.ro-glow { background: linear-gradient(90deg, #f093fb, #f5576c); }
.aro-glow { background: linear-gradient(90deg, #4facfe, #00f2fe); }
.verified-glow { background: linear-gradient(90deg, #43e97b, #38f9d7); }
.commissionerate-glow { background: linear-gradient(90deg, #fa709a, #fee140); }
.district-glow { background: linear-gradient(90deg, #30cfd0, #330867); }
.division-glow { background: linear-gradient(90deg, #a8edea, #fed6e3); }
.circle-glow { background: linear-gradient(90deg, #ff9a9e, #fecfef); }

/* Charts Section */
.charts-section {
  margin-bottom: 32px;
  z-index: 1;
  position: relative;
}

.chart-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  background: white;
  transition: transform 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-4px);
}

.chart-header {
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

/* Bar Chart */
.simple-bar-chart {
  height: 320px;
  padding: 20px 0;
}

.bar-chart-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 100%;
  gap: 32px;
  padding: 0 24px;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  height: 100%;
}

.bar-column {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
}

.bar-value-label {
  position: absolute;
  top: -30px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  z-index: 2;
}

.bar {
  width: 100%;
  max-width: 120px;
  border-radius: 12px 12px 0 0;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.bar-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { left: -100%; }
  50% { left: 100%; }
  100% { left: 100%; }
}

.bar:hover {
  transform: scaleY(1.05);
  filter: brightness(1.1);
}

.bar-hover-tooltip {
  position: absolute;
  top: -50px;
  background: #1e293b;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.bar-hover-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: #1e293b;
}

.bar-label {
  font-size: 15px;
  font-weight: 600;
  color: #475569;
  text-align: center;
  padding: 12px 4px;
}

/* Pie Chart */
.simple-pie-chart {
  max-width: 220px;
  margin: 0 auto 24px;
}

.pie-svg {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 4px 12px rgba(0,0,0,0.1));
}

.pie-segment {
  transition: all 0.3s ease;
  cursor: pointer;
}

.pie-segment:hover,
.pie-segment.active {
  opacity: 0.8;
  filter: brightness(1.2);
}

.pie-total-label {
  font-size: 13px;
  fill: #64748b;
  font-weight: 600;
}

.pie-total-value {
  font-size: 26px;
  fill: #1e293b;
  font-weight: 700;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.3s ease;
  cursor: pointer;
}

.legend-item:hover,
.legend-item.active {
  background: #f8fafc;
}

.legend-color {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.legend-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.legend-label {
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}

.legend-value {
  font-size: 14px;
  color: #1e293b;
  font-weight: 700;
}

/* Growth Stats */
.growth-stats {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 8px 0;
}

.growth-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  transition: transform 0.3s ease;
}

.growth-item:hover {
  transform: translateX(8px);
}

.growth-icon {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.growth-info {
  flex: 1;
}

.growth-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 4px;
}

.growth-value {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.growth-period {
  font-size: 12px;
  color: #94a3b8;
}

/* Actions Section */
.actions-section {
  margin-bottom: 32px;
  z-index: 1;
  position: relative;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 26px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
}

.title-icon-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.action-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  background: white;
  height: 100%;
  position: relative;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.action-card:hover {
  transform: translateY(-8px) scale(1.03);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.action-card:hover::before {
  opacity: 1;
}

.action-card .q-card-section {
  padding: 28px !important;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
}

.action-icon {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: white;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
}

.action-icon-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.3);
  border-radius: 18px;
  animation: pulse 2s infinite;
}

.action-title {
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.action-description {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.action-arrow {
  position: absolute;
  top: 16px;
  right: 16px;
  color: #cbd5e1;
  transition: all 0.3s ease;
}

.action-card:hover .action-arrow {
  color: #667eea;
  transform: translateX(6px);
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(248, 250, 252, 0.95);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  margin-bottom: 20px;
}

.loading-text {
  font-size: 18px;
  font-weight: 600;
  color: #475569;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 1023px) {
  .dashboard-page {
    padding: 20px;
  }

  .welcome-header {
    padding: 24px;
  }

  .welcome-title {
    font-size: 26px;
  }

  .stat-value {
    font-size: 32px;
  }
}

@media (max-width: 599px) {
  .dashboard-page {
    padding: 16px;
  }

  .welcome-header {
    padding: 20px;
    margin-bottom: 24px;
    flex-direction: column;
    align-items: flex-start;
  }

  .welcome-content {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .welcome-title {
    font-size: 22px;
  }

  .welcome-date {
    width: 100%;
    justify-content: center;
  }

  .stat-value {
    font-size: 28px;
  }

  .section-title {
    font-size: 22px;
  }

  .bar-chart-container {
    gap: 16px;
  }

  .growth-item {
    padding: 16px;
  }

  .growth-value {
    font-size: 24px;
  }
}
</style>