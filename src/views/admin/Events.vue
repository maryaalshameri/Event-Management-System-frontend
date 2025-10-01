<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">إدارة الفعاليات</h1>
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

    <!-- جدول الفعاليات -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          عرض {{ meta.from }} إلى {{ meta.to }} من {{ meta.total }} فعالية
        </div>
        <div class="flex space-x-2 space-x-reverse">
          <ExportButton
            :exporting="exporting"
            :total-items="meta.total"
            :filtered-items="events.length"
            :selected-items="selectedEvents"
            @export="handleExport"
          />
        </div>
      </div>
      
      <div class="overflow-x-auto">
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
              <th class="px-4 py-3 text-right">الفعالية</th>
              <th class="px-4 py-3 text-right">المنظم</th>
              <th class="px-4 py-3 text-right">التاريخ</th>
              <th class="px-4 py-3 text-right">المقاعد</th>
              <th class="px-4 py-3 text-right">الحالة</th>
              <th class="px-4 py-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events" :key="event.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3">
                <input 
                  type="checkbox" 
                  v-model="selectedEvents"
                  :value="event.id"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                >
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center">
                 <img
                  :src="`http://127.0.0.1:8000/storage/${event.image}`"
                  :alt="event?.title || 'فعالية'"
                  class="h-10 w-10 rounded object-cover ml-3"
                />                  <div>
                    <p class="font-medium text-black dark:text-gray-50">{{ event.title }}</p>
                    <p class="text-sm text-black dark:text-gray-50">{{ getCategoryText(event.category) }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-black dark:text-gray-50">{{ event.organizer?.name || 'غير محدد' }}</td>
              <td class="px-4 py-3  text-black dark:text-gray-50">{{ formatDate(event.start_date) }}</td>
              <td class="px-4 py-3">
                <span :class="getSeatsClass(event.available_seats, event.capacity)">
                  {{ event.available_seats }}/{{ event.capacity }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs rounded-full" :class="statusClass(event.status)">
                  {{ getStatusText(event.status) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex space-x-2 space-x-reverse gap-3">
                  <button @click="openViewModal(event)" class="text-blue-600 hover:text-blue-800" title="عرض">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button @click="openEditModal(event)" class="text-green-600 hover:text-green-800" title="تعديل">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="openDeleteModal(event)" class="text-red-600 hover:text-red-800" title="حذف">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- حالة عدم وجود نتائج -->
        <div v-if="events.length === 0" class="text-center py-8 text-gray-500">
          <i class="fas fa-search text-3xl mb-2"></i>
          <p>لا توجد فعاليات تطابق معايير البحث</p>
          <button 
            @click="resetFilters"
            class="mt-2 text-blue-600 hover:text-blue-800"
          >
            عرض جميع الفعاليات
          </button>
        </div>
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

    <!-- Modal عرض الفعالية -->
    <EventViewModal
      :show="showViewModal"
      :event="selectedEvent"
      @close="closeViewModal"
    />

    <!-- Modal تعديل الفعالية -->
    <EventEditModal
      :show="showEditModal"
      :event="selectedEvent"
      @close="closeEditModal"
      @saved="handleEventSaved"
    />

    <!-- Modal تأكيد الحذف -->
    <ConfirmationModal
      :show="showDeleteModal"
      :title="deleteModalTitle"
      :message="deleteModalMessage"
      confirm-text="حذف"
      cancel-text="إلغاء"
      @confirm="confirmDelete"
      @cancel="closeDeleteModal"
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
import EventViewModal from '@/components/Admin/EventViewModal.vue'
import EventEditModal from '@/components/Admin/EventEditModal.vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

// استخدام composables
const { filters, resetFilters: resetTableFilters } = useTableFilter()
const { exporting, exportToExcel } = useExcelExport()

// المتغيرات التفاعلية
const events = ref([])
const loading = ref(false)
const selectedEvents = ref([])
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
const showDeleteModal = ref(false)
const selectedEvent = ref(null)

// متغيرات Modal الحذف
const deleteModalTitle = ref('تأكيد الحذف')
const deleteModalMessage = ref('')

// تكوين الفلترة (محدث)
const filtersConfig = [
  {
    key: 'search',
    label: 'بحث',
    type: 'text',
    placeholder: 'ابحث باسم الفعالية...'
  },
  {
    key: 'status',
    label: 'الحالة',
    type: 'select',
    defaultOption: 'جميع الحالات',
    options: [
      { value: 'published', label: 'منشور' },
      { value: 'draft', label: 'مسودة' },
      { value: 'cancelled', label: 'ملغي' },
      { value: 'completed', label: 'مكتمل' }
    ]
  },
  {
    key: 'category',
    label: 'الفئة',
    type: 'select',
    defaultOption: 'جميع الفئات',
    options: [
 
      { value: 'festival', label: 'موسيقى' },
      { value: 'sports', label: 'رياضة' },
      { value: 'conference', label: 'مؤتمر' },
      { value: 'workshop', label: 'ورشة عمل' },
      { value: 'concert', label: 'معرض' }
    ]
  },
  {
    key: 'sort_by',
    label: 'الترتيب حسب',
    type: 'select',
    options: [
      { value: 'start_date', label: 'تاريخ البدء' },
      { value: 'created_at', label: 'تاريخ الإنشاء' },
      { value: 'title', label: 'الاسم' }
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
]

// computed properties للترقيم
const pages = computed(() => {
  if (!meta.value || meta.value.last_page <= 1) return []
  
  const totalPages = meta.value.last_page
  const currentPage = meta.value.current_page
  const delta = 2
  
  let range = []
  
  // إضافة الأرقام حول الصفحة الحالية
  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    range.push(i)
  }
  
  // إضافة النقاط في البداية إذا لزم الأمر
  if (currentPage - delta > 2) {
    range.unshift('...')
  }
  
  // إضافة النقاط في النهاية إذا لزم الأمر
  if (currentPage + delta < totalPages - 1) {
    range.push('...')
  }
  
  // إضافة الصفحة الأولى والأخيرة
  range.unshift(1)
  if (totalPages > 1) {
    range.push(totalPages)
  }
  
  return range
})

const selectAll = computed({
  get: () => events.value.length > 0 && selectedEvents.value.length === events.value.length,
  set: (value) => {
    if (value) {
      selectedEvents.value = events.value.map(event => event.id)
    } else {
      selectedEvents.value = []
    }
  }
})

// الدوال الرئيسية المحدثة
const fetchEvents = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    
    // إضافة جميع الفلاتر مع قيمها الافتراضية
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

    const response = await api.get(`/admin/events?${params}`)
    
    // افترض أن API يعيد البيانات بالشكل التالي:
    // { data: [], meta: { current_page, last_page, per_page, total, from, to } }
    events.value = response.data.data || []
    meta.value = response.data.meta || {
      current_page: 1,
      last_page: 1,
      per_page: parseInt(allFilters.per_page) || 15,
      total: events.value.length,
      from: 1,
      to: events.value.length
    }
    
  } catch (error) {
    console.error('Error fetching events:', error)
    showToast('خطأ', 'فشل في تحميل بيانات الفعاليات', 'error')
    events.value = []
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
  filters.value.page = 1 // العودة للصفحة الأولى عند تطبيق الفلترة
  fetchEvents()
}

const goToPage = (page) => {
  if (page === '...' || page < 1 || page > meta.value.last_page) return
  filters.value.page = page
  fetchEvents()
}

const resetFilters = () => {
  resetTableFilters()
  filters.value = {
    page: 1,
    per_page: 15,
    sort_by: 'created_at',
    sort_order: 'desc'
  }
  fetchEvents()
}

const handleExport = async (type) => {
  try {
    let dataToExport = []
    
    // لتصدير جميع البيانات، نحتاج لجلبها جميعاً من السيرفر
    if (type === 'all') {
      const params = new URLSearchParams()
      Object.keys(filters.value).forEach(key => {
        if (key !== 'page' && key !== 'per_page' && filters.value[key]) {
          params.append(key, filters.value[key])
        }
      })
      params.append('per_page', meta.value.total) // جلب جميع البيانات
      
      const response = await api.get(`/admin/events?${params}`)
      dataToExport = response.data.data || []
    } else if (type === 'selected') {
      dataToExport = events.value.filter(event => selectedEvents.value.includes(event.id))
    } else {
      dataToExport = [...events.value]
    }

    const columns = [
      { key: 'title', header: 'اسم الفعالية', width: 30 },
      { key: 'category', header: 'الفئة', width: 15, formatter: getCategoryText },
      { key: 'organizer', header: 'المنظم', width: 20, formatter: (val) => val?.name || 'غير محدد' },
      { key: 'start_date', header: 'تاريخ البدء', width: 15, formatter: formatDateForExport },
      { key: 'end_date', header: 'تاريخ النهاية', width: 15, formatter: (val) => val ? formatDateForExport(val) : '-' },
      { key: 'available_seats', header: 'المقاعد المتاحة', width: 15 },
      { key: 'capacity', header: 'السعة الكلية', width: 15 },
      { key: 'status', header: 'الحالة', width: 10, formatter: getStatusText },
      { key: 'location', header: 'المكان', width: 20, formatter: (val) => val || 'غير محدد' },
      { key: 'price', header: 'السعر', width: 15, formatter: (val) => val ? `${val} ر.س` : 'مجاني' },
      { key: 'created_at', header: 'تاريخ الإنشاء', width: 15, formatter: formatDateForExport }
    ]

    await exportToExcel(dataToExport, columns, 'الفعاليات')
    showToast('نجاح', `تم تصدير ${dataToExport.length} فعالية بنجاح`, 'success')
  } catch (error) {
    showToast('خطأ', error.message || 'حدث خطأ أثناء التصدير', 'error')
  }
}

// دوال إدارة Modals (تبقى كما هي)
const openViewModal = (event) => {
  selectedEvent.value = { ...event }
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedEvent.value = null
}

const openEditModal = (event) => {
  selectedEvent.value = JSON.parse(JSON.stringify(event))
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedEvent.value = null
}

const openDeleteModal = (event) => {
  selectedEvent.value = event
  deleteModalTitle.value = 'تأكيد حذف الفعالية'
  deleteModalMessage.value = `هل أنت متأكد من حذف الفعالية "${event.title}"؟ هذا الإجراء لا يمكن التراجع عنه.`
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedEvent.value = null
}

const handleEventSaved = (updatedEvent) => {
  console.log('handleEventSaved called with:', updatedEvent)
  
  // إغلاق المودال (لو لم يتم إغلاقه تلقائياً)
  closeEditModal();
  
  // إظهار الإشعار
  showToast('نجاح', 'تم تحديث الفعالية بنجاح', 'success');
  
  // إعادة تحميل البيانات
  fetchEvents();
}

const confirmDelete = async () => {
  if (!selectedEvent.value) return
  
  try {
    await api.delete(`/admin/events/${selectedEvent.value.id}`)
    showToast('نجاح', 'تم حذف الفعالية بنجاح', 'success')
    // إعادة تحميل البيانات بعد الحذف
    fetchEvents()
  } catch (error) {
    console.error('Error deleting event:', error)
    showToast('خطأ', 'حدث خطأ أثناء حذف الفعالية', 'error')
  } finally {
    closeDeleteModal()
  }
}

// الدوال المساعدة (تبقى كما هي)
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

const getSeatsClass = (available, capacity) => {
  if (available <= 0) return 'text-red-600 font-bold'
  if (available / capacity < 0.2) return 'text-orange-600 font-semibold'
  return 'text-green-600'
}

const statusClass = (status) => {
  const classes = {
    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getStatusText = (status) => {
  const texts = {
    published: 'منشور',
    draft: 'مسودة',
    cancelled: 'ملغي'
  }
  return texts[status] || status
}

const getCategoryText = (category) => {
  const texts = {
    concert: 'حفلات',
    conference: 'مؤتمرات',
    workshop: 'ورش عمل'
  }
  return texts[category] || category
}

// مشاهدة التغييرات
watch(() => filters.value.per_page, (newValue) => {
  if (newValue) {
    filters.value.page = 1 // العودة للصفحة الأولى عند تغيير عدد العناصر
    fetchEvents()
  }
})

onMounted(() => {
  // تهيئة الفلاتر بالقيم الافتراضية
  filters.value = {
    page: 1,
    per_page: 15,
    sort_by: 'created_at',
    sort_order: 'desc',
    ...filters.value
  }
  fetchEvents()
})
</script>