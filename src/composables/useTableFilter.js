import { ref, computed } from 'vue'

export function useTableFilter(defaultFilters = {}) {
  const filters = ref({
    search: '',
    status: '',
    category: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    ...defaultFilters
  })

  const filterTimeout = ref(null)

  const applyFilterDebounce = (callback, delay = 500) => {
    clearTimeout(filterTimeout.value)
    filterTimeout.value = setTimeout(callback, delay)
  }

  const resetFilters = () => {
    filters.value = {
      search: '',
      status: '',
      category: '',
      sort_by: 'created_at',
      sort_order: 'desc',
      ...defaultFilters
    }
  }

  return {
    filters,
    applyFilterDebounce,
    resetFilters
  }
}