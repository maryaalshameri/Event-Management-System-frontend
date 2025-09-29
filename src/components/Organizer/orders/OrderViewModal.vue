<template>
  <Modal :show="show" @close="close">
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">تفاصيل الطلب #{{ order?.id }}</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 class="font-semibold mb-2">معلومات الطلب</h3>
          <p><strong>رقم الطلب:</strong> #{{ order?.id }}</p>
          <p><strong>التاريخ:</strong> {{ formatDateTime(order?.created_at) }}</p>
          <p><strong>الحالة:</strong> <span :class="orderStatusClass(order?.status)">{{ getOrderStatusText(order?.status) }}</span></p>
          <p><strong>حالة الدفع:</strong> <span :class="paymentStatusClass(order?.payment_status)">{{ getPaymentStatusText(order?.payment_status) }}</span></p>
        </div>
        
        <div>
          <h3 class="font-semibold mb-2">معلومات المستخدم</h3>
          <p><strong>الاسم:</strong> {{ order?.user?.name }}</p>
          <p><strong>البريد:</strong> {{ order?.user?.email }}</p>
          <p><strong>الهاتف:</strong> {{ order?.user?.phone || 'غير متوفر' }}</p>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="font-semibold mb-2">الفعالية</h3>
        <p><strong>الاسم:</strong> {{ order?.event?.title }}</p>
        <p><strong>التاريخ:</strong> {{ formatDate(order?.event?.start_date) }}</p>
        <p><strong>المكان:</strong> {{ order?.event?.location || 'غير محدد' }}</p>
      </div>

      <div class="mb-6">
        <h3 class="font-semibold mb-2">التذاكر</h3>
        <div v-for="item in order?.order_items" :key="item.id" class="border-b py-2">
          <p><strong>{{ item.ticket_type?.name }}:</strong> {{ item.quantity }} × {{ formatCurrency(item.unit_price) }}</p>
          <p class="text-sm text-gray-600">المجموع: {{ formatCurrency(item.quantity * item.unit_price) }}</p>
        </div>
        <div class="mt-2 font-bold text-lg">
          الإجمالي: {{ formatCurrency(order?.total_amount) }}
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import Modal from '@/components/Shared/Modal.vue'

defineProps({
  show: Boolean,
  order: Object
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

// نفس الدوال المساعدة من الصفحة الرئيسية
const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const formatCurrency = (amount) => {
  if (!amount) return '٠ ر.س'
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(amount)
}

const orderStatusClass = (status) => {
  const classes = {
    reserved: 'text-blue-600',
    confirmed: 'text-green-600',
    cancelled: 'text-red-600'
  }
  return classes[status] || 'text-gray-600'
}

const paymentStatusClass = (status) => {
  const classes = {
    pending: 'text-yellow-600',
    completed: 'text-green-600',
    failed: 'text-red-600',
    refunded: 'text-purple-600'
  }
  return classes[status] || 'text-gray-600'
}

const getOrderStatusText = (status) => {
  const texts = {
    reserved: 'محجوز',
    confirmed: 'مؤكد',
    cancelled: 'ملغي'
  }
  return texts[status] || status
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