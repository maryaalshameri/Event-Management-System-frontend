<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 pt-20 pb-16 md:pb-0">
    <div class="container mx-auto px-4 py-6">
      <!-- رأس الصفحة -->
      <div class="mb-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
          <i class="fas fa-ticket-alt text-2xl text-indigo-600 dark:text-indigo-400"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">تذاكري</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">إدارة التذاكر المشتراة وحالة الحضور في مكان واحد</p>
      </div>

      <!-- حالة التحميل -->
      <div v-if="loading" class="flex flex-col justify-center items-center py-16">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <i class="fas fa-ticket-alt absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600"></i>
        </div>
        <span class="mt-4 text-lg text-gray-600 dark:text-gray-300">جاري تحميل التذاكر...</span>
      </div>

      <!-- قائمة التذاكر -->
      <div v-else class="space-y-6">
        <!-- فلترة وترتيب التذاكر -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="flex items-center">
              <i class="fas fa-filter text-gray-500 ml-2"></i>
              <span class="text-gray-700 dark:text-gray-300">فلترة التذاكر:</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="filter in filters" 
                :key="filter.id"
                @click="setActiveFilter(filter.id)"
                class="px-4 py-2 rounded-lg text-sm transition-all duration-200"
                :class="activeFilter === filter.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'"
              >
                {{ filter.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- ✅ استخدام v-for مع v-if بشكل صحيح -->
        <template v-for="order in filteredOrders" :key="order.id">
          <div v-if="isValidOrder(order)" class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
            
            <!-- رأس الطلب -->
            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5 relative">
              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div class="flex items-start space-x-4 space-x-reverse gap-3">
                  <div class="bg-white bg-opacity-20 p-2 rounded-lg">
                    <i class="fas fa-calendar-alt text-rose-900 text-lg"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-white text-xl">
                      {{ order.event?.title || 'فعالية غير معروفة' }}
                    </h3>
                    <div class="flex items-center mt-2 text-indigo-100">
                      <i class="fas fa-map-marker-alt ml-1 text-sm"></i>
                      <span class="text-sm">{{ order.event?.location || 'موقع غير محدد' }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col md:items-end mt-4 md:mt-0 space-y-2">
                  <div class="flex items-center space-x-2 space-x-reverse">
                    <span class="px-3 py-1 bg-white bg-opacity-20 text-shadow-teal-600 text-sm rounded-full backdrop-blur-sm">
                      {{ formatDate(order.event?.start_date) }}
                    </span>
                  </div>
                  <div class="flex items-center space-x-2 space-x-reverse gap-3">
                    <span class="px-3 py-1 bg-white text-indigo-600 text-sm font-medium rounded-full shadow-sm">
                      {{ getOrderStatusText(order.status) }}
                    </span>
                    <span class="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full shadow-sm">
                      {{ getPaymentStatusText(order.payment_status) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- محتوى الطلب -->
            <div class="p-6">
              <!-- التذاكر -->
              <div class="mb-6">
                <div class="flex items-center mb-4">
                  <i class="fas fa-ticket-alt text-indigo-500 ml-2"></i>
                  <h4 class="font-semibold text-gray-900 dark:text-white">التذاكر المشتراة</h4>
                  <span class="mr-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                    {{ order.tickets?.length || 0 }}
                  </span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <!-- ✅ التحقق من order.tickets -->
                  <div v-for="ticket in (order.tickets || [])" :key="ticket.id"
                       class="border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md bg-white dark:bg-gray-800">
                    <div class="flex justify-between items-start mb-3">
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white flex items-center">
                          <i class="fas fa-user ml-2 text-indigo-500 text-sm"></i>
                          {{ getTicketTypeText(ticket.order_item?.ticket_type?.name) }}
                        </p>
                        <p class="text-sm text-gray-500 mt-1 font-mono">{{ ticket.code }}</p>
                      </div>
                      <span class="px-2 py-1 text-xs rounded-full flex items-center"
                            :class="ticket.used_at ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'">
                        <i class="fas fa-circle text-xs ml-1" :class="ticket.used_at ? 'text-red-500' : 'text-green-500'"></i>
                        {{ ticket.used_at ? 'مستخدمة' : 'نشطة' }}
                      </span>
                    </div>
                    
                    <div class="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3 flex justify-between items-center">
                      <button
                        @click="downloadTicket(ticket.id)"
                        class="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm flex items-center transition-colors duration-200"
                      >
                        <i class="fas fa-download ml-1"></i>
                        تحميل PDF
                      </button>
                      <button
                        v-if="!ticket.used_at"
                        @click="showQRCode(ticket)"
                        class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm flex items-center transition-colors duration-200"
                      >
                        <i class="fas fa-qrcode ml-1"></i>
                        عرض QR
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- الإجراءات -->
              <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <button
                    @click="downloadAllTickets(order.id)"
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <i class="fas fa-download ml-2"></i>
                    تحميل جميع التذاكر
                  </button>
                  
                  <!-- ✅ زر التقييم - تم التصحيح -->
                  <button
                    v-if="canReview(order)"
                    @click="openReviewModal(order)"
                    class="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl flex items-center text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <i class="fas fa-star ml-2"></i>
                    تقييم الفعالية
                  </button>

                  <router-link
                    v-if="order.event && order.event.id"
                    :to="{ name: 'EventDetails', params: { id: order.event.id } }"
                    class="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl flex items-center text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <i class="fas fa-eye ml-2"></i>
                    عرض الفعالية
                  </router-link>
              </div>
            </div>
          </div>
        </template>

        <!-- ✅ عرض إذا لم توجد تذاكر أو حدثت أخطاء -->
        <div v-if="filteredOrders.length === 0" 
             class="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
          <div class="max-w-md mx-auto">
            <div class="w-24 h-24 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <i class="fas fa-ticket-alt text-3xl text-indigo-500 dark:text-indigo-400"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
              لا توجد تذاكر
            </h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              {{ activeFilter === 'all' 
                ? 'لم تقم بشراء أي تذاكر حتى الآن. ابدأ باستكشاف الفعاليات المتاحة!' 
                : 'لا توجد تذاكر تطابق معايير الفلترة المحددة.' }}
            </p>
            <router-link
              :to="{ name: 'EventsList' }"
              class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium inline-flex items-center transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <i class="fas fa-calendar-plus ml-2"></i>
              استكشاف الفعاليات
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal التقييم -->
    <ReviewModal
      :show="showReviewModal"
      :event="selectedEvent"
      @close="closeReviewModal"
      @submitted="handleReviewSubmitted"
    />

    <!-- Modal QR Code -->
    <QRCodeModal
      :show="showQRModal"
      :ticket="selectedTicket"
      @close="closeQRModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { showToast } from '@/utils/toast'
import ReviewModal from '@/components/attendees/ReviewModal.vue'
import QRCodeModal from '@/components/attendees/QRCodeModal.vue'

// المتغيرات التفاعلية
const orders = ref([])
const loading = ref(false)
const meta = ref({})
const showReviewModal = ref(false)
const showQRModal = ref(false)
const selectedEvent = ref(null)
const selectedTicket = ref(null)
const activeFilter = ref('all')

// تعريف الفلاتر
const filters = ref([
  { id: 'all', name: 'جميع التذاكر' },
  { id: 'active', name: 'نشطة' },
  { id: 'used', name: 'مستخدمة' },
  { id: 'upcoming', name: 'قادمة' },
  { id: 'past', name: 'منتهية' }
])

// حساب التذاكر المصفاة
const filteredOrders = computed(() => {
  if (!orders.value.length) return []
  
  let filtered = orders.value.filter(order => isValidOrder(order))
  
  if (activeFilter.value === 'active') {
    filtered = filtered.filter(order => 
      order.tickets?.some(ticket => !ticket.used_at)
    )
  } else if (activeFilter.value === 'used') {
    filtered = filtered.filter(order => 
      order.tickets?.some(ticket => ticket.used_at) && 
      !order.tickets?.some(ticket => !ticket.used_at)
    )
  } else if (activeFilter.value === 'upcoming') {
    filtered = filtered.filter(order => {
      if (!order.event?.start_date) return false
      const eventDate = new Date(order.event.start_date)
      const now = new Date()
      return eventDate > now
    })
  } else if (activeFilter.value === 'past') {
    filtered = filtered.filter(order => {
      if (!order.event?.end_date) return false
      const eventDate = new Date(order.event.end_date)
      const now = new Date()
      return eventDate < now
    })
  }
  
  return filtered
})

// الدوال
const setActiveFilter = (filterId) => {
  activeFilter.value = filterId
}

const fetchMyTickets = async () => {
  loading.value = true
  try {
    const response = await api.get('/attendee/my-tickets')
    console.log('API Response:', response.data) // ✅ للتصحيح
    
    // ✅ تحسين التحقق من هيكل البيانات
    if (response.data && response.data.success && response.data.data) {
      orders.value = Array.isArray(response.data.data) ? response.data.data : []
      meta.value = response.data.meta || {}
      
      // ✅ تحقق من صحة البيانات
      orders.value = orders.value.filter(order => {
        if (!order || typeof order !== 'object') return false
        if (!order.event || typeof order.event !== 'object') return false
        return true
      })
      
      console.log('Filtered orders:', orders.value)
    } else {
      console.error('Unexpected API response structure:', response.data)
      orders.value = []
    }
  } catch (error) {
    console.error('Error fetching tickets:', error)
    showToast('خطأ', 'فشل في تحميل التذاكر', 'error')
    orders.value = []
  } finally {
    loading.value = false
  }
}





const closeReviewModal = () => {
  showReviewModal.value = false
  selectedEvent.value = null
}

const showQRCode = (ticket) => {
  selectedTicket.value = ticket
  showQRModal.value = true
}

const closeQRModal = () => {
  showQRModal.value = false
  selectedTicket.value = null
}

const handleReviewSubmitted = () => {
  fetchMyTickets()
  showToast('نجاح', 'تم إضافة التقييم بنجاح', 'success')
}

const getTicketTypeText = (name) => {
  const types = {
    'regular': 'عادية',
    'vip': 'VIP',
    'premium': 'بريميوم'
  }
  return types[name] || name
}

const formatDate = (dateString) => {
  if (!dateString) return 'تاريخ غير محدد'
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// إضافة هذه الدوال في الـ script section
const getOrderStatusText = (status) => {
  const statusMap = {
    'reserved': 'محجوز',
    'confirmed': 'مؤكد',
    'cancelled': 'ملغي'
  }
  return statusMap[status] || status
}

const getPaymentStatusText = (status) => {
  const statusMap = {
    'pending': 'قيد الانتظار',
    'completed': 'مدفوع',
    'failed': 'فشل',
    'refunded': 'تم الاسترجاع'
  }
  return statusMap[status] || status
}
const canReview = (order) => {
  console.log('Checking if can review order:', order)
  
  if (!order || !order.event || !order.event.end_date) {
    console.log('Cannot review: missing event or end_date')
    return false
  }
  
  // التحقق من حالة الطلب
  if (order.status !== 'confirmed') {
    console.log('Cannot review: order status is not confirmed', order.status)
    return false
  }
  
  // التحقق من تاريخ الفعالية
  const eventEndDate = new Date(order.event.end_date)
  const now = new Date()
  const canReviewEvent = eventEndDate < now
  
  console.log('Event end date:', eventEndDate)
  console.log('Current date:', now)
  console.log('Can review event:', canReviewEvent)
  
  return canReviewEvent
}

// ✅ دالة openReviewModal محسنة
const openReviewModal = (order) => {
  console.log('Opening review modal for order:', order)
  
  if (!order || !order.event || !order.event.id) {
    console.error('Invalid order or event data')
    showToast('خطأ', 'لا يمكن فتح التقييم لهذه الفعالية', 'error')
    return
  }
  
  selectedEvent.value = order.event
  showReviewModal.value = true
  console.log('Modal opened for event:', selectedEvent.value)
}
// ✅ دالة canReview واحدة فقط
// const canReview = (order) => {
//   if (!order || !order.event || !order.event.end_date) return false
  
//   const eventDate = new Date(order.event.end_date)
//   const now = new Date()
//   return eventDate < now && order.status === 'confirmed'
// }

// // ✅ دالة openReviewModal واحدة فقط
// const openReviewModal = (event) => {
//   if (!event || !event.id) {
//     showToast('خطأ', 'لا يمكن فتح التقييم لهذه الفعالية', 'error')
//     return
//   }
//   selectedEvent.value = event
//   showReviewModal.value = true
// }

const downloadTicket = async (ticketId) => {
  try {
    console.log('Downloading ticket PDF:', ticketId);
    
    const response = await api.get(`/attendee/tickets/${ticketId}/download`, {
      responseType: 'blob'
    });
    
    console.log('PDF download response received');
    
    // إنشاء رابط تحميل
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ticket-${ticketId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // تنظيف الذاكرة
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
    
    showToast('نجاح', 'تم تحميل التذكرة بنجاح', 'success');
  } catch (error) {
    console.error('Error downloading ticket PDF:', error);
    
    let errorMessage = 'فشل في تحميل التذكرة';
    if (error.response?.status === 404) {
      errorMessage = 'ملف التذكرة غير موجود';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    showToast('خطأ', errorMessage, 'error');
  }
};

const downloadAllTickets = async (orderId) => {
  try {
    console.log('Downloading all tickets for order:', orderId);
    
    const response = await api.get(`/attendee/orders/${orderId}/download-all`, {
      responseType: 'blob'
    });
    
    console.log('ZIP download response received');
    
    // إنشاء رابط تحميل لملف ZIP
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tickets-order-${orderId}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    // تنظيف الذاكرة
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
    
    showToast('نجاح', 'تم تحميل جميع التذاكر بنجاح', 'success');
  } catch (error) {
    console.error('Error downloading all tickets:', error);
    
    let errorMessage = 'فشل في تحميل التذاكر';
    if (error.response?.status === 404) {
      errorMessage = 'لا توجد تذاكر في هذا الطلب';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    showToast('خطأ', errorMessage, 'error');
  }
};





const isValidOrder = (order) => {
  if (!order || typeof order !== 'object') return false
  if (!order.id) return false
  if (!order.event || typeof order.event !== 'object') return false
  if (!order.event.id) return false
  return true
}

onMounted(() => {
  console.log('MyTickets component mounted')
  fetchMyTickets()
})
</script>