<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
    <!-- تصميم متجاوب مع عدد الفلاتر -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="filter in filtersConfig" :key="filter.key">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {{ filter.label }}
        </label>
        
        <input 
          v-if="filter.type === 'text'"
          v-model="localFilters[filter.key]"
          type="text" 
          :placeholder="filter.placeholder"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
          @input="handleFilterChange"
        />
        
        <select 
          v-else-if="filter.type === 'select'"
          v-model="localFilters[filter.key]"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
          @change="handleFilterChange"
        >
          <!-- إصلاح: استخدام defaultOption فقط -->
          <option value="">{{ filter.defaultOption || 'الكل' }}</option>
          <option v-for="option in filter.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
    
    <!-- أزرار التحكم -->
    <div class="flex justify-end space-x-3 mt-4">
      <button 
        @click="handleReset"
        class="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
      >
        إعادة تعيين
      </button>
      <button 
        @click="handleApply"
        class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
        :disabled="loading"
      >
        <span v-if="loading" class="flex items-center">
          <i class="fas fa-spinner fa-spin ml-2"></i>
          جاري التحميل...
        </span>
        <span v-else>تطبيق الفلترة</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  filtersConfig: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  debounceDelay: {
    type: Number,
    default: 500
  }
})

const emit = defineEmits(['update:filters', 'apply', 'reset'])

const localFilters = ref({ ...props.filters })
const filterTimeout = ref(null)

const handleFilterChange = () => {
  clearTimeout(filterTimeout.value)
  filterTimeout.value = setTimeout(() => {
    emit('apply')
  }, props.debounceDelay)
}

const handleApply = () => {
  emit('apply')
}

const handleReset = () => {
  emit('reset')
}

// تحديث الفلترات المحلية عند تغيير الفلترات من الأب
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

// إرسال التغييرات إلى الأب
watch(localFilters, (newFilters) => {
  emit('update:filters', { ...newFilters })
}, { deep: true })

onMounted(() => {
  localFilters.value = { ...props.filters }
})

onUnmounted(() => {
  clearTimeout(filterTimeout.value)
})
</script>