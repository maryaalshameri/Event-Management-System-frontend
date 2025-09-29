<template>
  <Modal :show="show" @close="$emit('close')" max-width="md">
    <div class="p-6">
      <div class="flex items-center mb-4">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <i class="fas fa-exclamation-triangle text-red-600 dark:text-red-300 text-xl"></i>
          </div>
        </div>
        <div class="mr-3">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">تأكيد الحذف</h2>
        </div>
      </div>

      <div class="mb-6">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          هل أنت متأكد من رغبتك في حذف الفعالية 
          <span class="font-medium text-gray-900 dark:text-white">"{{ event?.title }}"</span>؟
        </p>
        <p class="text-sm text-red-600 dark:text-red-400 mt-2">
          ⚠️ هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع البيانات المرتبطة بهذه الفعالية بما في ذلك الطلبات والتذاكر.
        </p>

        <div v-if="hasActiveOrders" class="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-md">
          <div class="flex items-center">
            <i class="fas fa-exclamation-circle text-yellow-600 dark:text-yellow-300 ml-2"></i>
            <p class="text-sm text-yellow-700 dark:text-yellow-300">
              تحتوي هذه الفعالية على {{ event?.orders_count }} طلب نشط. سيتم إلغاء جميع الطلبات المرتبطة بها.
            </p>
          </div>
        </div>

        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            سبب الحذف (اختياري):
          </label>
          <textarea
            v-model="deletionReason"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            placeholder="أدخل سبب الحذف إذا رغبت..."
          ></textarea>
        </div>

        <div class="mt-3 flex items-center">
          <input
            id="confirm-delete"
            v-model="confirmed"
            type="checkbox"
            class="rounded border-gray-300 text-red-600 focus:ring-red-500 ml-2"
          >
          <label for="confirm-delete" class="text-sm text-gray-700 dark:text-gray-300">
            أدرك عواقب هذا الإجراء وأريد المتابعة
          </label>
        </div>
      </div>

      <div class="flex justify-end space-x-3 space-x-reverse gap-4">
        <button
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          إلغاء
        </button>
        <button
          @click="$emit('confirmed')"
          :disabled="!confirmed || loading"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin ml-2"></i>
          {{ loading ? 'جاري الحذف...' : 'حذف الفعالية' }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Modal from '@/components/Shared/Modal.vue'

const props = defineProps({
  show: Boolean,
  event: Object,
  loading: Boolean
})

const emit = defineEmits(['close', 'confirmed'])

const confirmed = ref(false)
const deletionReason = ref('')

const hasActiveOrders = computed(() => {
  return props.event?.orders_count > 0
})

watch(() => props.show, (newVal) => {
  if (!newVal) {
    // إعادة تعيين الحقول عند إغلاق المودال
    confirmed.value = false
    deletionReason.value = ''
  }
})
</script>