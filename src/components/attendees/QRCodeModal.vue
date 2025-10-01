<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl w-full max-w-sm shadow-2xl">
      <!-- الرأس -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
        <div class="flex items-center">
          <div class="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-lg ml-3">
            <i class="fas fa-qrcode text-indigo-600 dark:text-indigo-400"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">رمز QR للتذكرة</h3>
        </div>
        <button
          @click="close"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- المحتوى -->
      <div class="p-6">
        <!-- رمز QR -->
        <div class="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-4 flex justify-center">
          <div class="bg-white p-4 rounded-lg shadow-inner">
            <!-- محاكاة لرمز QR - يمكن استبدالها بمكتبة حقيقية -->
            <div class="grid grid-cols-8 gap-1 w-64 h-64 mx-auto">
              <div v-for="i in 64" :key="i" 
                   class="rounded-sm transition-all duration-300 hover:scale-110"
                   :class="Math.random() > 0.5 ? 'bg-black' : 'bg-white border border-gray-200'"></div>
            </div>
          </div>
        </div>

        <!-- معلومات التذكرة -->
        <div class="space-y-3 text-sm bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">رقم التذكرة:</span>
            <span class="font-mono font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
              {{ ticket?.code }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">نوع التذكرة:</span>
            <span class="font-medium text-gray-900 dark:text-white capitalize">
              {{ getTicketTypeText(ticket?.order_item?.ticket_type?.name) }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">الحالة:</span>
            <span class="font-medium px-2 py-1 rounded-full text-xs" 
                  :class="ticket?.used_at ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'">
              {{ ticket?.used_at ? 'مستخدمة' : 'نشطة' }}
            </span>
          </div>
        </div>

        <!-- تعليمات -->
        <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
          <div class="flex items-center">
            <i class="fas fa-info-circle text-blue-500 ml-2"></i>
            <p class="text-sm text-blue-700 dark:text-blue-300">
              اعرض هذا الرمز عند دخول الفعالية
            </p>
          </div>
        </div>
      </div>

      <!-- الأزرار -->
      <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex space-x-3 space-x-reverse gap-3">
        <button
          @click="close"
          class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl transition-all duration-200 font-medium flex items-center justify-center"
        >
          <i class="fas fa-times ml-2"></i>
          إغلاق
        </button>
        <button
          @click="downloadQRCode"
          :disabled="downloading"
          class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-xl transition-all duration-200 font-medium flex items-center justify-center shadow-md hover:shadow-lg"
        >
          <i v-if="downloading" class="fas fa-spinner fa-spin ml-2"></i>
          <i v-else class="fas fa-download ml-2"></i>
          <span>{{ downloading ? 'جاري التحميل...' : 'حفظ الصورة' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

const props = defineProps({
  show: Boolean,
  ticket: Object
})

const emit = defineEmits(['close'])

const downloading = ref(false)

const close = () => {
  emit('close')
}

const downloadQRCode = async () => {
  if (!props.ticket?.id) {
    showToast('خطأ', 'لا يمكن تحميل صورة QR', 'error')
    return
  }

  downloading.value = true

  try {
    const response = await api.get(`/attendee/tickets/${props.ticket.id}/download-qr`, {
      responseType: 'blob'
    })

    // إنشاء رابط تحميل
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `qr-${props.ticket.code}.png`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    showToast('نجاح', 'تم تحميل صورة QR بنجاح', 'success')
  } catch (error) {
    console.error('Error downloading QR code:', error)
    showToast('خطأ', 'فشل في تحميل صورة QR', 'error')
  } finally {
    downloading.value = false
  }
}

const getTicketTypeText = (name) => {
  const types = {
    'regular': 'عادية',
    'vip': 'VIP',
    'premium': 'بريميوم'
  }
  return types[name] || name
}
</script>