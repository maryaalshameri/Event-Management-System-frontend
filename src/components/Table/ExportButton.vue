<template>
  <div class="relative">
    <button 
      @click="toggleExportOptions"
      :disabled="exporting || totalItems === 0"
      class="px-3 py-1 text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-md flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <i class="fas fa-download ml-1"></i>
      <span v-if="exporting">جاري التصدير...</span>
      <span v-else>خيارات التصدير</span>
      <i class="fas fa-chevron-down mr-1 text-xs"></i>
    </button>
    
    <div v-if="exportOptionsVisible" class="absolute left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
      <div class="py-1">
        <button 
          @click="handleExport('all')"
          :disabled="totalItems === 0"
          class="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          تصدير جميع البيانات ({{ totalItems }})
        </button>
        <button 
          @click="handleExport('filtered')"
          :disabled="filteredItems === 0"
          class="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          تصدير البيانات المصفاة ({{ filteredItems }})
        </button>
        <button 
          @click="handleExport('selected')"
          :disabled="selectedItems.length === 0"
          class="block w-full text-right px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          تصدير المحدد ({{ selectedItems.length }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  exporting: {
    type: Boolean,
    default: false
  },
  totalItems: {
    type: Number,
    default: 0
  },
  filteredItems: {
    type: Number,
    default: 0
  },
  selectedItems: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['export'])

const exportOptionsVisible = ref(false)

const toggleExportOptions = () => {
  exportOptionsVisible.value = !exportOptionsVisible.value
}

const handleExport = (type) => {
  emit('export', type)
  exportOptionsVisible.value = false
}

// إغلاق القائمة عند النقر خارجها
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    exportOptionsVisible.value = false
  }
}

// إضافة مستمع الحدث
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>