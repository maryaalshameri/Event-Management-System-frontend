<template>
  <Modal :show="show" @close="handleClose" max-width="4xl">
    <div class="p-6">
      <!-- الهيدر -->
      <div class="flex justify-between items-center mb-6 pb-4 border-b dark:border-gray-600">
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 mr-3">
            <i class="fas fa-receipt text-lg"></i>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              تفاصيل الطلب #{{ order?.id }}
            </h2>
            <p class="text-sm text-gray-500 mt-1">معلومات كاملة عن الطلب</p>
          </div>
        </div>
        <button 
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 text-lg transition-colors"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- محتوى المودال -->
      <div v-if="order" class="space-y-6">
        <!-- معلومات الطلب -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">معلومات الطلب</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">رقم الطلب:</span>
                <span class="font-mono font-bold">#{{ order.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">تاريخ الطلب:</span>
                <span>{{ formatDateTime(order.created_at) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">حالة الطلب:</span>
                <span class="px-2 py-1 text-xs rounded-full" :class="orderStatusClass(order.status)">
                  {{ getOrderStatusText(order.status) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">حالة الدفع:</span>
                <span class="px-2 py-1 text-xs rounded-full" :class="paymentStatusClass(order.payment_status)">
                  {{ getPaymentStatusText(order.payment_status) }}
                </span>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">المعلومات المالية</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">المبلغ الإجمالي:</span>
                <span class="font-bold text-green-600">{{ formatCurrency(order.total_amount) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">طريقة الدفع:</span>
                <span>{{ order.payment_method || 'غير محدد' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">معرف الدفع:</span>
                <span class="font-mono text-sm">{{ order.payment_id || 'غير متوفر' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- معلومات المستخدم -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">معلومات المستخدم</h3>
          <div class="flex items-center space-x-3 space-x-reverse">
            <img 
              :src="order.user?.avatar || '/images/default-avatar.png'" 
              :alt="order.user?.name"
              class="h-12 w-12 rounded-full"
            />
            <div>
              <p class="font-medium">{{ order.user?.name || 'مستخدم محذوف' }}</p>
              <p class="text-gray-600 dark:text-gray-400">{{ order.user?.email }}</p>
              <p class="text-sm text-gray-500">{{ order.user?.phone || 'لا يوجد هاتف' }}</p>
            </div>
          </div>
        </div>

        <!-- معلومات الفعالية -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">معلومات الفعالية</h3>
          <div class="flex items-center space-x-3 space-x-reverse">
            <img 
              :src="order.event?.image || '/placeholder-image.jpg'" 
              :alt="order.event?.title"
              class="h-12 w-12 rounded object-cover"
            />
            <div class="flex-1">
              <p class="font-medium">{{ order.event?.title || 'فعالية محذوفة' }}</p>
              <p class="text-gray-600 dark:text-gray-400">
                {{ formatDate(order.event?.start_date) }} - {{ order.event?.location }}
              </p>
              <p class="text-sm text-gray-500">المنظم: {{ order.event?.organizer?.name || 'غير محدد' }}</p>
            </div>
          </div>
        </div>

        <!-- التذاكر -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">التذاكر المطلوبة</h3>
          <div class="space-y-3">
            <div v-for="item in order.order_items" :key="item.id" class="flex justify-between items-center p-3 bg-white dark:bg-gray-700 rounded">
              <div>
                <p class="font-medium">{{ item.ticket_type?.name || 'نوع تذكرة محذوف' }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">الكمية: {{ item.quantity }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold">{{ formatCurrency(item.price) }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">المجموع: {{ formatCurrency(item.price * item.quantity) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- الأزرار -->
      <div class="flex justify-end space-x-3 pt-6 border-t dark:border-gray-600">
        <button
          type="button"
          @click="handleClose"
          class="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors duration-200"
        >
          إغلاق
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import Modal from '@/components/Shared/Modal.vue'
import { formatCurrency, formatDate, formatDateTime } from '@/utils/formatters'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  order: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

// دوال المساعدة
const orderStatusClass = (status) => {
  const classes = {
    reserved: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getOrderStatusText = (status) => {
  const texts = {
    reserved: 'محجوز',
    confirmed: 'مؤكد',
    cancelled: 'ملغي'
  }
  return texts[status] || status
}

const paymentStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    refunded: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getPaymentStatusText = (status) => {
  const texts = {
    pending: 'قيد الانتظار',
    completed: 'مكتمل',
    failed: 'فاشل',
    refunded: 'تم الاسترداد'
  }
  return texts[status] || status
}
</script>