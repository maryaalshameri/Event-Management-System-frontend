<template>
  <Modal :show="show" @close="close">
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4">تغيير حالة الطلب #{{ order?.id }}</h2>
      
      <form @submit.prevent="updateStatus">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">حالة الطلب</label>
          <select v-model="form.status" class="w-full p-2 border rounded">
            <option value="reserved">محجوز</option>
            <option value="confirmed">مؤكد</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">حالة الدفع</label>
          <select v-model="form.payment_status" class="w-full p-2 border rounded">
            <option value="pending">قيد الانتظار</option>
            <option value="completed">مكتمل</option>
            <option value="failed">فاشل</option>
            <option value="refunded">تم الاسترداد</option>
          </select>
        </div>

        <div class="flex justify-end space-x-2 space-x-reverse gap-4">
          <button type="button" @click="close" class="px-4 py-2 border rounded">إلغاء</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">حفظ</button>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import Modal from '@/components/Shared/Modal.vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

const props = defineProps({
  show: Boolean,
  order: Object
})

const emit = defineEmits(['close', 'status-updated'])

const form = ref({
  status: '',
  payment_status: ''
})

watch(() => props.order, (newOrder) => {
  if (newOrder) {
    form.value.status = newOrder.status
    form.value.payment_status = newOrder.payment_status
  }
})

const close = () => {
  emit('close')
}

const updateStatus = async () => {
  try {
    await api.put(`/organizer/orders/${props.order.id}/status`, form.value)
    emit('status-updated')
    showToast('نجاح', 'تم تحديث حالة الطلب بنجاح', 'success')
  } catch (error) {
    showToast('خطأ', 'فشل في تحديث حالة الطلب', 'error')
  }
}
</script>