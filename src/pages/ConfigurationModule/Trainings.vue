<template>
  <q-page class="q-pa-sm">
    <q-card class="no-shadow" bordered>
      <q-card-section>
        <div class="text-h6 text-indigo-8">প্রশিক্ষণসমূহ</div>
        <div class="text-subtitle2">সকল প্রশিক্ষণের তালিকা</div>
      </q-card-section>
    </q-card>

    <q-separator spaced />

    <div class="q-pa-none">
      <div class="row q-col-gutter-md">
        <div class="col-7">
          <q-card>
            <q-card-section>
              <q-table :rows="trainings" :columns="columns" row-key="id">
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn size="sm" color="primary" icon="edit" @click="editItem(props.row)" />
                    <q-btn size="sm" color="negative" icon="delete" class="q-ml-sm" @click="deleteItem(props.row)" />
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-5">
          <q-card>
            <q-card-section>
              <div class="text-h6 text-indigo-8">{{ isEditing ? 'প্রশিক্ষণ সম্পাদন করুন' : 'নতুন প্রশিক্ষণ যোগ করুন' }}</div>

              <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md q-mt-lg">
                <q-input
                  outlined
                  v-model="form.name"
                  label="প্রশিক্ষণের নাম *"
                  :rules="[val => !!val || 'ঘরটি পূরণ করা আবশ্যক']"
                />
                <div>
                  <q-btn label="সংরক্ষণ করুন" type="submit" color="primary" />
                  <q-btn label="রিসেট করুন" type="reset" color="primary" flat class="q-ml-sm" />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'

const $q = useQuasar()

const form = ref({ name: '' })
const isEditing = ref(null)

const trainings = ref([])
const columns = [
  { name: 'name', label: 'প্রশিক্ষণের নাম', field: 'name', align: 'left' },
  { name: 'actions', label: 'কর্ম', field: 'actions', align: 'right' }
]

const fetchTrainings = async () => {
  try {
    const { data } = await api.get('/v1/categories?search=type:training_type')
    trainings.value = data.data;
  } catch (error) {
     console.error('প্রশিক্ষণ লোড করতে ব্যর্থ', error);
  }
}

const onSubmit = async () => {
  try {
    const payload = {
      name: form.value.name,
      type: 'training_type',
      parent_id: '', // or set from selection if needed
      additional_info: null
    }

    if (isEditing.value) {
      await api.patch(`/v1/categories/${isEditing.value.id}`, payload)
    } else {
      await api.post('/v1/categories', payload)
    }

   $q.notify({ message: 'প্রশিক্ষণ সফলভাবে সংরক্ষণ করা হয়েছে', color: 'positive', icon: 'check' })
    onReset()
    await fetchTrainings()
  } catch (error) {
    console.error('প্রশিক্ষণ সংরক্ষণের সময় ত্রুটি', error);
  }
}

const onReset = () => {
  form.value = { name: '' }
  isEditing.value = null
}

const editItem = (row) => {
  form.value = { name: row.name }
  isEditing.value = row
}

const deleteItem = async (row) => {
   $q.dialog({
    title: 'নিশ্চিত করুন',
    message: 'আপনি কি নিশ্চিত যে আপনি এটি মুছে ফেলতে চান?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/v1/categories/${row.id}`)
      $q.notify({ message: 'প্রশিক্ষণ মুছে ফেলা হয়েছে', color: 'negative', icon: 'check' })
      await fetchTrainings()
    } catch (error) {
      console.error('প্রশিক্ষণ মুছে ফেলার সময় ত্রুটি', error);
    }
  })
}

onMounted(() => {
  fetchTrainings()
})
</script>