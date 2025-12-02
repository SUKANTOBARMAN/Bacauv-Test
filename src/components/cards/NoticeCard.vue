<template>
    <q-card class="my-card q-ma-md" flat bordered>
      <q-card-section>
        <div class="row items-center q-mb-md">
          <q-icon name="announcement" size="md" color="teal" class="q-mr-sm" />
          <div class="text-h6 text-weight-bold text-teal">{{ notice.title }}</div>
        </div>
        <q-card-section>
          <div class="text-body2 text-grey-8">{{ notice.details }}</div>
        </q-card-section>
        <q-card-section horizontal class="q-py-sm bg-grey-2 text-grey-7">
          <q-icon name="event" size="sm" class="q-mr-xs" />
          <div class="text-caption">{{ notice.date }}</div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  defineProps({
    notice: {
      type: Object,
      required: true,
      default: () => ({
        title: 'Default Title',
        details: 'Default Description',
        date: '2025-05-01',
      }),
    },
  });
  </script>
  
  <style scoped>
  .my-card {
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .my-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  </style>