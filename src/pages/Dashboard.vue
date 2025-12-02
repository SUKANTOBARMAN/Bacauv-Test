<template>
  <q-page class="q-pa-sm">
    <h4 class="text-center">আপনাকে bacuav অ্যাপে স্বাগতম</h4>

    <div class="row q-mt-md justify-center">
      <q-card
        v-for="(card, index) in cards"
        :key="index"
        class="q-ma-sm cursor-pointer"
        style="width: 200px"
        clickable
        @click="navigateTo(card.route)"
      >
        <q-card-section class="text-center">
          <q-icon :name="card.icon" class="text-primary" size="48px" />
          <div class="text-h6 q-mt-sm">{{ card.title }}</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "src/stores/userStore";

const router = useRouter();
const userStore = useUserStore();

let cards;
if (userStore.getHighestRole === "admin") {
  cards = ref([
    { title: "কর্মচারী যোগ করুন", icon: "people", route: "/employees/add" },
    { title: "রিসোর্স", icon: "inventory", route: "/products" },
    { title: "বরাদ্দ", icon: "assignment", route: "/allocations" },
    { title: "আবার সংগ্রহ", icon: "assignment", route: "/field-requisition" },
    { title: "স্টকস", icon: "assignment", route: "/stocks" },
    { title: "নোটিশ যোগ করুন", icon: "report", route: "/notices/add" },
    { title: "বেতন কাঠামো", icon: "paid", route: "/salary" },
  ]);
}
if (userStore.getHighestRole === "subadmin") {
  cards = ref([
    { title: "Allocations", icon: "assignment", route: "/allocations" },
    { title: "Reacquisition", icon: "assignment", route: "/field-requisition" },
  ]);
}

const navigateTo = (route) => {
  router.push(route);
};

// 🚀 Redirect to dashboard on component mount
</script>
