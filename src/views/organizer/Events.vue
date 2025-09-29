<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">إدارة الفعاليات</h1>
      <button 
        @click="openCreateModal"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <i class="fas fa-plus ml-2"></i>
        إنشاء فعالية جديدة
      </button>
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
              <th class="px-4 py-3 text-right">التاريخ البدايه</th>
              <th class="px-4 py-3 text-right">المقاعد</th>
              <th class="px-4 py-3 text-right">الطلبات</th>
              <th class="px-4 py-3 text-right">تاريخ النهايه</th>
              <th class="px-4 py-3 text-right">الحالة</th>
              <th class="px-4 py-3 text-center">الإجراءات</th>
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
                  <img :src="event.image || '/placeholder-image.jpg'" :alt="event.title" class="h-10 w-10 rounded object-cover ml-3">
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">{{ event.title }}</p>
                    <p class="text-sm text-gray-500">{{ getCategoryText(event.category) }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-green-600 dark:text-white">{{ formatDate(event.start_date) }}</td>
              <td class="px-4 py-3">
                <span :class="getSeatsClass(event.available_seats, event.capacity)">
                  {{ event.available_seats }}/{{ event.capacity }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-900 dark:text-white">{{ event.orders_count || 0 }}</td>
              <td class="px-4 py-3">
                <span class="font-bold text-green-600 dark:text-white">{{ formatDate(event.end_date) }}</span>
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs rounded-full" :class="statusClass(event.status)">
                  {{ getStatusText(event.status) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex space-x-2 space-x-reverse gap-3">
                  <button 
                    @click="openViewModal(event.id)"
                    class="text-blue-600 hover:text-blue-800"
                    title="عرض"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button 
                    @click="openEditModal(event)"
                    class="text-green-600 hover:text-green-800"
                    title="تعديل"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="openStatusModal(event)"
                    class="text-yellow-600 hover:text-yellow-800"
                    title="تغيير الحالة"
                  >
                    <i class="fas fa-exchange-alt"></i>
                  </button>
                  <button 
                    @click="openDeleteModal(event)"
                    class="text-red-600 hover:text-red-800"
                    title="حذف"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                      <router-link 
                      :to="{ name: 'OrganizerAttendees', params: { id: event.id } }"
                      class="text-blue-600 hover:text-blue-800"
                      title="عرض الحضور"
                    >
                      <i class="fas fa-users"></i>
                    </router-link>
                    <button 
                      @click="openReviewsModal(event)"
                      class="text-purple-600 hover:text-purple-800"
                      title="عرض التقييمات"
                    >
                      <i class="fas fa-star"></i>
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
    
    <!-- Modals -->
    <ViewModal
      :show="showViewModal"
      :eventId="selectedEventId"
      @close="closeViewModal"
    />

    <EventFormModal
      :show="showFormModal"
      :event="selectedEvent"
      @close="closeFormModal"
      @saved="handleFormSaved"
    />

    <StatusModal
      :show="showStatusModal"
      :event="selectedEvent"
      @close="closeStatusModal"
      @status-updated="handleStatusUpdated"
    />

    <DeleteModal
      :show="showDeleteModal"
      :event="selectedEvent"
      @close="closeDeleteModal"
      @confirmed="handleDeleteConfirmed"
    />

          <!-- Reviews Modal -->
<div v-if="showReviewsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
    <div class="flex justify-between items-center p-4 border-b dark:border-gray-700">
      <h3 class="text-lg font-bold text-gray-900 dark:text-white">
        تقييمات الفعالية: {{ selectedEvent?.title }}
      </h3>
      <button @click="closeReviewsModal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400">
        <i class="fas fa-times text-xl"></i>
      </button>
    </div>
    
    <div class="p-4 max-h-[60vh] overflow-y-auto">
      <!-- إحصائيات التقييمات -->
      <div v-if="reviewsStats" class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-2xl font-bold text-yellow-600">{{ reviewsStats.average_rating }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">متوسط التقييم</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-blue-600">{{ reviewsStats.total_reviews }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">إجمالي التقييمات</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-green-600">{{ reviewsStats.rating_distribution[5] || 0 }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-300">تقييم 5 نجوم</p>
          </div>
        </div>
      </div>

      <!-- قائمة التقييمات -->
      <div v-if="reviewsLoading" class="text-center py-8">
        <i class="fas fa-spinner fa-spin text-2xl text-blue-600"></i>
        <p class="mt-2 text-gray-600 dark:text-gray-300">جاري تحميل التقييمات...</p>
      </div>

      <div v-else-if="reviews.length === 0" class="text-center py-8 text-gray-500">
        <i class="fas fa-star text-3xl mb-2"></i>
        <p>لا توجد تقييمات لهذه الفعالية بعد</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="review in reviews" :key="review.id" class="border-b dark:border-gray-600 pb-4">
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center">
              <img :src="review.user?.avatar || '/default-avatar.png'" 
                   :alt="review.user?.name" 
                   class="h-8 w-8 rounded-full ml-3">
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">{{ review.user?.name }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(review.created_at) }}</p>
              </div>
            </div>
            <div class="flex items-center">
              <span class="text-yellow-500 mr-1">
                <i class="fas fa-star" v-for="n in 5" :key="n" 
                   :class="n <= review.rating ? 'text-yellow-500' : 'text-gray-300'"></i>
              </span>
              <span class="text-sm text-gray-600 dark:text-gray-300">({{ review.rating }})</span>
            </div>
          </div>
          
          <p v-if="review.comment" class="text-gray-700 dark:text-gray-300 mt-2">
            {{ review.comment }}
          </p>
          
          <p v-else class="text-gray-500 text-sm mt-2">
            لا يوجد تعليق
          </p>
        </div>
      </div>

      <!-- ترقيم التقييمات -->
          <div v-if="reviewsMeta && reviewsMeta.total > reviewsMeta.per_page" class="mt-4 flex justify-center">
            <div class="flex space-x-2">
              <button 
                @click="loadReviewsPage(reviewsMeta.current_page - 1)"
                :disabled="reviewsMeta.current_page === 1"
                class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50"
              >
                السابق
              </button>
              <span class="px-3 py-1 text-sm text-gray-600 dark:text-gray-300">
                الصفحة {{ reviewsMeta.current_page }} من {{ reviewsMeta.last_page }}
              </span>
              <button 
                @click="loadReviewsPage(reviewsMeta.current_page + 1)"
                :disabled="reviewsMeta.current_page === reviewsMeta.last_page"
                class="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t dark:border-gray-700 flex justify-end">
          <button 
            @click="closeReviewsModal"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useTableFilter } from '@/composables/useTableFilter'
import { useExcelExport } from '@/composables/useExcelExport'
import api from '@/services/api'
import { showToast } from '@/utils/toast'
import FilterBar from '@/components/Table/FilterBar.vue'
import ExportButton from '@/components/Table/ExportButton.vue'
import StatusModal from '@/components/Organizer/events/StatusModal.vue'
import DeleteModal from '@/components/Organizer/events/DeleteModal.vue'
import ViewModal from '@/components/Organizer/events/ViewModal.vue'
import EventFormModal from '@/components/Organizer/events/EventFormModal.vue'

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
const selectedEvent = ref(null)
const selectedEventId = ref(null)
const showViewModal = ref(false)
const showFormModal = ref(false)
const showStatusModal = ref(false)
const showDeleteModal = ref(false)
const showReviewsModal = ref(false)
const reviews = ref([])
const reviewsLoading = ref(false)
const reviewsMeta = ref(null)
const reviewsStats = ref(null)
// تكوين الفلترة
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

// الدوال الرئيسية
const fetchEvents = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    
    // إضافة جميع الفلاتر مع قيمها الافتراضية
    const defaultFilters = {
      page: 1,
      per_page: 15,
      sort_by: 'start_date',
      sort_order: 'desc'
    }
    
    const allFilters = { ...defaultFilters, ...filters }
    
    Object.keys(allFilters).forEach(key => {
      if (allFilters[key] !== null && allFilters[key] !== undefined && allFilters[key] !== '') {
        params.append(key, allFilters[key])
      }
    })

    const response = await api.get(`/organizer/events?${params}`)
    
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
      delete filters[key]
    } else {
      filters[key] = newFilters[key]
    }
  })
}

const applyFilters = () => {
  filters.page = 1 // العودة للصفحة الأولى عند تطبيق الفلترة
  fetchEvents()
}

const goToPage = (page) => {
  if (page === '...' || page < 1 || page > meta.value.last_page) return
  filters.page = page
  fetchEvents()
}

const resetFilters = () => {
  resetTableFilters()
  Object.keys(filters).forEach(key => {
    if (key !== 'per_page') {
      filters[key] = key === 'sort_by' ? 'start_date' : key === 'sort_order' ? 'desc' : ''
    }
  })
  filters.page = 1
  fetchEvents()
}

const handleExport = async (type) => {
  try {
    let dataToExport = []
    
    // لتصدير جميع البيانات، نحتاج لجلبها جميعاً من السيرفر
    if (type === 'all') {
      const params = new URLSearchParams()
      Object.keys(filters).forEach(key => {
        if (key !== 'page' && key !== 'per_page' && filters[key]) {
          params.append(key, filters[key])
        }
      })
      params.append('per_page', meta.value.total) // جلب جميع البيانات
      
      const response = await api.get(`/organizer/events?${params}`)
      dataToExport = response.data.data || []
    } else if (type === 'selected') {
      dataToExport = events.value.filter(event => selectedEvents.value.includes(event.id))
    } else {
      dataToExport = [...events.value]
    }

    const columns = [
      { key: 'title', header: 'اسم الفعالية', width: 30 },
      { key: 'category', header: 'الفئة', width: 15, formatter: getCategoryText },
      { key: 'start_date', header: 'تاريخ البدء', width: 15, formatter: formatDateForExport },
      { key: 'end_date', header: 'تاريخ النهاية', width: 15, formatter: (val) => val ? formatDateForExport(val) : '-' },
      { key: 'available_seats', header: 'المقاعد المتاحة', width: 15 },
      { key: 'capacity', header: 'السعة الكلية', width: 15 },
      { key: 'orders_count', header: 'عدد الطلبات', width: 15 },
      { key: 'revenue', header: 'الإيرادات', width: 15, formatter: calculateRevenue },
      { key: 'status', header: 'الحالة', width: 10, formatter: getStatusText },
      { key: 'location', header: 'المكان', width: 20, formatter: (val) => val || 'غير محدد' },
      { key: 'price', header: 'السعر', width: 15, formatter: (val) => val ? `${val} ر.س` : 'مجاني' },
      { key: 'created_at', header: 'تاريخ الإنشاء', width: 15, formatter: formatDateForExport },
      { 
        key: 'average_rating', 
        header: 'متوسط التقييم', 
        width: 15, 
        formatter: (event) => {
          // يمكنك إضافة حساب متوسط التقييم هنا
          return event.average_rating || 'لا يوجد'
        } 
      },
      { 
        key: 'total_reviews', 
        header: 'عدد التقييمات', 
        width: 15,
        formatter: (event) => event.total_reviews || 0
      }
    ]

    await exportToExcel(dataToExport, columns, 'الفعاليات')
    showToast('نجاح', `تم تصدير ${dataToExport.length} فعالية بنجاح`, 'success')
  } catch (error) {
    showToast('خطأ', error.message || 'حدث خطأ أثناء التصدير', 'error')
  }
}

// دوال إدارة Modals
const openStatusModal = (event) => {
  selectedEvent.value = event
  showStatusModal.value = true
}

const closeStatusModal = () => {
  showStatusModal.value = false
  selectedEvent.value = null
}

const openDeleteModal = (event) => {
  selectedEvent.value = event
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedEvent.value = null
}

const openViewModal = (eventId) => {
  selectedEventId.value = eventId
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  selectedEventId.value = null
}

const openEditModal = (event) => {
  selectedEvent.value = event
  showFormModal.value = true
}

const openCreateModal = () => {
  selectedEvent.value = null
  showFormModal.value = true
}

const closeFormModal = () => {
  showFormModal.value = false
  selectedEvent.value = null
}

const openReviewsModal = async (event) => {
  selectedEvent.value = event
  showReviewsModal.value = true
  await fetchReviews()
  await fetchReviewsStats()
}

const closeReviewsModal = () => {
  showReviewsModal.value = false
  selectedEvent.value = null
  reviews.value = []
  reviewsMeta.value = null
  reviewsStats.value = null
}

const fetchReviews = async (page = 1) => {
  if (!selectedEvent.value) return
  
  reviewsLoading.value = true
  try {
    const response = await api.get(`/organizer/events/${selectedEvent.value.id}/reviews?page=${page}`)
    reviews.value = response.data.data
    reviewsMeta.value = response.data.meta
  } catch (error) {
    console.error('Error fetching reviews:', error)
    showToast('خطأ', 'فشل في تحميل التقييمات', 'error')
  } finally {
    reviewsLoading.value = false
  }
}

const fetchReviewsStats = async () => {
  if (!selectedEvent.value) return
  
  try {
    // يمكنك إنشاء API endpoint خاص بالإحصائيات أو حسابها من التقييمات
    const response = await api.get(`/organizer/events/${selectedEvent.value.id}/reviews`)
    const allReviews = response.data.data
    
    // حساب الإحصائيات
    const totalReviews = allReviews.length
    const averageRating = totalReviews > 0 
      ? (allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1)
      : 0
    
    const ratingDistribution = {
      5: allReviews.filter(r => r.rating === 5).length,
      4: allReviews.filter(r => r.rating === 4).length,
      3: allReviews.filter(r => r.rating === 3).length,
      2: allReviews.filter(r => r.rating === 2).length,
      1: allReviews.filter(r => r.rating === 1).length
    }
    
    reviewsStats.value = {
      average_rating: averageRating,
      total_reviews: totalReviews,
      rating_distribution: ratingDistribution
    }
  } catch (error) {
    console.error('Error fetching reviews stats:', error)
  }
}

const loadReviewsPage = (page) => {
  fetchReviews(page)
}

// دالة مساعدة لتنسيق التاريخ
const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleFormSaved = () => {
  fetchEvents()
  showToast('نجاح', 'تم حفظ الفعالية بنجاح', 'success')
}

const handleStatusUpdated = () => {
  fetchEvents()
  closeStatusModal()
  showToast('نجاح', 'تم تحديث حالة الفعالية بنجاح', 'success')
}

const handleDeleteConfirmed = async () => {
  try {
    await api.delete(`/organizer/events/${selectedEvent.value.id}`)
    showToast('نجاح', 'تم حذف الفعالية بنجاح', 'success')
    fetchEvents()
  } catch (error) {
    console.error('Error deleting event:', error)
    showToast('خطأ', 'فشل في حذف الفعالية', 'error')
  } finally {
    closeDeleteModal()
  }
}

// الدوال المساعدة
const formatDateForExport = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// const formatDate = (dateString) => {
//   if (!dateString) return '-'
//   return new Date(dateString).toLocaleDateString('ar-SA')
// }

const getCategoryText = (category) => {
  const categories = {
    music: 'موسيقى',
    sports: 'رياضة',
    conference: 'مؤتمر',
    workshop: 'ورشة عمل',
    exhibition: 'معرض',
    festival: 'موسيقى',
    concert: 'معرض'
  }
  return categories[category] || category
}

const getSeatsClass = (available, capacity) => {
  const percentage = (available / capacity) * 100
  if (percentage === 0) return 'text-red-600 font-bold'
  if (percentage < 20) return 'text-yellow-600 font-bold'
  return 'text-pink-600'
}

const calculateRevenue = (event) => {
  // حساب الإيرادات بناءً على الطلبات المكتملة
  // هذا مثال بسيط، يمكن تطويره حسب احتياجاتك
  return event.revenue ? `${event.revenue} ر.س` : '٠ ر.س'
}

const statusClass = (status) => {
  const classes = {
    published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getStatusText = (status) => {
  const texts = {
    published: 'منشور',
    draft: 'مسودة',
    cancelled: 'ملغي',
    completed: 'مكتمل'
  }
  return texts[status] || status
}

// مشاهدة التغييرات
watch(() => filters.per_page, (newValue) => {
  if (newValue) {
    filters.page = 1 // العودة للصفحة الأولى عند تغيير عدد العناصر
    fetchEvents()
  }
})

onMounted(() => {
  // تهيئة الفلاتر بالقيم الافتراضية
  filters.page = 1
  filters.per_page = 15
  filters.sort_by = 'start_date'
  filters.sort_order = 'desc'
  fetchEvents()
})
</script>