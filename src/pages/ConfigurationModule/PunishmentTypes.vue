<template>
  <q-page class="q-pa-sm">
    <q-card class="no-shadow" bordered>
      <q-card-section>
        <div class="text-h6 text-indigo-8">Punishment Types</div>
        <div class="text-subtitle2">List of all Punishment Types</div>
      </q-card-section>
    </q-card>

    <q-separator spaced />

    <div class="q-pa-none">
      <div class="row q-col-gutter-md">
        <div class="col-7">
          <q-card>
            <q-card-section>
              <q-table :rows="leaves" :columns="columns" row-key="id">
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
              <div class="text-h6 text-indigo-8">{{ isEditing ? 'Edit' : 'Add' }} Punishment Types</div>

              <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md q-mt-lg">
                <q-input
                  outlined
                  v-model="form.name"
                  label="Punishment Type *"
                  :rules="[val => !!val || 'Field is required']"
                />
                <div>
                  <q-btn label="Submit" type="submit" color="primary" />
                  <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
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

const leaves = ref([])
const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

const fetchLeaves = async () => {
  try {
    const { data } = await api.get('/v1/categories?search=type:punishment_type')
    leaves.value = data.data;
  } catch (error) {
    console.error('Failed to fetch punishments', error)
  }
}

const onSubmit = async () => {
  try {
    const payload = {
      name: form.value.name,
      type: 'punishment_type',
      parent_id: '', // or set from selection if needed
      additional_info: null
    }

    if (isEditing.value) {
      await api.patch(`/v1/categories/${isEditing.value.id}`, payload)
    } else {
      await api.post('/v1/categories', payload)
    }

    $q.notify({ message: 'Punishment saved successfully', color: 'positive', icon: 'check' })
    onReset()
    await fetchLeaves()
  } catch (error) {
    console.error('Error saving punishment', error)
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
    title: 'Confirm',
    message: 'Are you sure you want to delete?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await api.delete(`/v1/categories/${row.id}`)
      $q.notify({ message: 'Punishment deleted', color: 'negative', icon: 'check' })
      await fetchLeaves()
    } catch (error) {
      console.error('Error deleting punishment', error)
    }
  })
}

onMounted(() => {
  fetchLeaves()
})
</script>