<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">إدارة الطلبات</h1>
    </div>

    <!-- فلترة البحث -->
    <FilterBar
      :filters="filters"
      :filters-config="filtersConfig"
      :loading="loading"
      @update:filters="handleFiltersUpdate"
      @apply="applyFilters"
      @reset="resetFilters"
    />

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
      <span class="mr-2">جاري تحميل البيانات...</span>
    </div>

    <!-- جدول الطلبات -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          عرض {{ meta.from }} إلى {{ meta.to }} من {{ meta.total }} طلب
        </div>
        <div class="flex space-x-2 space-x-reverse">
          <ExportButton
            :exporting="exporting"
            :total-items="meta.total"
            :filtered-items="orders.length"
            :selected-items="selectedOrders"
            @export="handleExport"
          />
        </div>
      </div>
      
      <div v-if="orders.length === 0" class="p-6 text-center text-gray-500">
        <i class="fas fa-search text-3xl mb-2"></i>
        <p>لا توجد طلبات تطابق معايير البحث</p>
        <button 
          @click="resetFilters"
          class="mt-2 text-blue-600 hover:text-blue-800"
        >
          عرض جميع الطلبات
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="px-4 py-3 text-right w-8">
                <input 
                  type="checkbox" 
                  v-model="selectAll"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >
              </th>
              <th class="px-4 py-3 text-right">رقم الطلب</th>
              <th class="px-4 py-3 text-right">المستخدم</th>
              <th class="px-4 py-3 text-right">الفعالية</th>
              <th class="px-4 py-3 text-right">المبلغ</th>
              <th class="px-4 py-3 text-right">حالة الدفع</th>
              <th class="px-4 py-3 text-right">حالة الطلب</th>
              <th class="px-4 py-3 text-right">التاريخ</th>
              <th class="px-4 py-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3">
                <input 
                  type="checkbox" 
                  v-model="selectedOrders"
                  :value="order.id"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >
              </td>
              <td class="px-4 py-3">
                <span class="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  #{{ order.id }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <img 
                    :src="order.user?.avatar || '/images/default-avatar.png'" 
                    :alt="order.user?.name"
                    class="h-8 w-8 rounded-full object-cover ml-2"
                  />
                  <div>
                    <p class="font-medium text-black dark:text-gray-50">{{ order.user?.name || 'مستخدم محذوف' }}</p>
                    <p class="text-xs text-gray-500">{{ order.user?.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="max-w-xs truncate text-black dark:text-gray-50">
                  {{ order.event?.title || 'فعالية محذوفة' }}
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="font-bold text-green-600">
                  {{ formatCurrency(order.total_amount) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs rounded-full" :class="paymentStatusClass(order.payment_status)">
                  {{ getPaymentStatusText(order.payment_status) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs rounded-full" :class="orderStatusClass(order.status)">
                  {{ getOrderStatusText(order.status) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="text-sm text-black dark:text-gray-50">
                  <div>{{ formatDate(order.created_at) }}</div>
                  <div class="text-gray-500 text-xs">{{ formatTime(order.created_at) }}</div>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex space-x-2 space-x-reverse gap-3">
                  <button 
                    @click="openViewModal(order)"
                    class="text-blue-600 hover:text-blue-800"
                    title="عرض التفاصيل"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    @click="openEditModal(order)"
                    class="text-green-600 hover:text-green-800"
                    title="تعديل الحالة"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    v-if="order.status !== 'cancelled'"
                    @click="openCancelModal(order)"
                    class="text-red-600 hover:text-red-800"
                    title="إلغاء الطلب"
                  >
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- الترقيم -->
      <div v-if="meta && meta.total > meta.per_page" class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300 mb-2 md:mb-0">
            عرض <span class="font-medium">{{ meta.from }}</span> إلى <span class="font-medium">{{ meta.to }}</span> من <span class="font-medium">{{ meta.total }}</span> نتيجة
          </div>
          <div class="flex space-x-2">
            <button 
              @click="goToPage(meta.current_page - 1)"
              :disabled="meta.current_page === 1"
              class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              السابق
            </button>
            <button 
              v-for="page in pages"
              :key="page"
              @click="goToPage(page)"
              :class="['px-3 py-1 rounded-md text-sm font-medium', page === meta.current_page ? 'bg-indigo-600 text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600']"
              :disabled="page === '...'"
            >
              {{ page }}
            </button>
            <button 
              @click="goToPage(meta.current_page + 1)"
              :disabled="meta.current_page === meta.last_page"
              class="px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal عرض تفاصيل الطلب -->
    <OrderViewModal
      :show="showViewModal"
      :order="selectedOrder"
      @close="closeViewModal"
    />

    <!-- Modal تعديل حالة الطلب -->
    <OrderEditModal
      :show="showEditModal"
      :order="selectedOrder"
      @close="closeEditModal"
      @saved="handleOrderSaved"
    />

    <!-- Modal تأكيد الإلغاء -->
    <ConfirmationModal
      :show="showCancelModal"
      title="تأكيد إلغاء الطلب"
      :message="cancelModalMessage"
      confirm-text="إلغاء الطلب"
      cancel-text="تراجع"
      @confirm="confirmCancel"
      @cancel="closeCancelModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useTableFilter } from '@/composables/useTableFilter'
import { useExcelExport } from '@/composables/useExcelExport'
import FilterBar from '@/components/Table/FilterBar.vue'
import ExportButton from '@/components/Table/ExportButton.vue'
import ConfirmationModal from '@/components/Shared/ConfirmationModal.vue'
import OrderViewModal from '@/components/Admin/OrderViewModal.vue'
import OrderEditModal from '@/components/Admin/OrderEditModal.vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

// استخدام composables
const { filters, resetFilters: resetTableFilters } = useTableFilter()
const { exporting, exportToExcel } = useExcelExport()

// المتغيرات التفاعلية
const orders = ref([])
const events = ref([]) // قائمة الفعاليات
const loading = ref(false)
const selectedOrders = ref([])
const meta = ref({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
  from: 0,
  to: 0
})

// متغيرات Modals
const showViewModal = ref(false)
const showEditModal = ref(false)
const showCancelModal = ref(false)
const selectedOrder = ref(null)
const cancelModalMessage = ref('')

// تكوين الفلترة للطلبات
const filtersConfig = ref([
  {
    key: 'search',
    label: 'بحث',
    type: 'text',
    placeholder: 'ابحث برقم الطلب، اسم المستخدم، أو البريد...'
  },
  {
    key: 'event_id',
    label: 'الفعالية',
    type: 'select',
    defaultOption: 'جميع الفعاليات',
    options: [] // سيتم تعبئتها من الخادم
  },
  {
    key: 'payment_status',
    label: 'حالة الدفع',
    type: 'select',
    defaultOption: 'جميع حالات الدفع',
    options: [
      { value: 'pending', label: 'قيد الانتظار' },
      { value: 'completed', label: 'مكتمل' },
      { value: 'failed', label: 'فاشل' },
      { value: 'refunded', label: 'تم الاسترداد' }
    ]
  },
  {
    key: 'status',
    label: 'حالة الطلب',
    type: 'select',
    defaultOption: 'جميع حالات الطلب',
    options: [
      { value: 'reserved', label: 'محجوز' },
      { value: 'confirmed', label: 'مؤكد' },
      { value: 'cancelled', label: 'ملغي' }
    ]
  },
  {
    key: 'sort_by',
    label: 'الترتيب حسب',
    type: 'select',
    options: [
      { value: 'created_at', label: 'تاريخ الطلب' },
      { value: 'total_amount', label: 'المبلغ' },
      { value: 'id', label: 'رقم الطلب' }
    ]
  },
  {
    key: 'sort_order',
    label: 'نوع الترتيب',
    type: 'select',
    options: [
      { value: 'desc', label: 'تنازلي' },
      { value: 'asc', label: 'تصاعدي' }
    ]
  },
  {
    key: 'per_page',
    label: 'عدد العناصر',
    type: 'select',
    options: [
      { value: '10', label: '10' },
      { value: '15', label: '15' },
      { value: '25', label: '25' },
      { value: '50', label: '50' },
      { value: '100', label: '100' }
    ]
  }
])

// computed properties للترقيم
const pages = computed(() => {
  if (!meta.value || meta.value.last_page <= 1) return []
  
  const totalPages = meta.value.last_page
  const currentPage = meta.value.current_page
  const delta = 2
  
  let range = []
  
  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    range.push(i)
  }
  
  if (currentPage - delta > 2) {
    range.unshift('...')
  }
  
  if (currentPage + delta < totalPages - 1) {
    range.push('...')
  }
  
  range.unshift(1)
  if (totalPages > 1) {
    range.push(totalPages)
  }
  
  return range
})

const selectAll = computed({
  get: () => orders.value.length > 0 && selectedOrders.value.length === orders.value.length,
  set: (value) => {
    if (value) {
      selectedOrders.value = orders.value.map(order => order.id)
    } else {
      selectedOrders.value = []
    }
  }
})

// الدوال الرئيسية
const fetchOrders = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    
    const defaultFilters = {
      page: 1,
      per_page: 15,
      sort_by: 'created_at',
      sort_order: 'desc'
    }
    
    const allFilters = { ...defaultFilters, ...filters.value }
    
    Object.keys(allFilters).forEach(key => {
      if (allFilters[key] !== null && allFilters[key] !== undefined && allFilters[key] !== '') {
        params.append(key, allFilters[key])
      }
    })

    const response = await api.get(`/admin/orders?${params}`)
    
    orders.value = response.data.data || []
    meta.value = response.data.meta || {
      current_page: 1,
      last_page: 1,
      per_page: parseInt(allFilters.per_page) || 15,
      total: orders.value.length,
      from: 1,
      to: orders.value.length
    }
    
    // تحديث قائمة الفعاليات إذا كانت متوفرة في الاستجابة
    if (response.data.events) {
      events.value = response.data.events
      // تحديث خيارات فلترة الفعاليات
      const eventFilterIndex = filtersConfig.value.findIndex(f => f.key === 'event_id')
      if (eventFilterIndex !== -1) {
        filtersConfig.value[eventFilterIndex].options = response.data.events.map(event => ({
          value: event.id,
          label: event.title
        }))
      }
    }
    
  } catch (error) {
    console.error('Error fetching orders:', error)
    showToast('خطأ', 'فشل في تحميل بيانات الطلبات', 'error')
    orders.value = []
    meta.value = {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    }
  } finally {
    loading.value = false
  }
}

const handleFiltersUpdate = (newFilters) => {
  Object.keys(newFilters).forEach(key => {
    if (newFilters[key] === '' || newFilters[key] === null) {
      delete filters.value[key]
    } else {
      filters.value[key] = newFilters[key]
    }
  })
}

const applyFilters = () => {
  filters.value.page = 1
  fetchOrders()
}

const goToPage = (page) => {
  if (page === '...' || page < 1 || page > meta.value.last_page) return
  filters.value.page = page
  fetchOrders()
}

const resetFilters = () => {
  resetTableFilters()
  filters.value = {
    page: 1,
    per_page: 15,
    sort_by: 'created_at',
    sort_order: 'desc'
  }
  fetchOrders()
}

const handleExport = async (type) => {
  try {
    let dataToExport = []
    
    if (type === 'all') {
      const params = new URLSearchParams()
      Object.keys(filters.value).forEach(key => {
        if (key !== 'page' && key !== 'per_page' && filters.value[key]) {
          params.append(key, filters.value[key])
        }
      })
      params.append('per_page', meta.value.total)
      
      const response = await api.get(`/admin/orders?${params}`)
      dataToExport = response.data.data || []
    } else if (type === 'selected') {
      dataToExport = orders.value.filter(order => selectedOrders.value.includes(order.id))
    } else {
      dataToExport = [...orders.value]
    }

    const columns = [
      { key: 'id', header: 'رقم الطلب', width: 15 },
      { key: 'user', header: 'المستخدم', width: 20, formatter: (val) => val?.name || 'مستخدم محذوف' },
      { key: 'user', header: 'البريد الإلكتروني', width: 20, formatter: (val) => val?.email || '-' },
      { key: 'event', header: 'الفعالية', width: 25, formatter: (val) => val?.title || 'فعالية محذوفة' },
      { key: 'total_amount', header: 'المبلغ', width: 15, formatter: formatCurrencyForExport },
      { key: 'payment_status', header: 'حالة الدفع', width: 15, formatter: getPaymentStatusText },
      { key: 'status', header: 'حالة الطلب', width: 15, formatter: getOrderStatusText },
      { key: 'created_at', header: 'تاريخ الطلب', width: 20, formatter: formatDateForExport }
    ]

    await exportToExcel(dataToExport, columns, 'الطلبات')
    showToast('نجاح', `تم تصدير ${dataToExport.length} طلب بنجاح`, 'success')
  } catch (error) {
    showToast('خطأ', error.message || 'حدث خطأ أثناء التصدير', 'error')
  }
}

// دوال إدارة Modals
const openViewModal = (order) => {
  selectedOrder.value = { ...order }
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedOrder.value = null
}

const openEditModal = (order) => {
  selectedOrder.value = JSON.parse(JSON.stringify(order))
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedOrder.value = null
}

const openCancelModal = (order) => {
  selectedOrder.value = order
  cancelModalMessage.value = `هل أنت متأكد من إلغاء الطلب #${order.id}؟ هذا الإجراء لا يمكن التراجع عنه.`
  showCancelModal.value = true
}

const closeCancelModal = () => {
  showCancelModal.value = false
  selectedOrder.value = null
}

const handleOrderSaved = (updatedOrder) => {
  closeEditModal()
  showToast('نجاح', 'تم تحديث حالة الطلب بنجاح', 'success')
  fetchOrders()
}

const confirmCancel = async () => {
  if (!selectedOrder.value) return
  
  try {
    await api.put(`/admin/orders/${selectedOrder.value.id}/status`, {
      status: 'cancelled'
    })
    showToast('نجاح', 'تم إلغاء الطلب بنجاح', 'success')
    fetchOrders()
  } catch (error) {
    console.error('Error cancelling order:', error)
    showToast('خطأ', 'حدث خطأ أثناء إلغاء الطلب', 'error')
  } finally {
    closeCancelModal()
  }
}

// الدوال المساعدة
const formatCurrency = (amount) => {
  if (!amount) return '٠ ر.س'
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(amount)
}

const formatCurrencyForExport = (amount) => {
  if (!amount) return '٠ ر.س'
  return `${amount} ر.س`
}

const formatDateForExport = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ar-SA')
}

const formatTime = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit'
  })
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

// مشاهدة التغييرات
watch(() => filters.value.per_page, (newValue) => {
  if (newValue) {
    filters.value.page = 1
    fetchOrders()
  }
})

onMounted(() => {
  filters.value = {
    page: 1,
    per_page: 15,
    sort_by: 'created_at',
    sort_order: 'desc',
    ...filters.value
  }
  fetchOrders()
})
</script>