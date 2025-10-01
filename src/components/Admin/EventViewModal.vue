<template>
  <Modal :show="show" @close="$emit('close')" max-width="3xl">
    <div class="p-6">
      <!-- الهيدر -->
      <div class="flex justify-between items-start mb-6 pb-4 border-b dark:border-gray-600">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mr-3">
            <i class="fas fa-calendar-alt text-lg"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ event?.title }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">
              <span class="px-2 py-1 text-xs rounded-full" :class="statusClass(event?.status)">
                {{ getStatusText(event?.status) }}
              </span>
              • {{ getCategoryText(event?.category) }}
            </p>
          </div>
        </div>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 text-lg transition-colors"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- محتوى الفعالية -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- المعلومات الأساسية -->
        <div class="lg:col-span-2">
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
            <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">المعلومات الأساسية</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center py-2 border-b dark:border-gray-600">
                <span class="text-gray-600 dark:text-gray-400">المنظم:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ event?.organizer?.name || 'غير محدد' }}</span>
              </div>
              
              <div class="flex justify-between items-center py-2 border-b dark:border-gray-600">
                <span class="text-gray-600 dark:text-gray-400">المكان:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ event?.location || 'غير محدد' }}</span>
              </div>
              
              <div class="flex justify-between items-center py-2 border-b dark:border-gray-600">
                <span class="text-gray-600 dark:text-gray-400">السعر:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ event?.price ? `${event.price} ر.س` : 'مجاني' }}</span>
              </div>
              
              <div class="flex justify-between items-center py-2">
                <span class="text-gray-600 dark:text-gray-400">تاريخ الإنشاء:</span>
                <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(event?.created_at) }}</span>
              </div>
            </div>
          </div>

          <!-- الوصف -->
          <div v-if="event?.description" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">الوصف</h3>
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ event.description }}
            </p>
          </div>
        </div>

        <!-- الجانب الأيمن -->
        <div class="space-y-6">
          <!-- الصورة -->
          <div 
              class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden"
              v-if="event && event.image"
            >
              <img 
                :src="`http://127.0.0.1:8000/storage/${event.image}`"
                :alt="event?.title || 'فعالية'"
                class="w-full h-48 object-cover"
              >
            </div>
          <!-- المواعيد -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">المواعيد</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">البدء:</span>
                <span class="font-medium">{{ formatDateTime(event?.start_date) }}</span>
              </div>
              <div class="flex justify-between items-center" v-if="event?.end_date">
                <span class="text-gray-600 dark:text-gray-400">الانتهاء:</span>
                <span class="font-medium">{{ formatDateTime(event?.end_date) }}</span>
              </div>
            </div>
          </div>

          <!-- المقاعد -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">المقاعد</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">السعة:</span>
                <span class="font-medium">{{ event?.capacity }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">المتاحة:</span>
                <span :class="getSeatsClass(event?.available_seats, event?.capacity)" class="font-medium">
                  {{ event?.available_seats }}
                </span>
              </div>
              <div class="pt-2">
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    class="bg-green-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${getOccupancyPercentage(event)}%` }"
                  ></div>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                  نسبة الإشغال: {{ getOccupancyPercentage(event) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- الأزرار -->
      <div class="flex justify-end space-x-3 mt-6 pt-6 border-t dark:border-gray-600">
        <button
          @click="$emit('close')"
          class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors duration-200"
        >
          إغلاق
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import Modal from '@/components/Shared/Modal.vue'
import { computed } from 'vue'

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  event: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['close'])

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCategoryText = (category) => {
  const texts = {
    festival: 'موسيقى',
    sports: 'رياضة',
    conference: 'مؤتمر',
    workshop: 'ورشة عمل',
    concert: 'معرض'
  }
  return texts[category] || category
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

const statusClass = (status) => {
  const classes = {
    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getSeatsClass = (available, capacity) => {
  if (!available || !capacity) return 'text-gray-600'
  if (available <= 0) return 'text-red-600 font-bold'
  if (available / capacity < 0.2) return 'text-orange-600 font-semibold'
  return 'text-green-600'
}

const getOccupancyPercentage = computed(() => (event) => {
  if (!event?.capacity || !event?.available_seats) return 0
  return Math.round(((event.capacity - event.available_seats) / event.capacity) * 100)
})
</script>