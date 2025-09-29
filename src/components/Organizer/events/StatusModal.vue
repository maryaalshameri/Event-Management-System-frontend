<template>
  <Modal :show="show" @close="$emit('close')" max-width="md">
    <div class="p-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
        تغيير حالة الفعالية
      </h2>
      
      <div class="mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          الفعالية: <span class="font-medium">{{ event?.title }}</span>
        </p>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الحالة الحالية: 
            <span class="px-2 py-1 text-xs rounded-full" :class="statusClass(event?.status)">
              {{ getStatusText(event?.status) }}
            </span>
          </label>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            تغيير إلى:
          </label>
          <select 
            v-model="selectedStatus"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="draft">مسودة</option>
            <option value="published">منشور</option>
            <option value="cancelled">ملغي</option>
            <option value="completed">مكتمل</option>
          </select>
        </div>

        <div v-if="selectedStatus === 'cancelled'">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            سبب الإلغاء (اختياري):
          </label>
          <textarea
            v-model="cancellationReason"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="أدخل سبب الإلغاء إذا رغبت..."
          ></textarea>
        </div>
      </div>

      <div class="flex justify-end space-x-3 space-x-reverse mt-6 gap-4">
        <button
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          إلغاء
        </button>
        <button
          @click="updateStatus"
          :disabled="loading || selectedStatus === event?.status"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin ml-2"></i>
          {{ loading ? 'جاري التحديث...' : 'تحديث الحالة' }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'
import Modal from '@/components/Shared/Modal.vue'

const props = defineProps({
  show: Boolean,
  event: Object
})

const emit = defineEmits(['close', 'status-updated'])

const loading = ref(false)
const selectedStatus = ref('')
const cancellationReason = ref('')

watch(() => props.event, (newEvent) => {
  if (newEvent) {
    selectedStatus.value = newEvent.status
    cancellationReason.value = ''
  }
}, { immediate: true })

const statusClass = (status) => {
  const classes = {
    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getStatusText = (status) => {
  const texts = {
    published: 'منشور',
    draft: 'مسودة',
    cancelled: 'ملغي',
    completed: 'مكتمل'
  }
  return texts[status] || status
}

const updateStatus = async () => {
  if (!props.event || selectedStatus.value === props.event.status) return

  loading.value = true
  try {
    const updateData = { status: selectedStatus.value }
    
    if (selectedStatus.value === 'cancelled' && cancellationReason.value) {
      updateData.cancellation_reason = cancellationReason.value
    }

    await api.put(`/organizer/events/${props.event.id}/status`, updateData)
    
    showToast('نجاح', 'تم تحديث حالة الفعالية بنجاح', 'success')
    emit('status-updated')
    emit('close')
  } catch (error) {
    console.error('Error updating event status:', error)
    showToast('خطأ', 'فشل في تحديث حالة الفعالية', 'error')
  } finally {
    loading.value = false
  }
}
</script>