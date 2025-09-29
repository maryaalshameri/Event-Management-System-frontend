<template>
  <div class="container mx-auto px-4 py-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">لوحة تحكم المنظم</h1>
      <p class="text-gray-600 dark:text-gray-400">نظرة عامة على فعالياتك وأدائك</p>
    </div>

    <!-- إحصائيات سريعة -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
            <i class="fas fa-calendar text-xl"></i>
          </div>
          <div class="mr-3">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي الفعاليات</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total_events || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
            <i class="fas fa-check-circle text-xl"></i>
          </div>
          <div class="mr-3">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">فعاليات منشورة</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.published_events || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
          <i class="fas fa-star text-xl"></i>
        </div>
        <div class="mr-3">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">متوسط التقييمات</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ reviewStats.average_rating || '0.0' }}/5</p>
          <p class="text-xs text-gray-500">{{ reviewStats.total_reviews || 0 }} تقييم</p>
        </div>
      </div>
    </div>



      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
            <i class="fas fa-ticket-alt text-xl"></i>
          </div>
          <div class="mr-3">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي الطلبات</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total_orders || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
            <i class="fas fa-money-bill-wave text-xl"></i>
          </div>
          <div class="mr-3">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">إجمالي الإيرادات</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(stats.total_revenue) }}</p>
          </div>
        </div>
      </div>
    </div>


    
    <!-- بعد قسم الإحصائيات السريعة -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <!-- بطاقة متوسط التقييم -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-3">
        <i class="fas fa-star text-yellow-600 dark:text-yellow-300 text-xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">متوسط التقييم</h3>
      <p class="text-3xl font-bold text-yellow-600 mt-2">{{ reviewStats.average_rating || '0.0' }}</p>
      <p class="text-sm text-gray-500 mt-1">من 5 نجوم</p>
    </div>
  </div>

  <!-- بطاقة إجمالي التقييمات -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mb-3">
        <i class="fas fa-comment-alt text-blue-600 dark:text-blue-300 text-xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">إجمالي التقييمات</h3>
      <p class="text-3xl font-bold text-blue-600 mt-2">{{ reviewStats.total_reviews || 0 }}</p>
      <p class="text-sm text-gray-500 mt-1">تقييم</p>
    </div>
  </div>

  <!-- بطاقة التقييمات الإيجابية -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mb-3">
        <i class="fas fa-thumbs-up text-green-600 dark:text-green-300 text-xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">تقييمات 5 نجوم</h3>
      <p class="text-3xl font-bold text-green-600 mt-2">{{ reviewStats.five_star_reviews || 0 }}</p>
      <p class="text-sm text-gray-500 mt-1">تقييم إيجابي</p>
    </div>
  </div>
</div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- الفعاليات الأخيرة -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-4 border-b dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">الفعاليات الأخيرة</h2>
        </div>
        <div class="p-4">
          <div v-if="recentEvents.length === 0" class="text-center py-4 text-gray-500">
            <i class="fas fa-calendar-times text-3xl mb-2"></i>
            <p>لا توجد فعاليات بعد</p>
            <router-link to="/organizer/events/create" class="text-blue-600 hover:text-blue-800 mt-2 inline-block">
              إنشاء فعالية جديدة
            </router-link>
          </div>
          <div v-else class="space-y-3">
            <div v-for="event in recentEvents" :key="event.id" class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
              <div class="flex items-center">
                <img :src="event.image || '/placeholder-image.jpg'" :alt="event.title" class="h-10 w-10 rounded object-cover ml-3">
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ event.title }}</p>
                  <p class="text-sm text-gray-500">{{ formatDate(event.start_date) }}</p>
                </div>
              </div>
              <span class="px-2 py-1 text-xs rounded-full" :class="statusClass(event.status)">
                {{ getStatusText(event.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- الطلبات الأخيرة -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="p-4 border-b dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">الطلبات الأخيرة</h2>
        </div>
        <div class="p-4">
          <div v-if="recentOrders.length === 0" class="text-center py-4 text-gray-500">
            <i class="fas fa-shopping-cart text-3xl mb-2"></i>
            <p>لا توجد طلبات بعد</p>
          </div>
          <div v-else class="space-y-3">
            <div v-for="order in recentOrders" :key="order.id" class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
              <div>
                <p class="font-medium text-gray-900 dark:text-white">طلب #{{ order.id }}</p>
                <p class="text-sm text-gray-500">{{ order.user?.name }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-green-600">{{ formatCurrency(order.total_amount) }}</p>
                <span class="px-2 py-1 text-xs rounded-full" :class="paymentStatusClass(order.payment_status)">
                  {{ getPaymentStatusText(order.payment_status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- إجراءات سريعة -->
    <div class="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">إجراءات سريعة</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link 
          to="/organizer/events/create" 
          class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 ml-3">
            <i class="fas fa-plus"></i>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">إنشاء فعالية جديدة</p>
            <p class="text-sm text-gray-500">ابدأ بإنشاء فعالية جديدة</p>
          </div>
        </router-link>

        <router-link 
          to="/organizer/events" 
          class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <div class="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 ml-3">
            <i class="fas fa-list"></i>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">إدارة الفعاليات</p>
            <p class="text-sm text-gray-500">عرض وتعديل فعالياتك</p>
          </div>
        </router-link>

        <router-link 
          to="/organizer/orders" 
          class="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 ml-3">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">عرض الطلبات</p>
            <p class="text-sm text-gray-500">إدارة طلبات التذاكر</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'

const stats = ref({})
const reviewStats = ref({}) 
const recentEvents = ref([])
const recentOrders = ref([])
const loading = ref(false)

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const [statsResponse, reviewStatsResponse, eventsResponse, ordersResponse] = await Promise.all([
      api.get('/organizer/dashboard/stats'),
      api.get('/organizer/dashboard/review-stats'),
      api.get('/organizer/dashboard/recent-events?limit=5'),
      api.get('/organizer/dashboard/recent-orders?limit=5')
    ])

    stats.value = statsResponse.data
    reviewStats.value = reviewStatsResponse.data
    recentEvents.value = eventsResponse.data
    recentOrders.value = ordersResponse.data
    
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    
    // تسجيل تفاصيل الخطأ للمساعدة في التشخيص
    console.log('Error details:', error.response?.data || error.message)
    
    showToast('خطأ', 'فشل في تحميل بيانات لوحة التحكم', 'error')
  } finally {
    loading.value = false
  }
}

const formatCurrency = (amount) => {
  if (!amount) return '٠ ر.س'
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ar-SA')
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

const paymentStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
}

const getPaymentStatusText = (status) => {
  const texts = {
    pending: 'قيد الانتظار',
    completed: 'مكتمل',
    failed: 'فاشل'
  }
  return texts[status] || status
}

onMounted(() => {
  fetchDashboardData()
})
</script>