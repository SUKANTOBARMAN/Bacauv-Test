<template>
  <q-layout view="hHh Lpr lFf">
    <q-page-container>
      <q-page class="q-pa-sm">
        <q-card class="no-shadow" bordered>
          <q-card-section>
            <div class="text-h6 text-indigo-8">কমিশনারেটসমূহ</div>
            <div class="text-subtitle2">সকল কমিশনারেটের তালিকা</div>
          </q-card-section>
        </q-card>

        <q-separator spaced />

        <div class="q-pa-none">
          <div class="row q-col-gutter-md">
            <!-- Commissionerate List (Left Side) -->
            <div class="col-7">
              <q-card>
                <q-card-section>
                  <q-table 
                    :rows="commissionerates" 
                    :columns="columns" 
                    row-key="id"
                    :loading="loading"
                  >
                    <template v-slot:body-cell-actions="props">
                      <q-td :props="props">
                        <q-btn 
                          size="sm" 
                          color="primary" 
                          icon="edit" 
                          @click="editItem(props.row)" 
                        />
                        <q-btn 
                          size="sm" 
                          color="negative" 
                          icon="delete" 
                          class="q-ml-sm" 
                          @click="deleteItem(props.row)" 
                        />
                      </q-td>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card>
            </div>

            <!-- Commissionerate Form (Right Side) -->
            <div class="col-5">
              <q-card>
                <q-card-section>
                  <div class="text-h6 text-indigo-8">
                    {{ isEditing ? 'কমিশনারেট সম্পাদনা করুন' : 'নতুন কমিশনারেট যোগ করুন' }}
                  </div>

                  <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md q-mt-lg">
                    <q-input
                      outlined
                      v-model="form.name"
                      label="কমিশনারেটের নাম *"
                      lazy-rules
                      :rules="[val => !!val || 'কমিশনারেটের নাম আবশ্যক']"
                    />

                    <div>
                      <q-btn 
                        label="জমা দিন" 
                        type="submit" 
                        color="primary" 
                        :loading="submitting"
                      />
                      <q-btn 
                        label="রিসেট" 
                        type="reset" 
                        color="primary" 
                        flat 
                        class="q-ml-sm" 
                      />
                    </div>
                  </q-form>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()

// Form and state management
const form = ref({ name: '' })
const isEditing = ref(false)
const loading = ref(false)
const submitting = ref(false)

// Data
const commissionerates = ref([])
const columns = [
  { name: 'name', label: 'নাম', field: 'name', align: 'left' },
  { name: 'actions', label: 'কর্ম', field: 'actions', align: 'right' }
]

// Fetch all commissionerates
const fetchCommissionerates = async () => {
  try {
    loading.value = true
    const { data } = await api.get('/v1/categories?search=type:commissionerate&limit=0')
    commissionerates.value = data.data
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'কমিশনারেট লোড করতে ব্যর্থ হয়েছে',
      caption: error.message
    })
  } finally {
    loading.value = false
  }
}

// Handle form submission
const onSubmit = async () => {
  try {
    submitting.value = true
    
    const payload = {
      name: form.value.name,
      type: 'commissionerate',
      parent_id: null
    }

    if (isEditing.value) {
      await api.patch(`/v1/categories/${isEditing.value.id}`, payload)
      $q.notify({
        message: 'কমিশনারেট সফলভাবে আপডেট করা হয়েছে',
        color: 'positive',
        icon: 'check'
      })
    } else {
      await api.post('/v1/categories', payload)
      $q.notify({
        message: 'কমিশনারেট সফলভাবে তৈরি করা হয়েছে',
        color: 'positive',
        icon: 'check'
      })
    }

    onReset()
    await fetchCommissionerates()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'কমিশনারেট সংরক্ষণ করতে ব্যর্থ হয়েছে',
      caption: error.response?.data?.message || error.message
    })
  } finally {
    submitting.value = false
  }
}

// Reset form
const onReset = () => {
  form.value = { name: '' }
  isEditing.value = false
}

// Edit commissionerate
const editItem = (item) => {
  form.value = { name: item.name }
  isEditing.value = item
}

// Delete commissionerate
const deleteItem = (item) => {
  $q.dialog({
    title: 'নিশ্চিত করুন',
    message: 'আপনি কি এই কমিশনারেট মুছে ফেলতে চান?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/v1/categories/${item.id}`)
      $q.notify({
        message: 'কমিশনারেট সফলভাবে মুছে ফেলা হয়েছে',
        color: 'positive',
        icon: 'check'
      })
      await fetchCommissionerates()
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'কমিশনারেট মুছতে ব্যর্থ হয়েছে',
        caption: error.response?.data?.message || error.message
      })
    }
  })
}

// Fetch data on component mount
onMounted(() => {
  fetchCommissionerates()
})
</script>