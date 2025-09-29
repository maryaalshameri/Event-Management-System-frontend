<template>
  <Modal :show="true" @close="$emit('cancel')" max-width="md">
    <div class="p-6">
      <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {{ title }}
      </h2>
      
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
        {{ message }}
      </p>

      <div class="flex justify-end space-x-2 space-x-reverse gap-3">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
        >
          {{ cancelText }}
        </button>
        <button
          @click="$emit('confirm')"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/Shared/Modal.vue'

export default {
  components: { Modal },
  props: {
    title: {
      type: String,
      default: 'تأكيد الإجراء'
    },
    message: {
      type: String,
      required: true
    },
    confirmText: {
      type: String,
      default: 'تأكيد'
    },
    cancelText: {
      type: String,
      default: 'إلغاء'
    }
  },
  emits: ['confirm', 'cancel']
}
</script>