<template>
  <Modal :show="show" @close="close">
    <div class="p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">تفاصيل الفعالية</h3>
        <button @click="close" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div v-if="loading" class="text-center py-4">
        <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
        <p class="mt-2">جاري تحميل البيانات...</p>
      </div>

      <div v-else-if="event" class="space-y-4">
        <!-- صورة الفعالية -->
        <div class="text-center">
          <img 
            :src="`http://127.0.0.1:8000/storage/${event.image}`"
            :alt="event?.title || 'فعالية'"
            class="h-48 w-full object-cover rounded-lg mx-auto"
          >
        </div>

        <!-- المعلومات الأساسية -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">العنوان</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ event.title }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">الفئة</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ getCategoryText(event.category) }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">تاريخ البداية</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(event.start_date) }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">تاريخ النهاية</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(event.end_date) }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">الموقع</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ event.location }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">السعة</label>
            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ event.capacity }} شخص</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">الحالة</label>
            <span class="mt-1 px-2 py-1 text-xs rounded-full" :class="statusClass(event.status)">
              {{ getStatusText(event.status) }}
            </span>
          </div>
        </div>

        <!-- الوصف -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">الوصف</label>
          <p class="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{{ event.description }}</p>
        </div>

        <!-- أنواع التذاكر -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">أنواع التذاكر</label>
          <div class="space-y-2">
            <div v-for="ticket in event.ticket_types" :key="ticket.id" 
                 class="border rounded-lg p-3 dark:border-gray-600">
              <div class="flex justify-between items-center">
                <span class="font-medium">{{ ticket.name }}</span>
                <span class="text-green-600">{{ ticket.price }} ر.س</span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ ticket.description }}</p>
              <div class="flex justify-between text-xs text-gray-500 mt-2">
                <span>الكمية: {{ ticket.quantity }}</span>
                <span>المتبقي: {{ ticket.available }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/services/api'
import Modal from '@/components/Shared/Modal.vue'

const props = defineProps({
  show: Boolean,
  eventId: Number
})

const emit = defineEmits(['close'])

const event = ref(null)
const loading = ref(false)

const close = () => {
  emit('close')
}

const fetchEventDetails = async () => {
  if (!props.eventId) return
  
  loading.value = true
  try {
    const response = await api.get(`/organizer/events/${props.eventId}`)
    event.value = response.data
  } catch (error) {
    console.error('Error fetching event details:', error)
  } finally {
    loading.value = false
  }
}

watch(() => props.show, (newVal) => {
  if (newVal && props.eventId) {
    fetchEventDetails()
  } else {
    event.value = null
  }
})

// الدوال المساعدة
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const getCategoryText = (category) => {
  const categories = {
    festival: 'موسيقى',
    sports: 'رياضة',
    conference: 'مؤتمر',
    workshop: 'ورشة عمل',
    concert: 'معرض'
  }
  return categories[category] || category
}

const statusClass = (status) => {
  const classes = {
    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getStatusText = (status) => {
  const texts = {
    published: 'منشور',
    draft: 'مسودة',
    cancelled: 'ملغي'
  }
  return texts[status] || status
}
</script>