<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16 md:pb-0">
    <div class="container mx-auto px-4 py-6">
      <!-- شريط البحث والفلترة -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- بحث -->
          <div class="flex-1">
            <div class="relative">
              <input
                v-model="filters.search"
                type="text"
                placeholder="ابحث عن فعالية..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
              >
              <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
            </div>
          </div>

          <!-- فلترة المدينة -->
          <div class="w-full md:w-48">
            <select
              v-model="filters.city"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">جميع المدن</option>
              <option value="الرياض">الرياض</option>
              <option value="جدة">جدة</option>
              <option value="الدمام">الدمام</option>
            </select>
          </div>

          <!-- فلترة الفئة -->
          <div class="w-full md:w-48">
            <select
              v-model="filters.category"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            >
                         <option value="">جميع الفئات </option>
                           <option value="festival">موسيقى</option>
                          <option value="sports">رياضة</option>
                          <option value="conference">مؤتمر</option>
                          <option value="workshop">ورشة عمل</option>
                          <option value="concert">معرض</option>
            </select>
          </div>

          <!-- زر البحث -->
          <button
            @click="applyFilters"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center justify-center"
          >
            <i class="fas fa-search ml-2"></i>
            بحث
          </button>
        </div>
      </div>

      <!-- حالة التحميل -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <i class="fas fa-spinner fa-spin text-3xl text-indigo-600"></i>
        <span class="mr-3 text-gray-600 dark:text-gray-300">جاري تحميل الفعاليات...</span>
      </div>

      <!-- قائمة الفعاليات -->
      <div v-else-if="eventsData && eventsData.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="event in eventsData"
          :key="event.id "
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
               <div class="relative h-48 overflow-hidden">
              

             <img
                  :src="`http://127.0.0.1:8000/storage/${event.image}`"
                  :alt="event?.title || 'فعالية'"
                  class="w-full h-full object-cover"
                />
            <div class="absolute top-3 left-3">
              <span class="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full">
                {{ getCategoryText(event?.category) }}
              </span>
            </div>
            <div class="absolute top-3 right-3">
              <span class="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                {{ formatDate(event?.start_date) }}
              </span>
            </div>
          </div>

          <!-- محتوى البطاقة -->
          <div class="p-4">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
              {{ event?.title || 'عنوان غير متوفر' }}
            </h3>
            
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
              {{ event?.description || 'لا يوجد وصف' }}
            </p>

            <!-- الموقع -->
            <div class="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
              <i class="fas fa-map-marker-alt ml-2"></i>
              <span>{{ event?.location || 'موقع غير محدد' }}</span>
            </div>

            <!-- السعر والمقاعد -->
            <div class="flex justify-between items-center mb-4">
              <div class="text-indigo-600 font-bold">
                {{ event?.price > 0 ? `${event.price} ر.س` : 'مجاني' }}
              </div>
              <div class="text-sm text-gray-500">
                {{ event?.capacity || 0 }} مقاعد متاحة
              </div>
            </div>

            <!-- الأزرار -->
            <div class="flex space-x-2 space-x-reverse gap-4">
              <router-link
                v-if="event?.id"
                :to="{ name: 'EventDetails', params: { id: event.id } }"
                class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
              >
                التفاصيل
              </router-link>
              <button
                v-if="event?.id && event?.capacity > 0"
                @click="quickBook(event)"
                class="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
              >
                حجز
              </button>
              <div v-else class="flex-1"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- عدم وجود نتائج -->
      <div v-else-if="!loading" class="text-center py-12">
        <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
          لا توجد فعاليات
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-4">
          لم نعثر على فعاليات تطابق معايير البحث
        </p>
        <button
          @click="resetFilters"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
        >
          عرض جميع الفعاليات
        </button>
      </div>

      <!-- الترقيم -->
      <div v-if="meta && meta.last_page > 1" class="mt-8 flex justify-center">
        <div class="flex space-x-2">
          <button
            @click="goToPage(meta.current_page - 1)"
            :disabled="meta.current_page === 1"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            السابق
          </button>
          
          <button
            v-for="page in pages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-4 py-2 rounded-lg',
              page === meta.current_page
                ? 'bg-indigo-600 text-white'
                : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            ]"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>

          <button
            @click="goToPage(meta.current_page + 1)"
            :disabled="meta.current_page === meta.last_page"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

const router = useRouter()

// المتغيرات التفاعلية
const eventsData = ref([]) // تغيير الاسم ليكون أكثر وضوحاً
const loading = ref(false)
const meta = ref({})
const filters = ref({
  search: '',
  city: '',
  category: '',
  sort_by: 'start_date',
  sort_order: 'asc',
  page: 1,
  per_page: 12
})
const getImageUrl = (event) => {
  if (!event) return '/placeholder-event.jpg';
  
  console.log('بيانات الفعالية:', event);
  
  // ✅ الأولوية للـ image_url من السيرفر
  if (event.image_url) {
    console.log('استخدام image_url من السيرفر:', event.image_url);
    return event.image_url;
  }
  
  // ✅ إذا لم يكن image_url موجوداً، ابن الرابط بنفس الطريقة
  if (event.image) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const imageUrl = `${baseUrl}/storage/${event.image}`;
    console.log('بناء الرابط يدوياً:', imageUrl);
    return imageUrl;
  }
  
  return '/placeholder-event.jpg';
}

const handleImageError = (event) => {
  console.log('خطأ في تحميل الصورة:', event.target.src)
  event.target.src = '/placeholder-event.jpg'
}
// computed properties
const pages = computed(() => {
  if (!meta.value || meta.value.last_page <= 1) return []
  
  const totalPages = meta.value.last_page
  const currentPage = meta.value.current_page
  const delta = 2
  
  let range = []
  
  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    range.push(i)
  }
  
  if (currentPage - delta > 2) range.unshift('...')
  if (currentPage + delta < totalPages - 1) range.push('...')
  
  range.unshift(1)
  if (totalPages > 1) range.push(totalPages)
  
  return range
})

// الدوال
const fetchEvents = async () => {
  loading.value = true
  try {
    console.log('جاري جلب الفعاليات...')
    const params = new URLSearchParams()
    Object.keys(filters.value).forEach(key => {
      if (filters.value[key]) {
        params.append(key, filters.value[key])
      }
    })

    // استخدم المسار الصحيح
    const response = await api.get(`/attendee/events?${params}`)
    console.log('الاستجابة:', response)
    console.log('البيانات:', response.data)
    
    // معالجة البيانات بشكل صحيح
    if (response.data && response.data.success) {
      // البيانات تأتي في response.data.data
      const responseData = response.data.data
      
      if (Array.isArray(responseData.data)) {
        // إذا كانت البيانات في response.data.data.data (Pagination)
        eventsData.value = responseData.data
        meta.value = {
          current_page: responseData.current_page,
          last_page: responseData.last_page,
          per_page: responseData.per_page,
          total: responseData.total,
          from: responseData.from,
          to: responseData.to
        }
      } else if (Array.isArray(responseData)) {
        // إذا كانت البيانات مباشرة مصفوفة
        eventsData.value = responseData
        meta.value = {}
      } else {
        console.warn('هيكل البيانات غير متوقع:', responseData)
        eventsData.value = []
        meta.value = {}
      }
      
      console.log('الفعاليات المحملة:', eventsData.value)
      console.log('الميتاداتا:', meta.value)
    } else {
      console.warn('لا توجد بيانات في الاستجابة أو success=false')
      eventsData.value = []
      meta.value = {}
    }
    
  } catch (error) {
    console.error('Error details:', error)
    console.error('Error response:', error.response)
    
    // عرض تفاصيل الخطأ
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
      console.error('Headers:', error.response.headers)
      
      if (error.response.status === 401) {
        showToast('خطأ', 'غير مصرح بالدخول، يرجى تسجيل الدخول مرة أخرى', 'error')
        // توجيه إلى صفحة تسجيل الدخول
        router.push('/login')
      } else if (error.response.status === 404) {
        showToast('خطأ', 'المسار غير موجود', 'error')
      } else {
        showToast('خطأ', error.response.data?.message || 'فشل في تحميل الفعاليات', 'error')
      }
    } else if (error.request) {
      console.error('No response received:', error.request)
      showToast('خطأ', 'لا يمكن الاتصال بالخادم', 'error')
    } else {
      console.error('Error message:', error.message)
      showToast('خطأ', 'حدث خطأ غير متوقع', 'error')
    }
    
    eventsData.value = []
    meta.value = {}
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  filters.value.page = 1
  fetchEvents()
}

const resetFilters = () => {
  filters.value = {
    search: '',
    city: '',
    category: '',
    sort_by: 'start_date',
    sort_order: 'asc',
    page: 1,
    per_page: 12
  }
  fetchEvents()
}

const goToPage = (page) => {
  if (page === '...' || page < 1 || page > meta.value.last_page) return
  filters.value.page = page
  fetchEvents()
}

const quickBook = (event) => {
  if (event?.id) {
    router.push({ name: 'EventDetails', params: { id: event.id } })
  } else {
    showToast('خطأ', 'لا يمكن الوصول إلى تفاصيل الفعالية', 'error')
  }
}

const getCategoryText = (category) => {
  const categories = {
    festival: 'موسيقى',
    sports: 'رياضة',
    conference: 'مؤتمر',
    workshop: 'ورشة عمل',
    concert: 'معرض'
  }
  return categories[category] || category || 'غير محدد'
}

const formatDate = (dateString) => {
  if (!dateString) return 'غير محدد'
  try {
    return new Date(dateString).toLocaleDateString('ar-SA')
  } catch (error) {
    return 'تاريخ غير صالح'
  }
}



onMounted(() => {
  fetchEvents()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>